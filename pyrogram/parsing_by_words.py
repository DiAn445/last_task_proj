import requests
from bs4 import BeautifulSoup
"""
Цей код знаходить сторінку за заданою URL-адресою, розбирає її використовуючи BeautifulSoup, 
знаходить всі статті на сторінці та перевіряє кожну статтю на наявність ключових слів. 
Якщо стаття містить хоча б одне ключове слово, то вона додається до списку відповідних статей.
"""
# Сторінка для парсингу
url = "https://www.example.com/articles"

# Список ключових слів
keywords = ["Python", "programming"]

# Отримуємо сторінку
page = requests.get(url)

# Розбираємо сторінку з використанням BeautifulSoup
soup = BeautifulSoup(page.content, 'html.parser')

# Знаходимо всі статті
articles = soup.find_all('article')

# Знаходимо статті, які містять ключові слова
matching_articles = []
for article in articles:
    for keyword in keywords:
        if keyword in article.get_text():
            matching_articles.append(article)

# Виводимо результат
for article in matching_articles:
    print(article.get_text())
