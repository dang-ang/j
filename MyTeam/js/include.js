
// Carica menu.html dentro il div #menu
fetch("menu.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("main-navbar").innerHTML = data;
  });
