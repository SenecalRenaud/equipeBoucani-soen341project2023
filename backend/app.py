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
    url_for,\
    make_response,\
    flash
from flask_mail import Mail, Message

from requests import HTTPError

# from werkzeug.local import LocalProxy,WSGIApplication
from werkzeug.utils import secure_filename

from flask_cors import CORS,cross_origin #?  (for cross origin requests)
from flask_bcrypt import Bcrypt #? (keys and password hashing engine)
from flask_session import Session #NOTE : Assert Accept certain MIME Types/Subtypes

from flask_wtf.csrf import CSRFProtect

import MySQLdb #mysqlclient

import logging
import os
# from functools import partial,reduce
import random
import itertools
import operator
import json
import string
# import re

app = Flask(__name__)

#*******************************
from forms import authorized,login_required
with app.app_context():
    from config import ApplicationSessionConfig #env vars + Session configs
from models import db,ma # SQLAlchemyInterface and MarshmallowSchema objects  to integrate
from models import CommentPost, CommentPostSchema, JobPost, JobPostSchema

from authentification import fb_config,\
    fb_adminsdk_cred,\
    _firebase,\
    _auth,\
    fb_db,\
    fb_storage,\
    firebase_default_app,\
    mainStorageBucket,\
    firestore_db


#*******************************
# import pyrebase

from firebase_admin import auth,credentials,storage,firestore
from firebase_admin.exceptions import FirebaseError,AlreadyExistsError
from firebase_admin._auth_utils import EmailAlreadyExistsError, EmailNotFoundError, UserNotFoundError


app.config.from_object(ApplicationSessionConfig)


Session(app)

# CSRF cookie,credentials, server-side and request handling, security...
cors = CORS(app,
            supports_credentials=True # Access-Control-Allow-Credentials exposed for other servers / origins (i.e. outside backend app folder)
                                      # Will allow AJAX/XMLHttpRequests in js client to fetch session cookies for state and user log
            )


bcrypt = Bcrypt(app)

db.init_app(app) #TODO: session_options={"autocommit": True, "autoflush": False}

ma.init_app(app)

mail = Mail(app)
mail.init_app(app)

#todo csrf = CSRFProtect()
#todo csrf.init_app(app)


with app.app_context():
    db.create_all()




# TODO Separate once database has scaled... For now, single modules are convenient

commentpost_schema = CommentPostSchema()
commentposts_schema = CommentPostSchema(many=True)

jobpost_schema = JobPostSchema()
jobposts_schema = JobPostSchema(many=True)


app.logger = logging.getLogger("myapp")
app.logger.setLevel(logging.ERROR)
#app.logger.addHandler(.....)

logging.getLogger('werkzeug').setLevel(logging.WARNING)

print("\033[32;7;1m FLASK APP HAS STARTED ! \033[0m")


# @app.after_request
# def after_request(response):
#     timestamp = strftime('[%Y-%b-%d %H:%M]')
#     app.logger.error('%s %s %s %s %s %s', timestamp, request.remote_addr, request.method, request.scheme, request.full_path, response.status)
#     return response

#TODO Seperate once database has scaled... For now, single modules are convenient
from models import *
commentpost_schema = CommentPostSchema()
commentposts_schema = CommentPostSchema(many=True)
# userextrainfo_schema = UserExtraInfoSchema()

@app.route("/")
def index():
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


    return header_content + "<br><hr>" + render_template(r"PAGE_CONTENT.html") \
        + "<a href='/api/cookies_test/'> Click here to view session and cookies test page </a>"

@app.route("/getall-cookies/")
def getall_cookies():

    return jsonify(request.cookies)
@app.route("/get-cookie/")
def get_cookie():
    response = make_response("""Look at this cookie !
                             If made from client-side,
                             it means The AJAX request
                             was not blocked by CORS or something else.
                             """ )
    #response.headers["Set-Cookie"]
    sessioncookie_value = session['user']['localId'] if 'user' in session else "anonymous"

    response.set_cookie(key="loggedin_user_uid", value=sessioncookie_value)
                        # path="/api/cookies_test/")
                        # domain="fake.subdomain.net")
    print(response)
    return response
@app.route("/api/cookies_test/")
def cookies_test():
    print(request.cookies)
    if 'user' not in session:
        return jsonify(msg="No user logged in found in session!")

    user_auth_dict = session['user'] # Firebase-auth user record, not the firestore custom one
    print(user_auth_dict)

    assert user_auth_dict['localId'] == request.cookies["user_uid"]

    user_dict = firestore_db.collection(u'Users')\
        .document(request.cookies["user_uid"]).get().to_dict()


    if user_dict['userType'] != "ADMIN":
        #del user_dict['pwdHash'] #bytes are not serializable + cross origin requests should have direct access to this in response
        # return jsonify(user_dict)
        user_auth_dict['expiresIn'] = str(3600//4)
        return jsonify(user_auth_dict)
    else:
        return jsonify(msg="Can not display current user '" + user_auth_dict['displayName']
                           + "' because they are an ADMIN !")

@app.route('/firebase-api/signin',methods=['POST','GET'])
def signin():

    if request.method == "POST":

        email = request.form.get('email')
        password = request.form.get('password')

        try:


            # From auth... validity of idToken unchecked however.
            user = auth.get_user_by_email(email)

            # From Firestore
            firestore_user = firestore_db.collection(u'Users').document(user.uid).get().to_dict()

            # Can be validated through decoded id tokens. Ensures safe role assignment.
            auth.set_custom_user_claims(user.uid,
                                {
                                    firestore_user['userType'].lower(): True
                                }
            )

            user = _auth.sign_in_with_email_and_password(email,password)

            #decoded_claims = auth.verify_id_token(id_token)#TODO
            # # Only process if the user signed in within the last 5 minutes.
            # if time.time() - decoded_claims['auth_time'] < 5 * 60:
            #
            # expires_in = datetime.timedelta(days=5)
            # session_cookie = auth.create_session_cookie(id_token, expires_in=expires_in)
            # expires = datetime.datetime.now() + expires_in
            # response.set_cookie(
            #     'session', session_cookie, expires=expires, httponly=True, secure=True)


            pwdHash = firestore_user.pop('pwdHash')
            print("Password bcrypt few-rounds salted hash matched: ",end=" ")
            print(bcrypt.check_password_hash(
                pwdHash,password
            ))

            session['user'] = user

            auth_user_response = user.copy()
            userRecordInfo = _auth.get_account_info(user['idToken'])['users'][0]

            auth_user_response.update(
                firestore_user
            )
            auth_user_response.update(
                dict(
                    creationEpoch = userRecordInfo['createdAt'],
                    lastSeenEpoch = userRecordInfo['lastLoginAt']
                )
            )


            print(user, "\n\tJUST SIGNED IN !!!")

            # response = jsonify(auth_user_response)
            # response.delete_cookie('session')
            #
            # expires_in = datetime.timedelta(seconds=300)
            # session_cookie = auth.create_session_cookie(user['idToken'], expires_in=expires_in)
            # expires = datetime.datetime.now() + expires_in - datetime.timedelta(seconds=285)
            # response.set_cookie(
            #     'session', session_cookie, expires=expires, httponly=True, secure=True
            # )

            return jsonify(auth_user_response)
            # return redirect("/")
        except HTTPError as err:
            # print(err.__context__.args)
            parsedHttpErr = json.loads(err.args[1])

            login_err_resp = make_response(parsedHttpErr['error'],401)
            login_err_resp.status = parsedHttpErr['error']['message']
            # login_err_resp.access_control_allow_credentials = True
            print(login_err_resp.json,401)
            return login_err_resp.json,401
        except Exception as gen_err:
            return {'message': str(gen_err)}
    return render_template("logintest.html")

@app.route('/firebase-api/logout')
def logout():
    print("TRYING TO LOGOUT")

    if 'user' not in session:
        print("No user to logout in the backend!")
        response =  make_response("No user to logout in the backend!")
    else:
        print(session['user'], "\n\tJUST LOGGED OUT !")
        #TODO: _auth.refresh() if same IpV4 still and if passes other checks. ....
        loggedout_user = session.pop('user')
        response = make_response(f"Log out : {json.dumps(loggedout_user)} . " + \
                                 "Delete token cookies so frontend knows user is not authentificated or authorized anymore")

        try:
            decoded_token = auth.verify_id_token(loggedout_user['localId'])
            user_uid = decoded_token['uid']  # Get the user's UID from the decoded token

            # Log out the user by revoking the refresh token
            auth.revoke_refresh_tokens(user_uid)

            print('User logged out successfully from Firebase Auth System')
        except Exception as e:
            print('Error logging out user from Firebase Auth System:', e)

    if (session_cookie := request.cookies.get('session',None)):
        # print(type(session_cookie))
        # decoded_customclaims = auth.verify_session_cookie(session_cookie)
        # auth.revoke_refresh_tokens(decoded_customclaims['sub']) #Log out user's all other sessions with active idTokens

        response.set_cookie('session',expires=0) # Kill session cookie !


    #TODO CHange once securit with idToken and refresh token has been done !!! Important tokens are in cookies only for DEBUG !
    userCookiesHashset = {"access_token","refresh_token"}

    for tokenAuthCookieToRemove in set(request.cookies.keys()) & userCookiesHashset:
        response.delete_cookie(tokenAuthCookieToRemove)

    return response #redirect(r'/')
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
            # Can be validated through decoded id tokens. Ensures safe role assignment.
            auth.set_custom_user_claims(user.uid,
                                {
                                    user_infofields['userType'].lower(): True
                                }
                        )

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


#todo @authorized(admin=True)
@app.route('/firebase-api/authenticate', methods=['POST'])
@cross_origin()
def authenticate():
    print("GOT AUTHORIZED !")

    print(request.headers,end="\n\n\r")

    if request.environ.get('HTTP_X_FORWARDED_FOR') is None:
        print(request.environ['REMOTE_ADDR'])
        return jsonify({'ip': request.environ['REMOTE_ADDR']}), 200
    else:
        print(request.environ['HTTP_X_FORWARDED_FOR'])
        return jsonify({'ip': request.environ['HTTP_X_FORWARDED_FOR']}), 200


    # Verify the ID token
    # decoded_token = auth.verify_id_token(id_token)
    # # Authenticate the user with the refresh token
    # session_cookie = auth.create_session_cookie(refresh_token)
    # response = jsonify({'sessionCookie': session_cookie})
    # # Set the session cookie as an HTTP-only cookie
    # response.set_cookie('session2', session_cookie.decode("utf-8"),
    #                     httponly=True, secure=True)
    # #auth.set_custom_user_claims()


    #return response

@app.route("/firebase-api/get-user/<_uid>/",methods=['GET'],endpoint='get_user_details')
@cross_origin()
def get_user_details(_uid):
    _uid = _uid.strip()
    #TODO CACHE THESE USER DETAILS MAYBE?!
    if _uid == "current":
        # print("\tUSER IS CURRENT !")
        if 'user' in session:
            # print("\t\tUSER IN SESSION")
            user_recordinfo = _auth.get_account_info(session['user']['idToken'])['users'][0]
            _uid = user_recordinfo['localId']
        else:
            # print("\t\tUSER NOT IN SESSION")
            return {}


    # if 'user' in session:
    #     id_token = session['user']['idToken']
    #     decoded_token = auth.verify_id_token(id_token)
    #     print(decoded_token)
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
    #TODO: ADD A CRYPT SALT AND/OR IV FOR UUID ENCRYPTION ALG TO BE USED WITH CRYPTO JS
    del user_fields['pwdHash'] #do not need/want pass bcrypt hash bytes-string in requests

    return jsonify(user_fields)


@app.route("/firebase-api/edit-user/<_uid>/",methods=['PATCH','POST'])
def update_user_details(_uid):
    print("UPDATING USER!!!")
    # TODO: Checked logged in user: Only Admins and the user at uuid can edit user at uuid
    # TODO: Checked logged in user: Only Admins and the user at uuid can edit user at uuid
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

#
# =================== COMMENTPOSTS ===================
#

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
    if any(filter(None,results_arr)) and request.args.get('mapAsFields') == 'true':
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

#
# =================== JOBPOSTS ===================
#

@app.route('/getjob', methods=['GET'])  # methods = [list http reqs methods]
def get_all_jobposts():
    """
    GET request to view all table entries directly from 'many' mode sql schema
    :return: json response
    Antoine Cantin@ChiefsBestPal
    """

    all_jobposts = JobPost.query.all()
    results_arr = jobposts_schema.dump(all_jobposts)

    if any(filter(None,results_arr)) and request.args.get('mapAsFields') == 'true':
        print("Mapped fields into dict instead of array of obj!")
        response_fieldsdict = dict(map(lambda kv: (kv[0], [kv[1]]), results_arr[0].items()))

        for k, v in itertools.chain.from_iterable(map(operator.methodcaller('items'), results_arr[1:])):
            if response_fieldsdict.setdefault(k, None):
                response_fieldsdict[k].append(v)
        assert all(len(listed_fields_v) == len(results_arr) for listed_fields_v in response_fieldsdict.values())
        return jsonify(response_fieldsdict)

    return jsonify(results_arr)  # **{'Hello' : 'World'})


@app.route("/getjob/<_id>/", methods=['GET'])
def get_jobpost(_id):
    jobpost = JobPost.query.get(_id)
    return jobpost_schema.jsonify(jobpost)

@app.route("/addjob", methods=['POST'],endpoint='addJobPost')
@cross_origin()
@authorized(employer=True)
def addJobPost():

    jobtype, title, location, salary, description, tags,employerUid = request.json['jobtype'], request.json['title'], request.json[
        'location'], request.json['salary'], request.json['description'], request.json['tags'],request.json['employerUid']

    if request.args.get("random-fields"):
        title = ''.join(random.choice(string.digits + string.ascii_letters) for _ in range(11))
        salary = random.randint(500,12000)
        description = ''.join(random.choice(string.printable) for _ in range(140))


    jobpost = JobPost(jobtype, title, location, salary, description, tags,employerUid)
    db.session.add(jobpost)
    db.session.commit()

    return jobpost_schema.jsonify(jobpost)



@app.route("/updatejob/<_id>/", methods=['PUT'],endpoint='update_jobpost')
@authorized(employer=True,admin=True)
def update_jobpost(_id):
    jobpost = JobPost.query.get(_id)

    if 'jobtype' in request.json:
        jobpost.jobtype = request.json['jobtype']
    if 'title' in request.json:
        jobpost.title = request.json['title']
    if 'location' in request.json:
        jobpost.location = request.json['location']
    if 'salary' in request.json:
        jobpost.salary = request.json['salary']
    if 'tags' in request.json:
        jobpost.tags = request.json['tags']
    if 'description' in request.json:
        jobpost.description = request.json['description']
    # if 'employerUid' in request.json:
    #     jobpost.employerUid = request.json['employerUid']

    jobpost.editDate = datetime.datetime.now()

    db.session.commit()

    return jobpost_schema.jsonify(jobpost)


@app.route("/deletejob/<_id>/", methods=['DELETE'],endpoint='delete_jobpost')
@authorized(employer=True,admin=True)
def delete_jobpost(_id):
    jobpost = JobPost.query.get(_id)

    db.session.delete(jobpost)

    db.session.commit()

    return jobpost_schema.jsonify(jobpost)

#
# =================== FLASK MAIL TESTS ===================
#
#TODO Unit tests might be needed for the notification system(s) soon.
@app.route("/sendmail")
def flask_mail_send_test():
    try:
        msg = Message("Flask-Mail Test message",
                      sender="equipeboucani@gmail.com",
                      recipients=["ozan.alptekin2002@gmail.com"])
        msg.body = "This is a test message from flask mail"
        mail.send(msg)
        return "Sent"
    except Exception as e:
        return str(e)


if __name__ == '__main__':

    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True,load_dotenv=True)
