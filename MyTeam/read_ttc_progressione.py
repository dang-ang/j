import requests
from bs4 import BeautifulSoup
import json
import csv
import time

def scrape_classifica_completa_storica():
    base_url = "https://www.tuttocampo.it/EmiliaRomagna/GiovanissimiProvincialiU14/GironeDBologna/Giornata"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    classifica_per_giornata = {}

    for giornata in range(13, 14):
        url = f"{base_url}{giornata}"
        print(f"Estrazione Classifica Completa - Giornata {giornata}...")
        
        try:
            response = requests.get(url, headers=headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            tabella = soup.find('table', class_='tc-table sticky table_ranking sortable')
            
            if not tabella:
                print(f"Tabella non trovata per la giornata {giornata}")
                continue

            squadre_giornata = []
            rows = tabella.find('tbody').find_all('tr')
            
            for row in rows:
                cols = row.find_all('td')
                if len(cols) < 5: continue
                
                dati = {
                    "pos": cols[0].get_text(strip=True),
                    "squadra": cols[2].get_text(strip=True),
                    "punti": cols[3].get_text(strip=True),
                    "giocate": cols[4].get_text(strip=True),
                    "v": cols[5].get_text(strip=True),
                    "n": cols[6].get_text(strip=True),
                    "p": cols[7].get_text(strip=True),
                    "gf": cols[8].get_text(strip=True),
                    "gs": cols[9].get_text(strip=True),
                    "dr": cols[10].get_text(strip=True)
                }
                squadre_giornata.append(dati)
            
            classifica_per_giornata[f"Giornata_{giornata}"] = squadre_giornata
            time.sleep(0.8) # Rispetto per il server

        except Exception as e:
            print(f"Errore giornata {giornata}: {e}")

    return classifica_per_giornata

# Esecuzione e salvataggio
dati_completi = scrape_classifica_completa_storica()

if dati_completi:
    # 1. SALVATAGGIO JSON (Ideale per la dashboard)
    with open('classifica_storica_completa.json', 'w', encoding='utf-8') as f:
        json.dump(dati_completi, f, indent=4, ensure_ascii=False)
    
    # 2. SALVATAGGIO CSV (Ideale per Excel - Versione Flat)
    with open('classifica_storica_completa.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        # Intestazione con aggiunta della colonna Giornata
        writer.writerow(["Giornata", "Pos", "Squadra", "Punti", "G", "V", "N", "P", "GF", "GS", "DR"])
        
        for giornata, squadre in dati_completi.items():
            num_giornata = giornata.split("_")[1]
            for s in squadre:
                writer.writerow([num_giornata, s['pos'], s['squadra'], s['punti'], s['giocate'], 
                                 s['v'], s['n'], s['p'], s['gf'], s['gs'], s['dr']])

    print("\n--- ESPORTAZIONE COMPLETATA ---")
    print("File generati: 'classifica_storica_completa.json' e 'classifica_storica_completa.csv'")

    import os
    print(f"Il file CSV è stato salvato qui: {os.path.abspath('classifica_storica_completa.csv')}")