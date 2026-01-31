// timer.js
// gestione cronometro + tempi

// timer.js
let timer = null;
let secondiTotali = 0;
let timerRunning = false;
let tempoCorrente = 1; // 1 o 2
let primoTempoChiuso = false;
let partitaFinita = false;

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export function initTimer() {
  const cronometro = document.getElementById('cronometro');
  cronometro.textContent = formatTime(secondiTotali);
  document.getElementById('tempoCorrente').textContent = `Tempo: ${tempoCorrente}`;
}

export function isTimerRunning() {
  return timerRunning;
}

export function getCurrentSeconds() {
  return secondiTotali;
}

export function getTempoCorrente() {
  return tempoCorrente;
}

export function startCronometro() {
  if (partitaFinita) return;
  if (timerRunning) return;

  timerRunning = true;
  timer = setInterval(() => {
    secondiTotali++;
    document.getElementById('cronometro').textContent = formatTime(secondiTotali);
  }, 1000);
}

export function pausaCronometro(onPausaCallback) {
  if (!timerRunning || partitaFinita) return;

  clearInterval(timer);
  timerRunning = false;

  if (typeof onPausaCallback === 'function') {
    onPausaCallback();
  }

  alert('Timer in pausa. Chiudi per far ripartire il timer.');
  startCronometro();
}

export function stopCronometro(onFinePrimoTempo, onFineSecondoTempo) {
  if (!timerRunning) return;

  clearInterval(timer);
  timerRunning = false;

  if (tempoCorrente === 1 && !primoTempoChiuso) {
    primoTempoChiuso = true;
    alert('Fine 1° tempo. Salvare primo tempo.');
    document.getElementById('btnT1').disabled = true;
    document.getElementById('btnT2').disabled = false;
    if (typeof onFinePrimoTempo === 'function') onFinePrimoTempo();
  } else if (tempoCorrente === 2) {
    partitaFinita = true;
    alert('Fine 2° tempo. Salvare secondo tempo.');
    if (typeof onFineSecondoTempo === 'function') onFineSecondoTempo();
  }
}

export function resetCronometro() {
  clearInterval(timer);
  timerRunning = false;
  secondiTotali = 0;
  tempoCorrente = 1;
  primoTempoChiuso = false;
  partitaFinita = false;
  document.getElementById('btnT1').disabled = false;
  document.getElementById('btnT2').disabled = true;
  initTimer();
}

export function setTempo(n) {
  if (n === 1 && !primoTempoChiuso) {
    tempoCorrente = 1;
  } else if (n === 2 && primoTempoChiuso) {
    tempoCorrente = 2;
  }
  document.getElementById('tempoCorrente').textContent = `Tempo: ${tempoCorrente}`;
}
