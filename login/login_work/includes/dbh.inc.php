<?php
$dBServername = "34.66.160.101";
$dBUsername = "root";
$dBPassword = "fiveguys";
$dBName = "BitsAndBytes";
// Create connection
$conn = mysqli_connect($dBServername, $dBUsername, $dBPassword, $dBName);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
