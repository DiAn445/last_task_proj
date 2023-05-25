from typing import Dict, Union
from flask_jwt_extended import jwt_required, current_user
from flask_restful import Resource, reqparse
import pyrogram.errors.exceptions as pr_exceptions
from resources.utils import handle
from service.app import Instance, db, User
from service.client_wrapper import ClientWrapper

phone_parser = reqparse.RequestParser(). \
    add_argument(
    'phone', dest='phone',
    type=str, location='args',
    required=True
)

code_parser = reqparse.RequestParser(). \
    add_argument(
    'code', dest='code',
    type=str, location='args',
    required=True
)

info_parser = reqparse.RequestParser() \
    .add_argument(
    'first_name', dest='first_name',
    type=str, location='args'
).add_argument(
    'last_name', dest='last_name',
    type=str, location='args'
).add_argument(
    'bio', dest='bio',
    type=str, location='args'
)

search_parser = reqparse.RequestParser() \
    .add_argument(
    'phone', dest='phone',
    type=str, location='args'
).add_argument(
    'user_id', dest='user_id',
    type=str, location='args'
).add_argument(
    'username', dest='username',
    type=str, location='args'
)

user_codes: Dict[int, Union[str, None]] = dict()
active_clients: Dict[int, Union[ClientWrapper, None]] = dict()


async def get_wrapper(user: User) -> ClientWrapper:
    """
    Activate user instance and automatically connect
    :param user:
    :return:
    """
    try:
        wrapper = active_clients[user.id]

    except KeyError:
        active_clients[user.id] = wrapper = user.instance.activate()

    if not wrapper.client.is_connected:
        await wrapper.client.connect()

    return wrapper


class InstanceResource(Resource):

    @jwt_required(locations='headers')
    async def get(self):
        """
        Returns info about account and instance
        :return:
        """
        wrapper = await get_wrapper(current_user)

        authorized = await wrapper.authorized()

        data = {
            'id': current_user.instance.id,
            'phone': current_user.instance.phone,
            'authorized': authorized,
            'code_pending': bool(user_codes.get(current_user.id))
        }

        if authorized:
            info = await wrapper.info()
            data.update({
                'info': info
            })

        return data

    @handle(
        on_success={"ok": True, 'info': 'Successfully changed phone'},
        on_error={"ok": True, "info": "Can't change phone"},
        handled_exceptions=(Exception,)
    )
    @jwt_required(locations='headers')
    async def put(self):
        instance = current_user.instance

        query = Instance.query \
            .filter(Instance.phone == instance.phone)
        query.update(phone_parser.parse_args())
        db.session.commit()

        wrapper = await get_wrapper(current_user)
        await wrapper.logout()


class InstanceResourceSignIn(Resource):

    @handle(
        on_success={"ok": True, "info": 'Successfully sent code'},
        on_error={"ok": False, "info": 'Already authorized'},
        handled_exceptions=(KeyError,)
    )
    @jwt_required(locations='headers')
    async def post(self):
        """
        Sending code part of sign in.
        After "post" needs to "patch" for this path, to pass the code
        :return:
        """
        wrapper = await get_wrapper(current_user)
        user_codes[current_user.id] = (
            await wrapper.sign_in(
                current_user.instance.phone
            )
        )

    @handle(
        on_success={'ok': True, 'info': 'Code successfully passed !'},
        on_error={'ok': False, "info": 'Invalid code or code expired'},
        handled_exceptions=(
                pr_exceptions.PhoneCodeExpired,
                pr_exceptions.PhoneCodeInvalid,
                pr_exceptions.PhoneCodeEmpty,
                KeyError, AssertionError
        )
    )
    @jwt_required(locations='headers')
    async def patch(self):
        """
        Requires sent code to confirm sign in
        :return:
        """
        code_hash = user_codes[current_user.id]
        args = code_parser.parse_args()
        wrapper = await get_wrapper(current_user)
        authorized = await wrapper.authorized()

        assert not authorized

        await wrapper.client.sign_in(
            phone_number=current_user.instance.phone,
            phone_code_hash=code_hash,
            phone_code=args['code']
        )

        user_codes.pop(current_user.id)

    @jwt_required(locations='headers')
    async def get(self):
        """
        Is wrapper authorized already
        :return:
        """
        wrapper = await get_wrapper(current_user)
        authorized = await wrapper.authorized()
        return {'ok': authorized}


class InstanceResourceLogOut(Resource):

    @handle(
        on_success={'ok': True, "info": 'Successfully logged out'},
        on_error={"ok": False, "info": 'Not authorized yet'},
        handled_exceptions=(Exception,)
    )
    @jwt_required(locations='headers')
    async def post(self):
        """
        Log out from wrapper.
        Nothing requires
        :return:
        """
        wrapper = await get_wrapper(current_user)
        await wrapper.logout()


class InstanceResourceInfo(Resource):

    @handle(
        on_success={'ok': True, 'info': 'Successfully fetched'},
        on_error={'ok': False, 'info': "You not authorized yet"},
        handled_exceptions=(KeyError,)
    )
    @jwt_required(locations='headers')
    async def get(self):
        """
        Returns info about your account
        :return:
        """
        wrapper = await get_wrapper(current_user)
        return await wrapper.info()

    @handle(
        on_success={"ok": True, "info": 'Successfully created'},
        on_error={"ok": False, "info": 'Not authorized yet'},
        handled_exceptions=(KeyError,)
    )
    @jwt_required(locations='headers')
    async def put(self):
        args = info_parser.parse_args()
        wrapper = await get_wrapper(current_user)
        await wrapper.with_auth()
        await wrapper.client.update_profile(
            first_name=args.get('first_name'),
            last_name=args.get('last_name'),
            bio=args.get('bio')
        )


class InstanceResourceSearch(Resource):

    @handle(
        on_error={"ok": False, "info": "Can't find user"},
        on_success={"ok": True, "info": 'User found'},
        handled_exceptions=(KeyError, AssertionError)
    )
    @jwt_required(locations='headers')
    async def post(self):
        """
        Try to find user and returns him
        :return:
        """
        args = search_parser.parse_args()
        wrapper = await get_wrapper(current_user)
        user = await wrapper.search(
            phone=args.get('phone'),
            user_id=args.get('user_id'),
            username=args.get('username')
        )

        assert user is not None

        return user
