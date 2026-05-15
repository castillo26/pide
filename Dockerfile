FROM python:3.12-slim

# Evita archivos innecesarios
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar dependencias
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el proyecto
COPY . .

# Exponer puerto
EXPOSE 8000

# Comando para ejecutar Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
