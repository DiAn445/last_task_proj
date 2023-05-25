from flask import make_response
from flask_jwt_extended import jwt_required, current_user
from flask_restful import Resource, reqparse
from resources.instances import get_wrapper
from service.client_wrapper import DeferredLoader, ThreadException
from resources.telegram_users import users_loader
from resources.contacts import contacts_loader
from resources.chats import chats_loader
from resources.bykey import keyword_loader
from resources.utils import handle


loader_parser = reqparse.RequestParser()\
    .add_argument(
        "parsing", dest='parsing',
        type=str, location='args'
    ).add_argument(
        "addressee_loader", dest='addressee_loader',
        type=str, location='args',
        required=True
    ).add_argument(
        'message_list', dest='message_list',
        type=list, location='json',
        required=True
    )


mailing_loader = DeferredLoader()


class MailingResource(Resource):

    @jwt_required(locations='headers')
    async def get(self):
        global mailing_loader
        wrapper = await get_wrapper(current_user)

        try:
            await wrapper.with_auth()
            data = mailing_loader.content
        except KeyError:
            data = []

        response = make_response(data)
        response.headers.update({
            'Access-Control-Expose-Headers': 'X-Total-Count',
            'X-Total-Count': len(data)
        })

        return response

    @handle(
        on_success={'ok': True, "info": 'Do mailing'},
        on_error={'ok': False, 'info': "Can't do mailing"},
        handled_exceptions=(KeyError, ThreadException)
    )
    @jwt_required(locations='headers')
    async def post(self):
        global mailing_loader

        wrapper = await get_wrapper(current_user)
        await wrapper.with_auth()

        args = loader_parser.parse_args()
        loader: DeferredLoader = {
            'chats_loader': chats_loader,
            "users_loader": users_loader,
            "contacts_loader": contacts_loader,
            'keyword_loader': keyword_loader
        }[args['addressee_loader']]

        if args.get('parsing') and mailing_loader.finished:
            mailing_loader = DeferredLoader()

        await mailing_loader.run(
            generator=wrapper.mailing,
            message_list=args['message_list'],
            addressee_list=loader.content
        )


class MailingResourceLoaderInfo(Resource):

    @jwt_required(locations='headers')
    def get(self):
        return {
            'finished': mailing_loader.finished,
            "in_progress": mailing_loader.in_progress,
        }
