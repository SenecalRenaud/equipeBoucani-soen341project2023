import MySQLdb #NOTE: DBAPI mysqlclient, leave this import here !
from dotenv import load_dotenv
#Avoid (dotenv.find_dotenv(".myenvfilename"))
import os
#import redis #do from_url(), >redis-cli to get localhost redis uri
import enum
from abc import ABC, ABCMeta,abstractmethod

from flask import Flask,current_app

@enum.unique
class DialectDBAPI(enum.Enum):
    MYSQLCLIENT = "mysqldb" # C-library, fast... but if external sys req not met, might be issues
    PYMYSQL = "pymysql" # Maybe slightly slower, but easier to integrate
    MYSQLCONNECTORPYTHON = "mysqlconnector" # May cause issues in virtual env + dependencies ?


WDIR = os.path.abspath(os.path.dirname(__file__))

FLASK_ENV_FILE_NAME = ".flaskenv"
DATABASES_ENV_FILE_NAME = ".env.local" #Currently holds API key values for Firebase and MySql databases

useLocalInsteadOfHostedDatabase = (os.environ['useLocalInsteadOfHostedDatabase'] == "true") if 'useLocalInsteadOfHostedDatabase' in os.environ else True

try:

    assert load_dotenv(WDIR + os.sep + FLASK_ENV_FILE_NAME)

    if not (current_app.debug or os.environ.get("FLASK_ENV") == "development") or os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        useLocalInsteadOfHostedDatabase = input(
            "Do you want to use your personal local version of the MySQL database instead of the hosted one? (Y/N)\n\r>>> "
        ).strip().casefold() == 'y'
        os.environ['useLocalInsteadOfHostedDatabase'] = str(useLocalInsteadOfHostedDatabase).lower()

    if not useLocalInsteadOfHostedDatabase:
        assert load_dotenv(WDIR + os.sep + DATABASES_ENV_FILE_NAME)
except Exception as err :
    print(err)
    raise FileNotFoundError("Missing Environment Variables files.\n\r"+\
                            f"\033[7;33m{FLASK_ENV_FILE_NAME}\033[0;1m and/or \033[7;33m{DATABASES_ENV_FILE_NAME}\033[0m "
                            f"should be in \033[1m./backend/\033[0m.\n\r"
                            f">>> Contact Antoine@ChiefsBestPal for necessary auth or other admins if problems")



class ABCMetaDatabaseConnection(enum.EnumMeta, ABCMeta):
    """
    Database Connection Server info Meta x Abstract Mixin class
    AntoineCantin@ChiefsBestPal
    """
    OBLIGATORY_NAMES = ['RDBMS_ALCHEMY_HNAME', 'DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST', 'DB_PORT'] #not hashset, needs to be ordered
    def __new__(metacls, cls, bases, classdict):


        print(metacls, cls, bases, classdict)
        # bases = tuple([ABCMetaDatabaseConnection.CurrentDatabaseABCEnum] + list(bases)[1:])

        db_template_enum_obj = super().__new__(metacls, cls, bases, classdict)

        if db_template_enum_obj.__qualname__ == "CurrentDatabaseABCEnum":
            return db_template_enum_obj

        object_attrs = set(dir(type(cls, (object,), {})))

        db_template_enum_obj._member_names_ = set(classdict.keys()) - object_attrs
        # print("MEMNAMES:", db_template_enum_obj._member_names_)
        # print("ATTRS: ", set(classdict))
        # non_defaulted_members =
        classdict['_ignore_'] = "OBLIGATORY_NAMES"
        non_members = set()
        if db_template_enum_obj._member_map_:
            try:
                if (absmethods := list(db_template_enum_obj.__abstractmethods__)):
                    missing = ', '.join(f'{method!r}' for method in absmethods)
                    raise TypeError(
                       f"Cannot instantiate Abstract/MixinABC {db_template_enum_obj.__name__!r}:"
                       f"Without implementing abstract methods: {missing}")
            except AttributeError:
                pass #Not ABC, skip



        # print("MEMBERS: ",db_template_enum_obj.__members__)
        # print("MAP: ", db_template_enum_obj._member_map_)
        # print("NAMES: ", db_template_enum_obj._member_names_)
        for attr_name in set(db_template_enum_obj._member_names_)-{'databaseServerURL','exportToNameSpace','sqlalchemyURI'}:

            if attr_name.startswith('_') and attr_name.endswith('_'):

                non_members.add(attr_name)

            else:
                print(f"GETATTR ('{attr_name}') : {getattr(db_template_enum_obj,attr_name)}")
                setattr(db_template_enum_obj, attr_name, attr_name)

        db_template_enum_obj._member_names_.difference_update(non_members | {'OBLIGATORY_NAMES'})

        assert not (set(ABCMetaDatabaseConnection.OBLIGATORY_NAMES) - set(db_template_enum_obj.__members__.keys()))
        # print(db_template_enum_obj._member_names_)
        # print(json.dumps(dict(db_template_enum_obj.__members__.items()),indent=2))
        return db_template_enum_obj


class CurrentDatabaseABCEnum(metaclass=ABCMetaDatabaseConnection):
    """
    Abstract Enum that holds no actual information but forces metaclass in MRO
    and thus forces its Mixin inherihors to implement as specified here, as well as get any class or static methods,etc
    AntoineCantin@ChiefsBestPal
    """
    # _ignore_ = ['databaseServerURL','exportToNameSpace']
    # _order_ = ('RDBMS_ALCHEMY_HNAME', 'DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST', 'DB_PORT')

    @property
    @abstractmethod #@abstractproperty has been deprecated !
    def databaseServerURL(self):
        pass
    @classmethod
    def exportToNameSpace(cls,namespace : dict,*,onlyObligatoryFields=True):
        _members_map  = cls.__members__

        if onlyObligatoryFields:
            _members_map = {key: value for key, value in _members_map.items() if key in ABCMetaDatabaseConnection.OBLIGATORY_NAMES}
        namespace.update(_members_map)
        return tuple(map(lambda enum_field: enum_field.value,
                         _members_map.values()))
class LocalHostDatabase(CurrentDatabaseABCEnum, enum.Enum, metaclass=ABCMetaDatabaseConnection):
    """
    Current Test Database connection info...
    locally hosted tables using XAMMP and mysql+apache server
    AntoineCantin@ChiefsBestPal
    """
    RDBMS_ALCHEMY_HNAME = 'mysql'
    DB_NAME = "flask_test_mysql_db"
    DB_USER = "root"
    DB_PASS = "" #else -> ":'pass'"
    DB_HOST = "localhost"
    DB_PORT = ""#e.g. :5000, :3306

    #NOTE These fields will be ignored except if exportToNameSpace(namespace,onlyObligatoryFields=False)
    SELF = object()
    @property
    def sqlalchemyURI(self):
        cred = self.DB_USER.value
        if self.DB_PASS.value:
            cred += ":" + self.DB_PASS.value

        return rf"{self.RDBMS_ALCHEMY_HNAME.value}://{cred}@{self.DB_HOST.value}/{self.DB_NAME.value}"
    @property
    def databaseServerURL(self):
        return rf"jdbc:{self.RDBMS_ALCHEMY_HNAME.value}://{self.DB_HOST.value}:{self.DB_PORT.value}/{self.DB_NAME.value}"
class HostedSql96Database(CurrentDatabaseABCEnum, enum.Enum, metaclass=ABCMetaDatabaseConnection):
    """
    From freemysqlhosting.net account.
    Must have the right values in .env.local or any loaded .env file for databases
    Antoine@ChiefsBestPal
    """

    RDBMS_ALCHEMY_HNAME = 'mysql'
    DB_NAME = os.environ.get('HOSTMYSQL96_NAME','')
    DB_USER = os.environ.get('HOSTMYSQL96_USERNAME','')
    DB_PASS = os.environ.get('HOSTMYSQL96_PASSWORD','')
    DB_HOST = os.environ.get('HOSTMYSQL96_SERVER','')
    DB_PORT = os.environ.get('HOSTMYSQL96_PORT','')

    #NOTE These fields will be ignored except if exportToNameSpace(namespace,onlyObligatoryFields=False)
    SELF = object() # ref object to call more intuitively @property s

    BASIC_MB_SPACE = 5 # Basic storage for all tables
    SERVER_LOCATION = "NA-East" #Server datacenter location (May be of interest when choosing conns from alien IpV4s)

    HOSTING_ACCOUNT_NUMBER = os.environ.get('HOSTMYSQL96_ACCOUNTNO','') #Hosting service account number

    DBAPI_DIALECT = DialectDBAPI.MYSQLCLIENT #NOTE: If problems, try with other DBAPI (and install if not already done)
    @property
    def sqlalchemyURI(self):
        _DBAPI_DIALECT = DialectDBAPI(self.DBAPI_DIALECT.value)._value_
        return rf"{self.RDBMS_ALCHEMY_HNAME.value}+{_DBAPI_DIALECT}://" \
               rf"{self.DB_USER.value}:{self.DB_PASS.value}@" \
               rf"{self.DB_HOST.value}:{self.DB_PORT.value}/{self.DB_NAME.value}"
    @property
    def databaseServerURL(self):

        return self.SELF.sqlalchemyURI #TODO !!!!!!!!!!!!!!!!



Chosen_EnumDatabase_Conn_Obj_ = LocalHostDatabase if useLocalInsteadOfHostedDatabase else HostedSql96Database

RDBMS_ALCHEMY_HNAME,DB_NAME,DB_USER,DB_PASS,DB_HOST,DB_PORT = \
    Chosen_EnumDatabase_Conn_Obj_.exportToNameSpace(globals()) #NOTE: Current database is chosen here, and relays its members to module scope

print(f"\033[32m Running \033[100;1m{Chosen_EnumDatabase_Conn_Obj_.__qualname__}\033[49m\033[22m for the backend at: "
      f"{Chosen_EnumDatabase_Conn_Obj_.SELF.databaseServerURL.replace(DB_PASS,len(DB_PASS)*'*')}!!! \033[0m")


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

    SQLALCHEMY_DATABASE_URI = Chosen_EnumDatabase_Conn_Obj_.SELF.sqlalchemyURI
    SQLALCHEMY_TRACK_MODIFICATIONS = False # True only for debugging within flask
    SQLALCHEMY_ECHO = False

    #TODO app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    #    'pool_pre_ping': True,
    #    'pool_size': 5,
    #   'max_overflow': 10
    # }

    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USERNAME = 'equipeboucani@gmail.com'
    MAIL_PASSWORD = os.environ["FLASK_MAIL_APP_PW"]
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True

    # todo SQLALCHEMY_BINDS for cors or many db?
