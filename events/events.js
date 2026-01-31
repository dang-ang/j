// events.js
// logica eventi e storage

// events.js
import { isTimerRunning, getCurrentSeconds, getTempoCorrente } from './timer.js';

// const TIPI_EVENTO = ['TP', 'TF', 'FF', 'FS', 'PF', 'PX', 'GOL', 'CNL', 'CNO', 'PAUSA'];
let TIPI_EVENTO = [];
let DECODIFICA_EVENTI = {};
let DETTAGLI_EVENTI = {};   // <--- MANCAVA QUESTA RIGA


// eventi con icone e descrizione
export async function caricaEventi() {
  const res = await fetch('eventi.json');
  const data = await res.json();

  TIPI_EVENTO = data.eventi.map(e => e.codice);

  DECODIFICA_EVENTI = {};
  DETTAGLI_EVENTI = {};

  data.eventi.forEach(e => {
    DECODIFICA_EVENTI[e.codice] = e.descrizione;
    DETTAGLI_EVENTI[e.codice] = {
      descrizione: e.descrizione,
      icona: e.icona || "",
      immagine: e.immagine || "",
      pos: e.pos ?? 1
    };
  });
}


export function getDettagliEvento(codice) {
  return DETTAGLI_EVENTI[codice] || {
    descrizione: codice,
    icona: "",
    immagine: ""
  };
}

export function getDescrizioneEvento(codice) {
  return DECODIFICA_EVENTI[codice] || codice;
}


let eventiLocali = {};
let eventiOspiti = {};
let eventLog = [];

function initCounters(obj) {
  TIPI_EVENTO.forEach(t => obj[t] = 0);
}

export function initEvents() {
  initCounters(eventiLocali);
  initCounters(eventiOspiti);
  eventLog = [];
}

export function getTipiEvento() {
  return TIPI_EVENTO;
}

export function getTotals() {
  return {
    locali: { ...eventiLocali },
    ospiti: { ...eventiOspiti }
  };
}

export function getEventLog() {
  return [...eventLog];
}

export function getBlocco(secondi) {
  return Math.floor(secondi / 900) + 1; // 900 sec = 15 min
}

export function registraEvento(squadra, tipo) {
  // Includiamo categoria, girone e note in ogni evento
  const dataPartita = document.getElementById('dataPartita').value;
  const categoria = document.getElementById('categoriaPartita').value;
  const girone = document.getElementById('gironePartita').value;
  const note = document.getElementById('notePartita').value;

  
  if (!isTimerRunning() && tipo !== 'PAUSA') {
    alert('Impossibile registrare: il timer non è avviato.');
    return;


  }

  if (!TIPI_EVENTO.includes(tipo)) return;

  const tempo = getTempoCorrente();
  const secondi = getCurrentSeconds();
  const blocco = getBlocco(secondi);

  if (squadra === 'locali') {
    if (eventiLocali[tipo] !== undefined) eventiLocali[tipo]++;
  } else if (squadra === 'ospiti') {
    if (eventiOspiti[tipo] !== undefined) eventiOspiti[tipo]++;
  }

  // includiamo categoria, girone e note in ogni evento
  eventLog.push({
    data: dataPartita,
    categoria,
    girone,
    note,
    squadra,
    tipo,
    tempo,
    secondi,
    blocco
  });

}

// registra anche la data
const dataPartita = document.getElementById('dataPartita').value;
