import asyncio
from telethon import TelegramClient, types
from telethon.functions import contacts

async def main():
    client = TelegramClient(
        f'nikita', 
        api_hash=input("API HASH =>"), 
        api_id=input("API ID =>")
    )

    await client.start()

    #https://www.latlong.net/
    latitude = 50.394862
    longitude = 30.538974

    request = await client(contacts.GetLocatedRequest(
        geo_point=types.InputGeoPoint(
            lat=latitude,
            long=longitude
        ),
        self_expires=42
    ))

    print(f'Finded: {len(request.users)} users and {len(request.chats)} channels')

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())