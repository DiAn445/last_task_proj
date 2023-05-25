import time
from pyrogram import Client
"""
Приклад коду, який дозволяє отримувати інформацію про користувачів зі списку чату з використанням цього методу
та розділяти їх на частини по 1000 контактів для парсингу до 10800 контактів за один сеанс.
"""
app = Client("howdeepisyourlove7")
app.config_from_file("config.ini")
app.start()

# отримуємо інформацію про чат
chat = app.get_chat("chat_id")

# список учасників чату
members = []

# проходимо по всіх учасниках чату та збираємо їх інформацію
for member in app.iter_chat_members(chat.id):
    # додаємо інформацію про учасника до списку
    members.append(member)

    # якщо кількість учасників досягла 10800, зупиняємо збір
    if len(members) == 10800:
        break

# розділяємо список на частини по 1000 учасників
chunks = [members[i:i+1000] for i in range(0, len(members), 1000)]

# Пауза між кожною частиною в секундах
pause_between_chunks = 5

# Перебираємо кожну частину і отримуємо додаткову інформацію про кожного учасника
for chunk in chunks:
    with app:
        for member in chunk:
            # отримуємо додаткову інформацію про учасника
            full_member = app.get_users(member.user.id)
            print(full_member.first_name, full_member.last_name, full_member.username)

            time.sleep(1)  # Пауза між кожним запитом на отримання додаткової інформації
    time.sleep(pause_between_chunks)  # Пауза між кожною частиною