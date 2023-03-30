#TODO from flask_wtf import FlaskForm
#TODO from wtforms import ...
#todo from wtfforms.validators import ... , and also import regex

from functools import wraps
from flask import g, request, redirect, url_for,jsonify

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.user is None:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

# from firebase_admin import auth
# def authorized(permission):
#     def decorator(func):
#         def wrapper(*args, **kwargs):
#             # Get the Authorization header from the request
#             id_token = request.headers.get('Authorization', '').split('Bearer ')[-1]
#             # Verify the ID token and get the user's custom claims
#             try:
#                 decoded_token = auth.verify_id_token(id_token)
#                 custom_claims = decoded_token.get('custom_claims', {})
#             except:
#                 return jsonify({'error': 'Unauthorized'}), 401
#             # Check if the user has the required permission
#             if permission in custom_claims.get('permissions', []):
#                 return func(*args, **kwargs)
#             else:
#                 return jsonify({'error': 'Forbidden'}), 403
#         return wrapper
#     return decorator