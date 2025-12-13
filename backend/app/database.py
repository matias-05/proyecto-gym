from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Crear el motor de conexión
engine = create_engine(DATABASE_URL, echo=True) 

def get_session():
    with Session(engine) as session:
        yield session

# Función para crear las tablas al inicio
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)