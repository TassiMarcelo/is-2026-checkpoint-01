# Imagen base: Python 3.12 slim
FROM python:3.12-slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar la carpeta html/ dentro de la imagen
COPY html/ /app/

# Exponer el puerto 8080
EXPOSE 8080

# Comando para ejecutar el servidor HTTP de Python
CMD ["python3", "-m", "http.server", "8080"]
