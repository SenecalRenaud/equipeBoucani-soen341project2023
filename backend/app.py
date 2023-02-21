from flask import Flask,jsonify,request,abort,session

# from sqlalchemy import Integer,DateTime,String,Text,Column
# from flask.ext.session import Session, Session(app) to use flask.session instead of db.session

# from werkzeug.local import LocalProxy,WSGIApplication

from flask_cors import CORS #?  (for cross origin requests)
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

app.config.from_object(ApplicationSessionConfig)

db.init_app(app)

ma.init_app(app)

with app.app_context():
    db.create_all()

#TODO Seperate once database has scaled... For now, single modules are convenient
from models import CommentPost,CommentPostSchema
commentpost_schema = CommentPostSchema()
commentposts_schema = CommentPostSchema(many=True)

@app.route('/get', methods=['GET'])# methods = [list http reqs methods]
def get_all_commentposts():
    """
    GET request to view all table entries directly from 'many' mode sql schema
    :return: json response
    Antoine Cantin@ChiefsBestPal
    """

    all_commentposts = CommentPost.query.all()
    results_arr = commentposts_schema.dump(all_commentposts)

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

    commentpost.title = request.json['title']
    commentpost.body = request.json['body']

    db.session.commit()

    return commentpost_schema.jsonify(commentpost)
@app.route("/delete/<_id>/",methods=['DELETE'])
def delete_commentpost(_id):
    commentpost = CommentPost.query.get(_id)

    db.session.delete(commentpost)

    db.session.commit()

    return commentpost_schema.jsonify(commentpost)

if __name__ == '__main__':

    #port = int(os.environ.get('PORT', 5000))
    app.run(debug=True)
