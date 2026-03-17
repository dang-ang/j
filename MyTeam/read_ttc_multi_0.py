import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

# 1. DEFINIZIONE DEI DATI DI INPUT
ROOT = "D:\Dati\Documenti\DAvide\WEB_siti\github\GitHub\j\MyTeam\Content"
# Qui puoi aggiungere quante classifiche vuoi, specificando Categoria e Girone
config_classifiche = [
    {
        "categoria": "Under 14", 
        "girone": "Girone A", 
        "url": "https://www.tuttocampo.it/WidgetV2/Classifica/1cfb9d4f-13ba-4ffb-a388-1858c29e4389"
    },
    {
        "categoria": "Under 14", 
        "girone": "Girone B", 
        "url": "https://www.tuttocampo.it/WidgetV2/Classifica/730ada8c-04ff-40df-8b2b-57cd6bfa69dc"
    },
    {
        "categoria": "Under 14", 
        "girone": "Girone C", 
        "url": "https://www.tuttocampo.it/WidgetV2/Classifica/d04f6663-213d-4b86-aace-04fdc2b21e3a"
    },
    {
        "categoria": "Under 14", 
        "girone": "Girone D", 
        "url": "https://www.tuttocampo.it/WidgetV2/Classifica/1e45e881-9207-4886-b96c-c18b6e9acf11"
    }
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

'''
def estrai_dati(info):
    print(f"Scaricando: {info['categoria']} - {info['girone']}...")
    try:
        response = requests.get(info['url'], headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        tabella = soup.find('table')
        
        righe = []
        # Cerchiamo tutte le righe <tr> tranne l'intestazione
        for riga in tabella.find_all('tr')[1:]:
            colonne = riga.find_all('td')
            if len(colonne) > 1:
                righe.append({
                    "Categoria": info['categoria'],
                    "Girone": info['girone'],
                    "Pos": colonne[0].text.strip(),
                    "Squadra": colonne[1].text.strip(),
                    "Punti": colonne[2].text.strip(),
                    "Giocate": colonne[3].text.strip(),
                    "Vinte": colonne[4].text.strip(),
                    "Pareggiate": colonne[5].text.strip(),
                    "Perse": colonne[6].text.strip(),
                    "GF": colonne[7].text.strip(),
                    "GS": colonne[8].text.strip(),
                    "DR": colonne[9].text.strip()
                })
        return righe
    except Exception as e:
        print(f"Errore su {info['girone']}: {e}")
        return []
'''
'''
def estrai_dati(info):
    print(f"Scaricando: {info['categoria']} - {info['girone']}...")
    try:
        response = requests.get(info['url'], headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        tabella = soup.find('table')
        
        righe = []
        for riga in tabella.find_all('tr')[1:]:
            colonne = riga.find_all('td')
            
            # Verifichiamo che la riga abbia abbastanza colonne (solitamente sono 10 o 11)
            if len(colonne) >= 10:
                # Usiamo indici negativi per le ultime colonne se necessario, 
                # o mappiamo con attenzione.
                # In molti widget Tuttocampo:
                # [0]Pos, [1]Squadra, [2]Punti, [3]G, [4]V, [5]P, [6]S, [7]GF, [8]GS, [9]DR
                
                righe.append({
                    "Categoria": info['categoria'],
                    "Girone": info['girone'],
                    "Pos": colonne[0].text.strip(),
                    "Squadra": colonne[1].text.strip(),
                    "Punti": colonne[2].text.strip(),
                    "Giocate": colonne[3].text.strip(),
                    "Vinte": colonne[4].text.strip(),
                    "Pareggiate": colonne[5].text.strip(),
                    "Perse": colonne[6].text.strip(),
                    "GF": colonne[7].text.strip(),
                    "GS": colonne[8].text.strip(),
                    "DR": colonne[9].text.strip() # <--- Ora forziamo la lettura della decima colonna
                })
        return righe
    except Exception as e:
        print(f"Errore su {info['girone']}: {e}")
        return []
'''

def estrai_dati(info):
    print(f"Scaricando: {info['categoria']} - {info['girone']}...")
    try:
        response = requests.get(info['url'], headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Cerchiamo specificamente la tabella con le classi che hai indicato
        tabella = soup.find('table', class_='table_ranking')
        
        if not tabella:
            print(f"Tabella non trovata per {info['girone']}")
            return []

        righe = []
        for riga in tabella.find_all('tr')[1:]:
            # Estraiamo il testo da tutte le celle della riga
            colonne = [td.get_text(strip=True) for td in riga.find_all('td')]
            
            # Se la riga ha troppe colonne (es. c'è la colonna 'Trend' con le icone),
            # dobbiamo assicurarci di prendere i dati corretti.
            if len(colonne) >= 10:
                righe.append({
                    "Categoria": info['categoria'],
                    "Girone": info['girone'],
                    "Pos": colonne[0],
                    "Squadra": colonne[1],
                    "Punti": colonne[2],
                    "Giocate": colonne[3],
                    "Vinte": colonne[4],
                    "Pareggiate": colonne[5],
                    "Perse": colonne[6],
                    "GF": colonne[7],
                    "GS": colonne[8],
                    "DR": colonne[9]
                })
        return righe
    except Exception as e:
        print(f"Errore: {e}")
        return []


# 2. PROCESSO DI ESTRAZIONE
tutti_i_dati = []
for item in config_classifiche:
    dati_singoli = estrai_dati(item)
    tutti_i_dati.extend(dati_singoli)
    time.sleep(1.5) # Un po' di pausa extra per sicurezza

# 3. CREAZIONE DATAFRAME E SALVATAGGIO
if tutti_i_dati:
    df_finale = pd.DataFrame(tutti_i_dati)
    
    # Riordiniamo le colonne per una lettura più logica
    colonne_ordinate = ["Categoria", "Girone", "Pos", "Squadra", "Punti", "Giocate", "Vinte", "Pareggiate", "Perse", "GF", "GS", "DR"]
    df_finale = df_finale[colonne_ordinate]
    
    percorso = ROOT + "\classifiche_tuttocampo_complete.csv"
    df_finale.to_csv(percorso, index=False, sep=';', encoding='utf-8-sig')
    
    print(f"\n--- OPERAZIONE COMPLETATA ---")
    print(f"File salvato: {percorso}")
    print(f"Totale squadre estratte: {len(df_finale)}")
else:
    print("Nessun dato estratto. Controlla gli URL.")




import json

# Trasformiamo il DataFrame in una lista di dizionari
dati_json = df_finale.to_dict(orient='records')

# Salviamo in un file .js che la pagina web può leggere
with open( ROOT + "\data.js", "w", encoding="utf-8") as f:
    f.write(f"const classificaData = {json.dumps(dati_json, ensure_ascii=False)};")