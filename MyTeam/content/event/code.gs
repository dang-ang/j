// Assicurati che il foglio abbia intestazioni come: Squadra | Parametro | Minuto | Secondo | Tempo | Timestamp

function doGet() {
  return HtmlService.createHtmlOutputFromFile("index");
}

function doPost(e) {
  var sheet = SpreadsheetApp.openById("YOUR_SHEET_ID").getSheetByName("Foglio1");
  var data = JSON.parse(e.postData.contents);
  var timestamp = new Date();

  var squadra = data.squadra;
  var stats = data.stats;
  var vitalita = data.vitalita;

  for (var codice in stats) {
    for (var i = 0; i < stats[codice].length; i++) {
      var evento = stats[codice][i];
      // sheet.appendRow([squadra, codice, evento.minuto, "Tempo " + evento.tempo, timestamp]);
         sheet.appendRow([squadra, codice, evento.minuto, evento.secondo, "Tempo " + evento.tempo, timestamp]);
    }
  }

  for (var ruolo in vitalita) {
    sheet.appendRow([squadra, "VT_" + ruolo, vitalita[ruolo], "", timestamp]);
  }

  return ContentService.createTextOutput("OK");
}


