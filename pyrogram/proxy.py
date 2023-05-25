from pyrogram import Client, filters
import asyncio
import random
import aiohttp
import logging
import configparser

config = configparser.ConfigParser()
config.read("config.ini")

api_id = config['Telegram']['api_id']
api_hash = config['Telegram']['api_hash']
phone_number = config['Telegram']['phone_number']

proxy_list = config['Proxy']['proxy_list'].splitlines()
proxy_type = config['Proxy']['proxy_type']
proxy_rotation_interval = int(config['Proxy']['proxy_rotation_interval'])

logging.basicConfig(format='[%(asctime)s] %(message)s', level=logging.INFO)

async def proxy_rotator():
    global proxy_list
    while True:
        logging.info("Rotating proxy...")
        try:
            async with aiohttp.ClientSession() as session:
                proxy = random.choice(proxy_list)
                async with session.get(f"{proxy_type}://{proxy}") as response:
                    if response.status == 200:
                        logging.info(f"Proxy {proxy} is working fine!")
                        break
        except Exception as e:
            logging.warning(f"Failed to use proxy {proxy}: {e}")
        logging.info(f"Removing {proxy} from the list of proxies.")
        proxy_list.remove(proxy)
        if not proxy_list:
            raise Exception("No more proxies to use.")
        await asyncio.sleep(proxy_rotation_interval)

async def main():
    async with Client(":memory:", api_id, api_hash, phone_number=phone_number) as client:
        logging.info("Telegram client created.")
        # Start the proxy rotator task
        asyncio.ensure_future(proxy_rotator())
        # ...rest of your code here...