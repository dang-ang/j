var parametri = [
  { codice: "TP", descrizione: "Tiro in Porta" },
  { codice: "TF", descrizione: "Tiro Fuori" },
  { codice: "FF", descrizione: "Fallo Fatto" },
  { codice: "FS", descrizione: "Fallo Subito" },
  { codice: "PF", descrizione: "Passaggio Buono" },
  { codice: "PX", descrizione: "Passaggio Sbagliato" }
];

var stats = {};
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


var GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzT4RkapILVzkS4ZxgUp9iSxpJeGT-9UsbRBzJ-xtuhBgGOrX2tjyyx-FW57l0I4P_Tig/exec";

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
  var container = document.getElementById("bottoni");
  for (var i = 0; i < parametri.length; i++) {
    var btn = document.createElement("button");
    btn.innerHTML = parametri[i].descrizione;
    btn.setAttribute("onclick", "registra('" + parametri[i].codice + "')");
    container.appendChild(btn);
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
