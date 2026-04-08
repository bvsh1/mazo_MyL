from rest_framework import serializers
from .models import Carta, Bloque, Era

class CartaSerializer(serializers.ModelSerializer):
    # Agregamos estos campos de lectura para que el frontend tenga el texto directo
    bloque_nombre = serializers.CharField(source='bloque.nombre', read_only=True)
    era_nombre = serializers.CharField(source='bloque.era.nombre', read_only=True)

    class Meta:
        model = Carta
        fields = [
            'id', 'nombre', 'slug', 'tipo', 'raza', 'frecuencia', 
            'coste', 'fuerza', 'habilidad', 'edicion', 'imagen_url', 
            'bloque_nombre', 'era_nombre'
        ]