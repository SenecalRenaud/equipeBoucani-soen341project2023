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

from requests import HTTPError

# from sqlalchemy import Integer,DateTime,String,Text,Column
# from flask.ext.session import Session, Session(app) to use flask.session instead of db.session

# from werkzeug.local import LocalProxy,WSGIApplication
from werkzeug.utils import secure_filename

from flask_cors import CORS,cross_origin #?  (for cross origin requests)
from flask_bcrypt import Bcrypt #? (keys and password hashing engine)
# from flask_session import Session // TODO: Assert Accept certain MIME Types/Subtypes


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
    mainStorageBucket,\
    firestore_db

#from forms import login_required //TODO
#*******************************
import pyrebase

from firebase_admin import auth,credentials,storage,firestore
from firebase_admin.exceptions import FirebaseError,AlreadyExistsError
from firebase_admin._auth_utils import EmailAlreadyExistsError, EmailNotFoundError, UserNotFoundError

app = Flask(__name__)

cors = CORS(app)

app.config.from_object(ApplicationSessionConfig)

bcrypt = Bcrypt(app)
# Session(app)

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
# userextrainfo_schema = UserExtraInfoSchema()

@app.route("/")
def index():
    if _auth.current_user:
        print("Currently logged in: " + _auth.current_user)
    if (query_val := request.args.get("goto",default=None)) in ("signin","signup"):
        return redirect(rf"/firebase-api/{query_val}")

    elif 'user' in session:
        print(" User "  + session['user']['email'] + " is logged in on server-side session!")
        if query_val == "logout":

            return redirect(r"/firebase-api/logout")
        try:
            user_recordinfo = _auth.get_account_info(session['user']['idToken'])['users'][0]
        except HTTPError as invalidIDTokenOrAuth:
            print(invalidIDTokenOrAuth)
            print("Forcefully logout user")
            return redirect(r"/firebase-api/logout")

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

            pwdHash = firestore_db.collection(u'Users').document(user['localId']).get().to_dict()['pwdHash']
            print("Password bcrypt few-rounds salted hash matched: ",end=" ")
            print(bcrypt.check_password_hash(
                pwdHash,password
            ))

            session['user'] = user# ['email'] #todo: high-level identifier e.g. username goes here
            print(session['user'], "\n\tJUST SIGNED IN !!!")
            return redirect("/")
        except Exception as err:
            print(err)
            return {'message': "Failed login"}, 401

    return render_template("logintest.html")
@app.route('/firebase-api/logout')
def logout():
    print(session['user'], " JUST LOGGED OUT !")
    loggedout_user = session.pop('user')
    return redirect(r'/')
@app.route('/firebase-api/signup',methods=['POST','GET'])
def signup():
    if request.method == "POST":
        email = request.form.get('email')
        password = request.form.get('password')
        firstName,lastName = request.form.get("firstName"),request.form.get("lastName")
        userTypeVal = request.form.get('userType')

        uploaded_pdf_resume_file = request.files['uploadedResume']
        filename = secure_filename(uploaded_pdf_resume_file.filename)
        uploaded_pdf_resume_file.save(
            (resumefilepath :=
             os.path.join(
                 app.config['TEMP_UPLOAD_PATH'], filename))
        )

        resume_blob = mainStorageBucket.blob(r"resumes/" + filename)
        resume_blob.upload_from_filename(resumefilepath)
        os.remove(resumefilepath)
        resume_blob.make_public() #NOTE: Maybe better if resumes are private ?... right now not necessary

        uploaded_pfp_file = request.files['profilePicture']
        filename = secure_filename(uploaded_pfp_file.filename)
        if filename:

            uploaded_pfp_file.save(
                (pfpfilepath :=
                os.path.join(
                    app.config['TEMP_UPLOAD_PATH'],filename))
            )
            blob = mainStorageBucket.blob(r"profilePictures/" + filename)
            blob.upload_from_filename(pfpfilepath)
            blob.make_public()  # public access URL to download and view PFPs externally
        else:
            blob = mainStorageBucket.get_blob(
                f"default{UserType(UserType[userTypeVal].value).name.title()}Pfp.png"
            )

            #return abort(501)


        fb_db.child("") #Pyrebase database standard operation

        if email is None or password is None:
            return {'message': 'Error missing email or password'},400
        try:
            user_infofields = dict(
                email=email,
                password=password,
                display_name=firstName + " " + lastName,
                photo_url=blob.public_url
            )
            user = auth.create_user(
                   **user_infofields
            )
            del user_infofields['display_name']
            del user_infofields['password']
            user_infofields.update(
                dict(
                    firstName = firstName,
                    lastName = lastName,
                    userType = UserType[userTypeVal.upper()].name,
                    pwdHash = bcrypt.generate_password_hash(password),
                    resume_url = resume_blob.public_url
                )#Can add more fields later if update whole 'Users' collection database as well!
            )

            user_docref = firestore_db.collection(u'Users').document(
                str(user.uid)
            )
            user_docref.set(
                user_infofields
            )

            # userextrainfo = UserExtraInfo(user.uid,UserType[userTypeVal])
            # db.session.add(userextrainfo)
            # db.session.commit()

            print( {'message': f'Successfully created user {user.uid}'},200)
            session['user'] = _auth.sign_in_with_email_and_password(email, password)

            return redirect(url_for("index"))
        except EmailAlreadyExistsError as userAlreadyExists:
            print(userAlreadyExists.__str__().replace("email ","email [" + str(email) + "]"))
            return {'message' : 'Email ' + str(email) + ' is already taken !'},403
        except ValueError as validatorErr:
            return {'message': 'Property value error in user creation fields... ',
                    'error-traceback': validatorErr.__traceback__.tb_frame.__str__(),
                    'error-cause':validatorErr.__cause__.__str__(),
                    'error-context': validatorErr.__context__.__str__()},400
        except FirebaseError as privateFirebaseErr:
            print(privateFirebaseErr,type(privateFirebaseErr))
            return {'message': 'Firebase Error while creating user'},403 #Api route to get a new token for a valid user
        except (RuntimeError,Exception,InterruptedError) as err :
            print(err)
            return {'message': 'Unlogged failure, unknown reason. Contact admin or developer.'},406

    return render_template("signuptest.html")

@app.route('/firebase-api/userprofile') #todo put a @login_required decorator
def account_profile_view():

    user_recordinfo = _auth.get_account_info(session['user']['idToken'])['users'][0]

    #userextrainfo = UserExtraInfo.query.get(user_recordinfo['localId'])
    user_docref = firestore_db.collection('Users').document(user_recordinfo['localId'])
    user_doc = user_docref.get()

    fname,lname = user_recordinfo['displayName'].split(' ',maxsplit=1)
    context = dict(
        firstName = fname,lastName=lname,
        email = user_recordinfo['email'],
        profilePictureURL = user_doc.to_dict()['photo_url'],#user_recordinfo['photoUrl'],
        joinDate = strftime("%A %B %d %Y", localtime(
                            float(user_recordinfo['createdAt'])/ 1000)),
        lastSeenDatetime =  strftime("%A %B %d %Y, %H:%M:%S", localtime(
                            float(user_recordinfo['lastLoginAt'])/ 1000)),
        userType = str(user_doc.to_dict()['userType']).title(),
        uploadedResumeURL=user_doc.to_dict()['resume_url']
    )

    return render_template("profiletest.html",**context)

@app.route("/firebase-api/get-user/<_uid>/")
@cross_origin()
def get_user_details(_uid):
    _uid = _uid.strip()
    if _uid == "current" and 'user' in session:
        # print("USER IN SESSION !")
        user_recordinfo = _auth.get_account_info(session['user']['idToken'])['users'][0]
        _uid = user_recordinfo['localId']
    # print(_uid)
    # print(session)
    doc_ref = firestore_db.collection(u'Users').document(_uid)
    doc = doc_ref.get()
    if not doc.exists:
        return {'message': 'firebase auth user id Requested to backend was not found !'},404

    user_fields = doc.to_dict()
    userrecord_metadata = auth.get_user(_uid).user_metadata

    user_fields.update(
        dict(
    lastSeenEpoch = max(userrecord_metadata.last_refresh_timestamp,userrecord_metadata.last_sign_in_timestamp),
    creationEpoch = userrecord_metadata.creation_timestamp,
            uid = _uid
        ) # JS Epoch format... for some datetime modules, may need to divide by 1000, etc..
    )
    del user_fields['pwdHash'] #do not need/want pass bcrypt hash bytes-string in requests

    return jsonify(user_fields)

@app.route("/firebase-api/edit-user/<_uid>/",methods=['PATCH','POST'])
def update_user_details(_uid):
    print("UPDATING USER!!!")

    _uid = _uid.strip()
    if _uid == "current" and 'user' in session:
        # print("USER IN SESSION !")
        user_recordinfo = _auth.get_account_info(session['user']['idToken'])['users'][0]
        _uid = user_recordinfo['localId']

    if request.method == "PATCH":
        print(NotImplementedError("Not Implemented: client side PATCH request to update firebase user"))
        return {'message' : "Firebase user update >Not implemented< with PATCH requests. Must make a client-side REST API that fetches with PATCH REQUEST.\n\r "
                            "Native backend only uses POST to update users " }

    elif request.method == 'POST':
        try:
            user = auth.get_user(_uid)
            firstName,lastName = user.display_name.strip().split(' ',1)
            pfp_publicurl = user.photo_url

            user_docref = firestore_db.collection(u'Users').document(
                str(_uid))
            resume_url = None if 'resume_url' in user_docref.get().to_dict() else user_docref.get().to_dict()['resume_url']

            if 'firstName' in request.form:
                firstName = request.form['firstName']
            if 'lastName' in request.form:
                lastName = request.form['lastName']
            if 'profilePicture' in request.files:#request.json:
                uploaded_pfp_file = request.files['profilePicture']

                filename = secure_filename(uploaded_pfp_file.filename)
                if filename:
                    uploaded_pfp_file.save(
                        (pfpfilepath :=
                         os.path.join(
                             app.config['TEMP_UPLOAD_PATH'], filename))
                    )
                    blob = mainStorageBucket.blob(r"profilePictures/" + filename)
                    blob.upload_from_filename(pfpfilepath)
                    blob.make_public()  # public access URL to download and view PFPs externally
                    mainStorageBucket.delete_blob(
                        "profilePictures/" + pfp_publicurl.rsplit('/', 1)[-1]
                    )
                    pfp_publicurl = blob.public_url
            if 'uploadedResume' in request.files:
                uploaded_pdf_resume_file = request.files['uploadedResume']
                filename = secure_filename(uploaded_pdf_resume_file.filename)
                uploaded_pdf_resume_file.save(
                    (resumefilepath :=
                     os.path.join(
                         app.config['TEMP_UPLOAD_PATH'], filename))
                )

                resume_blob = mainStorageBucket.blob(r"resumes/" + filename)
                resume_blob.upload_from_filename(resumefilepath)
                mainStorageBucket.delete_blob(
                    "resumes/" + pfp_publicurl.rsplit('/', 1)[-1]
                )
                os.remove(resumefilepath)
                resume_blob.make_public()
                resume_url = resume_blob.public_url

            auth.update_user(_uid,
                             display_name=firstName + ' ' + lastName,
                             photo_url=pfp_publicurl)

            firestore_db.collection(u'Users').document(
                str(_uid)
            ).update(
                dict(
                    firstName=firstName,
                    lastName=lastName,
                    photo_url=pfp_publicurl,
                    resume_url=resume_url
                )
            )

        except ValueError as badUid:
            print(badUid)
            return {'message': 'Uid is invalid'},400
        except UserNotFoundError as userNotFound:
            return {'message': str(userNotFound)},404
        except FirebaseError as serverFirebaseErr:
            print(serverFirebaseErr)
            return {'message': 'Firebase error, contact developpers.'},403

        print({'message': f'Sucessfully updated user profile {_uid}'}, 200)
    return redirect("/firebase-api/userprofile")

@app.route('/get', methods=['GET'])
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
        # print("\033[7m",end=" ")
        # print(response_fieldsdict,end=" ")
        # print("\033[0m", end="\n\r")
        # response_fieldsdict: dict where
        # key[i]: 'someField e.g postedDate'
        # values: list of all keys e.g list of all postedDate
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

    # auth.update_user("VXmMwunX4eSDGNCVOt4m6nsR0R03",
    #                  photo_url="https://storage.googleapis.com/boucani-webappv2.appspot.com/profilePictures/tumblr_static_filename.gif")
    #
    # auth.update_user("B39a36hOG9cSJJwaXGF1WS6J54x2",
    #                  photo_url="https://storage.googleapis.com/boucani-webappv2.appspot.com/profilePictures/1OR7Jtk.png")
    #
    # auth.update_user("p8PSJ2iforSkT9szSg0lvGDCyyy2",
    #                  photo_url="https://storage.googleapis.com/boucani-webappv2.appspot.com/profilePictures/OG_Spider_Man_2.jpg")

    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True)
