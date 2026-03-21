// =====================================
//  GESTIONE SOSTITUZIONI - COMPLETO
// =====================================
// per la gestione 12 tempo e secondi da inizio partita in cui avviene evento
import { getCurrentSeconds, getTempoCorrente } from './timer.js';
import { getBlocco } from './events.js';



// stato interno
let riservaSelezionata = null;

// array locale (solo UI)
export const eventiSostituzioni = [];

// elementi DOM
const eventiDiv = document.getElementById("eventiSostituzioni");

// tempo ufficiale = cronometro della pagina
function tempoCronometro() {
  const el = document.getElementById("cronometro");
  return el ? el.textContent : "00:00";
}

// registra evento nella UI locale
function registraEventoUI(entra, esce) {
  const div = document.createElement("div");
  div.textContent = `${tempoCronometro()} — Entra ${entra}, Esce ${esce}`;
  eventiDiv.appendChild(div);
}

// registra evento nel sistema globale

function registraEventoGlobale(entra, esce) {

  const secondi = getCurrentSeconds();     // secondi progressivi
  const tempoNum = getTempoCorrente();     // 1 o 2
  const blocco = getBlocco(secondi);       // blocco 15 minuti

  const evento = {
    tipo: "SOST",
    squadra: "locali",
    tempo: tempoCronometro(),              // es. "00:12"
    tempoNum,
    secondi,
    blocco,
    entra,
    esce,

    // metadati
    data: document.getElementById('dataPartita').value,
    categoria: document.getElementById('categoriaPartita').value,
    girone: document.getElementById('gironePartita').value,
    note: document.getElementById('notePartita').value
  };

  window.eventiPartita.push(evento);

  if (window.aggiornaTimeline) window.aggiornaTimeline();
  if (window.aggiornaTotali) window.aggiornaTotali();
  if (window.aggiornaTabella15) window.aggiornaTabella15();
  if (window.aggiornaEsportazioni) window.aggiornaEsportazioni();
}


// abilita/disabilita titolari 2–11
function abilitaTitolari(stato) {
  document.querySelectorAll(".btn-titolare").forEach(btn => {
    const n = parseInt(btn.dataset.num);

    // titolare già sostituito → mai più selezionabile
    if (btn.dataset.sostituito === "true") return;

    if (n >= 2 && n <= 11) {
      btn.disabled = !stato;

      if (stato) btn.classList.add("selezionabile");
      else btn.classList.remove("selezionabile");
    }
  });
}

// abilita/disabilita riserve non usate
function abilitaRiserve(stato) {
  document.querySelectorAll(".btn-riserva").forEach(btn => {
    if (!btn.dataset.usata) btn.disabled = !stato;
  });
}

// =====================
// CLICK RISERVA
// =====================
document.querySelectorAll(".btn-riserva").forEach(btn => {
  btn.addEventListener("click", () => {
    const num = parseInt(btn.dataset.num);

    // caso speciale: 12 sostituisce sempre 1
    if (num === 12) {
      registraEventoUI(12, 1);
      registraEventoGlobale(12, 1);

      btn.disabled = true;
      btn.dataset.usata = "true";

      // segna titolare 1 come sostituito
      const t1 = document.querySelector('.btn-titolare[data-num="1"]');
      t1.dataset.sostituito = "true";
      t1.disabled = true;

      return;
    }

    // riserva normale (13–18)
    riservaSelezionata = num;

    // abilita titolari 2–11
    abilitaTitolari(true);

    // disabilita tutte le riserve finché non scelgo il titolare
    abilitaRiserve(false);

    // la riserva cliccata resta disabilitata
    btn.disabled = true;
  });
});

// =====================
// CLICK TITOLARE
// =====================
document.querySelectorAll(".btn-titolare").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!riservaSelezionata) return;

    const numTitolare = parseInt(btn.dataset.num);

    // registra evento
    registraEventoUI(riservaSelezionata, numTitolare);
    registraEventoGlobale(riservaSelezionata, numTitolare);

    // segna la riserva come usata
    const btnRiserva = document.querySelector(
      `.btn-riserva[data-num="${riservaSelezionata}"]`
    );
    btnRiserva.dataset.usata = "true";

    // segna il titolare come sostituito → non più selezionabile
    btn.dataset.sostituito = "true";
    btn.disabled = true;
    btn.classList.remove("selezionabile");

    // reset
    riservaSelezionata = null;

    // disabilita titolari 2–11
    abilitaTitolari(false);

    // riabilita riserve non usate
    abilitaRiserve(true);
  });
});

// stato iniziale
abilitaTitolari(false);
