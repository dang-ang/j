var graficoEventiChart = null; // distruggi grafico x rinfrescare

var parametri = [
  { codice: "TP", descrizione: "Tiro in Porta" },
  { codice: "TF", descrizione: "Tiro Fuori" },
  { codice: "FF", descrizione: "Fallo Fatto" },
  { codice: "FS", descrizione: "Fallo Subito" },
  { codice: "PF", descrizione: "Passaggio Buono" },
  { codice: "PX", descrizione: "Passaggio Sbagliato" }
];


// var stats = {};
// gestione multi squadra_eventi
var stats = {
  squadra1: { TP: [], TF: [] },
  squadra2: { TP: [], TF: [] }
};


// var vitalita = { portiere: 0, difesa: 0, centrocampo: 0, attacco: 0 };
var vitalita = {
  portiere: [],
  difesa: [],
  centrocampo: [],
  attacco: []
};


function init() {
  for (var i = 0; i < parametri.length; i++) {
    stats[parametri[i].codice] = [];
  }
  creaBottoni();
  aggiornaStatistiche();
}


var GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyNYqRpKA2txADHLPr-EczpOUsmZHpT2RtPvF2OLdrl_OvxSXme2pB4P5gn1qUrtZDOqw/exec";

// ----------------------------------------------------------------------

var startTime = null;
var cronometroInterval = null;
var tempo = 1;
var tempoTotaleMs = 0;


function startCronometro() {
  if (!startTime) startTime = new Date().getTime();
  cronometroInterval = setInterval(aggiornaCronometro, 1000);
}

function stopCronometro() {
  if (startTime) {
    var now = new Date().getTime();
    tempoTotaleMs += now - startTime;
    startTime = null;
  }
  clearInterval(cronometroInterval);
  aggiornaTempoTotale();
}

function resetCronometro() {
  clearInterval(cronometroInterval);
  startTime = null;
  tempoTotaleMs = 0;
  document.getElementById("cronometro").innerHTML = "00:00";
  document.getElementById("tempoTotale").innerHTML = "Tempo totale: 00:00";
}

function setTempo(t) {
  tempo = t;
  document.getElementById("tempoCorrente").innerHTML = "Tempo: " + tempo;
}


function aggiornaCronometro() {
  if (!startTime) return;
  var elapsed = new Date().getTime() - startTime;
  var min = Math.floor(elapsed / 60000);
  var sec = Math.floor((elapsed % 60000) / 1000);
  document.getElementById("cronometro").innerHTML =
    (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
}

function aggiornaTempoTotale() {
  var totale = tempoTotaleMs;
  if (startTime) {
    totale += new Date().getTime() - startTime;
  }
  var min = Math.floor(totale / 60000);
  var sec = Math.floor((totale % 60000) / 1000);
  document.getElementById("tempoTotale").innerHTML =
    "Tempo totale: " + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
}

// ----------------------------------------------------------------------
function creaBottoni() {
  /* --- > unica squadra
  var container = document.getElementById("bottoni");
  for (var i = 0; i < parametri.length; i++) {
    var btn = document.createElement("button");
    btn.innerHTML = parametri[i].descrizione;
    btn.setAttribute("onclick", "registra('" + parametri[i].codice + "')");
    container.appendChild(btn);
  }
  */

  var container = document.getElementById("bottoni");
  container.innerHTML = "";

  for (var i = 0; i < parametri.length; i++) {
    var wrapper = document.createElement("div");
    wrapper.className = "evento-wrapper";

    var label = document.createElement("span");
    label.className = "evento-label";
    label.innerText = parametri[i].descrizione;
    wrapper.appendChild(label);

    var btn1 = document.createElement("button");
    btn1.innerText = "S1";
    btn1.className = "btn-s1";
    btn1.onclick = (function(codice) {
      return function() {
        registraEventoSquadra(codice, "squadra1");
      };
    })(parametri[i].codice);
    wrapper.appendChild(btn1);

    var btn2 = document.createElement("button");
    btn2.innerText = "S2";
    btn2.className = "btn-s2";
    btn2.onclick = (function(codice) {
      return function() {
        registraEventoSquadra(codice, "squadra2");
      };
    })(parametri[i].codice);
    wrapper.appendChild(btn2);

    container.appendChild(wrapper);
  }

}


function registra(codice) {
  if (!startTime) {
    alert("Avvia il cronometro prima!");
    return;
  }
  var elapsed = new Date().getTime() - startTime;
  var minuto = Math.floor(elapsed / 60000);
  var secondo = Math.floor((elapsed % 60000) / 1000);
  stats[codice].push({ minuto: minuto, secondo: secondo, tempo: tempo });

  aggiornaStatistiche();
  aggiornaVisualizzazione(); // ← aggiunto
}

function registraVitalita(ruolo) {
  // vitalita[ruolo]++;
 if (!startTime) {
    alert("Avvia il cronometro prima!");
    return;
  }
  var elapsed = new Date().getTime() - startTime;
  var minuto = Math.floor(elapsed / 60000);
  var secondo = Math.floor((elapsed % 60000) / 1000);
  vitalita[ruolo].push({ minuto: minuto, secondo: secondo, tempo: tempo });

  aggiornaStatistiche();
  aggiornaVisualizzazione(); // ← aggiunto
}

function aggiornaStatistiche() {
  var squadra = document.getElementById("squadra").value || "Sconosciuta";
  var html = "<strong>Squadra:</strong> " + squadra + "<br><br>";
  for (var i = 0; i < parametri.length; i++) {
    var codice = parametri[i].codice;
    var eventi = stats[codice];
    var descrizioni = [];
    for (var j = 0; j < eventi.length; j++) {
      // descrizioni.push("[" + eventi[j].minuto + "' T" + eventi[j].tempo + "]");
        var e = eventi[j];
        descrizioni.push("[" + e.minuto + "′" + (e.secondo < 10 ? ":0" : ":") + e.secondo + " T" + e.tempo + "]");
    }
    html += parametri[i].descrizione + " (" + codice + "): " +
      eventi.length + " → " + descrizioni.join(", ") + "<br>";
  }
  html += "<br><strong>Vitalità</strong><br>";
  /*
  for (var ruolo in vitalita) {
    html += ruolo + ": " + vitalita[ruolo] + "<br>";
  }
  */
    for (var ruolo in vitalita) {
    var eventi = vitalita[ruolo];
    var descrizioni = [];
    for (var i = 0; i < eventi.length; i++) {
        var e = eventi[i];
        descrizioni.push("[" + e.minuto + "′" + (e.secondo < 10 ? ":0" : ":") + e.secondo + " T" + e.tempo + "]");
    }
    html += ruolo + ": " + eventi.length + " → " + descrizioni.join(", ") + "<br>";
    }

  document.getElementById("statistiche").innerHTML = html;
}


// ----------------------------------------
function salvaCSV() {
  var squadra = document.getElementById("squadra").value || "Sconosciuta";
  var totaleMin = Math.floor(tempoTotaleMs / 60000);
  var totaleSec = Math.floor((tempoTotaleMs % 60000) / 1000);

  var csv = "Squadra,Parametro,Minuto,Secondo,Tempo\n";
  for (var i = 0; i < parametri.length; i++) {
    var codice = parametri[i].codice;
    var eventi = stats[codice];
    for (var j = 0; j < eventi.length; j++) {
      csv += squadra + "," + codice + "," + e.minuto + "," + e.secondo + "," + e.tempo + "\n";
   }
  }
  /*
  for (var ruolo in vitalita) {
    csv += squadra + ",VT_" + ruolo + "," + vitalita[ruolo] + ",\n";
  }
 */
    for (var ruolo in vitalita) {
    var eventi = vitalita[ruolo];
    for (var i = 0; i < eventi.length; i++) {
        var e = eventi[i];
        csv += squadra + ",VT_" + ruolo + "," + e.minuto + "," + e.secondo + "," + e.tempo + "\n";
    }
    }

    csv += "Tempo totale,,," + totaleMin + "," + totaleSec + "\n";

    var uri = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    var link = document.createElement("a");
  
    link.setAttribute("href", uri);
  link.setAttribute("download", "statistiche_" + squadra + ".csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


// ----------------------
function salvaJSON() {
  var squadra = document.getElementById("squadra").value || "Sconosciuta";
  var totaleMin = Math.floor(tempoTotaleMs / 60000);
  var totaleSec = Math.floor((tempoTotaleMs % 60000) / 1000);

  var payload = {
    squadra: squadra,
    stats: stats,
    vitalita: vitalita,
    tempoTotale: {
      minuti: totaleMin,
      secondi: totaleSec
    }

  };

   var json = JSON.stringify(payload);
   var uri = "data:application/json;charset=utf-8," + encodeURIComponent(json);

  var link = document.createElement("a");
      link.setAttribute("href", uri);
      link.setAttribute("download", "statistiche_" + squadra + ".json");
        document.body.appendChild(link);
      link.click();
        document.body.removeChild(link);
}



// ---------------------------------
function inviaGoogle_post() {
  var squadra = document.getElementById("squadra").value || "Sconosciuta";
  var payload = {
    squadra: squadra,
    stats: stats,
    vitalita: vitalita
  };

  var xhr = new XMLHttpRequest();
  xhr.open("POST",  GAS_WEB_APP_URL, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      alert("Dati inviati!");
    }
  };
  xhr.send(JSON.stringify(payload));
}


//  ********************************************************************
function inviaGoogle() {
  var squadra = document.getElementById("squadra").value || "Sconosciuta";
  var totaleMin = Math.floor(tempoTotaleMs / 60000);
  var totaleSec = Math.floor((tempoTotaleMs % 60000) / 1000);

  var dati = {
    squadra: squadra,
    stats: JSON.stringify(stats),
    vitalita: JSON.stringify(vitalita),
    totaleMin: JSON.stringify(totaleMin),
    totaleSec: JSON.stringify(totaleSec),
  };

  var query = "?squadra=" + encodeURIComponent(dati.squadra) +
              "&stats=" + encodeURIComponent(dati.stats) +
              "&vitalita=" + encodeURIComponent(dati.vitalita)+
              "&totaleMin=" + encodeURIComponent(dati.totaleMin)+
              "&totaleSec=" + encodeURIComponent(dati.totaleSec);

  var xhr = new XMLHttpRequest();
  xhr.open("GET", GAS_WEB_APP_URL + query, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      alert("Dati inviati!");
    }
  };
  xhr.send();
}


/*  xx Chart */
function generaTabellaEventi(dati) {
  var html = "<table><tr><th>Evento</th><th>1° Tempo</th><th>2° Tempo</th><th>Totale</th></tr>";
  for (var tipo in dati) {
    var tempo1 = dati[tipo].filter(e => e.tempo === 1).length;
    var tempo2 = dati[tipo].filter(e => e.tempo === 2).length;
    var totale = tempo1 + tempo2;
    html += `<tr><td>${tipo}</td><td>${tempo1}</td><td>${tempo2}</td><td>${totale}</td></tr>`;
  }
  html += "</table>";
  document.getElementById("tabellaEventi").innerHTML = html;
}

function generaGraficoEventi(dati) {

  // Distruggi grafico precedente se esiste
  if (graficoEventiChart) {
    graficoEventiChart.destroy();
    graficoEventiChart = null;
  }

  var etichette = Array.from({length: 20}, (_, i) => i); // minuti 0–19
  var datasets = [];

  for (var tipo in dati) {
    var serie1 = Array(20).fill(0);
    var serie2 = Array(20).fill(0);

    dati[tipo].forEach(e => {
      if (e.minuto < 20) {
        if (e.tempo === 1) serie1[e.minuto]++;
        else if (e.tempo === 2) serie2[e.minuto]++;
      }
    });

    // cumulativo
    for (var i = 1; i < 20; i++) {
      serie1[i] += serie1[i - 1];
      serie2[i] += serie2[i - 1];
    }

    datasets.push({
      label: tipo + " (T1)",
      data: serie1,
      borderColor: randomColor(),
      fill: false
    });
    datasets.push({
      label: tipo + " (T2)",
      data: serie2,
      borderColor: randomColor(),
      borderDash: [5, 5],
      fill: false
    });
  }

 graficoEventiChart = new Chart(document.getElementById("graficoEventi"), {
    type: "line",
    data: {
      labels: etichette,
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "Andamento cumulativo degli eventi" }
      }
    }
  });
}

function randomColor() {
  return "hsl(" + Math.floor(Math.random() * 360) + ", 70%, 50%)";
}




function aggiornaVisualizzazione() {
  var unificato = Object.assign({}, stats);

  // integra vitalità come eventi
  for (var ruolo in vitalita) {
    unificato["VT_" + ruolo] = vitalita[ruolo];
  }

  /* -- eventi x singola squadra
  generaTabellaEventi(unificato);
  // generaGraficoEventi(unificato);  // unico 
  generaGraficiSeparati(unificato); // ← usa questa  x multi chart
  */

  /* x multi squadra_evento */
  generaTabellaEventiDoppia(stats);
  generaGraficiSeparatiDoppia(stats);
 

}

/* end xx Cjart  */





/* x grafici separti per evento  */
var graficiPerEvento = {}; // per tenere traccia dei grafici attivi

function generaGraficiSeparati(dati) {
  var container = document.getElementById("graficiEventi");
  container.innerHTML = ""; // pulisci tutto

  for (var tipo in dati) {
    var idCanvas = "grafico_" + tipo;
    var canvas = document.createElement("canvas");
    canvas.id = idCanvas;
    canvas.style.marginBottom = "30px";
    canvas.height = 300;
    container.appendChild(canvas);

    // distruggi grafico precedente se esiste
    if (graficiPerEvento[tipo]) {
      graficiPerEvento[tipo].destroy();
      graficiPerEvento[tipo] = null;
    }

    var serie1 = Array(20).fill(0);
    var serie2 = Array(20).fill(0);

    dati[tipo].forEach(e => {
      if (e.minuto < 20) {
        if (e.tempo === 1) serie1[e.minuto]++;
        else if (e.tempo === 2) serie2[e.minuto]++;
      }
    });

    for (var i = 1; i < 20; i++) {
      serie1[i] += serie1[i - 1];
      serie2[i] += serie2[i - 1];
    }

    graficiPerEvento[tipo] = new Chart(document.getElementById(idCanvas), {
      type: "line",
      data: {
        labels: Array.from({ length: 20 }, (_, i) => i),
        datasets: [
          {
            label: tipo + " (T1)",
            data: serie1,
            borderColor: randomColor(),
            fill: false
          },
          {
            label: tipo + " (T2)",
            data: serie2,
            borderColor: randomColor(),
            borderDash: [5, 5],
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          title: { display: true, text: "Evento: " + tipo }
        },
        scales: {
          x: { title: { display: true, text: "Minuto" } },
          // solo valori interi
          // y: { title: { display: true, text: "Eventi cumulati" }, beginAtZero: true }
          y: {
            title: { display: true, text: "Eventi cumulati" },
            beginAtZero: true,
            ticks: {
                stepSize: 1,
                callback: function(value) {
                return Number.isInteger(value) ? value : null;
                }
             }
           }



        }
      }
    });
  }
}

function randomColor() {
  return "hsl(" + Math.floor(Math.random() * 360) + ", 70%, 50%)";
}


/*  x gestione multi squadara_eventi */

function registraEventoSquadra(codice, squadra) {
  if (!startTime) {
    alert("Avvia il cronometro prima!");
    return;
  }
  var elapsed = new Date().getTime() - startTime;
  var minuto = Math.floor(elapsed / 60000);
  var secondo = Math.floor((elapsed % 60000) / 1000);

  if (!stats[squadra][codice]) stats[squadra][codice] = [];
  stats[squadra][codice].push({ minuto: minuto, secondo: secondo, tempo: tempo });

  aggiornaVisualizzazione();
}


function generaTabellaEventiDoppia(stats) {
  var html = "<table><tr><th>Evento</th><th>S1 T1</th><th>S1 T2</th><th>S2 T1</th><th>S2 T2</th><th>Totale</th></tr>";
  var tipi = ["TP", "TF"];

  tipi.forEach(tipo => {
    var s1t1 = stats.squadra1[tipo]?.filter(e => e.tempo === 1).length || 0;
    var s1t2 = stats.squadra1[tipo]?.filter(e => e.tempo === 2).length || 0;
    var s2t1 = stats.squadra2[tipo]?.filter(e => e.tempo === 1).length || 0;
    var s2t2 = stats.squadra2[tipo]?.filter(e => e.tempo === 2).length || 0;
    var totale = s1t1 + s1t2 + s2t1 + s2t2;

    html += `<tr><td>${tipo}</td><td>${s1t1}</td><td>${s1t2}</td><td>${s2t1}</td><td>${s2t2}</td><td>${totale}</td></tr>`;
  });

  html += "</table>";
  document.getElementById("tabellaEventi").innerHTML = html;
}


function generaGraficiSeparatiDoppia(stats) {
  var container = document.getElementById("graficiEventi");
  container.innerHTML = "";

  ["TP", "TF"].forEach(tipo => {
    var idCanvas = "grafico_" + tipo;
    var canvas = document.createElement("canvas");
    canvas.id = idCanvas;
    canvas.height = 300;
    canvas.style.marginBottom = "30px";
    container.appendChild(canvas);

    var serie = {
      S1_T1: Array(20).fill(0),
      S1_T2: Array(20).fill(0),
      S2_T1: Array(20).fill(0),
      S2_T2: Array(20).fill(0)
    };

    stats.squadra1[tipo]?.forEach(e => {
      if (e.minuto < 20) {
        if (e.tempo === 1) serie.S1_T1[e.minuto]++;
        else serie.S1_T2[e.minuto]++;
      }
    });

    stats.squadra2[tipo]?.forEach(e => {
      if (e.minuto < 20) {
        if (e.tempo === 1) serie.S2_T1[e.minuto]++;
        else serie.S2_T2[e.minuto]++;
      }
    });

    // cumulativo
    for (var i = 1; i < 20; i++) {
      for (var key in serie) {
        serie[key][i] += serie[key][i - 1];
      }
    }

    new Chart(document.getElementById(idCanvas), {
      type: "line",
      data: {
        labels: Array.from({ length: 20 }, (_, i) => i),
        datasets: [
          { label: "S1 T1", data: serie.S1_T1, borderColor: "blue", fill: false },
          { label: "S1 T2", data: serie.S1_T2, borderColor: "blue", borderDash: [5, 5], fill: false },
          { label: "S2 T1", data: serie.S2_T1, borderColor: "red", fill: false },
          { label: "S2 T2", data: serie.S2_T2, borderColor: "red", borderDash: [5, 5], fill: false }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          title: { display: true, text: "Evento: " + tipo }
        },
        scales: {
          x: { title: { display: true, text: "Minuto" } },
          y: {
            title: { display: true, text: "Eventi cumulati" },
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: v => Number.isInteger(v) ? v : null
            }
          }
        }
      }
    });
  });
}

