from dotenv import load_dotenv
import os

load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))

class ApplicationSessionConfig:
    SECRET_KEY = os.environ["SECRET_KEY"] # should set flask.Flask.secret_key

    SESSION_COOKIE_SECURE = False
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True

    SQLALCHEMY_DATABASE_URI = f"{RDBMS_ALCHEMY_HNAME}://{DB_USER}@{DB_HOST}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_ECHO = False
    #todo SQLALCHEMY_BINDS for cors or many db?
