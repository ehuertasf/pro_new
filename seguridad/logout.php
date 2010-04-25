<?php

header("Cache-control: No-Cache");
header("Pragma: No-Cache");

session_start();
session_destroy();
//$_SESSION['p3r1m1t1d0']='no';
header("Location:../seguridad/login.php");
echo $_SESSION['p3r1m1t1d0'];
?>
