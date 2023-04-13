import argparse
# import re
import ast

class ConfigAction(argparse.Action):
    def __init__(self, option_strings, dest, nargs=None, **kwargs):
        self.config_dict = {}
        super().__init__(option_strings, dest, nargs=nargs, **kwargs)

    def __call__(self, parser, namespace, values, option_string=None):
        for config in values:
            _key, _value = config.split('=') if '=' in config else (config,True)

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
                                 epilog="Enter --help for help, and read docs for app.py and config.py"

)
# parser.add_argument('--version', action='version', version='%(prog)s 3.0')
parser.add_argument('--config', dest='config_options', action=ConfigAction, nargs='+',
                    metavar='KEY=VALUE',
                    help='configuration options in the format KEY=VALUE')

parser.add_argument("--sqldb",dest='specified_sqldb', choices=["local", "hosted"], help="type of database to use (local or hosted) (see config.py)")
