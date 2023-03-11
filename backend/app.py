import datetime
from time import strftime

from flask import \
    Flask,\
    jsonify,\
    request,\
    abort,\
    session,\
    redirect,\
    render_template

# from sqlalchemy import Integer,DateTime,String,Text,Column
# from flask.ext.session import Session, Session(app) to use flask.session instead of db.session

# from werkzeug.local import LocalProxy,WSGIApplication

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

from authentification import fb_config,_firebase,_auth,user_db
#*******************************

# import firebase_admin
# from firebase_admin import credentials, auth
#todo cred = credentials.Certificate('firebase_integration/fbAdminConfig.json')

app = Flask(__name__)

cors = CORS(app)

app.config.from_object(ApplicationSessionConfig)

db.init_app(app)

ma.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/", methods=['POST','GET'])
def index():
    if 'user' in session:
        return f'Hi, {session["user"]}' + "<br>" +\
    render_template(r"logouttest.html")
    if request.method == r"POST":
        print("Signing in!")
        email = request.form.get('email')
        password = request.form.get('password')

        try:
            user = _auth.sign_in_with_email_and_password(email,password)
            #info = _auth.get_account_info(user[r'idToken'])
            session['user'] = user['email'] #todo: high-level identifier e.g. username goes here
            redirect("/")
        except:
            return "Failed login"
    return render_template(r"logintest.html")
@app.route('/firebase-api/login')
def login():

    return
@app.route('/firebase-api/logout')
def logout():
    loggedout_user = session.pop('user')
    return redirect(r'/')
@app.route('/firebase-api/signup')
def signup():
    email = request.form.get('email')
    password = request.form.get('password')
    firstName,lastName = request.form.get("firstName"),request.form.get("lastName")
    inputProfilePic = request.form.get("profilePicture")
    user_db.child("")
    if email is None or password is None:
        return {'message': 'Error missing email or password'},400
    try:
        user = _auth.create_user(
               email=email,
               password=password,
                display_name= firstName + " " + lastName,
                photo_url= str(inputProfilePic)
        )

        return {'message': f'Successfully created user {user.uid}'},200
    except:
        return {'message': 'Error creating user'},400 #Api route to get a new token for a valid user



#TODO Seperate once database has scaled... For now, single modules are convenient
from models import CommentPost,CommentPostSchema
commentpost_schema = CommentPostSchema()
commentposts_schema = CommentPostSchema(many=True)

#TODO Might remove logger once the web app has scaled more
logger = logging.getLogger('tdm')
logger.setLevel(logging.INFO)
# logger.addHandler(handler
@app.after_request
def after_request(response):
    timestamp = strftime('[%Y-%b-%d %H:%M]')
    logger.error('%s %s %s %s %s %s', timestamp, request.remote_addr, request.method, request.scheme, request.full_path, response.status)
    return response
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
