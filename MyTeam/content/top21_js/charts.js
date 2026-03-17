export function renderGironeChart(id, data) {
  new Chart(document.getElementById(`chart${id}`), {
    type: 'bar',
    data: {
      labels: data.squadre,
      datasets: [
        { label: "PPG", data: data.ppg, backgroundColor: "#0078ff88" },
        { label: "GF", data: data.gf, backgroundColor: "#00cc8888" },
        { label: "GS", data: data.gs, backgroundColor: "#ff444488" }
      ]
    }
  });
}

export function renderGlobalChart(global) {
  new Chart(document.getElementById("chartGlobal"), {
    type: "line",
    data: {
      labels: global.gironi,
      datasets: [
        { label: "PPG Medio", data: global.ppg, borderColor: "#0078ff", fill: false },
        { label: "GF Medio", data: global.gf, borderColor: "#00cc88", fill: false },
        { label: "GS Medio", data: global.gs, borderColor: "#ff4444", fill: false }
      ]
    }
  });
}
