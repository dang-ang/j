function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("show");
}

function caricaContenuto(file) {
  fetch(file)
    .then(response => response.text())
    .then(html => {
      document.getElementById("contenuto-dinamico").innerHTML = html;
    })
    .catch(error => {
      document.getElementById("contenuto-dinamico").innerHTML = "<p>Errore nel caricamento.</p>";
      console.error("Errore:", error);
    });
}
