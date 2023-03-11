# if sys.version_info.major == 3 and sys.version_info.minor >= 10:
#     pass
import pyrebase #NOTE: Pyrebase4 to fix collections 3.10 module errors
import json

from functools import wraps,reduce,lru_cache

import requests
fb_config = json.load(open('.firebase_config.json'))
fb_config.setdefault('databaseURL',"")

_firebase = pyrebase.initialize_app(fb_config)
_auth = _firebase.auth()
user_db = _firebase.database()
user_storage = _firebase.storage()


if __name__ == '__main__':
    SIGNIN_INFO = dict(
        email = "test@hotmail.com",
    password = "abc123"
    )
    user = None
    try:
        user = _auth.create_user_with_email_and_password(
            **SIGNIN_INFO
        )

    except requests.exceptions.HTTPError as err:
        #NOTE: print(err.strerror)
        user = _auth.sign_in_with_email_and_password(
            **SIGNIN_INFO
        )
    else:
        print("Created new user! ")

    info = _auth.get_account_info(user[r'idToken'])

    print(*user.items(),sep="\n",end="\n\n\r")

#TODO _auth.send_email_verification(user[r'idToken'])
#TODO _auth.send_password_reset_email(user['email'])

# def check_token(f):
#     @wraps(f)
#     def wrap(*args,**kwargs):
#         if not request.headers.get('authorization'):
#             return {'message': 'No token provided'},400
#         try:
#             user = auth.verify_id_token(request.headers['authorization'])
#             request.user = user
#         except:
#             return {'message':'Invalid token provided.'},400
#         return f(*args, **kwargs)
#     return wrap
# @app.route('/api/token')
# def token():
#     email = request.form.get('email')
#     password = request.form.get('password')
#     try:
#         user = pb.auth().sign_in_with_email_and_password(email, password)
#         jwt = user['idToken']
#         return {'token': jwt}, 200
#     except:
#         return {'message': 'There was an error logging in'},400
#