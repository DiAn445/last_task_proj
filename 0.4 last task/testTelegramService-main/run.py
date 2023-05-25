import asyncio
from asgiref.wsgi import WsgiToAsgi
from hypercorn.asyncio import serve
from hypercorn.config import Config
from service.app import PROXIES_FILE, app
from service.parser import parse


asyncio.get_event_loop()\
    .run_until_complete(parse(PROXIES_FILE))

app = WsgiToAsgi(app)
config = Config()
config.bind = ['0.0.0.0:80']

asyncio.run(serve(app, config))