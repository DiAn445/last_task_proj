from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from pathlib import Path
from flask_sqlalchemy import SQLAlchemy
from pyrogram import Client
from service.client_wrapper import ClientWrapper


root = Path(__file__).parent
app = Flask(
    import_name=__name__,
    static_folder=root.parent / Path('frontend/build')
)
PROXIES_FILE = root / Path('proxies.json')

# create API based object to add resources to him later
api = Api(app)

# add CORS compatibility
CORS(app)

# add jwt-tokens compatibility
jwt = JWTManager(app)

app.config.update(
    JWT_SECRET_KEY='A\xacE\x94\x04\x12\x93\xef\xa4\xea\xdd>\xff\t\x06\x00<\xb6J\xc6n\xba=\x02\xbb',
    SECRET_KEY='A\xacE\x94\x04\x12\x93\xef\xa4\xea\xdd>\xff\t\x06\x00<\xb6J\xc6n\xba=\x02\xbb',
    # SQLALCHEMY_DATABASE_URI="mysql+pymysql://root:1234@127.0.0.1:3306/tg_bot_test",
    # SQLALCHEMY_DATABASE_URI="postgresql://postgres:postgres@localhost/FastAPI",
    # SQLALCHEMY_DATABASE_URI="postgresql://admin:password@94.231.182.195/testTelegramService",
    SQLALCHEMY_DATABASE_URI="postgresql://admin:password@dbserver/testTelegramService",
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    DEBUG=True,
)


with app.app_context():
    db = SQLAlchemy(app, engine_options={'pool_pre_ping': True})


api_id = 28716558
api_hash = "162ff7c6e9a29998f993f28706d7ce30"


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), unique=True, nullable=False)
    password = db.Column(db.String(40), nullable=False)
    instance = db.relationship('Instance', backref='user', uselist=False)


class Instance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(40), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def activate(self) -> ClientWrapper:
        """
        Returns a Client object based on model information
        :return:
        """
        return ClientWrapper(
            client=Client(
                name='myapp',
                api_hash=api_hash,
                api_id=api_id,
                phone_number=self.phone,
                # test_mode=True
            ),
            proxy_file_path=PROXIES_FILE
        )


def db_init() -> None:
    """
    Initialize db data
    :return:
    """
    db.drop_all()
    db.create_all()
    db.session.commit()

    root = User(username='root', password='1234')
    db.session.add(root)

    db.session.commit()

    instance = Instance(phone='Your phone number', user_id=root.id)
    db.session.add(instance)

    db.session.commit()


with app.app_context():
    db_init()


# It's needed for get user object, when user is sign in

@jwt.user_identity_loader
def user_identity_lookup(dictionary: dict):
    return dictionary['username']


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter(User.username == identity).one_or_none()


def register_endpoints():
    from resources.users import UsersResource
    from resources.members import MembersResource
    from resources.messages import MessagesResource
    from resources.instances import (
        InstanceResource,
        InstanceResourceSignIn,
        InstanceResourceLogOut,
        InstanceResourceInfo,
        InstanceResourceSearch
    )
    from resources.contacts import (
        ContactsResource,
        ContactsLoaderInfo
    )
    from resources.chats import (
        ChatsResource,
        ChatsLoaderInfo
    )
    from resources.telegram_users import (
        TelegramUsersResource,
        TelegramUsersLoaderInfo
    )
    from resources.mailing import (
        MailingResource,
        MailingResourceLoaderInfo
    )
    from resources.bykey import (
        ByKeyResource,
        ByKeyResourceLoaderInfo
    )
    api.add_resource(UsersResource, '/users')
    api.add_resource(InstanceResource, '/instance')
    api.add_resource(InstanceResourceSignIn, '/instance/sign_in')
    api.add_resource(InstanceResourceLogOut, '/instance/log_out')
    api.add_resource(InstanceResourceInfo, '/instance/info')
    api.add_resource(InstanceResourceSearch, '/instance/search_user')
    api.add_resource(ContactsResource, '/contacts')
    api.add_resource(ContactsLoaderInfo, '/contacts/info')
    api.add_resource(ChatsResource, '/chats')
    api.add_resource(ChatsLoaderInfo, '/chats/info')
    api.add_resource(MembersResource, '/chats/members')
    api.add_resource(MessagesResource, '/chats/messages')
    api.add_resource(TelegramUsersResource, '/telegram_users')
    api.add_resource(TelegramUsersLoaderInfo, '/telegram_users/info')
    api.add_resource(MailingResource, '/mailing')
    api.add_resource(MailingResourceLoaderInfo, '/mailing/info')
    api.add_resource(ByKeyResource, '/keyword')
    api.add_resource(ByKeyResourceLoaderInfo, '/keyword/info')

