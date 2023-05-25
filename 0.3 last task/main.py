import os
from datetime import datetime
from pyrogram.raw import functions
from pyrogram import filters,Client 
from pyrogram.types import Message

api_id = 12345
api_hash = "0123456789abcdef0123456789abcdef"

app = Client("my_account", api_id=api_id, api_hash=api_hash)


@app.on_message(filters.command("joindate") & filters.me)
def join_date(app, message: Message):
    members = []
    limit = 1000
    for m in app.iter_chat_members(message.chat.id):
        members.append(
            (
                m.user.first_name,
                m.joined_date or app.get_messages(message.chat.id, 1).date,
            )
        )

    members.sort(key=lambda member: member[1])

    with open("joined_date.txt", "w", encoding="utf8") as f:
        f.write("Join Date      First Name\n")
        for member in members:
            f.write(
                str(datetime.fromtimestamp(member[1]).strftime("%y-%m-%d %H:%M"))
                + f" {member[0]}\n"
            )

    app.send_document(message.chat.id, "joined_date.txt")
    os.remove("joined_date.txt")


chat = "pyrogramlounge"
with app:
    full_log = app.send(
        functions.channels.GetAdminLog(
            channel=app.resolve_peer(chat),
            q="",
            max_id=0,
            min_id=0,
            limit=0,
        )
    )
with open(f"recent_actions_{chat}.txt", "w", encoding="utf8") as log_file:
    log_file.write(str(full_log))


app.run()
