import geoip2.database

# шлях до файлу бази даних GeoIP2
# ви можете завантажити файл бази даних з https://dev.maxmind.com/geoip/geoip2/geolite2/
database_path = '/path/to/GeoLite2-City.mmdb'

# функція, яка повертає інформацію про геолокацію за IP-адресою
def get_location_by_ip(ip_address):
    # відкриття бази даних
    reader = geoip2.database.Reader(database_path)
    # отримання інформації про геолокацію за IP-адресою
    response = reader.city(ip_address)
    # створення словника з інформацією про геолокацію
    location_info = {
        'city': response.city.name,
        'region': response.subdivisions.most_specific.name,
        'country': response.country.name,
        'latitude': response.location.latitude,
        'longitude': response.location.longitude
    }
    return location_info

# використання функції для отримання інформації про геолокацію за IP-адресою
location = get_location_by_ip('192.0.2.1')
print(location)
