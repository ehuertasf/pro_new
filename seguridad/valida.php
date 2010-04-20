<?php
include("../DB/connect.php");
$link=conectarse();
$usuario = $_POST["username"];
$password = $_POST["password"];
$query = "select * from tb_users where loguser='$usuario' and pasuser='$password'";
$sql = mysql_query($query,$link);
$check = mysql_num_rows($sql);

if($check>0){
    session_start();
    $_SESSION['p3r1m1t1d0']='yes'; //session username
    $_SESSION['us3r1d']=$usuario;
    echo "{success: true}";
}
else{
    echo "{success: false, errors: { reason: 'Fallo el Ingreso. Trate Nuevamente.' }}";
}
?>
