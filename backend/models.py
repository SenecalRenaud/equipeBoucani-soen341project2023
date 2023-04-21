"""models.py module

SQLalchemy SQL tables models
"""
import datetime
import enum

# from sqlalchemy import Integer, DateTime, String, Text, Column, Enum, VARCHAR
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

from uuid import uuid4  # , uuid1, uuid5


def generate_pr_uuid():
    return uuid4().hex


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
    title = db.Column(db.String(100), unique=True, nullable=False)
    body = db.Column(db.Text())
    date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now)
    editDate = db.Column(db.DateTime(timezone=True), default=lambda: None)

    def __init__(self, title, body):
        self.title = title
        self.body = body

        self.isEdited = False
        self._editDate = None

    # @property
    # def editDate(self):
    #     return self._editDate
    # @editDate.setter
    # def editDate(self,_arbitraryDate):
    #     self.isEdited = True
    #     if not isinstance(_arbitraryDate,datetime.datetime):
    #         _arbitraryDate = datetime.datetime.utcfromtimestamp(0)
    #     self._editDate = _arbitraryDate


class CommentPostSchema(ma.Schema):
    class Meta:
        fields = ("id", "title", "body", "date", "editDate")
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
        return cls["APPLICANT"]


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
#
# class UserExtraInfoSchema(ma.Schema):
#     class Meta:
#         fields = ('firebaseUUID','userType')


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
    employerUid = db.Column(
        db.VARCHAR(28), nullable=False
    )  # default firebase uuid used is 28 alphanumerical string

    def __init__(
        self, jobtype, title, location, salary, description, tags, employerUid
    ):
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

    # @property
    # def editDate(self):
    #     return self._editDate
    # @editDate.setter
    # def editDate(self,_arbitraryDate):
    #     self.isEdited = True
    #     if not isinstance(_arbitraryDate,datetime.datetime):
    #         _arbitraryDate = datetime.datetime.utcfromtimestamp(0)
    #     self._editDate = _arbitraryDate


class JobPostSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "jobtype",
            "title",
            "location",
            "salary",
            "description",
            "tags",
            "date",
            "editDate",
            "employerUid",
        )


class Application(db.Model):
    __slots__ = ()
    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)
    jobPostId = db.Column(db.Text())
    applicantUid = db.Column(db.VARCHAR(28))
    coverLetter = db.Column(db.Text())
    date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now)
    employerUid = db.Column(
        db.VARCHAR(28)
    )  # avoids using jobpostid with an extra request / cache storage in the frontend

    def __init__(self, jobPostId, applicantUid, coverLetter):
        self.jobPostId = jobPostId
        self.applicantUid = applicantUid
        self.coverLetter = coverLetter
        self.employerUid = JobPost.query.get(jobPostId).employerUid


class ApplicationSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "jobPostId",
            "applicantUid",
            "employerUid",
            "coverLetter",
            "date",
        )
