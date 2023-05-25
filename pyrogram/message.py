import time
from pyrogram import Client
"""
Цей код розділяє список отримувачів на частини по 1000 отримувачів, відправляє повідомлення до кожного отримувача
 в кожній частині з паузою 1 секунда між кожним повідомленням, і чекає 5 секунд між кожною части
"""
app = Client("howdeepisyourlove7")
app.config_from_file("config.ini")

# Отримуємо список отримувачів
recipients = ["user1", "user2", "user3", ..., "user10500"]

# Розмір кожної частини
chunk_size = 1000

# Розділяємо список на частини
chunks = [recipients[i:i+chunk_size] for i in range(0, len(recipients), chunk_size)]

# Пауза між кожною частиною в секундах
pause_between_chunks = 30

# Перебираємо кожну частину і відправляємо повідомлення до всіх отримувачів цієї частини
for chunk in chunks:
    with app:
        for recipient in chunk:
            app.send_message(recipient, "Hello, world!")
            time.sleep(1)  # Пауза між кожним повідомленням
    time.sleep(pause_between_chunks)  # Пауза між кожною частиною
