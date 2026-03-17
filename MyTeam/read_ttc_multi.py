import requests
from bs4 import BeautifulSoup
import pandas as pd
import json
import time

# 1. CONFIGURAZIONE INPUT
ROOT = "D:\Dati\Documenti\DAvide\WEB_siti\github\GitHub\j\MyTeam\Content"

config_classifiche = [
    {
        "categoria": "Under 14", 
        "girone": "Girone A - BO", 
        "url": "https://www.tuttocampo.it/WidgetV2/Classifica/1cfb9d4f-13ba-4ffb-a388-1858c29e4389"
    },
    {
        "categoria": "Under 14", 
        "girone": "Girone B - BO", 
        "url": "https://www.tuttocampo.it/WidgetV2/Classifica/730ada8c-04ff-40df-8b2b-57cd6bfa69dc"
    },
    {
        "categoria": "Under 14", 
        "girone": "Girone C - BO", 
        "url": "https://www.tuttocampo.it/WidgetV2/Classifica/d04f6663-213d-4b86-aace-04fdc2b21e3a"
    },
    {
        "categoria": "Under 14", 
        "girone": "Girone D - BO", 
        "url": "https://www.tuttocampo.it/WidgetV2/Classifica/1e45e881-9207-4886-b96c-c18b6e9acf11"
    },
    {
        "categoria": "Under 14", 
        "girone": "Girone A - RA", 
        "url": "https://www.tuttocampo.it/WidgetV2/Classifica/d8a2730d-5c90-4b21-a582-1db9981b242b"
    },
    {
        "categoria": "Under 14", 
        "girone": "Girone B - RA", 
        "url": "https://www.tuttocampo.it/WidgetV2/Classifica/444c593e-66ba-45ce-8728-d9c71cac37af"
    }


]
'''
config_classifiche = [
    {
        "categoria": "Under 14", 
        "girone": "Girone A", 
        "url": "https://www.tuttocampo.it/WidgetV2/Classifica/1cfb9d4f-13ba-4ffb-a388-1858c29e4389"
    }
]
'''

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def estrai_dati(info):
    print(f"Scaricando: {info['categoria']} - {info['girone']}...")
    try:
        response = requests.get(info['url'], headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        tabella = soup.find('table', class_='table_ranking')
        if not tabella: return []

        righe_dati = []
        for riga in tabella.find('tbody').find_all('tr'):
            
            # Funzione interna per estrarre testo o attributi per classe
            def get_val(cls, attr=None):
                target = riga.find('td', class_=cls)
                if not target: return ""
                if attr: # Utile per prendere l'src del logo
                    img = target.find('img')
                    return img.get(attr) if img else ""
                return target.get_text(strip=True)

            squadra = get_val('team')
            if not squadra: continue

            righe_dati.append({
                "Categoria": info['categoria'],
                "Girone": info['girone'],
                "Logo": get_val('team_logo', 'src'), # Estraiamo l'URL dell'immagine
                "Squadra": squadra,
                "Punti": get_val('pt'),
                "PG": get_val('pg'),
                "VT": get_val('vt'),
                "PA": get_val('pa'),
                "SC": get_val('sc'),
                "GF": get_val('gf'),
                "GS": get_val('gs'),
                "DR": get_val('dr')
            })
        return righe_dati
    except Exception as e:
        print(f"Errore: {e}")
        return []

# 2. ESECUZIONE
tutti_i_dati = []
for item in config_classifiche:
    tutti_i_dati.extend(estrai_dati(item))
    time.sleep(1)

# 3. SALVATAGGIO DOPPIO (CSV + JS per il Web)
if tutti_i_dati:
    df = pd.DataFrame(tutti_i_dati)
    
    # Salva CSV
    df.to_csv(ROOT + "\classifiche_complete.csv", index=False, sep=';', encoding='utf-8-sig')
    
    # Salva JS per la Dashboard
    json_data = df.to_dict(orient='records')
    with open(ROOT + "\data.js", "w", encoding="utf-8") as f:
        f.write(f"const classificaData = {json.dumps(json_data, ensure_ascii=False)};")

    # Salva anche data.json
    with open(ROOT + "\data.json", "w", encoding="utf-8") as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)


    print(f"\n✅ Elaborazione completata! Estratte {len(df)} squadre.")