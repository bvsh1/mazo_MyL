import requests
import json

def obtener_todas_las_cartas():
    url = "https://api.myl.cl/cards/edition/todas"
    
    # Mantenemos los headers por si tienen algún firewall bloqueando bots
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
    }

    print(f"[*] Consultando API oficial de MyL: {url}...")
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            # Transformamos el texto directamente a un objeto de Python (diccionario/lista)
            datos_json = response.json()
            
            print("[+] ¡Conexión exitosa! Datos recibidos.")
            
            # Guardamos la respuesta tal cual viene para analizar su estructura
            with open('cartas_myl_crudo.json', 'w', encoding='utf-8') as f:
                json.dump(datos_json, f, ensure_ascii=False, indent=4)
                
            # Validamos qué estructura nos devolvió
            if isinstance(datos_json, list):
                print(f"[*] Se guardaron {len(datos_json)} cartas exitosamente.")
            elif isinstance(datos_json, dict):
                # Si viene dentro de un objeto, por ejemplo {"cards": [...] }
                claves = list(datos_json.keys())
                print(f"[*] El JSON es un objeto. Llaves principales: {claves}")
            
            print("[+] Archivo 'cartas_myl_crudo.json' creado. Ábrelo para ver la estructura.")

        else:
            print(f"[-] Error HTTP {response.status_code}. El servidor rechazó la petición.")
            
    except Exception as e:
        print(f"[-] Ocurrió un error inesperado: {e}")

if __name__ == "__main__":
    obtener_todas_las_cartas()