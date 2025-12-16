# Gym Manager - Sistema de Gestión de Rutinas **(Backend)**

> **Proyecto Final - Cátedra Programación IV**
> Universidad Tecnológica Nacional (UTN)

## 📋 Descripción del Proyecto

Este directorio contiene la lógica del servidor (API RESTful) para el proyecto **Gym Manager**.
Está desarrollado con **FastAPI**, un framework moderno de Python que permite crear APIs rápidas y autodocumentadas.

El backend se encarga de:
* Gestionar la lógica de negocio (CRUD de Rutinas y Ejercicios).
* Validar la integridad de los datos con **Pydantic**.
* Interactuar con la base de datos **PostgreSQL** mediante el ORM **SQLModel**.
* Manejar errores y respuestas HTTP estandarizadas.

## 🚀 Características Técnicas

* **API REST:** Endpoints organizados para operaciones GET, POST, PUT y DELETE.
* **ORM (Object-Relational Mapping):** Uso de SQLModel para interactuar con la base de datos usando objetos Python en lugar de SQL crudo.
* **Documentación Automática:** Generación de Swagger UI y ReDoc en tiempo real.
* **Configuración Segura:** Manejo de credenciales de base de datos mediante variables de entorno (`.env`).
* **CORS Habilitado:** Configurado para permitir peticiones desde el Frontend (React).

## 🛠️ Tecnologías y Librerías

* **Lenguaje:** `Python 3.10+`
* **Framework Web:** `FastAPI`
* **Servidor ASGI:** `Uvicorn`
* **Base de Datos / ORM:** `SQLModel` (basado en SQLAlchemy), `psycopg2-binary`.
* **Gestión de Entorno:** `python-dotenv`.

## 🔧 Instalación y Ejecución

Sigue estos pasos para levantar el servidor localmente.

### Prerrequisitos
* **Python 3.10** o superior instalado.
* **PostgreSQL** instalado y el servicio corriendo.
* Una base de datos creada (ej: `gym_db`).

### Pasos

1.  **Navegar a la carpeta del backend:**
    ```bash
    cd backend
    ```

2.  **Crear y activar el entorno virtual:**
    Es fundamental para aislar las dependencias del proyecto.

    * **En Windows (Git Bash):**
        ```bash
        python -m venv venv
        source venv/Scripts/activate
        ```
    * **En Windows (PowerShell/CMD):**
        ```bash
        python -m venv venv
        venv\Scripts\activate
        ```
    * **En Mac/Linux:**
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```

3.  **Instalar dependencias:**
    Instala todas las librerías necesarias desde el archivo `requirements.txt`.
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configurar Variables de Entorno (.env):**
    Crea un archivo llamado `.env` en la raíz de la carpeta `backend/` y define la conexión a tu base de datos:

    ```env
    DATABASE_URL=postgresql://TU_USUARIO:TU_CONTRASEÑA@localhost/gym_db
    ```
    *(Asegúrate de reemplazar `TU_USUARIO`, `TU_CONTRASEÑA` y `gym_db` con tus datos reales de PostgreSQL).*

5.  **Iniciar el Servidor:**
    Ejecuta el siguiente comando para levantar la API en modo desarrollo (con recarga automática):

    ```bash
    python -m uvicorn app.main:app --reload
    ```

    *El servidor iniciará en:* `http://127.0.0.1:8000`

## 📖 Documentación de Endpoints

Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva para probar la API:

* **Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **ReDoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## 📂 Estructura del Proyecto

* `app/main.py`: Punto de entrada de la aplicación y configuración de FastAPI.
* `app/database.py`: Configuración de la conexión a PostgreSQL.
* `app/models.py`: Modelos de datos (Tablas) definidos con SQLModel.
* `requirements.txt`: Lista de dependencias del proyecto.
* `.env`: Variables de entorno (No incluido en el repositorio por seguridad).