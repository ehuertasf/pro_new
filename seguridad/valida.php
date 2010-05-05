<?php
include("../DB/connect.php");
$link=conectarse();
$usuario = $_POST["username"];
$password = md5(trim($_POST["password"]));
$query = "select * from tb_users where loguser='$usuario' and pasuser='$password' and estuser=1;";
$sql = mysql_query($query,$link);
$check = mysql_num_rows($sql);

if($check>0){
    session_start();
    $_SESSION['p3r1m1t1d0']='yes'; //session username
    $_SESSION['us3r1d']=$usuario;

    /**
     * @author Ricardo (04-05-2010)
     * Nos aseguramos que las tablas temporales esten vacias para su usuario cuando inicia la sesion
     */

    mysql_query("delete from tmp_estperchk where loguser='".$usuario."';") or die(mysql_error());
    mysql_query("delete from tmp_estactchk where loguser='".$usuario."';") or die(mysql_error());

    /**
     * **********************************************************************************************
     */

    echo "{success: true}";
}
else{
    echo "{success: false, errors: { reason: 'Fallo el Ingreso. Trate Nuevamente.' }}";
}
?>
