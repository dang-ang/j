const endpoint = "https://script.google.com/macros/s/AKfycbx00UVcT8Ae7d8ukZ9s-TJeL9HP5gAjP9L2KfL2tUZi0LbceKW2ePV-vFLn6SLXdcRONA/exec"; // ← sostituisci con il tuo URL Web App
let rawData = [], chartPlayers, chartSquadra, heatmapChart;

fetch(endpoint)
  .then(res => res.json())
  .then(data => {
    rawData = data;
    const players = [...new Set(data.map(d => d.name))];
    const select = document.getElementById("playerSelect");
    players.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      select.appendChild(opt);
    });
    renderCharts(); renderHeatmap();

    document.getElementById("viewMode").addEventListener("change", () => {
      renderCharts(); renderHeatmap();
    });
    document.getElementById("startDate").addEventListener("change", () => {
      renderCharts(); renderHeatmap();
    });
    document.getElementById("endDate").addEventListener("change", () => {
      renderCharts(); renderHeatmap();
    });
    select.addEventListener("change", () => {
      renderCharts(); renderHeatmap();
    });
  });

function selectAllPlayers() {
  const select = document.getElementById("playerSelect");
  for (const option of select.options) option.selected = true;
  renderCharts(); renderHeatmap();
}

function getLabel(ts, mode) {
  const d = new Date(ts);
  switch (mode) {
    case "day": return ts;
    case "week": return `W${Math.ceil(d.getDate()/7)}-${d.getMonth()+1}`;
    case "month": return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}`;
    case "year": return `${d.getFullYear()}`;
    default: return ts;
  }
}
function avg(arr) {
  return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : null;
}

function renderCharts() {
  const mode = document.getElementById("viewMode").value;
  const start = new Date(document.getElementById("startDate").value);
  const end = new Date(document.getElementById("endDate").value);
  const selected = Array.from(document.getElementById("playerSelect").selectedOptions).map(o => o.value);
  const grouped = {};

  rawData.forEach(e => {
    const date = new Date(e.timestamp);
    if ((start && date < start) || (end && date > end)) return;
    const label = getLabel(e.timestamp, mode);
    if (!grouped[label]) grouped[label] = {};
    if (!grouped[label][e.name]) grouped[label][e.name] = { rpe: [], pain: [], recovery: [] };
    grouped[label][e.name].rpe.push(+e.rpe);
    grouped[label][e.name].pain.push(+e.pain);
    grouped[label][e.name].recovery.push(+e.recovery);
  });

  const labels = Object.keys(grouped).sort();
  const colorMap = { rpe: "#0078D4", pain: "#E53935", recovery: "#43A047" };

  const playerDatasets = [];
  selected.forEach(name => {
    ["rpe", "pain", "recovery"].forEach(key => {
      playerDatasets.push({
        label: `${key.toUpperCase()} - ${name}`,
        data: labels.map(l => grouped[l][name] ? avg(grouped[l][name][key]) : null),
        borderColor: colorMap[key],
        fill: false
      });
    });
  });

  const teamDatasets = ["rpe","pain","recovery"].map(key => ({
    label: `Media Squadra - ${key.toUpperCase()}`,
    data: labels.map(l => {
      const all = Object.values(grouped[l] || {});
      const values = all.flatMap(p => p[key]);
      return avg(values);
    }),
    borderColor: colorMap[key],
    borderDash: [5, 5],
    fill: false
  }));

  if (chartPlayers) chartPlayers.destroy();
  chartPlayers = new Chart(document.getElementById("chartPlayers"), {
    type: "line",
    data: { labels, datasets: playerDatasets },
    options: {
      plugins: { title: { display: true, text: `Confronto Giocatori (${mode.toUpperCase()})` } },
      scales: { y: { beginAtZero: true, max: 10 } }
    }
  });

  if (chartSquadra) chartSquadra.destroy();
  chartSquadra = new Chart(document.getElementById("chartSquadra"), {
    type: "line",
    data: { labels, datasets: teamDatasets },
    options: {
      plugins: { title: { display: true, text: `Media Squadra (${mode.toUpperCase()})` } },
      scales: { y: { beginAtZero: true, max: 10 } }
    }
  });
}

function renderHeatmap() {
  const start = new Date(document.getElementById("startDate").value);
  const end = new Date(document.getElementById("endDate").value);
  const mode = document.getElementById("viewMode").value;
  const weekMap = {};

  rawData.forEach(d => {
    const ts = new Date(d.timestamp);
    if ((start && ts < start) || (end && ts > end)) return;
    const label = getLabel(d.timestamp, "week");
    if (!weekMap[label]) weekMap[label] = { rpe: [], pain: [], recovery: [] };
    weekMap[label].rpe.push(+d.rpe);
    weekMap[label].pain.push(+d.pain);
    weekMap[label].recovery.push(+d.recovery);
  });

  const labels = Object.keys(weekMap).sort();
  const datasets = ["rpe","pain","recovery"].map((key,i) => ({
    label: key.toUpperCase(),
    data: labels.map(l => avg(weekMap[l][key])),
    backgroundColor: labels.map(() => {
      const base = i * 80;
      return `rgba(${base + 50}, ${200 - i * 60}, ${150 + i * 20}, 0.6)`;
    }),
    borderWidth: 1
  }));

  if (heatmapChart) heatmapChart.destroy();
  heatmapChart = new Chart(document.getElementById("heatmapChart"), {
    type: "bar",
    data: {
      labels,
      datasets
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "📆 Heatmap Settimanale - Squadra"
        }
      },
      scales: {
        y: { beginAtZero: true, max: 10 },
        x: { title: { display: true, text: "Settimana" } }
      }
    }
  });
}

     
   function exportPNG(canvasId) {
      html2canvas(document.getElementById(canvasId)).then(canvas => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${canvasId}.png`;
        link.click();
      });
    }

    function exportPDF(canvasId) {
      html2canvas(document.getElementById(canvasId)).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("landscape");
        pdf.addImage(imgData, "PNG", 10, 10, 270, 160);
        pdf.save(`${canvasId}.pdf`);
      });
    }