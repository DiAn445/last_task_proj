import numpy as np
import tensorflow as tf

# Завантаження даних для тренування мікронейронної мережі
data = open('topSubscribed.csv', 'r').read()
chars = list(set(data))
char_to_num = {char: num for num, char in enumerate(chars)}

# Параметри мікронейронної мережі
num_epochs = 50
batch_size = 128
seq_length = 100
learning_rate = 0.01
vocab_size = len(chars)

# Створення моделі мікронейронної мережі
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(vocab_size, 256, batch_input_shape=[batch_size, None]),
    tf.keras.layers.LSTM(1024, return_sequences=True, stateful=True, recurrent_initializer='glorot_uniform'),
    tf.keras.layers.Dense(vocab_size)
])

# Компіляція моделі мікронейронної мережі
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=learning_rate),
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True))

# Функція для генерації тексту за допомогою мікронейронної мережі
def generate_text(model, start_string):
    # Кількість символів для генерації
    num_generate = 1000

    # Конвертуємо початковий текст в числове представлення
    input_eval = [char_to_num[char] for char in start_string]
    input_eval = tf.expand_dims(input_eval, 0)

    # Зберігаємо згенерований текст
    generated_text = []

    # Генерація тексту
    model.reset_states()
    for i in range(num_generate):
        predictions = model(input_eval)
        predictions = tf.squeeze(predictions, 0)
        predicted_id = tf.random.categorical(predictions, num_samples=1)[-1, 0].numpy()

        # Додаємо вихідний символ до згенерованого тексту
        generated_text.append(chars[predicted_id])

        # Використовуємо останній згенерований символ як вхід до наступного виклику моделі
        input_eval = tf.expand_dims([predicted_id], 0)

    return (start_string + ''.join(generated_text))

# Тренування мікронейронної мережі
for epoch in range(num_epochs):
    # Розбиваємо дані на пакети
    chunks = tf.data.Dataset.from_tensor_slices(data_as_int).batch(batch_size, drop_remainder=True)

