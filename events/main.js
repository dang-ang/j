// main.js
// entrypoint, type="module"


//x v2.3
// array globale degli eventi
window.eventiPartita = window.eventiPartita || [];

// funzioni di aggiornamento (se non esistono già)
window.aggiornaTimeline = window.aggiornaTimeline || function(){};
window.aggiornaTotali = window.aggiornaTotali || function(){};
window.aggiornaTabella15 = window.aggiornaTabella15 || function(){};
window.aggiornaEsportazioni = window.aggiornaEsportazioni || function(){};


// import delle funzioni da vari file
import { initTimer,  startCronometro,  pausaCronometro, stopCronometro,  resetCronometro,  setTempo } from './timer.js';
import { initEvents, registraEvento,caricaEventi} from './events.js';
import { buildEventButtons, renderDashboard, renderTimeline } from './ui.js';
import { salvaCSV, salvaJSON, inviaGoogle,salvaPDF } from './export.js';
import './sostituzioni.js';



// caricamento del file di configurazione
async function caricaConfigurazione() {
  const res = await fetch('config.json');
  const cfg = await res.json();

  document.getElementById('dataPartita').value = cfg.dataPartita || new Date().toISOString().split('T')[0];
  document.getElementById('categoriaPartita').value = cfg.categoria || "";
  document.getElementById('gironePartita').value = cfg.girone || "";
  document.getElementById('notePartita').value = cfg.note || "";
  document.getElementById('squadraLocali').value = cfg.locali || "";
  document.getElementById('squadraOspiti').value = cfg.ospiti || "";
}



async function init() {
  // carico il file di configuraizone
  await caricaEventi();           // 1) carica tipi evento dal JSON
  await caricaConfigurazione();   // 2) carica categoria/girone/squadre/data

  // Imposta la data di oggi come default
  const oggi = new Date().toISOString().split('T')[0];
  document.getElementById('dataPartita').value = oggi;

  initTimer();          // 3) timer
  initEvents();         // 4) inizializza contatori basati sui tipi evento
  buildEventButtons();  // 5) genera pulsanti basati sui tipi evento
  renderDashboard();    // 6) dashboard completa

  document.getElementById('btnStart').addEventListener('click', () => startCronometro());

  document.getElementById('btnPausa').addEventListener('click', () =>
    pausaCronometro(() => registraEvento('sistema', 'PAUSA'))
  );

  document.getElementById('btnStop').addEventListener('click', () =>
    stopCronometro(
      () => console.log('Fine primo tempo'),
      () => console.log('Fine secondo tempo')
    )
  );

  document.getElementById('btnReset').addEventListener('click', () => {
    resetCronometro();
    initEvents();
    buildEventButtons();
    renderDashboard();
  });

  document.getElementById('btnT1').addEventListener('click', () => setTempo(1));
  document.getElementById('btnT2').addEventListener('click', () => setTempo(2));

  document.getElementById('btnCSV').addEventListener('click', () => salvaCSV());
  document.getElementById('btnJSON').addEventListener('click', () => salvaJSON());
  document.getElementById('btnGoogle').addEventListener('click', () => inviaGoogle());

  document.getElementById('filtroSquadra').addEventListener('change', renderTimeline);
  document.getElementById('filtroTempo').addEventListener('change', renderTimeline);
  document.getElementById('filtroEvento').addEventListener('change', renderTimeline);

}

document.addEventListener('DOMContentLoaded', init);

// per esportazione pdf
document.getElementById('btnPDF').addEventListener('click', () => salvaPDF());
  
