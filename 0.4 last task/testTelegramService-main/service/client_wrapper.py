import asyncio
import json
import random
from itertools import cycle
from typing import (
    List,
    Any,
    Dict,
    Union,
    TypeVar,
    AsyncGenerator
)
from threading import Thread
from urllib.parse import urlparse

import pyrogram.enums
from pyrogram import Client
from pyrogram import types
import pyrogram.errors.exceptions as exceptions

from service.parser import sync_text_proxy

_T = TypeVar('_T')


class ThreadException(Exception):
    pass


class ExceptionalThread(Thread):
    """
    Custom thread class for handling thread errors
    """

    def run(self) -> None:
        try:
            if hasattr(self, '_Thread__target'):
                self._Thread__target(*self._Thread__args, **self._Thread__kwargs)
            else:
                self._target(*self._args, **self._kwargs)
        except Exception as e:
            raise ThreadException(str(e))


class Serialization:
    """
    Uses for serialize pyrogram objects to JSON
    """

    def __init__(
            self,
            structure: Any,
            save_fields: List[str] = None
    ):
        self.structure = structure
        self.save_fields = save_fields or []

    def _save_fields(self) -> Dict[str, str]:
        """
        Help function for saving fields
        :return:
        """
        saved = dict()
        for field in self.save_fields:
            saved[field] = getattr(self.structure, field)
        return saved

    def serialize(self) -> Dict[str, str]:
        """
        Serialize structure to JSON.
        And pass unchanged `save_fields` from object to json
        :return:
        """
        stringed = str(self.structure)
        jsoned = json.loads(stringed)
        jsoned.update(self._save_fields())
        return jsoned


class WaitQueue(asyncio.Queue):
    """
    Custom queue for waiting objects
    """

    def __init__(self, wait_time: int, *args, **kwargs):
        self.wait_time = wait_time
        super(WaitQueue, self).__init__(*args, **kwargs)

    async def get(self) -> _T:
        await asyncio.sleep(self.wait_time)
        return await super(WaitQueue, self).get()


class ClientWrapper:
    """
        Wrapper upon pyrogram Client for
        custom methods
    """
    def __init__(
            self,
            client: Client,
            proxy_file_path: str,
            message_limit: int = 0,
            parse_limit: int = 3,
            current_message_count: int = 0,
            current_parse_count: int = 4,
            parser_per_object: int = 3,
            wait_per_action: int = 3,
            parses_per_proxy: int = 100,
            messages_per_proxy: int = 100,
    ):
        self.client = client
        self.message_limit = message_limit
        self.parse_limit = parse_limit
        self._current_message_count = current_message_count
        self._current_parse_count = current_parse_count
        self.parses_per_object = parser_per_object
        self.wait_per_action = wait_per_action
        self.messages_per_proxy = messages_per_proxy
        self.parses_per_proxy = parses_per_proxy
        self.queue = WaitQueue(wait_time=self.wait_per_action, maxsize=1)
        self._authorized = None
        self.do_changing_proxy = True
        self._signing_in = False

        with open(proxy_file_path, 'r') as file:
            self.proxies = cycle(json.load(file)['proxies'])

    def _next_proxy(self, tries=3):
        """
        If first `tries` proxies will be invalid,
        it's just set self.client.proxy = None
        :param tries:
        :return:
        """

        if tries == 0:
            self.client.proxy = None
            self.do_changing_proxy = False
            return

        if not self.do_changing_proxy:
            return

        proxy = next(self.proxies)
        proxy, is_valid = sync_text_proxy(proxy)

        if not is_valid:
            print(f"""
                Proxy {proxy} is bad.
                Trying next proxy
            """)
            self._next_proxy(tries=tries-1)
            return

        print(f"""
            Proxy {proxy} is valid.
            This proxy will be used for now
        """)

        parsed = urlparse(proxy)
        ip, port = parsed.netloc.split(':')
        self.client.proxy = {
            'scheme': parsed.scheme,
            "hostname": ip,
            'port': int(port)
        }

    @property
    def current_message_count(self) -> int:
        return self._current_message_count

    @current_message_count.setter
    def current_message_count(self, value) -> None:
        self._current_message_count = value
        if (
                (self._current_message_count % self.messages_per_proxy == 0)
                and (self._current_message_count > 0)
        ):
            self._next_proxy()

    @property
    def current_parse_count(self) -> int:
        return self._current_parse_count

    @current_parse_count.setter
    def current_parse_count(self, value) -> None:
        self._current_parse_count = value
        if (
                (self._current_parse_count % self.parses_per_proxy == 0)
                and (self._current_parse_count > 0)
        ):
            self._next_proxy()

    async def with_auth(self) -> None:
        """
        Connects client if authorized.
        Else - KeyError
        :return:
        """

        if self._authorized is None or self._signing_in:
            self._authorized = await self.authorized()
            self._signing_in = False

        if not self._authorized:
            raise KeyError('Not authorized yet')

    async def authorized(self) -> bool:
        """
        Checks, is client already authorized
        :return:
        """
        try:
            await self.client.get_me()
            return True
        except (
                exceptions.AuthKeyUnregistered
        ):
            return False

    async def sign_in(self, phone: str) -> str:
        """
        Trying sign in to account.
        Returns a function for confirm code.
        If already authorized - KeyError
        :return:
        """
        authorized = await self.authorized()

        if authorized:
            raise KeyError("Already authorized")

        sent_code = await self.client.send_code(phone)
        self._signing_in = True

        return sent_code.phone_code_hash

    async def logout(self) -> bool:
        """
        Trying to log out from session.
        If not authorized - KeyError
        :return:
        """
        await self.with_auth()
        # noinspection PyBroadException
        try:
            await self.client.log_out()
        except:
            pass

        self._authorized = False

        return True

    async def parse_chats(self) -> List[List[types.Chat]]:
        """
        Parses chat objects with queue delay
        :return:
        """
        await self.with_auth()

        chats = []
        async for dialog in self.client.get_dialogs():

            if self.parse_limit == self.current_parse_count:
                return

            await self.queue.put(dialog.chat)
            chats.append(await self.queue.get())
            yield chats

            self.current_parse_count += 1

    async def chats(self) -> List[List[Dict[str, str]]]:
        """
        Returns all available chats in JSON view.
        Depends on `parse_chats()`
        :return:
        """
        async for partial_chats in self.parse_chats():
            serialized = []
            for chat in partial_chats:
                serialized.append(
                    Serialization(chat).serialize()
                )
            yield list(serialized)

    async def contacts(self) -> List[List[Dict[str, str]]]:
        """
        List all available contacts in JSON view.
        Depends on `parse_contacts()`
        :return:
        """
        async for contact_parts in self.parse_contacts():
            serialized = []
            for contact in contact_parts:
                serialized.append(
                    Serialization(contact, save_fields=['phone_number']).serialize()
                )
            yield serialized

    async def info(self) -> dict:
        """
        Returns result of "get_me" pyrogram client
        :return:
        """
        await self.with_auth()
        me = await self.client.get_me()
        return Serialization(me).serialize()

    async def search(
            self,
            phone: str = None,
            username: str = None,
            user_id: str = None
    ) -> dict:
        """
        Find and returns a user if found.
        Else - None
        :param phone:
        :param username:
        :param user_id:
        :return:
        """
        await self.with_auth()

        if phone:

            clear_phone = lambda number: number \
                .replace(' ', '') \
                .replace("+", '')

            async for contacts_part in self.contacts():
                last_contact = contacts_part[-1]

                if clear_phone(last_contact['phone_number']) == clear_phone(phone):
                    return last_contact

        if user_id or username:
            try:
                user = await self.client.get_users(user_id or username)
                return Serialization(user, save_fields=['phone_number']).serialize()
            except exceptions.UsernameNotOccupied:
                return

    async def parse_contacts(self) -> List[List[types.User]]:
        """
        Asynchronously parse contact objects with queue delay
        :return:
        """
        await self.with_auth()
        contacts = []

        for contact in await self.client.get_contacts():

            if self.parse_limit == self.current_parse_count:
                return

            await self.queue.put(contact)
            contacts.append(await self.queue.get())
            yield contacts

            self.current_parse_count += 1

    async def parse_chat_members(self) -> List[List[types.User]]:
        """
        Parses chat members from available chat objects.
        Depends on `parse_chats()`
        :return:
        """

        users_dict = dict()
        info = await self.info()
        last_len = None

        async for chats_part in self.parse_chats():

            if self.parse_limit == self.current_parse_count:
                return

            chat = chats_part[-1]

            try:

                if chat.type == pyrogram.enums.ChatType.PRIVATE:
                    users_dict[chat.id] = await self.client.get_users(chat.id)

                else:
                    async for member in self.client.get_chat_members(chat.id):

                        if member.user.id == info['id']:
                            continue

                        users_dict[member.user.id] = member.user
                        self.current_parse_count += 1

            except exceptions.ChannelInvalid:
                continue

            finally:

                current_len = len(users_dict)
                if current_len != last_len:
                    last_len = current_len
                    yield list(users_dict.values())

    async def parse_users(self) -> List[List[types.User]]:
        """
        Parse users from chats and concat it's with contacts.
        Depends on `parse_chat_members()` and `parse_contacts()`
        :return:
        """
        users_dict = dict()
        last_len = None

        async for members_part in self.parse_chat_members():

            member = members_part[-1]
            users_dict[member.id] = member
            current_len = len(users_dict)

            if last_len != current_len:
                last_len = current_len
                yield list(users_dict.values())

        async for contacts_part in self.parse_contacts():

            contact = contacts_part[-1]
            users_dict[contact.id] = contact
            current_len = len(users_dict)

            if last_len != current_len:
                last_len = current_len
                yield list(users_dict.values())

    async def users(self) -> List[List[Dict[str, str]]]:
        """
        Returns users from chats and groups with contacts in JSON format.
        Depends on `parse_users()`
        :return:
        """
        async for users_part in self.parse_users():
            users = []
            for user in users_part:
                users.append(
                    Serialization(user).serialize()
                )
            yield users

    async def chats_with_users(self) -> List[Union[types.User, types.Chat]]:
        """
        Returns all available to send message objects
        :return:
        """
        users = [user async for user in self.parse_users()]
        chats = [chat async for chat in self.parse_chats()]
        return users + chats

    async def mailing(
            self,
            message_list: List[str],
            addressee_list: Union[List[Dict[str, str]], List[Union[types.User, types.Chat]]]
    ) -> List[List[Dict[str, str]]]:
        """
        Sends all addressed users and chats a one of passed messages
        :param message_list:
        :param addressee_list:
        :return:
        """

        if not addressee_list or not message_list:
            yield []
            return

        if isinstance(addressee_list[0], dict):
            new_list = []
            for item in addressee_list:
                item_class_name = item.pop('_')
                item_class = getattr(types, item_class_name)
                new_list.append(item_class(**item))
            addressee_list = new_list

        messages = []

        for addressee in addressee_list:
            message = random.choice(message_list)
            messages.append(
                await self.client.send_message(addressee.id, message)
            )
            await asyncio.sleep(self.wait_per_action)
            yield [
                Serialization(msg).serialize()
                for msg in messages
            ]
            self.current_message_count += 1

    async def parse_by_key_raw(self, keyword: str) -> List[List[types.User]]:
        """
        Parses global search for find words in available chats.
        :param keyword: word must be in chat
        :return:
        """
        info = await self.info()
        users = dict()
        async for message in self.client.search_global(query=keyword):

            if message.from_user.id == info['id']:
                continue

            await self.queue.put(message.from_user)
            user = await self.queue.get()
            users[user.id] = user
            yield list(users.values())
            self.current_parse_count += 1

    async def parse_by_key(self, keyword: str) -> List[List[Dict[str, str]]]:
        """
        Returns users, which was written this word in some chats.
        Depends on `parse_by_key_raw()`
        :param keyword:
        :return:
        """
        async for users_part in self.parse_by_key_raw(keyword):
            yield [
                Serialization(user).serialize()
                for user in users_part
            ]


class DeferredLoader:

    def __init__(self):
        self.generator_args: tuple = tuple()
        self.generator_kwargs: dict = dict()
        self.content: List[Any] = []
        self.in_progress: bool = False
        self.finished: bool = False
        self.generator: AsyncGenerator = None

    async def process(self) -> None:
        """
        Runs generator and updates content
        :return:
        """
        self.in_progress = True
        # noinspection PyCallingNonCallable
        async for partial_result in self.generator(*self.generator_args, **self.generator_kwargs):
            self.content = partial_result

        self.in_progress = False
        self.finished = True

    async def run(self, generator, *generator_args, **generator_kwargs) -> None:
        """
        Uses for run async generator on background
        :return:
        """

        if self.in_progress or self.finished:
            return

        self.generator_args = generator_args
        self.generator_kwargs = generator_kwargs
        self.generator = generator
        loop = asyncio.get_event_loop()

        def wrapper():
            asyncio.run_coroutine_threadsafe(
                coro=self.process(),
                loop=loop
            )

        ExceptionalThread(target=wrapper).start()
