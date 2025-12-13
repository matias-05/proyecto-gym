from typing import List, Optional
from datetime import datetime
from sqlmodel import SQLModel
from .models import DiaSemana

#Esquemas de Ejercicio
class EjercicioBase(SQLModel):
    nombre: str
    dia: DiaSemana
    series: int
    repeticiones: int
    peso: Optional[float] = None
    notas: Optional[str] = None
    orden: int = 0

class EjercicioCreate(EjercicioBase):
    pass

class EjercicioRead(EjercicioBase):
    id: int

#Esquemas de Rutina
class RutinaBase(SQLModel):
    nombre: str
    descripcion: Optional[str] = None

class RutinaCreate(RutinaBase):
    ejercicios: List[EjercicioCreate] = []

class RutinaRead(RutinaBase):
    id: int
    fecha_creacion: datetime
    ejercicios: List[EjercicioRead] = []

class RutinaUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    ejercicios: Optional[List[EjercicioCreate]] = None