import argparse
import ast


class ConfigAction(argparse.Action):
    """
    CLI Argument Config class

    Config actions used as flags when running app.py
    to allow a CI-pipeline, automated tests or even
    practical/lazy users to inline
    Backend config options and database options
    """

    def __init__(self, option_strings, dest, nargs=None, **kwargs):
        self.config_dict = {}
        super().__init__(option_strings, dest, nargs=nargs, **kwargs)

    def __call__(self, argparser, namespace, values, option_string=None):
        for config in values:
            _key, _value = config.split('=') if '=' in config else (config, True)

            if not (key := _key.upper()).isidentifier():
                continue
            try:
                value = ast.literal_eval(_value)
            except ValueError:
                value = _value
            self.config_dict[key] = value
        setattr(namespace, self.dest, self.config_dict)


parser = argparse.ArgumentParser(prog="FlaskApp Backend Boucani WebApp",
                                 description='Process some configuration options.',
                                 epilog="Enter --help for help, "
                                        "and read docs for app.py and config.py"
                                 )
# parser.add_argument('--version', action='version', version='%(prog)s 3.0')
parser.add_argument('--config', dest='config_options', action=ConfigAction, nargs='+',
                    metavar='KEY=VALUE',
                    help='configuration options in the format KEY=VALUE')

parser.add_argument("--sqldb", dest='specified_sqldb', choices=["local", "hosted"],
                    help="type of database to use (local or hosted) (see config.py)")

__doc__ = """
python app.py --help
 to see the docs and help info I made
--config SESSION_COOKIE_SAMESITE="None" SESSION_COOKIE_HTTPONLY=False MAIL_USE_TLS=True MAIL_SERVER=somethng.gmail@lol
this will set any Flask app config options as seen in config.py/ApplicationSessionConfig, (which are passed to app.config.from_object(ApplicationSessionConfig),etc... )
--sqldb local
 or 
--sqldb hosted
 Will force the program to pick the specified database.
All of these are optional
"""
