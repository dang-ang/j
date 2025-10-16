function doGet() {
  return HtmlService.createHtmlOutputFromFile("index");
}

function doPost(e) {
  const sheet = SpreadsheetApp.openById("YOUR_SHEET_ID").getSheetByName("Foglio1");
  const data = JSON.parse(e.postData.contents);
  const timestamp = new Date();

  const squadra = data.squadra;
  const stats = data.stats;
  const vitalita = data.vitalita;

  for (let codice in stats) {
    stats[codice].forEach(minuto => {
      sheet.appendRow([squadra, codice, minuto, "", timestamp]);
    });
  }

  for (let ruolo in vitalita) {
    sheet.appendRow([squadra, `VT_${ruolo}`, vitalita[ruolo], "", timestamp]);
  }

  return ContentService.createTextOutput("OK");
}
