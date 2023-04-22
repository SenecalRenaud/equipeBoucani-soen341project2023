from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow,fields

from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import backref


import datetime
import enum

from uuid import uuid1, uuid4, uuid5

generate_pr_uuid = lambda: uuid4().hex

db = SQLAlchemy()

ma = Marshmallow()


class CommentPost(db.Model):
    """
    Experiment MySQL Alchemy Table creation and config with OOP.
    Python interpreter simplest launch example
    //>>> from app import db
    //>>> db.create_all()
    """
    __slots__ = ()
    __tablename__ = "comment_post"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), unique=True)
    body = db.Column(db.Text())
    date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now)
    editDate = db.Column(db.DateTime(timezone=True), default=lambda: None)
    posterUid = db.Column(db.VARCHAR(28), nullable=False)

    parent_id = db.Column(db.Integer, db.ForeignKey('comment_post.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('job_post.id'))
    parent = db.relationship('CommentPost',
                             remote_side=[id],
                             backref= backref('replies', lazy='dynamic'))
    post = db.relationship('JobPost',
                           backref= backref('post_comments', lazy='dynamic'))

    @hybrid_property
    def is_reply(self):
        return bool(self.parent)

    @hybrid_property
    def is_post_comment(self):
        return not bool(self.parent)

    #TODO Add reactions, like and dislike.

    def __init__(self, title, body, posterUid,post_id,parent_id=None):
        self.title = title
        self.body = body
        self.posterUid =posterUid

        self.post_id = post_id
        self.parent_id = parent_id

        self.isEdited = False
        self._editDate = None





class CommentPostSchema(ma.SQLAlchemyAutoSchema):

    # @fields.post_load
    # def make_comment(self, data, **kwargs):
    #     replies = data.pop('replies', [])
    #     comment = Comment(**data)
    #     self.set_replies(comment, replies)
    #     return comment
    #
    # @fields.pre_dump
    # def get_replies_data(self, obj, **kwargs):
    #     self.get_replies(obj)
    #     return obj
    class Meta:
        model = CommentPost
        include_fk = True
        load_instance = True
        exclude = ('parent', 'post',)

    replies = ma.List(ma.Nested(
        lambda: CommentPostSchema()#exclude=('replies','parent', 'post',)
                                ))

    # _links = ma.Hyperlinks(

"""
class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    parent_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    parent = db.relationship('Comment', remote_side=[id])
    post = db.relationship('Post', backref='comments')

class CommentSchema(Schema):
    id = fields.Int(dump_only=True)
    text = fields.Str(required=True)
    post = fields.Nested(PostSchema)
    replies = fields.Nested('self', many=True)

    @staticmethod
    def get_replies(obj):
        return obj.replies or []

    @staticmethod
    def set_replies(obj, replies):
        obj.replies = replies

    @fields.post_load
    def make_comment(self, data, **kwargs):
        replies = data.pop('replies', [])
        comment = Comment(**data)
        self.set_replies(comment, replies)
        return comment

    @fields.pre_dump
    def get_replies_data(self, obj, **kwargs):
        self.get_replies(obj)
        return obj

comment = Comment.query.get(1)
comment_schema = CommentSchema()
json_data = comment_schema.dump(comment)
print(json_data)
from datetime import datetime
from marshmallow import Schema, fields
from myapp import db

class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200))
    parent_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    parent = db.relationship('Comment', remote_side=[id], backref='replies')
    post = db.relationship('Post', backref='comments')

    def __repr__(self):
        return f'<Comment {self.id}>'

class CommentSchema(Schema):
    id = fields.Int(dump_only=True)
    text = fields.Str(required=True)
    parent_id = fields.Int()
    post_id = fields.Int()
    created_at = fields.DateTime(dump_only=True)
    parent = fields.Nested('self', exclude=('parent',), dump_only=True)
    replies = fields.Nested('self', exclude=('replies',), many=True, dump_only=True)

class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    body = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    comments = db.relationship('Comment', backref='post')

    def __repr__(self):
        return f'<Post {self.id}>'

class PostSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    body = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)
    comments = fields.Nested(CommentSchema, many=True, dump_only=True)

class CommentInputSchema(Schema):
    text = fields.Str(required=True)
    parent_id = fields.Int()
    post_id = fields.Int()


"""

class UserType(enum.Enum):
    APPLICANT = 0
    STUDENT = 0
    JOBSEEKER = 0
    EMPLOYER = 1
    ADMIN = 2

    @classmethod
    def _missing_(cls, value: object):
        try:
            value = value.upper()

            for member in cls:

                if member.value == value:
                    return member
        except:
            pass
        return cls['APPLICANT']



class JobPost(db.Model):
    __slots__ = ()
    __tablename__ = "job_post"

    id = db.Column(db.Integer, primary_key=True)
    jobtype = db.Column(db.Text(), nullable=False)
    location = db.Column(db.Text())
    salary = db.Column(db.Integer())
    title = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text())
    tags = db.Column(db.Text())
    editDate = db.Column(db.DateTime(timezone=True), default=lambda: None)
    date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now)
    employerUid = db.Column(db.VARCHAR(28), nullable=False)  # default firebase uuid used is 28 alphanumerical string

    comments = db.relationship('CommentPost', backref='job_comments')
    def __init__(self, jobtype, title, location, salary, description, tags, employerUid):
        self.jobtype = jobtype
        self.title = title
        self.location = location
        self.salary = salary
        self.description = description
        self.tags = tags
        self.employerUid = employerUid

        # Attributes used for common modification date handling (IF ANY) in app routes !
        self.isEdited = False
        self._editDate = None


class JobPostSchema(ma.Schema):
    class Meta:
        fields = (
            'id', 'jobtype', 'title', 'location', 'salary', 'description', 'tags', 'date', 'editDate', 'employerUid')
        ordered = True

    post_comments = ma.Nested(CommentPostSchema, many=True, dump_only=True)

class Application(db.Model):
    __slots__ = ()
    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)
    jobPostId = db.Column(db.Text()) #TODO or use relation("JobPost" back_populates='Applications')
    #TODO jobPostId = db.Column(db.Integer, db.ForeignKey('job_post.id'), nullable=False) here
    #TODO applications = db.relationship('ApplicationPost', backref='job_post') in JobPost
    applicantUid = db.Column(db.VARCHAR(28))
    coverLetter = db.Column(db.Text())
    date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now)
    employerUid = db.Column(
        db.VARCHAR(28))  # avoids using jobpostid with an extra request / cache storage in the frontend

    def __init__(self, jobPostId, applicantUid, coverLetter):
        self.jobPostId = jobPostId
        self.applicantUid = applicantUid
        self.coverLetter = coverLetter
        self.employerUid = JobPost.query.get(jobPostId).employerUid


class ApplicationSchema(ma.Schema):
    class Meta:
        fields = ('id', 'jobPostId', 'applicantUid', 'employerUid', 'coverLetter', 'date')

# class UserExtraInfo(db.Model):
#     __tablename__ = "users_extra_info"
#
#     firebaseUUID = db.Column(db.VARCHAR(255),primary_key=True)
#     userType = db.Column(db.Enum(UserType))
#
#     def __init__(self,firebaseUUID,userType):
#
#         self.firebaseUUID = firebaseUUID
#         self.userType = userType
#    # @property
    # def editDate(self):
    #     return self._editDate
    # @editDate.setter
    # def editDate(self,_arbitraryDate):
    #     self.isEdited = True
    #     if not isinstance(_arbitraryDate,datetime.datetime):
    #         _arbitraryDate = datetime.datetime.utcfromtimestamp(0)
    #     self._editDate = _arbitraryDate
# class UserExtraInfoSchema(ma.Schema):
#     class Meta:
#         fields = ('firebaseUUID','userType')
