import requests
from bs4 import BeautifulSoup
import pandas as pd


ROOT = "D:\Dati\Documenti\DAvide\WEB_siti\github\GitHub\j\MyTeam\Content"

# L'URL del widget che mi hai fornito
url = "https://www.tuttocampo.it/WidgetV2/Classifica/1cfb9d4f-13ba-4ffb-a388-1858c29e4389"

# Impostiamo un User-Agent per simulare un browser reale (importante per non essere bloccati)
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def estrai_classifica(url):
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print(f"Errore nella richiesta: {response.status_code}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Cerchiamo la tabella della classifica
    tabella = soup.find('table')
    classifica = []

    # Iteriamo sulle righe della tabella (saltando l'intestazione)
    for riga in tabella.find_all('tr')[1:]:
        colonne = riga.find_all('td')
        if len(colonne) > 1:
            dati_squadra = {
                "Pos": colonne[0].text.strip(),
                "Squadra": colonne[1].text.strip(),
                "Punti": colonne[2].text.strip(),
                "Giocate": colonne[3].text.strip(),
                "Vinte": colonne[4].text.strip(),
                "Pareggiate": colonne[5].text.strip(),
                "Perse": colonne[6].text.strip(),
                "GF": colonne[7].text.strip(), # Gol Fatti
                "GS": colonne[8].text.strip(), # Gol Subiti
                "DR": colonne[9].text.strip()  # Differenza Reti
            }
            classifica.append(dati_squadra)
    
    return classifica

# Esecuzione
dati = estrai_classifica(url)

# Trasformiamo in un DataFrame per vederlo bene o salvarlo in Excel/CSV
df = pd.DataFrame(dati)
print(df.to_string(index=False))

# Invece di df.to_excel, usa questo:
# df.to_csv("classifica_tuttocampo.csv", index=False, sep=';', encoding='utf-8-sig')
df.to_csv(ROOT + "\classifica_tuttocampo.csv", index=False, sep=';', encoding='utf-8-sig')

# import os
# print(f"Il file è stato salvato qui: {os.path.abspath('classifica_tuttocampo.csv')}")
# Se vuoi salvarlo in Excel:
# df.to_excel("classifica_tuttocampo.xlsx", index=False)
