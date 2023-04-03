from dotenv import load_dotenv,find_dotenv
#Avoid (dotenv.find_dotenv(".myenvfilename"))
import os
#import redis #do from_url(), >redis-cli to get localhost redis uri
import enum
from abc import ABC, ABCMeta,abstractmethod

import dotenv

WDIR = os.path.abspath(os.path.dirname(__file__))

FLASK_ENV_FILE_NAME = ".flaskenv"
DATABASES_ENV_FILE_NAME = ".env.local" #Currently holds API key values for Firebase and MySql databases

try:
    assert load_dotenv(WDIR + os.sep + FLASK_ENV_FILE_NAME)

    assert load_dotenv(WDIR + os.sep + DATABASES_ENV_FILE_NAME)
except:
    raise FileNotFoundError("Missing Environment Variables files.\n\r"+\
                            f"\033[7;33m{FLASK_ENV_FILE_NAME}\033[0;1m and/or \033[7;33m{DATABASES_ENV_FILE_NAME}\033[0m "
                            f"should be in \033[1m./backend/\033[0m.\n\r"
                            f">>> Contact Antoine@ChiefsBestPal for necessary auth or other admins if problems")

class MetaDatabaseConnection(enum.EnumMeta,ABCMeta):
    """
    Database Connection Server info Meta class
    ChiefsBestPal@AntoineCantin
    """
    OBLIGATORY_NAMES = ['RDBMS_ALCHEMY_HNAME', 'DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST', 'DB_PORT'] #not hashset, needs to be ordered
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

        assert not (set(db_template_enum_obj.__members__) - set(MetaDatabaseConnection.OBLIGATORY_NAMES))


        return db_template_enum_obj

    class CurrentDatabaseEnum(enum.Enum,ABC):
        # _order_ = ('RDBMS_ALCHEMY_HNAME', 'DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST', 'DB_PORT')

        @abstractmethod #@abstractproperty has been deprecated !
        def databaseServerURL(self):
            pass
        @classmethod
        def exportToNameSpace(cls,namespace : dict,onlyObligatoryFields=True):
            members  = cls.__members__
            if onlyObligatoryFields:
                members = {key: value for key, value in members.items() if key in MetaDatabaseConnection.OBLIGATORY_NAMES}
            namespace.update(members)
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

    @property
    def databaseServerURL(self):
        return rf"jdbc:mysql://localhost:3306/flask_test_mysql_db"
class HostedSql96Database(MetaDatabaseConnection.CurrentDatabaseEnum, metaclass=MetaDatabaseConnection):
    """
    From freemysqlhosting.net account.
    Must have the right values in .env.local or any loaded .env file for databases
    Antoine@ChiefsBestPal
    """
    RDBMS_ALCHEMY_HNAME = 'mysql'#TODO
    DB_NAME = "flask_test_mysql_db"#TODO
    DB_USER = "root"#TODO
    DB_PASS = "" #else -> ":'pass'"#TODO
    DB_HOST = "localhost"#TODO
    DB_PORT = ""#e.g. :5000, :3306#TODO

    @property
    def databaseServerURL(self):
        return r"jdbc:mysql://localhost:3306/flask_test_mysql_db"

RDBMS_ALCHEMY_HNAME,DB_NAME,DB_USER,DB_PASS,DB_HOST,DB_PORT = \
    HostedSql96Database.exportToNameSpace(globals()) #NOTE: Current database is chosen here, and relays its members to module scope

#TODO OFFER CHOICE BETWEEN LOCAL AND HOSTED DATABASE IN BACKEND CONSOLE !


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
