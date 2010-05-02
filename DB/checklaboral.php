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
            $sqlquery ="SELECT l.codchklab, l.nomemp, l.codcue, c.descue, l.telemp, l.codestchk, e.desestchk, l.cueresp
                        FROM tb_chklaboral l left join tb_estadocheck e on l.codestchk=e.codestchk
                        left join tb_cuestionario c on l.codcue=c.codcue where codper='$codper' and codsol='$codsol'";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"listachecklab":'.json_encode($arr).'}';
            break;
        case 2: //Preguntas grabadas del Check Laboral
            $codchklab = $_POST['codchklab'];
            $sqlquery ="select r.codsol, r.codper, r.codchklab, r.codcue, r.codpre, p.despre, r.respre
                        FROM tb_respuestas r, tb_preguntas p where codchklab='$codchklab' and r.codpre=p.codpre order by codpre";
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
        case 6:
            session_start();
            $usuciechklab = $_SESSION['us3r1d'];
            $nuevo = $_POST['nuevo'];
            $codchklabc = $_POST['codchklab'];
            $codperc = $_POST['codper'];
            $codsolc = $_POST['codsol'];
            $nomperref = $_POST['nomperref'];
            $nomemp = $_POST['nomemp'];
            $telemp = $_POST['telemp'];
            $perlab = $_POST['perlab'];
            $motces = $_POST['motces'];
            $percont = $_POST['percont'];
            $carpercont = $_POST['carpercont'];
            $fecent = $_POST['fecent'];
            $noment = $_POST['noment'];
            $codcon = $_POST['codcon'];
            $obsent = $_POST['obsent'];
            $codestchk = $_POST['codestchk'];
            $cueresp = $_POST['cueresp'];
            $respuestas = $_POST['respuestas'];

            $fecciechklab = date('Y-m-d H:i:s');
            $resprecibidas = explode("|,|",$respuestas);
            $cant_respuestas = count($resprecibidas);
            try {
                //echo ('entro al try<br>');
                $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
                $dbh->beginTransaction();

                //echo 'Paso la configuracion PDO<br>';
                if ($nuevo=='si'){
                    $sql="INSERT INTO tb_chklaboral (codper,codsol,nomperref,nomemp,telemp,perlab,motces,percont,carpercont,fecent,obsent,noment,usuciechklab,fecciechklab,codestchk,codcue,cueresp,codcon)
                                VALUES(:codper,:codsol,:nomperref,:nomemp,:telemp,:perlab,:motces,:percont,:carpercont,:fecent,:obsent,:noment,:usuciechklab,:fecciechklab,:codestchk,1,1,:codcon)";
                    $stmt=$dbh->prepare($sql);
                    $stmt->execute(array(
                    ':codper' => $codperc,
                    ':codsol' => $codsolc,
                    ':nomperref' => $nomperref,
                    ':nomemp' => $nomemp,
                    ':telemp' => $telemp,
                    ':perlab' => $perlab,
                    ':motces' => $motces,
                    ':percont' => $percont,
                    ':carpercont' => $carpercont,
                    ':fecent' => $fecent,
                    ':obsent' => $obsent,
                    ':noment' => $noment,
                    ':usuciechklab' => $usuciechklab,
                    ':fecciechklab' => $fecciechklab,
                    ':codestchk' => $codestchk,
                    ':codcon' => $codcon
                    ));
                    $nrochklab=$dbh->lastInsertId();
                    for($i=0;$i<$cant_respuestas;$i++){
                        $elemento = explode("$$",$resprecibidas[$i]);

                        $codsol = $elemento[0];
                        $codper = $elemento[1];
                        $codchklab = $nrochklab;
                        $codcue = $elemento[3];
                        $codpre = $elemento[4];
                        $respre = $elemento[5];
                        //echo $codsol.'-'.$codper.'-'.$codchklab;
                        $sql= "INSERT INTO tb_respuestas (codsol,codper,codchklab,codcue,codpre,respre)
                                      VALUES (:codsol,:codper,:codchklab,:codcue,:codpre,:respre)";
                        $stmt =$dbh->prepare($sql);
                        $stmt->execute(array(
                            ':codsol' => $codsol,
                            ':codper' => $codper,
                            ':codchklab' => $codchklab,
                            ':codcue' => $codcue,
                            ':codpre' => $codpre,
                            ':respre' => $respre
                        ));
                    }
                }
                else{
                    $sql="UPDATE tb_chklaboral set nomperref=:nomperref,nomemp=:nomemp,telemp=:telemp,
                        perlab=:perlab,motces=:motces,percont=:percont,carpercont=:carpercont,fecent=:fecent,obsent=:obsent,
                        noment=:noment,usuciechklab=:usuciechklab,fecciechklab=:fecciechklab,codestchk=:codestchk,codcue=1,
                        cueresp=1,codcon=:codcon where codchklab=:codchklab";
                    $stmt=$dbh->prepare($sql);
                    $stmt->execute(array(
                        ':nomperref' => $nomperref,
                        ':nomemp' => $nomemp,
                        ':telemp' => $telemp,
                        ':perlab' => $perlab,
                        ':motces' => $motces,
                        ':percont' => $percont,
                        ':carpercont' => $carpercont,
                        ':fecent' => $fecent,
                        ':obsent' => $obsent,
                        ':noment' => $noment,
                        ':usuciechklab' => $usuciechklab,
                        ':fecciechklab' => $fecciechklab,
                        ':codestchk' => $codestchk,
                        ':codcon' => $codcon,
                        ':codchklab' => $codchklabc
                    ));
                    if($cueresp==0){
                        for($i=0;$i<$cant_respuestas;$i++){
                            $elemento = explode("$$",$resprecibidas[$i]);

                            $codsol = $elemento[0];
                            $codper = $elemento[1];
                            $codchklab = $codchklabc;
                            $codcue = $elemento[3];
                            $codpre = $elemento[4];
                            $respre = $elemento[5];

                            $sql= "INSERT INTO tb_respuestas (codsol,codper,codchklab,codcue,codpre,respre)
                                          VALUES (:codsol,:codper,:codchklab,:codcue,:codpre,:respre)";
                            $stmt =$dbh->prepare($sql);
                            //echo $codsol.'-'.$codper.'-'.$codchklab;
                            $stmt->execute(array(
                                ':codsol' => $codsol,
                                ':codper' => $codper,
                                ':codchklab' => $codchklab,
                                ':codcue' => $codcue,
                                ':codpre' => $codpre,
                                ':respre' => $respre
                            ));
                        }
                    }else{
                        for($i=0;$i<$cant_respuestas;$i++){
                            $elemento = explode("$$",$resprecibidas[$i]);

                            $codsol = $elemento[0];
                            $codper = $elemento[1];
                            $codchklab = $elemento[2];
                            $codcue = $elemento[3];
                            $codpre = $elemento[4];
                            $respre = $elemento[5];

                            $sql= "UPDATE tb_respuestas set respre=:respre
                                          where codchklab=:codchklab and codpre=:codpre";
                            $stmt =$dbh->prepare($sql);
                            $stmt->execute(array(
                                ':codchklab' => $codchklab,
                                ':codpre' => $codpre,
                                ':respre' => $respre
                        ));
                        }
                    }
                }
                $dbh->commit();
                echo "{respuesta: {error : 0, mensaje: 'Se grabaron correctamente los datos', estado:$codestchk }}";
            } catch (PDOException $e) {
                //echo $e;
                $dbh->rollBack();
//                echo 'PDO Excepciones.	';
//                echo 'Error con la base de datos: <br />';
//                echo 'SQL Query: ',: $sql;
//                echo '<pre>';
                echo 'Error: ,:'.$e->getMessage(). '<br />';
//                echo 'Archivo: ' . $e->getFile() . '<br />';
                echo 'Linea: ' . $e->getLine() . '<br />';
//                echo '</pre>';
		//echo 'Ocurrio un error al tratar de grabar la solicitud, Vuelva a intentar y si el problema persiste comuniquese con soporte';
                echo "{respuesta: {error : 1, mensaje: 'Ocurrio un error al grabar Check laboral, comuniquese con Sistemas' }}";

            }

}
?>
