import json

from flask import make_response
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, current_user
from .instances import get_wrapper
from .utils import handle
from service.client_wrapper import DeferredLoader


contact_parser = reqparse.RequestParser()\
    .add_argument(
        'user_id', dest='user_id',
        type=int, location='args',
        required=True
    ).add_argument(
        'first_name', dest='first_name',
        type=str, location='args',
        required=True
    ).add_argument(
        'last_name', dest='last_name',
        type=str, location='args'
    ).add_argument(
        'phone', dest='phone',
        type=str, location='args'
    )


loader_parser = reqparse.RequestParser()\
    .add_argument(
        "parsing", dest='parsing',
        type=str, location='args'
    )


contacts_loader = DeferredLoader()


class ContactsResource(Resource):

    @jwt_required(locations='headers')
    async def get(self):
        """
        List all user contacts
        :return:
        """
        global contacts_loader
        wrapper = await get_wrapper(current_user)
        args = loader_parser.parse_args()

        try:
            await wrapper.with_auth()

            if contacts_loader.finished and args.get('parsing'):
                contacts_loader = DeferredLoader()

            await contacts_loader.run(generator=wrapper.contacts)
            data = contacts_loader.content

        except KeyError:
            data = []

        response = make_response(data)
        response.headers.update({
            'Access-Control-Expose-Headers': 'X-Total-Count',
            'X-Total-Count': len(data)
        })

        return response

    @handle(
        on_success={'ok': True, 'info': 'Successfully created'},
        on_error={'ok': False, 'info': "Not authorized yet"},
        handled_exceptions=(KeyError,)
    )
    @jwt_required(locations='headers')
    async def post(self):
        """
        Creates new contact if it's possible.
        If user is not authorized returns 204
        :return:
        """
        args = contact_parser.parse_args()
        wrapper = await get_wrapper(current_user)
        await wrapper.with_auth()

        user = await wrapper.client.add_contact(
            user_id=args['user_id'],
            first_name=args['first_name'],
            last_name=args.get('last_name', ''),
            phone_number=args.get('phone', '')
        )
        jsoned = json.loads(str(user))
        return jsoned


class ContactsLoaderInfo(Resource):

    @jwt_required(locations='headers')
    def get(self):
        return {
            'finished': contacts_loader.finished,
            "in_progress": contacts_loader.in_progress
        }
