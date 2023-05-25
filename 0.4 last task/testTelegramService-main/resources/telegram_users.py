
from flask import make_response
from flask_jwt_extended import jwt_required, current_user
from flask_restful import Resource, reqparse
from resources.instances import get_wrapper
from service.client_wrapper import DeferredLoader


loader_parser = reqparse.RequestParser()\
    .add_argument(
        "parsing", dest='parsing',
        type=str, location='args'
    )

users_loader = DeferredLoader()


class TelegramUsersResource(Resource):

    @jwt_required(locations='headers')
    async def get(self):
        global users_loader
        wrapper = await get_wrapper(current_user)
        args = loader_parser.parse_args()

        try:
            await wrapper.with_auth()

            if users_loader.finished and args.get('parsing'):
                users_loader = DeferredLoader()
            await users_loader.run(generator=wrapper.users)
            data = users_loader.content

        except KeyError:
            data = []

        response = make_response(data)
        response.headers.update({
            'Access-Control-Expose-Headers': 'X-Total-Count',
            'X-Total-Count': len(data)
        })

        return response


class TelegramUsersLoaderInfo(Resource):

    @jwt_required(locations='headers')
    def get(self):
        return {
            'finished': users_loader.finished,
            "in_progress": users_loader.in_progress
        }
