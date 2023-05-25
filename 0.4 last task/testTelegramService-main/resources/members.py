from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, current_user

from resources.instances import get_wrapper


member_parser = reqparse.RequestParser()\
    .add_argument(
        'chat_id', dest='chat_id',
        type=int, location='args',
        required=True
    ).add_argument(
        'member_id', dest='member_id',
        type=str, location='args',
        required=True
    )


class MembersResource(Resource):

    @jwt_required(locations='headers')
    async def post(self):
        """
        Tries to add member to group
        :return:
        """
        wrapper = await get_wrapper(current_user)
        args = member_parser.parse_args()

        try:
            await wrapper.with_auth()
            await wrapper.client.add_chat_members(
                chat_id=args['chat_id'],
                user_ids=args['member_id']
            )
            ok, info = True, 'Member added !'

        except KeyError:
            ok, info = False, "You not authorized yet"

        return {"ok": ok, 'info': info}

    @jwt_required(locations='headers')
    async def delete(self):
        """
        Tries to delete group member
        :return:
        """
        wrapper = await get_wrapper(current_user)
        args = member_parser.parse_args()

        # noinspection PyBroadException
        try:
            await wrapper.with_auth()
            await wrapper.client.ban_chat_member(
                chat_id=args['chat_id'],
                user_id=args['member_id']
            )
            ok, info = True, 'Member deleted !'

        except KeyError:
            ok, info = False, "Can't delete member"

        return {"ok": ok, 'info': info}
