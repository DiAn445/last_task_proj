import random


def randomize_text(text):
    # розбиваємо текст на список слів
    words = text.split()

    # рандомізуємо порядок слів у списку
    random.shuffle(words)

    # об'єднуємо слова у випадковий порядок
    randomized_text = ' '.join(words)

    return randomized_text
