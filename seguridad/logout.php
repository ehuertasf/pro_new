<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
session_start();
session_destroy();
//$_SESSION['p3r1m1t1d0']='no';
header("Location: ../index.php");
echo $_SESSION['p3r1m1t1d0'];
?>
