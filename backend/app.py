from flask import Flask, jsonify
from flask_cors import CORS
import psycopg2
import os

# Inicialización de la aplicación Flask
app = Flask(__name__)
CORS(app)



#Creacion y retorno de la conexión a la base de datos PostgreSQL utilizando variables de entorno.
def get_connection():
       
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD")
    )



#Endpoint para verificar si el backend esta activo
@app.route("/api/health")
def health():
    
    return jsonify({"status": "ok"}), 200


#Obtencion de la lista de integrantes 
@app.route("/api/team")
def team():
    conn = None
    cursor = None

    try:
        
        conn = get_connection()
        cursor = conn.cursor()

        
        cursor.execute("SELECT * FROM members;")
        rows = cursor.fetchall()

        # Transformación de los resultados a JSON
        members = []
        for row in rows:
            members.append({
                "id": row[0],
                "nombre": row[1],
                "apellido": row[2],
                "legajo": row[3],
                "feature": row[4],
                "servicio": row[5],
                "estado": row[6]
            })

        return jsonify(members)

    except Exception as e:
        # Manejo de errores
        return jsonify({"error": str(e)}), 500
    

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            

@app.route("/api/info")
def info():
    """
    Devuelve información básica del servicio backend.

    Returns:
        JSON con metadata del servicio
    """
    return jsonify({
        "service": "backend",
        "version": "1.0"
    })


# Punto de entrada de la aplicación
if __name__ == "__main__":
    """
    Ejecuta la aplicación en modo desarrollo.
    Escucha en todas las interfaces en el puerto 5000.
    """
    app.run(host="0.0.0.0", port=5000)