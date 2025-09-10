function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}

function loadPage(url) {
  const content = document.getElementById('content');
  //var urls=urlPath + url;
  var urls=url;
  
  fetch(urls)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
    })
    .catch(err => {
      content.innerHTML = "<p>Errore nel caricamento della pagina.</p>";
    });
}

// Carica la home all'avvio
  var urlPath='https://dang-ang.github.io/j/';
  let urlHome='tuttocampo.html';

window.onload = () => loadPage(urlHome);