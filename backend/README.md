> To test the prototype webapp, 
> 0. Create a .flaskenv with AT LEAST the following set:
FLASK_APP=app
FLASK_ENV=development
SECRET_KEY=A_SECURE_HASH_TO_TEST_LOCALLY_AND_THAT_YOU_WILL_NOT_SHARE
APPLICATION_ROOT=/
> 1. create a python virtualenv and pip install all packages in requirements.txt
> 2. npm install in the frontend folder to create node_modules (flags may be needed on certain systems)
> 3. Run a sql schema in "db schemas for tests" into a locally hosted database with XAMPP/WAMP
> 4. Now try to make the adequate requests with postman or a similar tool to add,remove,update,delete CommentPost models !
> 5. They will be refreshed in the DEBUG_BACKEND webpage !
> [Antoine .C. Feb 17th 2023]

