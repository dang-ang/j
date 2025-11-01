document.querySelectorAll(".nav-list a").forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    const href = this.getAttribute("href");
    document.getElementById("pageFrame").setAttribute("src", href);
    closeSidebar();
  });
});




// 👆 Apri sidebar
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
});

// 👇 Chiudi sidebar al clic fuori
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

// 🧭 Carica contenuto SPA
function renderPageContent(route) {
  const content = document.getElementById("pageContent");
  const breadcrumb = document.getElementById("breadcrumb");

  switch (route) {
    case "home":
      content.innerHTML = "<h1>Home</h1><p>Benvenuto nella homepage!</p>";
      breadcrumb.innerText = "Home";
      break;
    case "rpe":
      fetch("rpeSel.html")
        .then(res => res.text())
        .then(html => {
          content.innerHTML = html;
          breadcrumb.innerText = "Home > RPE";
        })
        .catch(() => {
          content.innerHTML = "<h1>Errore</h1><p>Impossibile caricare rpeSel.html</p>";
          breadcrumb.innerText = "";
        });
      break;
    case "pain":
      content.innerHTML = "<h1>Pain</h1><p>Monitoraggio del dolore dei giocatori.</p>";
      breadcrumb.innerText = "Home > Pain";
      break;
    case "recovery":
      content.innerHTML = "<h1>Recovery</h1><p>Analisi del recupero muscolare.</p>";
      breadcrumb.innerText = "Home > Recovery";
      break;
    case "dashboard":
      content.innerHTML = "<h1>Dashboard</h1><p>Statistiche e visualizzazioni in tempo reale.</p>";
      breadcrumb.innerText = "Home > Dashboard";
      break;
    default:
      content.innerHTML = "<h1>Errore</h1><p>Pagina non trovata.</p>";
      breadcrumb.innerText = "";
  }
}

// 🔄 Router SPA
function router() {
  const route = window.location.hash.replace("#", "") || "home";
  renderPageContent(route);
  closeSidebar();
}
window.addEventListener("hashchange", router);
window.addEventListener("load", router);
