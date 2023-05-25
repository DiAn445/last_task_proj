@bot.message_handler(commands=["Newsletter"])
def answer(message):
    if (message.from_user.id == 365156441):
        newsletter = message.text.split(maxsplit=1)[1]
        cursor.execute("SELECT `id` FROM `Users_mining`")
        allusers = cursor.fetchall()
        for i in range(len(allusers)):
            try:
                if i % 20 == 0:
                    time.sleep(30)
                bot.send_message(allusers[i]['id'], newsletter )
            except:
                continue