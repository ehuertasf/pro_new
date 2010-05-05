<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
header("Content-type: application/json; charset=UTF-8");
header("Cache-control: No-Cache");
header("Pragma: No-Cache");

ini_set("display_errors", "On");
error_reporting(E_ALL ^ E_NOTICE);
include_once("connect.php");
$link=conectarse();
$dbh=conectaPDO();

//$n=$_GET['n'];
$n = (isset($_POST['n']) ? $_POST['n'] : $_GET['n']);
switch ($n){
        //case 100:
        //    echo '{"detpersonas":null}';
        case 1: //Puestos
            $sqlquery ="select codpue,despue from tb_puesto";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"puestos":'.json_encode($arr).'}';
            break;
        case 2:	//Resultado de Busqueda
            $txtbuscar=$_GET["query"];
            $sqlquery ="select p.codper,p.nomper,p.apepatper,p.apematper,p.codtipdoc,p.numdocper,td.destipdoc
                        from tb_persona p left join tb_tipdoc td on p.codtipdoc=td.codtipdoc where numdocper
                        like '%".$txtbuscar."%' or CONCAT(nomper,' ',apepatper,' ',apematper) like '%".$txtbuscar."%'
                        order by apepatper, apematper, nomper";
            //print $sqlquery;
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
                    echo '{"busquedaper":'.json_encode($arr).'}';
            break;
        case 3: //Registra Solicitud
            session_start();
            $usuregsol  = $_SESSION['us3r1d'];
            $codcli	= $_POST['codcli'];
            $fecvensol	= $_POST['fecvensol'];
            $obssol	= $_POST['obssol'];
            $detalle	= $_POST['detalle'];
            $fecregsol	= date('Y-m-d H:i:s');
            $codestsol  = 1;
            $textorecibido = explode("|,|",$detalle);
            $cant_elementos = count($textorecibido);
            //echo ('leyo las variables<br>');
            try {
                //echo ('entro al try<br>');
                $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
                $dbh->beginTransaction();

                //echo 'Paso la configuracion PDO<br>';
                $sql="INSERT INTO tb_solicitud (fecregsol,fecvensol,codcli,usuregsol,obssol,codestsol)
                            VALUES(:fecregsol,:fecvensol,:codcli,:usuregsol,:obssol,:codestsol)";
                $stmt=$dbh->prepare($sql);
                $stmt->execute(array(
                    ':fecregsol' => $fecregsol,
                    ':fecvensol' => $fecvensol,
                    ':codcli' => $codcli,
                    ':usuregsol' => $usuregsol,
                    ':obssol' => $obssol,
                    ':codestsol' => $codestsol
                ));
                $nrosol=$dbh->lastInsertId();
                //Grabando el detalle de la solicitud
                for($i=0;$i<$cant_elementos;$i++){
                    $elementodetalle = explode("$$",$textorecibido[$i]);
                    $codper     = $elementodetalle[0];
                    $codpue     = $elementodetalle[1];
                    $codpacchk  = $elementodetalle[2];

                    $sql= "INSERT INTO tb_detallesolicitud (codsol,codper,codpue,codpacchk,codestchk)
                                  VALUES (:codsol,:codper,:codpue,:codpacchk,1)";
                    $stmt =$dbh->prepare($sql);
                    $stmt->execute(array(
                        ':codsol' => $nrosol,
                        ':codper' => $codper,
                        ':codpue' => $codpue,
                        ':codpacchk' => $codpacchk,
                    ));
                }
                //prepara datos para llenar en tablas de check
                $sql="select sp.codsol,sp.codper,sp.codpacchk,c.nomtbl from tb_detallesolicitud sp
                                right join tb_detallepackcheck pc on sp.codpacchk=pc.codpacchk
                                right join tb_check c on pc.codchk=c.codchk
                            where sp.codsol='$nrosol' order by sp.codper,pc.codpacchk,pc.codchk";
                //comienza la inserción
                foreach($dbh->query($sql) as $fila){
                    switch($fila['nomtbl']){
                        case 'tb_chkservice' :
                            $sql="INSERT INTO tb_chkservice (codper,codsol,coddel,codestchk)
                                        VALUES (:codper,:codsol,1,1)";
                            break;
                        case 'tb_chklaboral' :
                            $sql="INSERT INTO tb_chklaboral (codper,codsol,codcue,codestchk,cueresp)
                                        VALUES (:codper,:codsol,1,1,0)";
                            break;
                        case 'tb_chkdomicilio' :
                            $sql="INSERT INTO tb_chkdomicilio (codper,codsol,coddpto,codpro,coddist,codtipvia,codpar,codviv,codtipviv,codtipmat,codestcon,codzonif,codzonrie,codcon,codestchk)
                                        VALUES (:codper,:codsol,15,1,1,1,1,1,1,1,1,1,1,1,1)";
                            break;
                    }
                    $stmt =$dbh->prepare($sql);
                    $stmt->execute(array(
                        ':codper'=>$fila['codper'],
                        ':codsol'=>$fila['codsol']
                    ));
                    //Insertando imagenes
                    if ($fila['nomtbl']=='tb_chkdomicilio'){
                        $codchkdom = $dbh->lastInsertId();
                        for($i=0;$i<3;$i++){
                            $sql= "INSERT INTO tb_imgdomicilio (codsol,codper,codchkdom,codtipimg,numimgdom)
                                  VALUES (:codsol,:codper,:codchkdom,:codtipimg,:numimgdom)";
                            $stmt =$dbh->prepare($sql);
                            $stmt->execute(array(
                                ':codper'=>$fila['codper'],
                                ':codsol'=>$fila['codsol'],
                                ':codchkdom'=>$codchkdom,
                                ':codtipimg'=>4,
                                ':numimgdom'=>$i
                            ));
                        }
                    }
                    //echo $fila['codper'].'|'.$fila['codsol'].'|'.$fila['nomtbl'].'|';
                }
                $dbh->commit();
                echo "{respuesta: {error : 0, mensaje: 'Solicitud generada satisfactoriamente. Nro. Solicitud : ', codsol: $nrosol} }";
                //echo 'Solicitud generada satisfactoriamente. Nro. Solicitud: ~'.$nrosol;
                //echo ','.$sqlchecks;
            } catch (PDOException $e) {
                //echo $e;
                $dbh->rollBack();
//                echo 'PDO Excepciones.	';
//                echo 'Error con la base de datos: <br />';
//                echo 'SQL Query: ', $sql;
//                echo '<pre>';
//                echo 'Error: ,'.$e->getMessage();
//                echo 'Archivo: ' . $e->getFile() . '<br />';
//                echo 'Linea: ' . $e->getLine() . '<br />';
//                echo '</pre>';
		//echo 'Ocurrio un error al tratar de grabar la solicitud, Vuelva a intentar y si el problema persiste comuniquese con soporte';
                echo "{respuesta: {error : 1, mensaje: 'Ocurrio un error al generar la solicitud comuniquese con Sistemas' }}";
            }
            break;
        case 4: //Estados de solicitud
            $sqlquery ="select codestsol,desestsol from tb_estsol where estestsol=1";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"estadossol":'.json_encode($arr).'}';
            break;
        case 5: //Consultas de solicitud
            $ponerand=false;
            $codsol = $_POST['codsol'];
            $codcli = $_POST['codcli'];
            $codestsol = $_POST['codestsol'];
            $desde = $_POST['desde'];
            $hasta = $_POST['hasta'];
            $sqlquery ="SELECT s.codsol,s.codcli,c.nomcli,s.fecregsol,s.fecvensol,CONCAT(DATEDIFF(s.fecvensol,s.fecregsol),' dias') AS plazo,
						DATEDIFF(s.fecvensol,NOW()) AS diasrest,
						s.codestsol,e.desestsol,CONCAT(u.nomuser,' ',u.apeuser) AS usuario,
						(SELECT COUNT(ds.codsol) FROM tb_detallesolicitud ds WHERE ds.codsol=s.codsol) AS canper
						FROM tb_solicitud s LEFT JOIN tb_cliente c ON s.codcli=c.codcli
						LEFT JOIN tb_estsol e ON s.codestsol=e.codestsol
						LEFT JOIN tb_users u ON s.usuregsol=u.loguser";
            if($codsol!='' || $codcli!='' || $codestsol!='' || $desde!='' || $hasta!=''){
                $sqlquery=$sqlquery.' WHERE';
                if($codsol!=''){
                    $sqlquery=$sqlquery.' s.codsol='.$codsol;
                    $ponerand=true;
                }else{
                    $ponerand=false;
                }
                if($codcli!=''){
                    if($ponerand==false){
                        $sqlquery=$sqlquery.' s.codcli='.$codcli;
                        $ponerand=true;
                    }else{
                        $sqlquery=$sqlquery.' and s.codcli='.$codcli;
                        $ponerand=true;
                    }
                }
                if($codestsol!=''){
                    if($ponerand==false){
                        $sqlquery=$sqlquery.' s.codestsol='.$codestsol;
                        $ponerand=true;
                    }else{
                        $sqlquery=$sqlquery.' and s.codestsol='.$codestsol;
                        $ponerand=true;
                    }
                }
                if($desde!='' && $hasta!=''){
                    if($ponerand==false){
                        $sqlquery=$sqlquery.' s.fecregsol BETWEEN \''.$desde.'\' AND \''.$hasta.'\'';
                        $ponerand=true;
                    }else{
                        $sqlquery=$sqlquery.' and s.fecregsol BETWEEN \''.$desde.'\' AND \''.$hasta.'\'';
                        $ponerand=false;
                    }
                }
            }
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"busquedasol":'.json_encode($arr).'}';
            //echo '{'.$sqlquery.'}';
            break;
       case 6: //Lista Paquetes de Check
            $sqlquery ="select codpacchk,despacchk from tb_packcheck where estpacchk=1";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"packcheck":'.json_encode($arr).'}';
            break;
       case 7: //cabecera solicitud
            $codsol	= $_POST['codsol'];
            $sqlquery ="select codsol,codcli,fecvensol,obssol,codestsol from tb_solicitud where codsol=".$codsol;
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"cabsolicitud":'.json_encode($arr).'}';
            break;
       case 8: //cabecera solicitud
            session_start();
            include("ftn_actestchk.php");
            $usuregsol  = $_SESSION['us3r1d'];
            $codsol	= $_POST['codsol'];

            ftn_act_estadochk($codsol,$usuregsol);
            $sqlquery ="SELECT ds.codsol,ds.codper,CONCAT(p.nomper,' ',p.apepatper,' ',p.apematper) AS nombre,p.codtipdoc,doc.destipdoc,p.numdocper,
                        ds.codpacchk,pc.despacchk,ds.codpue,pu.despue,(
                                SELECT r.desestchk FROM tb_estadocheck r,tmp_estactchk i
                                WHERE r.codestchk=i.codestchk AND i.codsol=ds.codsol AND i.codper=ds.codper
                        ) AS estado
                        FROM tb_detallesolicitud ds LEFT JOIN tb_persona p ON ds.codper=p.codper
                        LEFT JOIN tb_packcheck pc ON ds.codpacchk=pc.codpacchk
                        LEFT JOIN tb_puesto pu ON ds.codpue=pu.codpue
                        LEFT JOIN tb_tipdoc doc ON p.codtipdoc=doc.codtipdoc
                        WHERE codsol=".$codsol;


            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"detpersol":'.json_encode($arr).'}';
            break;
       case 9: //cabecera solicitud
            $codsol	= $_POST['codsol'];
            $codper	= $_POST['codper'];
            $sqlquery ="select sp.codsol,sp.codper,sp.codpacchk,sp.codpue,c.nomobj,concat(p.apepatper,' ',p.apematper,', ',p.nomper) as nombre from tb_detallesolicitud sp
                            right join tb_detallepackcheck pc on sp.codpacchk=pc.codpacchk
                            right join tb_check c on pc.codchk=c.codchk
                            right join tb_persona p on sp.codper=p.codper
                        where sp.codsol=".$codsol." and sp.codper=".$codper." order by sp.codper,pc.codpacchk,pc.codchk";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"checkspersona":'.json_encode($arr).'}';
            break;
}
?>
