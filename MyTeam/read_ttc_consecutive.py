import requests
from bs4 import BeautifulSoup
import csv
import json

def get_tuttocampo_data():
    url = "https://www.tuttocampo.it/EmiliaRomagna/GiovanissimiProvincialiU14/GironeDBologna/Squadra/JcrJuveniliaCRavaglia/1284515/Statistiche"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    print(f"Recupero dati da: {url}...")
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Individuiamo il contenitore dei record
        container = soup.find('div', id='consecutives_column')
        if not container:
            print("Contenitore 'consecutives_column' non trovato.")
            return None

        # Estraiamo i dati (Tuttocampo usa spesso blocchi con label e valore)
        # Cerchiamo tutti gli elementi che contengono i record
        stats_list = []
        # Cerchiamo i div che contengono i singoli record
        items = container.find_all('div', class_='consecutive-item') 
        
        # Se la classe non è quella, proviamo a estrarre i testi dai paragrafi o righe
        if not items:
            # Fallback se la struttura è diversa: cerchiamo i testi puliti
            items = container.find_all(['div', 'p'], recursive=False)

        for item in items:
            text = item.get_text(separator="|").strip()
            if "|" in text:
                parts = text.split("|")
                label = parts[0].strip()
                value = parts[-1].strip()
                stats_list.append({"Record": label, "Valore": value})

        return stats_list

    except Exception as e:
        print(f"Errore durante lo scraping: {e}")
        return None

def save_data(data):
    if not data:
        return

    # 1. Salva in CSV
    with open('statistiche_team.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=["Record", "Valore"])
        writer.writeheader()
        writer.writerows(data)
    print("File CSV 'statistiche_team.csv' creato con successo.")

    # 2. Salva in JSON
    with open('statistiche_team.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print("File JSON 'statistiche_team.json' creato con successo.")

# Esecuzione
if __name__ == "__main__":
    dati = get_tuttocampo_data()
    if dati:
        save_data(dati)
        for d in dati:
            print(f"{d['Record']}: {d['Valore']}")