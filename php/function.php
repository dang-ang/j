<?php
// ---------------------------------------------------------
//  decode string
function decodeNumberToString($number) {
    $numStr = strval($number);
    $result = '';

    for ($i = 0; $i < strlen($numStr); $i += 2) {
        $pair = substr($numStr, $i, 2);
        $decodedNumber = intval($pair);
        $character = chr($decodedNumber);
        $result .= $character;
    }

    return $result;
}
// ---------------------------------------------------------
?>