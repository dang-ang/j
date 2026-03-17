export function generateNarrative(g, label) {
  const maxPPG = Math.max(...g.ppg);
  const minPPG = Math.min(...g.ppg);

  const struttura =
    maxPPG - minPPG > 1.5 ? "fortemente polarizzata" :
    maxPPG - minPPG > 0.8 ? "moderatamente equilibrata" :
    "molto equilibrata";

  const anomalie = [];

  g.raw.forEach(s => {
    if (Number(s.DR) > 40 && Number(s.Punti) < 25)
      anomalie.push(`${s.Squadra}: DR molto alta ma pochi punti`);
  });

  if (anomalie.length === 0) anomalie.push("Nessuna anomalia rilevante");

  return {
    strutturaGirone: struttura,
    descrizioneTop: "le squadre di vertice mostrano continuità e superiorità tecnica",
    midGFRange: `${Math.min(...g.gf)}–${Math.max(...g.gf)}`,
    midGSRange: `${Math.min(...g.gs)}–${Math.max(...g.gs)}`,
    stabilita: maxPPG > 2 ? "alta nelle prime posizioni" : "variabile",
    anomalie,
    identitaTattica: "ritmi alti e forte verticalità",
    caratteristicaTop: "efficienza offensiva e solidità difensiva",
    caratteristicaMid: "incostanza nei momenti chiave",
    criticitaBottom: "gap fisico e organizzativo",
    label
  };
}
 