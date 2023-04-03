from dotenv import load_dotenv
#Avoid (dotenv.find_dotenv(".myenvfilename"))
import os
#import redis #do from_url(), >redis-cli to get localhost redis uri
import enum


ENV_FILE_NAME = ".flaskenv"
WDIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(WDIR + os.sep + ENV_FILE_NAME)

class MetaDatabaseConnection(enum.EnumMeta):
    """
    Database Connection Server info Meta class
    ChiefsBestPal@AntoineCantin
    """
    OBLIGATORY_NAMES = {'RDBMS_ALCHEMY_HNAME', 'DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST', 'DB_PORT'}
    def __new__(metacls, cls, bases, classdict):

        classdict['_ignore_'] = 'OBLIGATORY_NAMES'

        bases = tuple([MetaDatabaseConnection.CurrentDatabaseEnum] + list(bases)[1:])

        object_attrs = set(dir(type(cls, (object,), {})))

        db_template_enum_obj = super().__new__(metacls, cls, bases, classdict)

        
        db_template_enum_obj._member_names_ = set(classdict.keys()) - object_attrs

        non_members = set()

        for attr in db_template_enum_obj._member_names_:

            if attr.startswith('_') and attr.endswith('_'):

                non_members.add(attr)

            else:

                setattr(db_template_enum_obj, attr, attr)

        db_template_enum_obj._member_names_.difference_update(non_members | set(classdict.get('_ignore_',[])))

        assert not (set(db_template_enum_obj.__members__) - MetaDatabaseConnection.OBLIGATORY_NAMES)


        return db_template_enum_obj

    class CurrentDatabaseEnum(enum.Enum):
        @classmethod
        def exportToNameSpace(cls,namespace : dict):
            namespace.update(cls.__members__)
            return tuple(map(lambda enum_field: enum_field.value,
                             cls._member_map_.values()))
class LocalHostDatabase(MetaDatabaseConnection.CurrentDatabaseEnum, metaclass=MetaDatabaseConnection):
    """
    Current Test Database connection info...
    locally hosted tables using XAMMP and mysql+apache server
    Antoine Cantin
    """
    RDBMS_ALCHEMY_HNAME = 'mysql'
    DB_NAME = "flask_test_mysql_db"
    DB_USER = "root"
    DB_PASS = "" #else -> ":'pass'"
    DB_HOST = "localhost"
    DB_PORT = ""#e.g. :5000, :3306

RDBMS_ALCHEMY_HNAME,DB_NAME,DB_USER,DB_PASS,DB_HOST,DB_PORT = \
    LocalHostDatabase.exportToNameSpace(globals())

localDbMySql = LocalHostDatabase.DB_HOST

class ApplicationSessionConfig:
    SECRET_KEY = os.environ["SECRET_KEY"] # should set flask.Flask.secret_key
    SESSION_TYPE = 'filesystem'
    SESSION_FILE_DIR = "local_flask_sessions" #If you change this name, add to .gitignore (NOTE: still low security threat)

    TEMP_UPLOAD_PATH = "uploads_cache"

    CORS_HEADERS = "Content-Type"

    SESSION_COOKIE_SECURE = False #when True, limit the cookies to HTTPS traffic only [for production].
    SESSION_COOKIE_HTTPONLY=False #when True, prevents any client-side usage of the session cookie
    # REMEMBER_COOKIE_HTTPONLY=True
    SESSION_COOKIE_SAMESITE="None" #else, "Strict"

    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True

    SQLALCHEMY_DATABASE_URI = f"{RDBMS_ALCHEMY_HNAME}://{DB_USER}@{DB_HOST}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_ECHO = False

    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USERNAME = 'equipeboucani@gmail.com'
    MAIL_PASSWORD = os.environ["FLASK_MAIL_APP_PW"]
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True

    # todo SQLALCHEMY_BINDS for cors or many db?
