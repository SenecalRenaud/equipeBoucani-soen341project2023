import datetime
from time import strftime,localtime

from flask import \
    Flask,\
    jsonify,\
    request,\
    abort,\
    session,\
    redirect,\
    render_template,\
    url_for

# from sqlalchemy import Integer,DateTime,String,Text,Column
# from flask.ext.session import Session, Session(app) to use flask.session instead of db.session

# from werkzeug.local import LocalProxy,WSGIApplication
from werkzeug.utils import secure_filename

from flask_cors import CORS,cross_origin #?  (for cross origin requests)
#TODO from flask_bcrypt import Bcrypt #? (for passwords, private op hash,...)
import pyrebase

import logging
import os
import re
import itertools
import operator
import json

#*******************************
from config import ApplicationSessionConfig #env vars + Session configs
from models import db,ma # SQLAlchemyInterface and MarshmallowSchema objects  to integrate

from authentification import fb_config,\
    fb_adminsdk_cred,\
    _firebase,\
    _auth,\
    fb_db,\
    fb_storage,\
    firebase_default_app,\
    userPfpBucket,\
    firestore_db

from forms import login_required
#*******************************

from firebase_admin import auth,credentials,storage,firestore
from firebase_admin.exceptions import FirebaseError


app = Flask(__name__)

cors = CORS(app)

app.config.from_object(ApplicationSessionConfig)

db.init_app(app)

ma.init_app(app)

with app.app_context():
    db.create_all()

#TODO Might remove logger once the web app has scaled more
logger = logging.getLogger('tdm')
logger.setLevel(logging.INFO)
# logger.addHandler(handler
@app.after_request
def after_request(response):
    timestamp = strftime('[%Y-%b-%d %H:%M]')
    logger.error('%s %s %s %s %s %s', timestamp, request.remote_addr, request.method, request.scheme, request.full_path, response.status)
    return response

#TODO Seperate once database has scaled... For now, single modules are convenient
from models import *
commentpost_schema = CommentPostSchema()
commentposts_schema = CommentPostSchema(many=True)
userextrainfo_schema = UserExtraInfoSchema()

@app.route("/")
def index():
    if (query_val := request.args.get("goto",default=None)) in ("signin","signup"):
        return redirect(rf"/firebase-api/{query_val}")

    elif 'user' in session:
        if query_val == "logout":
            return redirect(r"/firebase-api/logout")

        user_recordinfo = _auth.get_account_info(session['user']['idToken'])['users'][0]

        header_content =  f'Hi, {user_recordinfo["displayName"]}' + "\t" + \
                            "\t" + f"<a href='/firebase-api/userprofile'><img src=\"{user_recordinfo['photoUrl']}\" width='75' height='75'/></a>" +\
                          "<sub>(click to view profile)</sub>" + render_template(r"header_logout.html")

    else:
        header_content = render_template(r"header_login_or_signup.html")


    return header_content + "<br><hr>" + render_template(r"PAGE_CONTENT.html")


@app.route('/firebase-api/signin',methods=['POST','GET'])
def signin():

    if request.method == "POST":

        email = request.form.get('email')
        password = request.form.get('password')

        try:
            user = _auth.sign_in_with_email_and_password(email,password)

            session['user'] = user# ['email'] #todo: high-level identifier e.g. username goes here
            redirect("/")
        except:
            return {'message': "Failed login"}, 401

    return render_template("logintest.html")
@app.route('/firebase-api/logout')
def logout():

    loggedout_user = session.pop('user')
    return redirect(r'/')
@app.route('/firebase-api/signup',methods=['POST','GET'])
def signup():
    if request.method == "POST":
        email = request.form.get('email')
        password = request.form.get('password')
        firstName,lastName = request.form.get("firstName"),request.form.get("lastName")
        userTypeVal = request.form.get('userType')

        uploaded_pfp_file = request.files['profilePicture']
        filename = secure_filename(uploaded_pfp_file.filename)
        if filename:
            uploaded_pfp_file.save(
                (pfpfilepath :=
                os.path.join(
                    app.config['TEMP_UPLOAD_PATH'],filename))
            )
        else:
            print("DEFAULT PROFILE PIC TODO IMPLEMENT HERE !!!")
            # todo default pic: https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg
            return abort(501)

        blob = userPfpBucket.blob(filename)
        blob.upload_from_filename(pfpfilepath)
        blob.make_public() # public access URL to download and view PFPs externally

        fb_db.child("") #Pyrebase database standard operation

        if email is None or password is None:
            return {'message': 'Error missing email or password'},400
        try:

            user = auth.create_user(
                   email=email,
                   password=password,
                    display_name= firstName + " " + lastName,
                    photo_url= blob.public_url
            )

            userextrainfo = UserExtraInfo(user.uid,UserType[userTypeVal])
            db.session.add(userextrainfo)
            db.session.commit()

            print( {'message': f'Successfully created user {user.uid}'},200)

            session['user'] = _auth.sign_in_with_email_and_password(email, password)

            return redirect(url_for("index"))
        except ValueError as validatorErr:
            return {'message': 'Property value error in user creation fields... ',
                    'error-traceback': validatorErr.__traceback__.tb_frame.__str__(),
                    'error-cause':validatorErr.__cause__.__str__(),
                    'error-context': validatorErr.__context__.__str__()},400
        except FirebaseError:
            return {'message': 'Firebase Error while creating user'},403 #Api route to get a new token for a valid user
        except (RuntimeError,Exception,InterruptedError) as err :
            print(err)
            return {'message': 'Unlogged failure, unknown reason. Contact admin or developer.'},406

    return render_template("signuptest.html")

@app.route('/firebase-api/userprofile') #todo put a @login_required decorator
def account_profile_view():

    user_recordinfo = _auth.get_account_info(session['user']['idToken'])['users'][0]

    userextrainfo = UserExtraInfo.query.get(user_recordinfo['localId'])

    fname,lname = user_recordinfo['displayName'].split(' ',maxsplit=1)
    context = dict(
        firstName = fname,lastName=lname,
        email = user_recordinfo['email'],
        profilePictureURL = user_recordinfo['photoUrl'],
        joinDate = strftime("%A %B %d %Y", localtime(
                            float(user_recordinfo['createdAt'])/ 1000)),
        lastSeenDatetime =  strftime("%A %B %d %Y, %H:%M:%S", localtime(
                            float(user_recordinfo['lastLoginAt'])/ 1000)),
        userType = str(userextrainfo.userType.name).title()
    )

    return render_template("profiletest.html",**context)


@app.route('/get', methods=['GET'])# methods = [list http reqs methods]
def get_all_commentposts():
    """
    GET request to view all table entries directly from 'many' mode sql schema
    :return: json response
    Antoine Cantin@ChiefsBestPal
    """

    all_commentposts = CommentPost.query.all()
    results_arr = commentposts_schema.dump(all_commentposts)
    print(results_arr)
    if request.args.get('mapAsFields') == 'true':
        print("Mapped fields into dict instead of array of obj!")
        response_fieldsdict = dict(map(lambda kv: (kv[0], [kv[1]]), results_arr[0].items()))

        for k, v in itertools.chain.from_iterable(map(operator.methodcaller('items'), results_arr[1:])):
            if response_fieldsdict.setdefault(k, None):
                response_fieldsdict[k].append(v)
        assert all(len(listed_fields_v) == len(results_arr) for listed_fields_v in response_fieldsdict.values())
        return jsonify(response_fieldsdict)

    return jsonify(results_arr)#**{'Hello' : 'World'})


@app.route('/add', methods=['POST']) # methods = [list http reqs methods]
@cross_origin()
def add_commentpost():
    """
    POST to host the following request json bod/headers:
    {
    *ALL the parameters in the db.Model inherited class's __init__*
    }
    :return:  sql table type schema json response
    """
    title,body = request.json['title'],request.json['body']

    commentpost = CommentPost(title,body)
    db.session.add(commentpost)
    db.session.commit()

    return commentpost_schema.jsonify(commentpost)


@app.route("/get/<_id>/",methods=['GET'])
def get_commentpost(_id):
    commentpost = CommentPost.query.get(_id)
    return commentpost_schema.jsonify(commentpost)


#TODO Use ['PATCH'] to partially update existing commentpost, only selected json/req header fields !
@app.route("/update/<_id>/",methods=['PUT'])
def update_commentpost(_id):
    commentpost = CommentPost.query.get(_id)

    if 'title' in request.json:
        commentpost.title = request.json['title']
    if 'body' in request.json:
        commentpost.body = request.json['body']

    commentpost.editDate = datetime.datetime.now()

    db.session.commit()

    return commentpost_schema.jsonify(commentpost)
@app.route("/delete/<_id>/",methods=['DELETE'])
def delete_commentpost(_id):
    commentpost = CommentPost.query.get(_id)

    db.session.delete(commentpost)

    db.session.commit()

    return commentpost_schema.jsonify(commentpost)

if __name__ == '__main__':

    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True)
