from fastapi import FastAPI, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from .database import create_db_and_tables, get_session
from .models import Rutina, Ejercicio
from .schemas import RutinaCreate, RutinaRead, RutinaUpdate, EjercicioCreate

#Configuración de inicio
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables() #Crear tablas si no existen al arrancar
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Endpoints

# 1. Crear Rutina (con ejercicios)
@app.post("/api/rutinas", response_model=RutinaRead, status_code=201)
def crear_rutina(rutina_data: RutinaCreate, session: Session = Depends(get_session)):
    # Validar nombre único para la rutina
    rutina_existente = session.exec(select(Rutina).where(Rutina.nombre == rutina_data.nombre)).first()
    if rutina_existente:
        raise HTTPException(status_code=400, detail="Ya existe una rutina con ese nombre")

    # Crear la rutina
    nueva_rutina = Rutina(nombre=rutina_data.nombre, descripcion=rutina_data.descripcion)
    
    # Agregar los ejercicios recibidos
    for ejercicio in rutina_data.ejercicios:
        nuevo_ejercicio = Ejercicio.model_validate(ejercicio)
        nueva_rutina.ejercicios.append(nuevo_ejercicio)

    session.add(nueva_rutina)
    session.commit()
    session.refresh(nueva_rutina)
    return nueva_rutina

# 2. Listar todas las rutinas
@app.get("/api/rutinas", response_model=List[RutinaRead])
def listar_rutinas(session: Session = Depends(get_session)):
    rutinas = session.exec(select(Rutina)).all()
    return rutinas

# 3. Buscar Rutinas por nombre
@app.get("/api/rutinas/buscar", response_model=List[RutinaRead])
def buscar_rutinas(nombre: str = Query(..., min_length=1), session: Session = Depends(get_session)):
    rutinas = session.exec(select(Rutina).where(Rutina.nombre.ilike(f"%{nombre}%"))).all()
    return rutinas

# 4. Obtener detalle de una rutina
@app.get("/api/rutinas/{id}", response_model=RutinaRead)
def obtener_rutina(id: int, session: Session = Depends(get_session)):
    rutina = session.get(Rutina, id)
    if not rutina:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")
    
    rutina.ejercicios.sort(key=lambda x: x.orden)
    
    return rutina

# 5. Eliminar Rutina
@app.delete("/api/rutinas/{id}", status_code=204)
def eliminar_rutina(id: int, session: Session = Depends(get_session)):
    rutina = session.get(Rutina, id)
    if not rutina:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")
    
    session.delete(rutina)
    session.commit()
    return None

# 6. Actualizar Rutina (Básico: Nombre/Descripción)
@app.put("/api/rutinas/{id}", response_model=RutinaRead)
def actualizar_rutina(id: int, rutina_data: RutinaUpdate, session: Session = Depends(get_session)):
    rutina_db = session.get(Rutina, id)
    if not rutina_db:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")
    
    # 1. Actualizar datos básicos (Nombre, Descripción)
    if rutina_data.nombre is not None:
        rutina_db.nombre = rutina_data.nombre
    if rutina_data.descripcion is not None:
        rutina_db.descripcion = rutina_data.descripcion

    # 2. Actualizar Ejercicios
    if rutina_data.ejercicios is not None:
        # A. Borra los ejercicios antiguos de esta rutina
        for ejercicio_antiguo in rutina_db.ejercicios:
            session.delete(ejercicio_antiguo)
        
        # B. Agrega los nuevos ejercicios
        for ejercicio_nuevo in rutina_data.ejercicios:
            ejercicio_db = Ejercicio.model_validate(ejercicio_nuevo)
            rutina_db.ejercicios.append(ejercicio_db)
        
    session.add(rutina_db)
    session.commit()
    session.refresh(rutina_db)
    
    rutina_db.ejercicios.sort(key=lambda x: x.orden)
    
    return rutina_db