import hmac
from typing import Union
from flask_restful import Resource, reqparse
from flask_jwt_extended import create_access_token
from service.app import User, db, Instance

str_to_bytes = lambda string: string.encode("utf-8") if isinstance(string, str) else string
safe_str_cmp = lambda str_a, str_b: hmac.compare_digest(str_to_bytes(str_a), str_to_bytes(str_b))


"""
Url params parser when user try login in admin
"""
parser = reqparse.RequestParser()\
    .add_argument(
        'username', dest='username',
        type=str, location='json',
        required=True
    ).add_argument(
        'password', dest='password',
        type=str, location='json',
        required=True
    )


register_parser = reqparse.RequestParser()\
    .add_argument(
        'username', dest='username',
        type=str, location='json',
        required=True
    ).add_argument(
        'password', dest='password',
        type=str, location='json',
        required=True,
    ).add_argument(
        'phone', dest='phone',
        type=str, location='json',
        required=True
    )


def authenticate(username: str, password: str) -> Union[User, None]:
    """
    Check user in db
    and compare passed user password with password in db
    :param username:
    :param password:
    :return:
    """
    user = User.query.filter(User.username == username).first()
    if user and safe_str_cmp(user.password.encode('utf-8'), password.encode('utf-8')):
        return user


class UsersResource(Resource):

    def post(self) -> dict:
        """
        Check user in db and
        if user exists, give him auth token
        :return:
        """
        args = parser.parse_args()
        user = authenticate(
            args['username'], args['password']
        )
        if user:
            token = create_access_token(identity={
                'username': args['username'],
                'role': 'admin'
            }, expires_delta=False)
            return {'token': token}
        return {
            'error': "Invalid username or password"
        }

    def put(self):
        """
        User registration form
        :return:
        """
        all_users = User.query.all()

        if len(all_users) == 3:
            return {'response': "Max users registered", "status": False}

        args = register_parser.parse_args()
        username = args['username']
        password = args['password']
        phone = args['phone']

        user = User.query.filter(User.username == username).first()
        instance = Instance.query.filter(Instance.phone == phone).first()

        if user:
            return {"response": "User already exists", "status": False}

        if instance:
            return {'response': "Phone already exists", "status": False}

        new_user = User(username=username, password=password)

        db.session.add(new_user)
        db.session.commit()

        new_instance = Instance(phone=phone, user_id=new_user.id)

        db.session.add(new_instance)
        db.session.commit()

        return {'response': "You successfully registered", 'status': True}
