import telegram
from telegram.error import Unauthorized

# Вставьте свой API-ключ здесь
bot = telegram.Bot('YOUR_API_KEY')

try:
    chats = bot.get_chats()
except Unauthorized:
    print("Unauthorized to access this chat list.")
else:
    for chat in chats:
        print(chat.title, chat.type, chat.id)








import telegram

# Вставьте свой API-ключ здесь
bot = telegram.Bot('YOUR_API_KEY')

# Поиск каналов по ключевому слову
query = 'python'
channels = bot.get_chat_history('@telegram', limit=50, query=query)

# Вывод результатов
for channel in channels:
    print(channel.title, channel.type, channel.id)
