from flask import make_response
from flask_jwt_extended import jwt_required, current_user
from flask_restful import Resource, reqparse
from resources.instances import get_wrapper
from service.client_wrapper import DeferredLoader, ThreadException
from resources.utils import handle


loader_parser = reqparse.RequestParser()\
    .add_argument(
        "parsing", dest='parsing',
        type=str, location='args'
    ).add_argument(
        "keyword", dest='keyword',
        type=str, location='json',
        required=True
    )


keyword_loader = DeferredLoader()


class ByKeyResource(Resource):

    @jwt_required(locations='headers')
    async def get(self):
        global keyword_loader
        wrapper = await get_wrapper(current_user)

        try:
            await wrapper.with_auth()
            data = keyword_loader.content
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
        global keyword_loader

        wrapper = await get_wrapper(current_user)
        await wrapper.with_auth()
        args = loader_parser.parse_args()

        if args.get('parsing') and keyword_loader.finished:
            keyword_loader = DeferredLoader()

        await keyword_loader.run(
            generator=wrapper.parse_by_key,
            keyword=args['keyword']
        )


class ByKeyResourceLoaderInfo(Resource):

    @jwt_required(locations='headers')
    def get(self):
        return {
            'finished': keyword_loader.finished,
            "in_progress": keyword_loader.in_progress,
        }
