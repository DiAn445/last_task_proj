FROM python:3.8.16-bullseye

WORKDIR /usr/src/app

RUN mkdir service
COPY ./service ./service
COPY run.py .
COPY requirements.txt .

RUN /usr/local/bin/python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt


CMD ["python", "run.py"]

EXPOSE 80