export function groupByGirone(data) {
  const gironi = {};
  data.forEach(row => {
    const g = row.Girone.replace("Girone ", "");
    if (!gironi[g]) gironi[g] = { squadre: [], punti: [], ppg: [], gf: [], gs: [], raw: [] };
    gironi[g].squadre.push(row.Squadra);
    gironi[g].punti.push(Number(row.Punti));
    gironi[g].ppg.push(Number(row.Punti) / Number(row.PG));
    gironi[g].gf.push(Number(row.GF));
    gironi[g].gs.push(Number(row.GS));
    gironi[g].raw.push(row);
  });
  return gironi;
}
