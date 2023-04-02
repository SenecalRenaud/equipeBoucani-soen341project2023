#TODO from flask_wtf import FlaskForm
#TODO from wtforms import ...
#todo from wtfforms.validators import ... , and also import regex
import datetime

from firebase_admin import auth
from functools import wraps
from flask import g, request, redirect, url_for, jsonify, make_response

import logging

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.user is None:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function


def authorized(**permissions):
    def decorator(func):
        nonlocal permissions
        def wrapper(*args, **kwargs):
            nonlocal permissions,func

            #TODO auth.verify_session_cookie() best for backend and JWT best for frontend ? USE BOTH?
            #TODO auth.verify_session_cookie() best for backend and JWT best for frontend ? USE BOTH?
            #TODO auth.verify_session_cookie() best for backend and JWT best for frontend ? USE BOTH?
            #TODO CHECK IPV4 LOCATION BASED !!!!! JTW COOKIE COULD BE MISUSED ELSE IF SOMEHOW LEAKED !
            #TODO CHECK IPV4 LOCATION BASED !!!!! JTW COOKIE COULD BE MISUSED ELSE IF SOMEHOW LEAKED !
            # TODO CHECK IPV4 LOCATION BASED !!!!! JTW COOKIE COULD BE MISUSED ELSE IF SOMEHOW LEAKED !

            # Get the Authorization header from the request
            id_token = request.headers.get('Authorization', '').split('Bearer ')[-1]

            # Verify the ID token and get the user's custom claims
            try:

                decoded_token = auth.verify_id_token(id_token,check_revoked=True)
                print(decoded_token)

                if decoded_token['admin']: #A regular level admin has AT LEAST all the rights of all other types combined !
                    decoded_token.setdefault('employer',True)
                    decoded_token.setdefault('applicant', True)


                permissions = dict(filter(lambda kv: kv[1], permissions.items()))
                if len((diff_set := set(permissions.keys()) - set(decoded_token.keys()))):
                    raise auth.InvalidIdTokenError(
                        f"Missing Custom claims / Permissions from JWT: {diff_set}; Authorization denied.")

            except auth.RevokedIdTokenError as revokedNeedRefresh:
                # Token revoked, inform the user to reauthenticate or signOut().
                print(revokedNeedRefresh)
                refresh_token = request.json['refreshToken']

                response = make_response("Refreshing token of session cookie")
                response.set_cookie('session',expires=0)

                session_cookie = auth.create_session_cookie(refresh_token,expires_in=3600)
                response.set_cookie(
                    'session', session_cookie.decode("utf-8"),
                                        httponly=True, secure=True,samesite='Strict'
                )
                return wrapper(*args,**kwargs)
            except auth.InvalidIdTokenError as generic_jwt_err:
                print(generic_jwt_err)

                return jsonify({'error': 'Unauthorized'}), 401
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