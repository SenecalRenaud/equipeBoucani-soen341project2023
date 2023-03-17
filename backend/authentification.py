# if sys.version_info.major == 3 and sys.version_info.minor >= 10:
#     pass
import pyrebase #NOTE: Pyrebase4 to fix collections 3.10 module errors

import firebase_admin
from firebase_admin import credentials, auth,storage,firestore

from functools import wraps,reduce,lru_cache
import json

import requests

import dotenv
import os

FIREBASE_CONFIG_JSON_NAME = ".firebase_config.json"
FIREBASE_ADMINSDK_CREDS_SERVICEKEYS_FILENAME = ".credentials_firebase_adminsdk_8mtwu_187f5d4799.json"

dotenv.load_dotenv(".env.local")


fb_config = json.load(open(FIREBASE_CONFIG_JSON_NAME))
fb_config.setdefault('databaseURL',"")
fb_config.setdefault('storageBucket',os.environ['FIREBASE_STORAGE_BUCKET'])

fb_adminsdk_cred = credentials.Certificate(FIREBASE_ADMINSDK_CREDS_SERVICEKEYS_FILENAME)


firebase_default_app = firebase_admin.initialize_app(fb_adminsdk_cred,
                                                     {'storageBucket': os.environ['FIREBASE_STORAGE_BUCKET']})

_firebase = pyrebase.initialize_app(fb_config)
_auth = _firebase.auth()#Pyrebase4 api,: send_email_verification, send_password_reset_email, etc..
fb_db = _firebase.database()
fb_storage = _firebase.storage()

userPfpBucket = storage.bucket()

firestore_db = firestore.client()

if __name__ == '__main__':

    print(fb_db.__repr__())
    print(fb_db.child("users"))

    doc_ref = firestore_db.collection(u'test_db_user').document(u'antoinecantin')
    doc_ref.set(
        {
            u'first': u'Antoine',
            u'last': u'Cantin',
            u'born': 2002

        }
    )
    print(doc_ref)


    # SIGNIN_INFO = dict(
    #     email = "test@hotmail.com",
    # password = "abc123"
    # )
    # user = None
    # try:
    #     user = _auth.create_user_with_email_and_password(
    #         **SIGNIN_INFO
    #     )
    #
    # except requests.exceptions.HTTPError as err:
    #     #NOTE: print(err.strerror)
    #     user = _auth.sign_in_with_email_and_password(
    #         **SIGNIN_INFO
    #     )
    # else:
    #     print("Created new user! ")
    #
    # info = _auth.get_account_info(user['idToken'])
    #
    # print(*user.items(),sep="\n",end="\n\n\r")
