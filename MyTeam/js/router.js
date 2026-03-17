// carica SOLO il contenuto centrale
function loadPage(page) {
  fetch(`content/${page}.html`)
    .then(res => res.text())
    .then(html => {
      document.getElementById("content").innerHTML = html;
    });
}

function router() {
  const hash = window.location.hash.replace("#", "") || "home";
  loadPage(hash);
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
