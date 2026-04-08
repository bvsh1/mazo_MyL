# api_cartas/management/commands/importar_cartas.py
import json
from django.core.management.base import BaseCommand
from api_cartas.models import Carta, Bloque, Era

class Command(BaseCommand):
    help = 'Importa cartas desde el JSON oficial de la API de MyL'

    def handle(self, *args, **options):
        # 1. Cargar el JSON
        with open('cartas_myl_crudo.json', 'r', encoding='utf-8') as f:
            data = json.load(f)

        # 2. Crear diccionarios de traducción (ID -> Nombre)
        dic_razas = {r['id']: r['name'] for r in data.get('races', [])}
        dic_tipos = {t['id']: t['name'] for t in data.get('types', [])}
        dic_rarezas = {r['id']: r['name'] for r in data.get('rarities', [])}
        
        # 3. Diccionario manual para agrupar Ediciones en Bloques y Eras
        # Deberás ir agregando las ediciones que necesites aquí
        mapeo_ediciones = {
            "espada-sagrada": ("Primer Bloque", "Segunda Era"),
            "helenica": ("Primer Bloque", "Segunda Era"),
            "hijos-de-daana": ("Primer Bloque", "Segunda Era"),
            "guerrero-jaguar": ("Crónicas", "Segunda Era"),
            "legado-gotico": ("Furia", "Nueva Era"),
            # etc...
        }

        cartas = data.get('cards', [])
        cartas_creadas = 0

        for c in cartas:
            # Traducir IDs a Texto
            tipo_nombre = dic_tipos.get(c.get('type'), 'Desconocido')
            raza_nombre = dic_razas.get(c.get('race'), 'Sin Raza') if c.get('race') else None
            frecuencia_nombre = dic_rarezas.get(c.get('rarity'), 'Desconocida')
            
            ed_slug = c.get('ed_slug', 'desconocido')
            
            # Resolver Bloque y Era
            bloque_nombre, era_nombre = mapeo_ediciones.get(ed_slug, ("Sin Bloque", "Sin Era"))
            era_obj, _ = Era.objects.get_or_create(nombre=era_nombre)
            bloque_obj, _ = Bloque.objects.get_or_create(nombre=bloque_nombre, era=era_obj)

            # Reconstruir la URL de la imagen
            # Nota: La API de MyL suele guardar las imágenes siguiendo este patrón
            # Reconstruir la URL de la imagen
            # Reconstruir la URL de la imagen usando los IDs numéricos
            url_img = f"https://api.myl.cl/static/cards/{c.get('ed_edid')}/{c.get('edid')}.png"

            # Guardar o actualizar en la base de datos
            Carta.objects.update_or_create(
                slug=c.get('slug'), # Usamos el slug como identificador único
                defaults={
                    'nombre': c.get('name').title(),
                    'tipo': tipo_nombre,
                    'raza': raza_nombre,
                    'frecuencia': frecuencia_nombre,
                    'coste': c.get('cost'),
                    'fuerza': c.get('damage'),
                    'habilidad': c.get('ability'),
                    'edicion': ed_slug.replace("-", " ").title(),
                    'imagen_url': url_img,
                    'bloque': bloque_obj
                }
            )
            cartas_creadas += 1

        self.stdout.write(self.style.SUCCESS(f'¡Éxito! Se importaron/actualizaron {cartas_creadas} cartas.'))