import datetime
from time import strftime

from flask import Flask,jsonify,request,abort,session

# from sqlalchemy import Integer,DateTime,String,Text,Column
# from flask.ext.session import Session, Session(app) to use flask.session instead of db.session

# from werkzeug.local import LocalProxy,WSGIApplication

from flask_cors import CORS,cross_origin #?  (for cross origin requests)
#TODO from flask_bcrypt import Bcrypt #? (for passwords, private op hash,...)

import logging
import os
import re
import itertools
import operator


#*******************************
from config import ApplicationSessionConfig #env vars + Session configs
from models import db,ma # SQLAlchemyInterface and MarshmallowSchema objects  to integrate
#*******************************


app = Flask(__name__)

# import firebase_admin
# import pyrebase
# from firebase_admin import credentials, auth
# cred = credentials.Certificate('firebase_integration/fbAdminConfig.json')
# firebase = firebase_admin.initialize_app(cred)
# pb = pyrebase.initialize_app(json.load(open('firebase_integration/fbconfig.json')))#Data source
# users = [{'uid': 1, 'name': 'Napolean Bonaparte'}]#Api route to get users

cors = CORS(app)

app.config.from_object(ApplicationSessionConfig)

db.init_app(app)

ma.init_app(app)

with app.app_context():
    db.create_all()

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
