<?php
ini_set("display_errors", "On");
error_reporting(E_ALL ^ E_NOTICE);
include_once("connect.php");
$link=conectarse();
$dbh=conectaPDO();

//$n=$_GET['n'];
$n = (isset($_POST['n']) ? $_POST['n'] : $_GET['n']);

switch ($n){
        case 1: //Listado de Checks Laborales
            $codper = $_POST['codper'];
            $codsol = $_POST['codsol'];
            $sqlquery ="SELECT l.codchklab, l.nomemp, l.codcue, c.descue, l.telemp, l.codestchk, e.desestchk
                        FROM tb_chklaboral l left join tb_estadocheck e on l.codestchk=e.codestchk
                        left join tb_cuestionario c on l.codcue=c.codcue where codper='$codper' and codsol='$codsol'";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"listachecklab":'.json_encode($arr).'}';
            break;
        case 2: //Preguntas grabadas del Check Laboral
            $codchklab = $_POST['codchklab'];
            $sqlquery ="select codsol, codper, codchklab, codcue, codpre, respre
                        FROM tb_respuestas where codchklab='$codchklab' order by codpre";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"cuestionario":'.json_encode($arr).'}';
            break;
        case 3: //Recupera plantilla de preguntas para registro inicial
            $codper = $_POST['codper'];
            $codsol = $_POST['codsol'];
            $codchklab = $_POST['codchklab'];
            $codcue = $_POST['codcue'];
            $sqlquery ="select $codsol as codsol, $codper as codper, $codchklab as codchklab, $codcue as codcue, p.codpre, p.despre, '' as respre
                        FROM tb_preguntas p left join tb_respuestas r on p.codcue=$codcue order by codpre";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"cuestionario":'.json_encode($arr).'}';
            break;
        case 4: //recupera datos del Chek Laboral
            $codchklab = $_POST['codchklab'];
            $sqlquery ="select * FROM tb_chklaboral where codchklab='$codchklab'";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"checklaboralpersona":'.json_encode($arr).'}';
            break;
        case 5: //recupera preguntas por código de cuestionario
            $codsol = $_POST['codsol'];
            $codper = $_POST['codper'];
            $codcue = $_POST['codcue'];
            $sqlquery ="select $codsol as codsol, $codper as codper, codpre,codcue,despre,'' as respre FROM tb_preguntas where codcue='$codcue'";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"cuestionario":'.json_encode($arr).'}';
            break;
}
?>
