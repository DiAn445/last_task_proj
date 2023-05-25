import time
from pyrogram import Client, filters
from pyrogram.errors import ChatWriteForbidden, UserNotParticipant, PeerIdInvalid
from pyrogram.types import ChatPermissions

app = Client("howdeepisyourlove7")
app.config_from_file("config.ini")


def create_group(chat_title, user_ids):
    try:
        # Створення групи
        chat = app.create_group(
            title=chat_title,
            users=user_ids
        )
        print(f"Group created with ID: {chat.id}")
        time.sleep(5)
        return chat.id
    except Exception as e:
        print(f"Failed to create group. Error: {e}")
        return None


def add_members(chat_id, user_ids):
    try:
        # Додавання учасників у групу
        app.add_chat_members(chat_id, user_ids)
        print(f"Added members to group {chat_id}")
        time.sleep(5)
    except PeerIdInvalid:
        print(f"Group {chat_id} not found")
    except UserNotParticipant:
        print(f"Bot is not a member of group {chat_id}")
    except ChatWriteForbidden:
        print(f"Cannot send messages to group {chat_id}")
    except Exception as e:
        print(f"Failed to add members to group {chat_id}. Error: {e}")


def remove_members(chat_id, user_ids):
    try:
        # Видалення учасників з групи
        app.kick_chat_members(chat_id, user_ids)
        print(f"Removed members from group {chat_id}")
        time.sleep(5)
    except PeerIdInvalid:
        print(f"Group {chat_id} not found")
    except UserNotParticipant:
        print(f"Bot is not a member of group {chat_id}")
    except ChatWriteForbidden:
        print(f"Cannot send messages to group {chat_id}")
    except Exception as e:
        print(f"Failed to remove members from group {chat_id}. Error: {e}")


try:
    app.start()

    # Створення групи
    chat_title = "Test Group1"
    user_ids = ["rita_bgrv", "hrdrfstrsmtr", "vova_ebash_ix_bliat"]
    chat_id = create_group(chat_title, user_ids)

    # Додавання учасників у групи
    members_to_add = ["rita_bgrv", "hrdrfstrsmtr"]
    add_members(chat_id, members_to_add)

    # Видалення учасників з групи
    members_to_remove = ["user_id_1", "user_id_2"]
    remove_members(chat_id, members_to_remove)

    app.stop()
except Exception as e:
    print(f"Failed to start or stop the client. Error: {e}")
