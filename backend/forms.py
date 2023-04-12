#TODO from flask_wtf import FlaskForm
#TODO from wtforms import ...
#todo from wtfforms.validators import ... , and also import regex
import datetime

from firebase_admin import auth
from functools import wraps
from flask import g, request, redirect, url_for, jsonify, make_response,session

import logging

from backend.models import JobPost


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.user is None:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function


def authorized(**permissions):
    """
    author: ChiefsBestPal@Antoine Cantin
    """
    def decorator(func):
        nonlocal permissions
        def wrapper(*args, **kwargs):
            nonlocal permissions,func
            # TODO: REVISIT MY @AUTHORIZE DECORATOR SO YOU CAN DO WITH BITS: admin | myself & ~employer, etc...
            print("GETTING ID TOKEN!!!!!")
            #TODO auth.verify_session_cookie() best for backend and JWT best for frontend ? USE BOTH?
            #TODO auth.verify_session_cookie() best for backend and JWT best for frontend ? USE BOTH?
            #TODO auth.verify_session_cookie() best for backend and JWT best for frontend ? USE BOTH?
            #TODO CHECK IPV4 LOCATION BASED !!!!! JTW COOKIE COULD BE MISUSED ELSE IF SOMEHOW LEAKED !
            #TODO CHECK IPV4 LOCATION BASED !!!!! JTW COOKIE COULD BE MISUSED ELSE IF SOMEHOW LEAKED !
            # TODO CHECK IPV4 LOCATION BASED !!!!! JTW COOKIE COULD BE MISUSED ELSE IF SOMEHOW LEAKED !

            # Get the Authorization header from the request
            auth_header = request.headers.get('Authorization', '').strip()
            id_token = auth_header.split('Bearer ')[-1]
            if not id_token:
                id_token = auth_header.split(' ')[-1]
            if not id_token:
                id_token = request.cookies.get('access_token',None)
            print(id_token)

            # Verify the ID token and get the user's custom claims
            try:
                decoded_token = auth.verify_id_token(id_token,check_revoked=True)
                print(decoded_token)

                if (isRequesterAdmin := 'admin' in decoded_token and decoded_token['admin']) \
                    and permissions.get('admin',True) is False: #Even admins are not able to proceed. Specific task, admin not required to access.
                    raise auth.InsufficientPermissionError(
                        "Admin does not need to and cant access this route; Permission admin=False is not fullfilled. Authorization Denied.",
                        None,
                        403
                    )
                elif isRequesterAdmin: #A regular level admin has AT LEAST all the rights of all other types combined !
                    decoded_token.setdefault('employer',True)
                    decoded_token.setdefault('applicant', True)
                    decoded_token.pop('myself',None)


                if 'myself' in permissions:
                    affected_user_uid = ""
                    if '_uid' in request.view_args: #The request is manipulating a user direct info
                        affected_user_uid = request.view_args.get('_uid')
                    elif '_jobid' in request.view_args: #The request is manipulating a user's job post
                        affected_user_uid = JobPost.query.get(
                            request.view_args.get('_jobid')
                        ).employerUid
                    else: # TODO: Similar handling will be done for interviews, applications, etc...
                        raise auth.UserNotFoundError(
                            f"Critical error and warning: No view arguments tracing back to " + \
                            f"a user were found in flask app route: {request.full_path}. Cant verify myself=... permission.",
                            None,
                            401
                        )

                    if (session_user := session.get("user", None)) is None or session_user['idToken'] != id_token:
                        raise auth.ExpiredSessionCookieError(
                            f"Backend session could not be found and myself permission thus couldnt be verified; Authorization denied.",
                            session_user
                        )
                    elif bool(permissions['myself']) and decoded_token['sub'] != affected_user_uid:
                        raise auth.InsufficientPermissionError(
                            f"Could not fullfill 'myself'=True perm. Action requested on user has to be done by that user. Authorization denied." +\
                            f"{decoded_token['sub']} was refused {request.path} ",
                            session_user,
                            403
                        )
                    elif not bool(permissions['myself']) and decoded_token['sub'] == affected_user_uid:
                        raise auth.InsufficientPermissionError(
                            f"Could not fullfill 'myself'=False requirement. Action requested on user cant be done by that user. Authorization denied."+\
                            f"{decoded_token['sub']} was refused {request.path}" ,
                            session_user,
                            403
                        )
                    else:
                        print(f"myself={bool(permissions['myself'])} permission has been authorized.")
                        del permissions['myself']


                permissions = dict(filter(lambda kv: kv[1], permissions.items()))
                if len((diff_set := set(permissions.keys()) - set(decoded_token.keys()))):
                    raise auth.InvalidIdTokenError(
                        f"Missing Custom claims / Permissions from JWT: {diff_set}; Authorization denied.")

            except auth.RevokedIdTokenError as generic_jwt_err:
                print("auth.RevokedIdTokenError")
                print(generic_jwt_err)

                return jsonify({'error': 'Unauthorized'}), 401
            except auth.InvalidIdTokenError as expiredNeedRefresh:
                # Token revoked, inform the user to reauthenticate or signOut().
                print("auth.InvalidIdTokenError")
                print(expiredNeedRefresh)
                print("AAAAAA ?")
                refresh_token = request.json['refreshToken']
                if not refresh_token:
                    refresh_token = request.cookies.get("refresh_token")
                print("BBBBBBBBB ?")
                response = make_response("Refreshing token of session cookie")
                response.set_cookie('session',expires=0)
                print("CCCCCCCCCC ?")
                session_cookie = auth.create_session_cookie(refresh_token,expires_in=3600)
                response.set_cookie(
                    'session', session_cookie.decode("utf-8"),
                                        httponly=True, secure=True,samesite='Strict'
                )
                print("DDDDDDDDDDDD ?")
                return wrapper(*args,**kwargs)
            except auth.UserDisabledError:
                # Token belongs to a disabled user record.
                auth.revoke_refresh_tokens(decoded_token['sub']) # Revoke allsessions
                pass

            # Check if the user has the required permission from dev/custom claims
            if all(val == decoded_token[perm_claim] for perm_claim,val in permissions.items()):
                return func(*args, **kwargs)
            else:
                return jsonify({'error': 'Forbidden'}), 403
        return wrapper
    return decorator

def exception_handler(func):
  def wrapper(*args, **kwargs):
    try:
        return func(*args, **kwargs)
    except Exception as e:
        error_code = getattr(e, "code", 500)
        logging.getLogger('main').exception("Service exception: %s", e)
        r = jsonify({"message": e.message, "matches": e.message, "error_code": error_code})
        return make_response(r, status=error_code, mimetype='application/json')
  # Renaming the function name:
  wrapper.__name__ = func.__name__
  return wrapper