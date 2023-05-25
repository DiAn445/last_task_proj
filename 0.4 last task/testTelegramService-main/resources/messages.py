from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, current_user
from .instances import get_wrapper
from .utils import handle


send_message_parser = reqparse.RequestParser()\
    .add_argument(
        'chat_id', dest='chat_id',
        type=str, location='args',
        required=True
    ).add_argument(
        'text', dest='text',
        type=str, location='args',
        required=True
    )


class MessagesResource(Resource):

    @handle(
        on_success={'ok': True, 'info': 'Message sent !'},
        on_error={"ok": False, 'info': "Can't send message"},
        handled_exceptions=(Exception,)
    )
    @jwt_required(locations='headers')
    async def post(self):
        wrapper = await get_wrapper(current_user)
        args = send_message_parser.parse_args()

        await wrapper.with_auth()
        await wrapper.client.send_message(
            chat_id=args['chat_id'],
            text=args['text']
        )
