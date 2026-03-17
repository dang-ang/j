import { loadData } from "./dataLoader.js";
import { groupByGirone } from "./grouping.js";
import { computeKPI, computeGlobalKPI } from "./kpi.js";
import { generateNarrative } from "./narrative.js";
import { renderGironeChart, renderGlobalChart } from "./charts.js";
import { renderGirone, renderClassifica } from "./rendering.js";
import { initTabs } from "./tabs.js";

async function init() {
  const data = await loadData();

  const grouped = groupByGirone(data);

  const gironi = {};
  Object.keys(grouped).forEach(g => {
    gironi[g] = {
      ...grouped[g],
      kpi: computeKPI(grouped[g]),
      ...generateNarrative(grouped[g], g)
    };
  });

  const global = computeGlobalKPI(gironi);

  // render global
  renderGlobalChart(global);
  renderClassifica("classifica-global", data);

  // render gironi
  Object.keys(gironi).forEach(g => {
    renderGirone(g, gironi[g]);
    renderGironeChart(g, gironi[g]);
    renderClassifica(`classifica-${g}`, gironi[g].raw);
  });

  initTabs();
}

init();
