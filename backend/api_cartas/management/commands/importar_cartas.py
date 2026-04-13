# api_cartas/management/commands/importar_cartas.py
import json
from django.core.management.base import BaseCommand
from api_cartas.models import Carta, Bloque, Era

class Command(BaseCommand):
    help = 'Importa cartas desde el JSON oficial de la API de MyL'

    def handle(self, *args, **options):
        try:
            with open('cartas_myl_crudo.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR('Error: No se encontró el archivo cartas_myl_crudo.json'))
            return

        dic_razas = {r['id']: r['name'] for r in data.get('races', [])}
        dic_tipos = {t['id']: t['name'] for t in data.get('types', [])}
        dic_rarezas = {r['id']: r['name'] for r in data.get('rarities', [])}
        
        # Mapeo exhaustivo y exacto según formatos de juego
        mapeo_ediciones = {
            # --- PRIMERA ERA ---
            "el-reto": ("Primera Era", "Primera Era"),
            "mundo-gotico": ("Primera Era", "Primera Era"),
            "la-ira-del-nahual": ("Primera Era", "Primera Era"),
            "ragnarok": ("Primera Era", "Primera Era"),
            "la-cofradia": ("Primera Era", "Primera Era"),
            "espiritu-del-dragon": ("Primera Era", "Primera Era"),

            # --- PRIMER BLOQUE ---
            "espada-sagrada": ("Primer Bloque", "Segunda Era"),
            "cruzadas": ("Primer Bloque", "Segunda Era"),
            "helenica": ("Primer Bloque", "Segunda Era"),
            "imperio": ("Primer Bloque", "Segunda Era"),
            "hijos-de-daana": ("Primer Bloque", "Segunda Era"),
            "tierras-altas": ("Primer Bloque", "Segunda Era"),
            "dominios-de-ra": ("Primer Bloque", "Segunda Era"),
            "encrucijada": ("Primer Bloque", "Segunda Era"),

            # --- SEGUNDO BLOQUE ---
            "guerrero-jaguar": ("Segundo Bloque", "Segunda Era"),
            "vendaval": ("Segundo Bloque", "Segunda Era"),
            "barbarie": ("Segundo Bloque", "Segunda Era"),
            "reino-de-acero": ("Segundo Bloque", "Segunda Era"),
            "hordas": ("Segundo Bloque", "Segunda Era"),
            "bestiario": ("Segundo Bloque", "Segunda Era"),
            "heroes": ("Segundo Bloque", "Segunda Era"),

            # --- FURIA ---
            "furia": ("Furia", "Nueva Era"),
            "furia-extension": ("Furia", "Nueva Era"),
            "sumeria": ("Furia", "Nueva Era"),
            "rebelion": ("Furia", "Nueva Era"),
            "asgard": ("Furia", "Nueva Era"),
            "midgard": ("Furia", "Nueva Era"),
            "camelot": ("Furia", "Nueva Era"),
            "templarios": ("Furia", "Nueva Era"),
            "bushido": ("Furia", "Nueva Era"),
            "sol-naciente": ("Furia", "Nueva Era"),

            # --- FURIA EXTENDIDO ---
            "roma": ("Furia Extendido", "Nueva Era"),
            "excalibur": ("Furia Extendido", "Nueva Era"),
            "troya": ("Furia Extendido", "Nueva Era"),
            "guerreros-del-sol": ("Furia Extendido", "Nueva Era"),
            "guardianes-de-daana": ("Furia Extendido", "Nueva Era"),

            # --- IMPERIO ---
            "kemet": ("Imperio", "Nueva Era"),
            "arsenal": ("Imperio", "Nueva Era"),
            "valhalla": ("Imperio", "Nueva Era"),
            "exploradores": ("Imperio", "Nueva Era"),
            "angeles-y-demonios": ("Imperio", "Nueva Era"),
            "angeles-demonios": ("Imperio", "Nueva Era"), # Por si difiere el slug en el JSON
            "acero": ("Imperio", "Nueva Era"),
            "cid": ("Imperio", "Nueva Era"),
            "shogun": ("Imperio", "Nueva Era"),
            "keltoi": ("Imperio", "Nueva Era"),
            "axis": ("Imperio", "Nueva Era"),
            "napoleon": ("Imperio", "Nueva Era"),
            "japon-medieval": ("Imperio", "Nueva Era"),
            "bestiarium": ("Imperio", "Nueva Era"),
        }

        cartas = data.get('cards', [])
        cartas_creadas = 0

        for c in cartas:
            tipo_nombre = dic_tipos.get(c.get('type'), 'Desconocido')
            raza_nombre = dic_razas.get(c.get('race'), 'Sin Raza') if c.get('race') else None
            frecuencia_nombre = dic_rarezas.get(c.get('rarity'), 'Desconocida')
            
            ed_slug = c.get('ed_slug', 'desconocido')
            
            # Buscar el bloque correcto para la edición, si no existe por defecto "Otro"
            bloque_nombre, era_nombre = mapeo_ediciones.get(ed_slug, ("Sin Bloque", "Sin Era"))
            era_obj, _ = Era.objects.get_or_create(nombre=era_nombre)
            bloque_obj, _ = Bloque.objects.get_or_create(nombre=bloque_nombre, era=era_obj)

            url_img = f"https://api.myl.cl/static/cards/{c.get('ed_edid')}/{c.get('edid')}.png"

            slug_unico = f"{ed_slug}-{c.get('slug', '')}"

            Carta.objects.update_or_create(
                slug=slug_unico,
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

        self.stdout.write(self.style.SUCCESS(f'¡Éxito! Se procesaron {cartas_creadas} cartas con los bloques actualizados.'))