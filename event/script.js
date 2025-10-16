const parametri = [
  { codice: "TP", descrizione: "Tiro in Porta" },
  { codice: "TF", descrizione: "Tiro Fuori" },
  { codice: "FF", descrizione: "Fallo Fatto" },
  { codice: "FS", descrizione: "Fallo Subito" },
  { codice: "PF", descrizione: "Passaggio Buono" },
  { codice: "PX", descrizione: "Passaggio Sbagliato" }
];

let stats = {};
let vitalita = { portiere: 0, difesa: 0, centrocampo: 0, attacco: 0 };
let startTime = null;
let cronometroInterval = null;

parametri.forEach(p => stats[p.codice] = []);

function startCronometro() {
  startTime = Date.now();
  cronometroInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const min = Math.floor(elapsed / 60000);
    const sec = Math.floor((elapsed % 60000) / 1000);
    document.getElementById("cronometro").textContent =
      `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }, 1000);
}

function creaBottoni() {
  const container = document.getElementById("bottoni");
  parametri.forEach(p => {
    const btn = document.createElement("button");
    btn.textContent = p.descrizione;
    btn.onclick = () => registra(p.codice);
    container.appendChild(btn);
  });
}

function registra(codice) {
  if (!startTime) return alert("Avvia il cronometro prima!");
  const minuto = Math.floor((Date.now() - startTime) / 60000);
  stats[codice].push(minuto);
  aggiornaStatistiche();
}

function registraVitalita(ruolo) {
  vitalita[ruolo]++;
  aggiornaStatistiche();
}

function aggiornaStatistiche() {
  const squadra = document.getElementById("squadra").value || "Sconosciuta";
  let html = `<strong>Squadra:</strong> ${squadra}<br><br>`;
  parametri.forEach(p => {
    html += `${p.descrizione} (${p.codice}): ${stats[p.codice].length} → Minuti: [${stats[p.codice].join(", ")}]<br>`;
  });
  html += `<br><strong>Vitalità</strong><br>`;
  for (let ruolo in vitalita) {
    html += `${ruolo}: ${vitalita[ruolo]}<br>`;
  }
  document.getElementById("statistiche").innerHTML = html;
}

function salvaLocaleJSON() {
  const squadra = document.getElementById("squadra").value || "Sconosciuta";
  const payload = { squadra, stats, vitalita };
  const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `statistiche_${squadra}.json`;
  a.click();
}

function salvaLocaleCSV() {
  const squadra = document.getElementById("squadra").value || "Sconosciuta";
  let csv = `Squadra,Parametro,Minuto\n`;
  parametri.forEach(p => {
    stats[p.codice].forEach(min => {
      csv += `${squadra},${p.codice},${min}\n`;
    });
  });
  for (let ruolo in vitalita) {
    csv += `${squadra},VT_${ruolo},${vitalita[ruolo]}\n`;
  }
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `statistiche_${squadra}.csv`;
  a.click();
}

function inviaGoogle() {
  const squadra = document.getElementById("squadra").value || "Sconosciuta";
  const payload = { squadra, stats, vitalita };

  fetch("/", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.text())
  .then(msg => alert("Dati inviati!"))
  .catch(err => alert("Errore: " + err));
}

window.onload = () => {
  creaBottoni();
  aggiornaStatistiche();
};
