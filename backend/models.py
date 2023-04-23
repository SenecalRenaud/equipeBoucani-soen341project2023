from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow,fields

from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import backref
from sqlalchemy import Enum

import datetime
import enum

from uuid import uuid1, uuid4, uuid5

generate_pr_uuid = lambda: uuid4().hex

db = SQLAlchemy()

ma = Marshmallow()

from sqlalchemy.types import TypeDecorator, VARCHAR,String
import json



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
                             backref= backref(
                                 'parent_replies',
                                 lazy='dynamic',
                                cascade='all, delete-orphan'))

    post = db.relationship('JobPost',
                           backref= backref('post_comments', lazy='dynamic'))

    replies = db.relationship('CommentPost',
                              cascade='all, delete-orphan',
                              backref=backref('parent_comment', remote_side=[id]),
                              single_parent=True)

    reactions = db.relationship('CommentReaction',
                                backref='comment',
                                cascade='all, delete-orphan',
                                lazy='dynamic')
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

class ReactionType(enum.Enum):
    LIKE = "fa-thumbs-up"
    DISLIKE = "fa-thumbs-down"
    MEH = "fa-face-meh"
    APPLAUSE = "fa-hands-clapping"
    INNOVATIVE = "fa-lightbulb-on"
    LOVE = "fa-heart"
    THINKING = "fa-face-thinking"
    FUNNY = "fa-face-laugh-beam"
class ReactionEnumType(TypeDecorator):
    impl = String
    def process_bind_param(self, value, dialect):
        print(f"process_bind_param: {value}" )

        if value is not None:
            return value.value

    def process_result_value(self, value, dialect):
        print(f"process_result_value: {value}" )

        if value not in [None,'']:
            return ReactionType(value)
class CommentReaction(db.Model):
    __slots__ = ()
    __tablename__ = "comment_reaction"

    id = db.Column(db.Integer, primary_key=True)
    reaction_type = db.Column(ReactionEnumType, nullable=False)
    reacterUid = db.Column(db.VARCHAR(28), nullable=False)
    comment_id = db.Column(db.Integer, db.ForeignKey('comment_post.id'), nullable=False)

    __table_args__ = (db.UniqueConstraint('reacterUid', 'comment_id'),)

    def __init__(self, reaction_type, reacterUid, comment_id):
        self.reaction_type = reaction_type
        self.reacterUid = reacterUid
        self.comment_id = comment_id

class CommentReactionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CommentReaction
        include_fk = True
        load_instance = True


class CommentPostSchema(ma.SQLAlchemyAutoSchema):

    #todo @fields.post_load
    # def make_comment(self, data, **kwargs):
    #     replies = data.pop('replies', [])
    #     comment = Comment(**data)
    #     self.set_replies(comment, replies)
    #     return comment
    #
    #todo @fields.pre_dump
    # def get_replies_data(self, obj, **kwargs):
    #     self.get_replies(obj)
    #     return obj
    class Meta:
        model = CommentPost
        include_fk = True
        load_instance = True
        exclude = ('parent', 'post',)

    replies = ma.List(ma.Nested(
        lambda: CommentPostSchema()#exclude=('replies', 'parent_replies', 'parent', 'post',))
                                ))
    reactions = ma.List(ma.Nested(
        lambda: CommentReactionSchema()))
    # _links = ma.Hyperlinks(


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
