FROM python:3.8.16-bullseye

# Установка зависимостей для бэкенда
WORKDIR /usr/src/app
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y libpq-dev

# Установка Node.js и npm
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

# Установка зависимостей и сборка фронтенда
WORKDIR /usr/src/app/frontend
COPY ./frontend/package.json .
COPY ./frontend/package-lock.json .
RUN npm install
COPY ./frontend/public ./public
COPY ./frontend/src ./src
RUN npm run build

# Копирование исходного кода бэкенда
COPY ./service ./service
COPY run.py .

# Конфигурация и запуск приложения
CMD ["python", "run.py"]

