import time
from pyrogram import Client, filters
from pyrogram.errors import ChatWriteForbidden

app = Client("howdeepisyourlove7")
app.config_from_file("config.ini")


@app.on_message(filters.private & filters.command("invite"))
async def invite_users_to_group(client, message):
    # Перевірка, чи є повідомлення від адміністратора групи
    chat = await client.get_chat(message.chat.id)
    if not chat.type == "supergroup":
        return await message.reply_text("Ця команда працює тільки в супергрупах!")

    member = await client.get_chat_member(chat_id=chat.id, user_id=message.from_user.id)
    if not (member.status in ("creator", "administrator")):
        return await message.reply_text("Ви повинні бути адміністратором групи, щоб запрошувати користувачів.")

    # Перевірка, чи було вказано ім'я групи та список користувачів
    if len(message.command) < 3:
        return await message.reply_text("Будь ласка, введіть назву групи та список користувачів, яких ви хочете запросити.")

    # Отримання назви групи
    group_name = message.command[1]

    # Отримання списку користувачів, яких потрібно запросити
    users_to_invite = message.command[2:]

    # Запрошення користувачів у групу
    added_users = []
    failed_users = []
    for user in users_to_invite:
        try:
            await client.add_chat_members(chat_id=chat.id, user_ids=int(user))
            added_users.append(int(user))
        except Exception as e:
            print(e)
            failed_users.append(int(user))

        time.sleep(1)

    # Формування відповіді
    response = f"Запрошення надіслано до наступних користувачів:\n\n"
    for user_id in added_users:
        response += f"• {user_id}\n"

    if failed_users:
        response += "\nНе вдалося запросити наступних користувачів:\n\n"
        for user_id in failed_users:
            response += f"• {user_id}\n"

    try:
        await message.reply_text(response)
    except ChatWriteForbidden:
        pass