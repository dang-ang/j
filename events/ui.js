// ui.js
// costruzione pulsanti, dashboard, binding


// ui.js
import { getTipiEvento, getTotals, getEventLog,getDettagliEvento} from './events.js';



/**************************************************/

export function buildEventButtons_old() {
  const containerLocali = document.getElementById('eventiLocali');
  const containerOspiti = document.getElementById('eventiOspiti');
  containerLocali.innerHTML = '';
  containerOspiti.innerHTML = '';

  const tipi = getTipiEvento().filter(t => t !== 'PAUSA'); // PAUSA è di sistema

  tipi.forEach(tipo => {
    if (tipo === 'GOL' || tipo === 'CNL' || tipo === 'CNO') return; // gestiti a parte

    // -------------------------------
    /*
    const det = getDettagliEvento(tipo);

    btnL.innerHTML = `
      <div class="evento-btn">
        ${det.icona ? `<span class="ev-icona">${det.icona}</span>` : ""}
        <span class="ev-codice">${tipo}</span>
        <span class="ev-desc">${det.descrizione}</span>
      </div>
    `;
    */
    // -------------------------------

    const btnL = document.createElement('button');
    btnL.textContent = tipo;
    btnL.addEventListener('click', () => {
      import('./events.js').then(m => {
        m.registraEvento('locali', tipo);
        renderDashboard();
      });
    });
    containerLocali.appendChild(btnL);

    const btnO = document.createElement('button');
    btnO.textContent = tipo;
    btnO.addEventListener('click', () => {
      import('./events.js').then(m => {
        m.registraEvento('ospiti', tipo);
        renderDashboard();
      });
    });
    containerOspiti.appendChild(btnO);
  });

  // Gol dedicati
  const golLocali = document.createElement('button');
  golLocali.textContent = '⚽ Gol Locali ⚽';
  golLocali.addEventListener('click', () => {
    import('./events.js').then(m => {
      m.registraEvento('locali', 'GOL');
      renderDashboard();
    });
  });
  containerLocali.appendChild(golLocali);

  const golOspiti = document.createElement('button');
  golOspiti.textContent = '⚽ Gol Ospiti';
  golOspiti.addEventListener('click', () => {
    import('./events.js').then(m => {
      m.registraEvento('ospiti', 'GOL');
      renderDashboard();
    });
  });
  containerOspiti.appendChild(golOspiti);

  // Corner dedicati
  const cornerLocali = document.createElement('button');
  cornerLocali.textContent = '🏳️ Corner Locali🏳️';
  cornerLocali.addEventListener('click', () => {
    import('./events.js').then(m => {
      m.registraEvento('locali', 'CNL');
      renderDashboard();
    });
  });
  containerLocali.appendChild(cornerLocali);

  const cornerOspiti = document.createElement('button');
  cornerOspiti.textContent = '🏳️ Corner Ospiti';
  cornerOspiti.addEventListener('click', () => {
    import('./events.js').then(m => {
      m.registraEvento('ospiti', 'CNO');
      renderDashboard();
    });
  });
  containerOspiti.appendChild(cornerOspiti);
}



export function buildEventButtons() {
  const loc1 = document.querySelector('.col-loc-1');
  const loc2 = document.querySelector('.col-loc-2');
  const locFull = document.querySelector('.col-loc-full');

  const osp1 = document.querySelector('.col-osp-1');
  const osp2 = document.querySelector('.col-osp-2');
  const ospFull = document.querySelector('.col-osp-full');

  loc1.innerHTML = "";
  loc2.innerHTML = "";
  locFull.innerHTML = "";
  osp1.innerHTML = "";
  osp2.innerHTML = "";
  ospFull.innerHTML = "";

  const tipi = getTipiEvento();

  tipi.forEach(tipo => {
    const det = getDettagliEvento(tipo);

    const btnLoc = document.createElement('button');
    const btnOsp = document.createElement('button');

    btnLoc.classList.add("evento-btn");
    btnOsp.classList.add("evento-btn");

    /*
    const html = `
      ${det.icona ? `<span class="ev-icona">${det.icona}</span>` : ""}
      ${det.immagine ? `<img class="ev-img" src="${det.immagine}">` : ""}
      <span class="ev-codice">${tipo}</span>
      <span class="ev-desc">${det.descrizione}</span>
    `;
    */
     const html = `
      ${det.icona ? `<span class="ev-icona">${det.icona}</span>` : ""}
      <span class="ev-codice">${tipo}</span>
      <span class="ev-desc">${det.descrizione}</span>
    `;

    btnLoc.innerHTML = html;
    btnOsp.innerHTML = html;

    btnLoc.addEventListener('click', () => {
      import('./events.js').then(m => {
        m.registraEvento('locali', tipo);
        renderDashboard();
      });
    });

    btnOsp.addEventListener('click', () => {
      import('./events.js').then(m => {
        m.registraEvento('ospiti', tipo);
        renderDashboard();
      });
    });

    // POSIZIONAMENTO
    if (det.pos === 1) {
      loc1.appendChild(btnLoc);
      osp1.appendChild(btnOsp);
    } else if (det.pos === 2) {
      loc2.appendChild(btnLoc);
      osp2.appendChild(btnOsp);
    } else {
      locFull.appendChild(btnLoc);
      ospFull.appendChild(btnOsp);
    }
  });
}





/**************************************************/
export function renderDashboard() {
    // mostra la data nella dashboard
    document.getElementById('dataDisplay').textContent ="📅 Data partita: " + document.getElementById('dataPartita').value;

    // mostra i metadati della partita
    const data = document.getElementById('dataPartita').value;
    const categoria = document.getElementById('categoriaPartita').value;
    const girone = document.getElementById('gironePartita').value;
    const note = document.getElementById('notePartita').value;

    document.getElementById('tabellaEventi').innerHTML =
      `<p><strong>Data:</strong> ${data}</p>
      <p><strong>Categoria:</strong> ${categoria}</p>
      <p><strong>Girone:</strong> ${girone}</p>
      <p><strong>Note:</strong> ${note}</p>` +
      document.getElementById('tabellaEventi').innerHTML;

    renderRisultatoPartita(); // <--- NUOVO
    renderTotali();
    renderLog();
    renderTimeline();
    render15Min();
    renderHeatmap();
    renderMomentum();
  }




  /**************************************************/
  export function renderTotali_old() {
    const { locali, ospiti } = getTotals();
    const div = document.getElementById('tabellaEventi');

    let html = '<table><thead><tr><th>Evento</th><th>Locali</th><th>Ospiti</th></tr></thead><tbody>';

    Object.keys(locali).forEach(tipo => {
    //mostra codice e descrizione
    const det = getDettagliEvento(tipo);

      html += `<tr>
        <td>${det.icona ? det.icona + " " : ""}${tipo} - ${det.descrizione}</td>
        <td>${locali[tipo]}</td>
        <td>${ospiti[tipo]}</td>
      </tr>`;
    });

    html += '</tbody></table>';
    div.innerHTML = html;
  }

  // v1 _old manca istogramma proporzionale
  export function renderTotali_v1() {
    const { locali, ospiti } = getTotals();
    const div = document.getElementById('tabellaEventi');

    let html = `
      <table class="tabella-totali">
        <thead>
          <tr>
            <th>Evento</th>
            <th>Locali</th>
            <th>Ospiti</th>
          </tr>
        </thead>
        <tbody>
    `;

    Object.keys(locali).forEach(tipo => {
      const det = getDettagliEvento(tipo);

      const valLoc = locali[tipo];
      const valOsp = ospiti[tipo];
      const maxVal = Math.max(valLoc, valOsp, 1); // evita divisione per 0

      const percLoc = (valLoc / maxVal) * 100;
      const percOsp = (valOsp / maxVal) * 100;

      html += `
        <tr>
          <td>
            ${det.icona ? det.icona + " " : ""}
            ${tipo} - ${det.descrizione}
          </td>

          <td>
            <div>${valLoc}</div>
            <div class="bar-container">
              <div class="bar" style="width:${percLoc}%"></div>
            </div>
          </td>

          <td>
            <div>${valOsp}</div>
            <div class="bar-container">
              <div class="bar bar-ospiti" style="width:${percOsp}%"></div>
            </div>
          </td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    div.innerHTML = html;
  }


  // v2. con istogramma proporazionale
export function renderTotali_v2() {
  const { locali, ospiti } = getTotals();
  const div = document.getElementById('riepilogoTotali');

  let html = `
    <table class="tabella-totali">
      <thead>
        <tr>
          <th>Evento</th>
          <th>Locali</th>
          <th>Ospiti</th>
        </tr>
      </thead>
      <tbody>
  `;

  Object.keys(locali).forEach(tipo => {
    const det = getDettagliEvento(tipo);

    const valLoc = locali[tipo];
    const valOsp = ospiti[tipo];
    const maxVal = Math.max(valLoc, valOsp, 1);

    const percLoc = (valLoc / maxVal) * 100;
    const percOsp = (valOsp / maxVal) * 100;

    html += `
      <tr>
        <td>
          ${det.icona ? det.icona + " " : ""}
          ${tipo} - ${det.descrizione}
        </td>

        <td>
          <div>${valLoc}</div>
          <div class="bar-container">
            <div class="bar" style="width:${percLoc}%"></div>
          </div>
        </td>

        <td>
          <div>${valOsp}</div>
          <div class="bar-container">
            <div class="bar bar-ospiti" style="width:${percOsp}%"></div>
          </div>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  div.innerHTML = html;
}

// v3.
export function renderTotali() {
  const { locali, ospiti } = getTotals();
  const div = document.getElementById('tabellaEventi');

  if (!div) return; // evita errori se il div non esiste

  let html = `
    <table class="tabella-totali">
      <thead>
        <tr>
          <th>Evento</th>
          <th>Locali</th>
          <th>Ospiti</th>
          <th>Distribuzione %</th>
        </tr>
      </thead>
      <tbody>
  `;

  Object.keys(locali).forEach(tipo => {
    const det = getDettagliEvento(tipo);

    const valLoc = locali[tipo];
    const valOsp = ospiti[tipo];
    const totale = valLoc + valOsp;

    const percLoc = totale > 0 ? (valLoc / totale) * 100 : 0;
    const percOsp = totale > 0 ? (valOsp / totale) * 100 : 0;

    html += `
      <tr>
        <td>
          ${det.icona ? det.icona + " " : ""}
          ${tipo} - ${det.descrizione}
        </td>

        <td>${valLoc} (${percLoc.toFixed(1)}%)</td>
        <td>${valOsp} (${percOsp.toFixed(1)}%)</td>

        <td>
          <div class="stack-container">
            <div class="stack-bar locali" style="width:${percLoc}%"></div>
            <div class="stack-bar ospiti" style="width:${percOsp}%"></div>
          </div>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  div.innerHTML = html;
}



/**************************************************/
export function renderLog() {
  const log = getEventLog();
  const div = document.getElementById('logEventi');

  if (log.length === 0) {
    div.innerHTML = '<p>Nessun evento registrato.</p>';
    return;
  }

  let html = '<table><thead><tr><th>#</th><th>Squadra</th><th>Evento</th><th>Tempo</th><th>Secondi</th><th>Blocco</th></tr></thead><tbody>';

  log.forEach((e, idx) => {
    const isGol = e.tipo === 'GOL';
    html += `<tr style="${isGol ? 'background:#d4ffd4;font-weight:bold' : ''}">
      <td>${idx + 1}</td>
      <td>${e.squadra}</td>
      <td>${getDettagliEvento(e.tipo).descrizione}</td>
      <td>${e.tempo}</td>
      <td>${e.secondi}</td>
      <td>${e.blocco}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  div.innerHTML = html;
}



/**************************************************/
export function renderTimeline() {
  const log = getEventLog();
  const div = document.getElementById('timelineEventi');

  const filtroSquadra = document.getElementById('filtroSquadra').value;
  const filtroTempo = document.getElementById('filtroTempo').value;
  const filtroEvento = document.getElementById('filtroEvento').value;

  let filtrati = log;

  if (filtroSquadra !== 'tutte') {
    filtrati = filtrati.filter(e => e.squadra === filtroSquadra);
  }

  if (filtroTempo !== 'tutti') {
    filtrati = filtrati.filter(e => String(e.tempo) === filtroTempo);
  }

  if (filtroEvento !== 'tutti') {
    filtrati = filtrati.filter(e => e.tipo === filtroEvento);
  }

  if (filtrati.length === 0) {
    div.innerHTML = '<p>Nessun evento corrisponde ai filtri.</p>';
    return;
  }

  let html = '';

  filtrati.forEach(e => {
    let classe = e.squadra;
    if (e.tipo === 'GOL') classe += ' gol';
    if (e.squadra !== 'locali' && e.squadra !== 'ospiti') classe = 'sistema';

    //mostra codice e descrizione
    const det = getDettagliEvento(e.tipo);

    html += `
      <div class="timeline-row ${classe}">
        <div class="timeline-time">${Math.floor(e.secondi/60)}'</div>
        <div class="timeline-evento"> ${det.icona ? det.icona + " " : ""} ${det.descrizione} </div>
        <div class="timeline-squadra">${e.squadra}</div>
      </div>
    `;
  });

  div.innerHTML = html;
}

/**************************************************/
export function render15Min() {
  const log = getEventLog();
  const div = document.getElementById('tabella15');

  if (log.length === 0) {
    div.innerHTML = '<p>Nessun evento registrato.</p>';
    return;
  }

  const gruppi = {};
  log.forEach(e => {
    if (!gruppi[e.blocco]) gruppi[e.blocco] = [];
    gruppi[e.blocco].push(e);
  });

  let html = '<table><thead><tr><th>Blocco</th><th>Locali</th><th>Ospiti</th></tr></thead><tbody>';

  Object.keys(gruppi).forEach(blocco => {
    const eventi = gruppi[blocco];

    const locali = eventi.filter(e => e.squadra === 'locali').length;
    const ospiti = eventi.filter(e => e.squadra === 'ospiti').length;

    html += `
      <tr>
        <td>${blocco} (min ${(blocco-1)*15}–${blocco*15 - 1})</td>
        <td>${locali}</td>
        <td>${ospiti}</td>
      </tr>
    `;
  });

  html += '</tbody></table>';
  div.innerHTML = html;
}


/**************************************************/
export function renderHeatmap() {
  const log = getEventLog();
  const div = document.getElementById('heatmapEventi');

  if (log.length === 0) {
    div.innerHTML = '<p>Nessun evento registrato.</p>';
    return;
  }

  const gruppi = {};
  log.forEach(e => {
    if (!gruppi[e.blocco]) gruppi[e.blocco] = 0;
    gruppi[e.blocco]++;
  });

  const maxVal = Math.max(...Object.values(gruppi));

  let html = '';

  Object.keys(gruppi).forEach(blocco => {
    const val = gruppi[blocco];
    const perc = maxVal > 0 ? (val / maxVal) * 100 : 0;

    html += `
      <div class="heatmap-row">
        <div class="heatmap-label">Blocco ${blocco}</div>
        <div class="heatmap-bar">
          <div class="heatmap-fill" style="width:${perc}%;"></div>
        </div>
        <div style="width:40px;text-align:right;font-size:12px;">${val}</div>
      </div>
    `;
  });

  div.innerHTML = html;
}



/**************************************************/
export function renderMomentum() {
  const log = getEventLog();
  const div = document.getElementById('momentumEventi');

  if (log.length === 0) {
    div.innerHTML = '<p>Nessun evento registrato.</p>';
    return;
  }

  // finestra di 5 minuti (300 sec)
  const finestra = 300;

  // calcoliamo per blocchi di 5 minuti
  const maxSecondi = Math.max(...log.map(e => e.secondi));
  const blocchi = [];

  for (let start = 0; start <= maxSecondi; start += finestra) {
    const end = start + finestra - 1;
    const eventiFinestra = log.filter(e => e.secondi >= start && e.secondi <= end);

    const locali = eventiFinestra.filter(e => e.squadra === 'locali').length;
    const ospiti = eventiFinestra.filter(e => e.squadra === 'ospiti').length;

    blocchi.push({
      start,
      end,
      locali,
      ospiti
    });
  }

  const maxVal = Math.max(...blocchi.map(b => Math.max(b.locali, b.ospiti)), 1);

  let html = '';

  blocchi.forEach(b => {
    const percL = (b.locali / maxVal) * 100;
    const percO = (b.ospiti / maxVal) * 100;

    html += `
      <div class="momentum-row">
        <div class="momentum-label">${Math.floor(b.start/60)}'–${Math.floor(b.end/60)}'</div>
        <div class="momentum-bar">
          <div class="momentum-fill-locali" style="width:${percL}%;"></div>
        </div>
        <div style="width:30px;text-align:right;font-size:12px;">${b.locali}</div>
      </div>
      <div class="momentum-row">
        <div class="momentum-label"></div>
        <div class="momentum-bar">
          <div class="momentum-fill-ospiti" style="width:${percO}%;"></div>
        </div>
        <div style="width:30px;text-align:right;font-size:12px;">${b.ospiti}</div>
      </div>
    `;
  });

  div.innerHTML = html;
}




// Calcolo gol per tempo e globale
export function renderRisultatoPartita() {
  const log = getEventLog();

  let golL1 = 0, golO1 = 0;
  let golL2 = 0, golO2 = 0;

  log.forEach(ev => {
    if (ev.tipo !== "GOL") return;

    if (ev.tempo === 1) {
      if (ev.squadra === "locali") golL1++;
      if (ev.squadra === "ospiti") golO1++;
    }

    if (ev.tempo === 2) {
      if (ev.squadra === "locali") golL2++;
      if (ev.squadra === "ospiti") golO2++;
    }
  });

  const golL = golL1 + golL2;
  const golO = golO1 + golO2;

  const div = document.getElementById("risultatoPartita");

  div.innerHTML = `
    <table class="tabella-risultato">
      <thead>
        <tr>
          <th></th>
          <th>Locali</th>
          <th>Ospiti</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1° Tempo</td>
          <td>${golL1}</td>
          <td>${golO1}</td>
        </tr>
        <tr>
          <td>2° Tempo</td>
          <td>${golL2}</td>
          <td>${golO2}</td>
        </tr>
        <tr class="totale">
          <td>Totale</td>
          <td>${golL}</td>
          <td>${golO}</td>
        </tr>
      </tbody>
    </table>
  `;
}
