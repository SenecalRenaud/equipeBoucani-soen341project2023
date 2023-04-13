import argparse
# import re
#
# parser = argparse.ArgumentParser(
#     prog= 'Program Name',
#     description='Process some integers.',
#     epilog='Text at bottom of help'
# )
# parser.add_argument('integers', metavar='N', type=int, nargs='+',
#                     help='an integer for the accumulator')
# parser.add_argument('--sum', dest='accumulate', action='store_const',
#                     const=sum, default=max,
#                     help='sum the integers (default: find the max)')
#
# args = parser.parse_args()
# print(args.accumulate(args.integers))


class ConfigAction(argparse.Action):
    def __init__(self, option_strings, dest, nargs=None, **kwargs):
        self.config_dict = {}
        super().__init__(option_strings, dest, nargs=nargs, **kwargs)

    def __call__(self, parser, namespace, values, option_string=None):
        for config in values:
            _key, value = config.split('=') if '=' in config else (config,True)
            if not (key := _key.upper()).isidentifier():
                continue
            self.config_dict[key] = value
        setattr(namespace, self.dest, self.config_dict)

parser = argparse.ArgumentParser(description='Process some configuration options.')
parser.add_argument('--config', dest='config_options', action=ConfigAction, nargs='+',
                    metavar='KEY=VALUE',
                    help='configuration options in the format KEY=VALUE')

parser.add_argument("--sqldb", choices=["local", "hosted"], help="type of database to use (local or hosted)")
args = parser.parse_args()

print(args.config_options)
class ApplicationSessionConfig:
    SECRET_KEY = 'os.environ["SECRET_KEY"]' # should set flask.Flask.secret_key
    SESSION_TYPE = 'filesystem'
    SESSION_FILE_DIR = "local_flask_sessions" #If you change this name, add to .gitignore (NOTE: still low security threat)

    TEMP_UPLOAD_PATH = "uploads_cache"

    CORS_HEADERS = "Content-Type"

    SESSION_COOKIE_SECURE = True #when True, limit the cookies to HTTPS traffic only [for production].
    SESSION_COOKIE_HTTPONLY = False #when True, prevents any client-side usage of the session cookie
    # REMEMBER_COOKIE_HTTPONLY=True
    SESSION_COOKIE_SAMESITE="None" #else, "Strict"

    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True

    SQLALCHEMY_DATABASE_URI = "Chosen_EnumDatabase_Conn_Obj_.SELF.sqlalchemyURI"
    SQLALCHEMY_TRACK_MODIFICATIONS = False # True only for debugging within flask
    SQLALCHEMY_ECHO = False

    #TODO app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    #    'pool_pre_ping': True,
    #    'pool_recycle' : 3600,
    #    'pool_size': 5,
    #   'max_overflow': 10
    # }

    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USERNAME = 'equipeboucani@gmail.com'
    MAIL_PASSWORD = 'os.environ["FLASK_MAIL_APP_PW"]'
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True

    # todo SQLALCHEMY_BINDS for cors or many db?