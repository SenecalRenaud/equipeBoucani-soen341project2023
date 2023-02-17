from flask import Flask,jsonify,request
from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import Integer,DateTime,String,Text,Column
import flask

from flask_marshmallow import Marshmallow

# from werkzeug.local import LocalProxy,WSGIApplication


#todo from flask_cors import CORS (for cross origin requests)
#todo from flask_bcrypt import Bcrypt (for passwords, private op hash,...)

import logging
import datetime
import os

import re

import itertools
import operator

RDBMS_ALCHEMY_HNAME = 'mysql'
_DB_NAME = "flask_test_mysql_db"
DB_USER = "root"
DB_PASS = "" #else -> ":'pass'"
DB_HOST = "localhost"
DB_PORT = ""#e.g. :5000, :3306


app = Flask(__name__)

#Type of SQLalchemy database wanted; Lookup config keys type in flasksqlalchemy website
app.config['SQLALCHEMY_DATABASE_URI'] = f"{RDBMS_ALCHEMY_HNAME}://{DB_USER}@{DB_HOST}/{_DB_NAME}"

#for debug/dev safety mostly
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#if db imported from another module, do db.init_app(app)
db = SQLAlchemy(app)

ma = Marshmallow(app)

class CommentPost(db.Model):
    """
    Experiment MySQL Alchemy Table creation and config with OOP.
    Python interpreter simplest launch example
    >>> from app import db
    >>> db.create_all()
    """
    __slots__ = ()
    __tablename__ = "comment_post"

    id = db.Column(db.Integer,primary_key=True)
    title = db.Column(db.String(100),unique=True,nullable=False)
    body = db.Column(db.Text())
    date = db.Column(db.DateTime,default=datetime.datetime.now)

    def __init__(self,title,body):
        self.title = title
        self.body = body

class CommentPostSchema(ma.Schema):
    class Meta:
        fields = ('id','title','body','date')

commentpost_schema = CommentPostSchema()
commentposts_schema = CommentPostSchema(many=True)

@app.route('/get', methods=['GET']) # methods = [list http reqs methods]
def get_all_commentposts():
    """
    GET request to view all table entries directly from 'many' mode sql schema
    :return: json response
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

    # with app.app_context():
    #     db.create_all()
    # port = int(os.environ.get('PORT', 5000))
    app.run(debug=True)

# with app.app_context():
#     db.create_all()
#
#     db.session.add(TableExample("This the #1 Title", "And this the #1 Body"))
#     db.session.add(TableExample("BUt This the #2 Title", "And indeed this the #2 Body"))
#
#     db.session.commit()
#
#     tableexamples = TableExample.query.all()
#     print(tableexamples)
