<?php
include_once 'function.php';

//-----------------------------------------------------------
// Recupera e decodifica il nome
$id = isset($_POST['player_id']) ? $_POST['player_id'] : '';
// echo $id  ."|";

 $encodedName=$id ;
 $decodedName = decodeNumberToString($id);
// echo $decodedName  ."|";
//-----------------------------------------------------------


//-----------------------------------------------------------
// Redirect se nome non valido / vuoto
if ($decodedName === '') {
    header("Location: main.html");
    exit;
}
//-----------------------------------------------------------



// Parametri disponibili
$parameters = [
    ["name" => "Sforzo", "type" => "rpe"],
    ["name" => "Recupero", "type" => "recovery"],
    ["name" => "Stanchezza", "type" => "fatigue"],
    ["name" => "Scheda Partita", "type" => "selfcheck"]
];

?>

<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dashboard Giocatore</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="css/style_content_home.css">
</head>
<body>

<div class="container">
  <h4>Giocatore</h4>
  <h2 id="playerName"><?= htmlspecialchars($decodedName) ?></h2>

  <h4>Seleziona il dato da inserire:</h4>
  <div class="parameter-grid">
    <?php foreach ($parameters as $param): 
      $href = ($param['type'] === 'selfcheck') 
        ? "game_selfCheck.html?name=$encodedName" 
        : "parameter_input.html?name=$encodedName&paramType=" . urlencode($param['type']);
    ?>
      <a href="<?= $href ?>" class="parameter-card" onclick="showOverlay()">
        <?= htmlspecialchars($param['name']) ?>
      </a>
    <?php endforeach; ?>
  </div>

  <iframe title="grafici" class="iframex" id="graficoFrame" src="grafico_giocatori_all1.html?nome=<?= urlencode($decodedName) ?>"></iframe>
</div>

<div id="loadingOverlay">Caricamento dati...</div>

<script>
function showOverlay() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

window.addEventListener("message", function(event) {
  if (event.data && event.data.altezza) {
    document.getElementById("graficoFrame").style.height = event.data.altezza + "px";
  }
});

window.onload = function() {
  document.getElementById('loadingOverlay').style.display = 'none';
};
</script>

</body>
</html>
