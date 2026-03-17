@echo off
echo Avvio VideoTaggingEvents...

REM crea ambiente virtuale locale se non esiste
if not exist venv (
    echo Creo ambiente virtuale...
    python -m venv venv
)

REM attiva ambiente
call venv\Scripts\activate

REM installa dipendenze se mancano
pip install -r requirements.txt

REM avvia l'app
python videotaggingevents.py
