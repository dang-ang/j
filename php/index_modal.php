<?php
session_start();

include_once 'function.php';

// ---------------------------------------------------------
// Detect if the browser is Safari
$isSafari = strpos($_SERVER['HTTP_USER_AGENT'], 'Safari') !== false &&
    strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome') === false;
// ---------------------------------------------------------


// ---------------------------------------------------------
// Detect the player or user
$id = isset($_POST['player_id']) ? $_POST['player_id'] : '';
$message = '';

if ($id !== '') {
    $message = "Benvenuto, giocatore ID: " . htmlspecialchars($id) . "|" . decodeNumberToString($id);
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
    <?php include 'navbar.php'; ?> <!-- Include the navbar -->

    <!-- Include MESSAGE -->
    <div id="messageModal" class="modal">
        <div class="modal-content">
            <span class="close-button" onclick="closeModal()">&times;</span>
            <p><?php echo $message; ?></p>
        </div>
    </div> 

    <div>
      <?php  include('player_in.php'); ?> <!-- Include CONTENT -->
    </div> 

<script>
/*
function closeModal() {
    var modal = document.getElementById("messageModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Chiudi automaticamente la modal dopo 5 secondi (5000 ms)
window.onload = function() {
  // setTimeout(closeModal, 1000);
};
*/
</script>
</body>

</html>
