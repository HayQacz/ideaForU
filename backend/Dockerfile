FROM python:3.9-slim

# Zapobiega zapisywaniu plików .pyc oraz buforowaniu wyjścia
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Ustaw katalog roboczy w kontenerze
WORKDIR /app

# Skopiuj plik z zależnościami i zainstaluj wymagane pakiety
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Skopiuj cały projekt do katalogu roboczego
COPY . /app

# Domyślne polecenie uruchamiające serwer Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
