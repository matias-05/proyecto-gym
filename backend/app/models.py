from typing import List, Optional
from datetime import datetime
from sqlmodel import Field, Relationship, SQLModel
from enum import Enum

class DiaSemana(str, Enum):
    LUNES = "Lunes"
    MARTES = "Martes"
    MIERCOLES = "Miércoles"
    JUEVES = "Jueves"
    VIERNES = "Viernes"
    SABADO = "Sábado"
    DOMINGO = "Domingo"

class Ejercicio(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    dia: DiaSemana  
    series: int = Field(gt=0)
    repeticiones: int = Field(gt=0)
    peso: Optional[float] = Field(default=None, ge=0) 
    notas: Optional[str] = Field(default=None)
    orden: int = Field(default=0) 
    rutina_id: Optional[int] = Field(default=None, foreign_key="rutina.id")
    rutina: Optional["Rutina"] = Relationship(back_populates="ejercicios")

class Rutina(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, unique=True)
    descripcion: Optional[str] = Field(default=None)
    fecha_creacion: datetime = Field(default_factory=datetime.now)
    ejercicios: List[Ejercicio] = Relationship(
        back_populates="rutina",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )