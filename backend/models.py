

from uuid import uuid1,uuid4,uuid5
#db.init_app(app) in __main__ if db=SQLAlchemy() created here !
def generate_pr_uuid():
    return uuid4().hex

