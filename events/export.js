// export.js
// CSV / JSON / Google Sheets – versione corretta con sostituzioni normalizzate

import { getEventLog } from './events.js';

// unisce eventi standard + sostituzioni
function getLogCompleto() {
  const standard = getEventLog();              // eventi normali
  const sost = window.eventiPartita || [];     // include SOST
  return [...standard, ...sost];
}

export function salvaCSV() {
  const log = getLogCompleto();

  if (log.length === 0) {
    alert('Nessun evento da salvare.');
    return;
  }

  const header = [
    'data','categoria','girone','note',
    'squadra','tipo','tempo','secondi','blocco'
  ];

  const rows = log.map(e => {

    // ============================
    //  NORMALIZZAZIONE SOSTITUZIONI
    // ============================
    if (e.tipo === 'SOST') {
      return [
        e.data,
        e.categoria,
        e.girone,
        `"${(e.note || '').replace(/"/g, '""')}"`,
        e.squadra,
        'SOST',
        e.tempoNum,                               // tempo = tempoNum
        e.secondi,                                // secondi progressivi
        `Entra: ${e.entra} > Esce: ${e.esce}`      // blocco descrittivo
      ];
    }

    // ============================
    //  EVENTI NORMALI
    // ============================
    return [
      e.data,
      e.categoria,
      e.girone,
      `"${(e.note || '').replace(/"/g, '""')}"`,
      e.squadra,
      e.tipo,
      e.tempo,
      e.secondi,
      e.blocco
    ];
  });

  const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadFile('eventi_partita.csv', csv, 'text/csv');
}

export function salvaJSON() {
  const log = getLogCompleto();

  if (log.length === 0) {
    alert('Nessun evento da salvare.');
    return;
  }

  const normalizzato = log.map(e => {

    // ============================
    //  NORMALIZZAZIONE SOSTITUZIONI
    // ============================
    if (e.tipo === 'SOST') {
      return {
        data: e.data,
        categoria: e.categoria,
        girone: e.girone,
        note: e.note,
        squadra: e.squadra,
        tipo: 'SOST',
        tempo: e.tempoNum,                         // tempo = tempoNum
        secondi: e.secondi,                        // secondi progressivi
        blocco: `Entra: ${e.entra} > Esce: ${e.esce}` // blocco descrittivo
      };
    }

    // ============================
    //  EVENTI NORMALI
    // ============================
    return {
      data: e.data,
      categoria: e.categoria,
      girone: e.girone,
      note: e.note,
      squadra: e.squadra,
      tipo: e.tipo,
      tempo: e.tempo,
      secondi: e.secondi,
      blocco: e.blocco
    };
  });

  const json = JSON.stringify(normalizzato, null, 2);
  downloadFile('eventi_partita.json', json, 'application/json');
}

export function inviaGoogle() {
  alert('Stub: qui colleghi Apps Script / API Google Sheets.');
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// esportazione pdf (invariata)
export function salvaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const log = getLogCompleto();
  if (log.length === 0) {
    alert("Nessun evento da salvare.");
    return;
  }

  // Header
  doc.setFontSize(16);
  doc.text("Report Partita", 14, 15);

  // Metadati
  const data = document.getElementById('dataPartita').value;
  const categoria = document.getElementById('categoriaPartita').value;
  const girone = document.getElementById('gironePartita').value;
  const note = document.getElementById('notePartita').value;
  const locali = document.getElementById('squadraLocali').value;
  const ospiti = document.getElementById('squadraOspiti').value;

  doc.setFontSize(11);
  doc.text(`Data: ${data}`, 14, 25);
  doc.text(`Categoria: ${categoria}`, 14, 31);
  doc.text(`Girone: ${girone}`, 14, 37);
  doc.text(`Locali: ${locali}`, 14, 43);
  doc.text(`Ospiti: ${ospiti}`, 14, 49);
  doc.text(`Note: ${note}`, 14, 55);

  // Tabella eventi
  const rows = log.map(e => {

    if (e.tipo === "SOST") {
      return [
        e.data,
        e.categoria,
        e.girone,
        e.squadra,
        "SOST",
        e.tempoNum,
        e.secondi,
        `Entra: ${e.entra} > Esce: ${e.esce}`
      ];
    }

    return [
      e.data,
      e.categoria,
      e.girone,
      e.squadra,
      e.tipo,
      e.tempo,
      e.secondi,
      e.blocco
    ];
  });

  doc.autoTable({
    startY: 65,
    head: [['Data','Categoria','Girone','Squadra','Evento','Tempo','Secondi','Blocco']],
    body: rows,
    theme: 'grid',
    styles: { fontSize: 8 }
  });

  doc.save("report_partita.pdf");
}
