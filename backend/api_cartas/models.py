# api_cartas/models.py
from django.db import models

class Era(models.Model):
    nombre = models.CharField(max_length=50)

class Bloque(models.Model):
    nombre = models.CharField(max_length=50)
    era = models.ForeignKey(Era, on_delete=models.CASCADE)

class Carta(models.Model):
    nombre = models.CharField(max_length=100)
    slug = models.CharField(max_length=100, unique=True, null=True) # Muy útil para URLs
    tipo = models.CharField(max_length=50) 
    raza = models.CharField(max_length=50, null=True, blank=True)
    frecuencia = models.CharField(max_length=50)
    coste = models.CharField(max_length=10, null=True, blank=True) # String porque a veces hay X o null
    fuerza = models.CharField(max_length=10, null=True, blank=True)
    habilidad = models.TextField(null=True, blank=True)
    edicion = models.CharField(max_length=100) # Ej: legado-gotico
    imagen_url = models.URLField(max_length=300, null=True, blank=True)
    bloque = models.ForeignKey(Bloque, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.nombre