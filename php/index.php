<?php
session_start();
// echo "Script avviato"; // Aggiungi questa riga

include_once 'function.php';

//--------------------------------------------
// abilitazione visualizzazione degli errori
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
//--------------------------------------------

// ---------------------------------------------------------
// Detect if the browser is Safari
$isSafari = strpos($_SERVER['HTTP_USER_AGENT'], 'Safari') !== false && strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome') === false;
// echo "safari:" . ($isSafari ? 'true' : 'false') . "||";

// ---------------------------------------------------------


// ---------------------------------------------------------
// Detect the player or user
$id = isset($_POST['player_id']) ? $_POST['player_id'] : '';
$message = '';

if ($id !== '') {
    $playerName= decodeNumberToString($id);
    $message = "Benvenuto, giocatore ID: " . htmlspecialchars($id) . "|" . $playerName;
} else {
    $message = "ID non ricevuto.";
}
// ---------------------------------------------------------



?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JCR-2012</title>
    <link rel="stylesheet" href="css/style_p.css">
    <?php if ($isSafari): ?>
        <link rel="stylesheet" href="css/safari.css">
    <?php endif; ?>
</head>

<body>
     <!-- Include NAVBAR -->
    <?php  include 'navbar.php';  ?> <!-- Include the navbar -->

    <div>
      <?php  include('player_in.php');   ?> <!-- Include CONTENT -->
    </div> 

</body>

</html>
