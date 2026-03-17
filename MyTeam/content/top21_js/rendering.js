export function renderGirone(id, data) {
  document.querySelector(`[data-${id}-kpi="ppg"]`).textContent = data.kpi.ppgMedio;
  document.querySelector(`[data-${id}-kpi="gf"]`).textContent = data.kpi.gfMedio;
  document.querySelector(`[data-${id}-kpi="gs"]`).textContent = data.kpi.gsMedio;

  document.querySelector(`[data-${id}="trend"]`).textContent = `
• Dominanza/equilibrio: ${data.strutturaGirone}
• Polarizzazione: ${data.descrizioneTop}
• Range GF: ${data.midGFRange}
• Range GS: ${data.midGSRange}
• Stabilità: ${data.stabilita}
  `.trim();

  document.querySelector(`[data-${id}="anomalie"]`).textContent =
    data.anomalie.map(a => "• " + a).join("\n");

  document.querySelector(`[data-${id}="kpi"]`).textContent = `
• PPG medio: ${data.kpi.ppgMedio}
• GF medio: ${data.kpi.gfMedio}
• GS medio: ${data.kpi.gsMedio}
• Goal Ratio: ${data.kpi.grMedio}
  `.trim();

  document.querySelector(`[data-${id}="commento"]`).textContent = `
Il Girone ${id} si caratterizza per ${data.identitaTattica}.
Le squadre top mostrano ${data.caratteristicaTop},
la zona centrale soffre di ${data.caratteristicaMid},
le squadre di coda evidenziano ${data.criticitaBottom}.
  `.trim();
}

export function renderClassifica(containerId, rows) {
  const div = document.getElementById(containerId);
  let html = `<table><tr><th>Squadra</th><th>Punti</th><th>PG</th><th>GF</th><th>GS</th><th>DR</th></tr>`;
  rows.forEach(r => {
    html += `<tr>
      <td>${r.Squadra}</td>
      <td>${r.Punti}</td>
      <td>${r.PG}</td>
      <td>${r.GF}</td>
      <td>${r.GS}</td>
      <td>${r.DR}</td>
    </tr>`;
  });
  html += `</table>`;
  div.innerHTML = html;
}
