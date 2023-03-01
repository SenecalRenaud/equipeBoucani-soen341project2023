from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

import datetime

from uuid import uuid1,uuid4,uuid5
generate_pr_uuid = lambda : uuid4().hex

db = SQLAlchemy()

ma = Marshmallow()
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
    date = db.Column(db.DateTime(timezone=True),default=datetime.datetime.now)

    def __init__(self,title,body):
        self.title = title
        self.body = body
# md.create_all()
# eng = md.bind
# con = eng.connect()
# res = con.execute(data_table.insert().values(id=1))
# s = sqlalchemy.sql.select([data_table])
# res = con.execute(s)
# rw = res.fetchone()
class CommentPostSchema(ma.Schema):
    class Meta:
        fields = ('id','title','body','date')

    # _links = ma.Hyperlinks(


