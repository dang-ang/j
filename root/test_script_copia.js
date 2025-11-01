function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}

function loadPage(page) {
  const content = document.getElementById('content');
  fetch(`${page}.html`)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
    })
    .catch(err => {
      content.innerHTML = "<p>Errore nel caricamento della pagina.</p>";
    });
}

// Carica la home all'avvio
window.onload = () => loadPage('tuttocampo');
