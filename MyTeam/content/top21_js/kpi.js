export function computeKPI(g) {
  const avg = arr => arr.reduce((a,b)=>a+b,0) / arr.length;
  return {
    ppgMedio: avg(g.ppg).toFixed(2),
    gfMedio: avg(g.gf).toFixed(1),
    gsMedio: avg(g.gs).toFixed(1),
    grMedio: (avg(g.gf) / Math.max(avg(g.gs), 0.1)).toFixed(2)
  };
}

export function computeGlobalKPI(gironi) {
  const keys = Object.keys(gironi);
  const avg = arr => arr.reduce((a,b)=>a+b,0) / arr.length;

  const ppg = keys.map(k => Number(gironi[k].kpi.ppgMedio));
  const gf = keys.map(k => Number(gironi[k].kpi.gfMedio));
  const gs = keys.map(k => Number(gironi[k].kpi.gsMedio));

  return {
    gironi: keys,
    ppg, gf, gs,
    ppgMedio: avg(ppg).toFixed(2),
    gfMedio: avg(gf).toFixed(1),
    gsMedio: avg(gs).toFixed(1)
  };
}
