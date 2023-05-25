import json
from flask import make_response
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, current_user
from resources.instances import get_wrapper
from resources.utils import handle
from service.client_wrapper import DeferredLoader


creation_parser = reqparse.RequestParser()\
    .add_argument(
        "chat_name", dest='chat_name',
        type=str, location='args',
        required=True
    ).add_argument(
        'user_id', dest='user_id',
        type=str, location='args',
        required=True
    )

loader_parser = reqparse.RequestParser()\
    .add_argument(
        "parsing", dest='parsing',
        type=str, location='args'
    )


chats_loader = DeferredLoader()


class ChatsResource(Resource):

    @jwt_required(locations='headers')
    async def get(self):
        """
        Returns all available chats
        :return:
        """
        global chats_loader
        args = loader_parser.parse_args()
        wrapper = await get_wrapper(current_user)

        try:
            await wrapper.with_auth()

            if args.get('parsing') and chats_loader.finished:
                chats_loader = DeferredLoader()

            await chats_loader.run(generator=wrapper.chats)
            data = chats_loader.content

        except KeyError:
            data = []

        response = make_response(data)
        response.headers.update({
            'Access-Control-Expose-Headers': 'X-Total-Count',
            'X-Total-Count': len(data)
        })

        return response

    @handle(
        on_error={'ok': False, 'info': 'Not authenticated yet'},
        on_success={'ok': True, 'info': 'Successfully created group'},
        handled_exceptions=(KeyError,)
    )
    @jwt_required(locations='headers')
    async def post(self):
        """
        Created new group
        :return:
        """
        args = creation_parser.parse_args()
        wrapper = await get_wrapper(current_user)

        await wrapper.with_auth()
        me = await wrapper.client.get_me()

        chat = await wrapper.client.create_group(
            title=args['chat_name'],
            users=[me.id, args['user_id']]
        )

        return json.loads(str(chat))


class ChatsLoaderInfo(Resource):

    @jwt_required(locations='headers')
    def get(self):
        return {
            'finished': chats_loader.finished,
            "in_progress": chats_loader.in_progress
        }
