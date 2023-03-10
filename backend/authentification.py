# if sys.version_info.major == 3 and sys.version_info.minor >= 10:
#     pass
import pyrebase #NOTE: Pyrebase4 to fix collections 3.10 module errors
import json

from functools import wraps,reduce,lru_cache
fb_config = json.load(open('.firebase_config.json'))
fb_config.setdefault('databaseURL',"")

_firebase = pyrebase.initialize_app(fb_config)
auth = _firebase.auth()


user = auth.create_user_with_email_and_password(
    email = "test@hotmail.com",
    password = "abc123"
)
print(user)

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