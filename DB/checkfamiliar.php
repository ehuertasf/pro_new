<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
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
            $sqlquery ="SELECT f.codchkser, f.nombre, p.despar, e.desestchk
                        FROM tb_chkfamiliar f left join tb_estadocheck e on f.codestchk=e.codestchk
                        left join tb_parentesco p on f.codpar=p.codpar where codper='$codper' and codsol='$codsol'";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"listacheckfam":'.json_encode($arr).'}';
            break;
        case 4: //recupera datos del Chek Laboral
            $codchkser = $_POST['codchkser'];
            $sqlquery ="select * FROM tb_chkfamiliar where codchkser='$codchkser'";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"checkfamiliarpersona":'.json_encode($arr).'}';
            break;
        case 5: //Graba CheckService
            $codper = $_POST['codper'];
            $codsol = $_POST['codsol'];
            $codchkser = $_POST['codchkfam'];
            $nuevo = $_POST['nuevo'];
            $imgactual = $_POST['imgreniecactfam'];
            $nomimgreniec =  basename( $_FILES['imgreniecfam']['name']);
            $nombreper = $_POST['nombre'];
            $codpar = $_POST['vcodpar'];
            $obsimgreniec = $_POST['obsimgreniecfam'];
            $indrefpol	= $_POST['vindrefpol'];
            $refpolchk	= $_POST['refpolchk'];
            $indantpol	= $_POST['vindantpol'];
            $indreqjud	= $_POST['vindreqjud'];
            $indrefter	= $_POST['vindrefter'];
            $indrefdro	= $_POST['vindrefdro'];
            $indimpsalpai= $_POST['vindimpsalpai'];
            $indinvpen	= $_POST['vindinvpen'];
            $invpenchk	= $_POST['invpenchk'];
            $recchk	= $_POST['recchkfam'];
            $delitos	= $_POST['delitos'];
            $codestchk  = $_POST['vcodestchk'];
            $detrecibido = explode("|,|",$delitos);
            $cant_elementos = count($detrecibido);

            //print_r($_FILES);
            $target_path = "../files/images_dni/fam/";
            //$target_path = $target_path . basename( $_FILES['imgreniec']['name']);

            try {
                $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
                $dbh->beginTransaction();

                if ($nuevo=='no'){
                    if($nomimgreniec!=''){
                        $nombre = $codsol."_".date("YmdGis")."_dni.".end(explode(".", $nomimgreniec));
                        if(move_uploaded_file($_FILES['imgreniecfam']['tmp_name'], $target_path.$nombre)) {
                            $archivorecibido =  $nombre;
                        } else{
                            echo "{success: false, confirma: {mensaje: 'No se pudo grabar la imagen, intente nuevamente'}}";
                            //echo "{\"success\":\"false\",\"errors\":{\"reason\":\"Ocurrio un error al cargar el archivo, Intente nuevamente\"},\"respuesta\":{\"estado\":\"-1\"},\"img\":{\"imagen\":\"$archivorecibido\"}}";
                            exit();
                        }
                    }
                    else{
                        $archivorecibido=$imgactual;
                    }

                    $sql = "UPDATE tb_chkfamiliar SET nombre=:nombre, codpar=:codpar, obsimgreniec=:obsimgreniec, indrefpol=:indrefpol, imgreniec=:nomimgreniec,
                            refpolchk=:refpolchk, indantpol=:indantpol, indreqjud=:indreqjud, indrefter=:indrefter,
                            indrefdro=:indrefdro, indimpsalpai=:indimpsalpai, indinvpen=:indinvpen, invpenchk=:invpenchk,
                            recchk=:recchk, codestchk=:codestchk where codchkser=:codchkser";
                            //recchk=:recchk, coddel=:coddel, codestchk=:codestchk where codsol=:codsol and codper=:codper";
                    $stmt=$dbh->prepare($sql);
                    $stmt->execute(array(
                        ':nombre' => $nombreper,
                        ':codpar' => $codpar,
                        ':obsimgreniec' => $obsimgreniec,
                        ':indrefpol' => $indrefpol,
                        ':nomimgreniec' => $archivorecibido,
                        ':refpolchk' => $refpolchk,
                        ':indantpol' => $indantpol,
                        ':indreqjud' => $indreqjud,
                        ':indrefter' => $indrefter,
                        ':indrefdro' => $indrefdro,
                        ':indimpsalpai' => $indimpsalpai,
                        ':indinvpen' => $indinvpen,
                        ':invpenchk' => $invpenchk,
                        ':recchk' => $recchk,
                        ':codestchk' => $codestchk,
                        ':codchkser' => $codchkser
                    ));



                    for($i=0;$i<$cant_elementos;$i++){
                        //echo "elementodetalle=".$elementodetalle;
                        $elementodetalle = explode("$$",$detrecibido[$i]);
                        $rgrabado=$elementodetalle[1];
                        //echo "es grabado=".$rgrabado;
                        if($rgrabado==0){
                            $rcoddel = $elementodetalle[0];
                            $sql = "INSERT INTO tb_chkfamilia_delito (coddel,codchkser,codper,codsol)
                                          VALUES (:coddel,:codchkser,:codper,:codsol)";
                            $stmt =$dbh->prepare($sql);
                            //echo "recibido: ".$rcoddel."-".$codchkser."-".$codper."-".$codsol;
                            $stmt->execute(array(
                                ':coddel' => $rcoddel,
                                ':codchkser' => $codchkser,
                                ':codper' => $codper,
                                ':codsol' => $codsol
                            ));
                        }
                    }
                }else{
                    if($nomimgreniec!=''){
                        $nombre = $codsol."_".date("YmdGis")."_dni.".end(explode(".", $nomimgreniec));
                        if(move_uploaded_file($_FILES['imgreniecfam']['tmp_name'], $target_path.$nombre)) {
                            $archivorecibido =  $nombre;
                        } else{
                            echo "{success: false, confirma: {mensaje: 'No se pudo grabar la imagen, intente nuevamente'}}";
                            //echo "{\"success\":\"false\",\"errors\":{\"reason\":\"Ocurrio un error al cargar el archivo, Intente nuevamente\"},\"respuesta\":{\"estado\":\"-1\"},\"img\":{\"imagen\":\"$archivorecibido\"}}";
                            exit();
                        }
                    }
                    else{
                        $archivorecibido=$imgactual;
                    }

                    $sql = "INSERT INTO tb_chkfamiliar (codper,codsol,nombre,codpar,obsimgreniec,indrefpol,imgreniec,
                                refpolchk,indantpol,indreqjud,indrefter,indrefdro,indimpsalpai,indinvpen,invpenchk,
                                recchk,codestchk)
                        VALUES (:codper,:codsol,:nombre,:codpar,:obsimgreniec,:indrefpol,:nomimgreniec,
                            :refpolchk,:indantpol,:indreqjud,:indrefter,:indrefdro,:indimpsalpai,:indinvpen,:invpenchk,
                            :recchk,:codestchk)";
                            //recchk=:recchk, coddel=:coddel, codestchk=:codestchk where codsol=:codsol and codper=:codper";
                    $stmt=$dbh->prepare($sql);
                    $stmt->execute(array(
                        ':codper' => $codper,
                        ':codsol' => $codsol,
                        ':nombre' => $nombreper,
                        ':codpar' => $codpar,
                        ':obsimgreniec' => $obsimgreniec,
                        ':indrefpol' => $indrefpol,
                        ':nomimgreniec' => $archivorecibido,
                        ':refpolchk' => $refpolchk,
                        ':indantpol' => $indantpol,
                        ':indreqjud' => $indreqjud,
                        ':indrefter' => $indrefter,
                        ':indrefdro' => $indrefdro,
                        ':indimpsalpai' => $indimpsalpai,
                        ':indinvpen' => $indinvpen,
                        ':invpenchk' => $invpenchk,
                        ':recchk' => $recchk,
                        ':codestchk' => $codestchk
                    ));

                $codchkser=$dbh->lastInsertId();

                    for($i=0;$i<$cant_elementos;$i++){
                        //echo "elementodetalle=".$elementodetalle;
                        $elementodetalle = explode("$$",$detrecibido[$i]);
                        $rgrabado=$elementodetalle[1];
                        //echo "es grabado=".$rgrabado;
                        if($rgrabado==0){
                            $rcoddel = $elementodetalle[0];
                            $sql = "INSERT INTO tb_chkfamilia_delito (coddel,codchkser,codper,codsol)
                                          VALUES (:coddel,:codchkser,:codper,:codsol)";
                            $stmt =$dbh->prepare($sql);
                            //echo "recibido: ".$rcoddel."-".$codchkser."-".$codper."-".$codsol;
                            $stmt->execute(array(
                                ':coddel' => $rcoddel,
                                ':codchkser' => $codchkser,
                                ':codper' => $codper,
                                ':codsol' => $codsol
                            ));
                        }
                    }
                }
                $dbh->commit();
                echo "{success: true, confirma: {mensaje: 'Se grabaron correctamente los datos'},respuesta: {estado: '$codestchk'}, img: {imagen: '$archivorecibido' }}";
            } catch (Exception $e) {
//                echo 'PDO Excepciones.	';
//                echo 'Error con la base de datos: <br />';
//                echo 'SQL Query: ', $sql;
//                echo '<pre>';
                echo 'Error: ,'.$e->getMessage();
//                echo 'Archivo: ' . $e->getFile() . '<br />';
//                echo 'Linea: ' . $e->getLine() . '<br />';
//                echo '</pre>';
//                echo $e->getMessage();
                echo "{success: false, confirma: {mensaje: 'Ocurrio un error al grabar los datos, Comuniquese con Sistemas'}, respuesta: {estado: '$codestchk'}, img: {imagen: '$nomimgreniec' }}";

            }
            break;
        case 45: //Consultas de solicitud
            $ponerand=false;
            $codsol = $_POST['codsol'];
            $codcli = $_POST['codcli'];
            $codestsol = $_POST['codestsol'];
            $desde = $_POST['desde'];
            $hasta = $_POST['hasta'];
            $sqlquery ="select s.codsol,s.codcli,c.nomcli,s.fecregsol,s.fecvensol,CONCAT(DATEDIFF(s.fecvensol,s.fecregsol),' dias') as plazo,s.codestsol,e.desestsol,concat(u.nomuser,' ',u.apeuser) as usuario,
                        (select count(ds.codsol) from tb_detallesolicitud ds where ds.codsol=s.codsol) as canper
                        from tb_solicitud s left join tb_cliente c on s.codcli=c.codcli
                        left join tb_estsol e on s.codestsol=e.codestsol
                        left join tb_users u on s.usuregsol=u.loguser";
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
            $codsol	= $_POST['codsol'];
            $sqlquery ="select ds.codsol,ds.codper,concat(p.nomper,' ',p.apepatper,' ',p.apematper) as nombre,p.codtipdoc,doc.destipdoc,p.numdocper,ds.codpacchk,pc.despacchk,ds.codpue,pu.despue
                        from tb_detallesolicitud ds left join tb_persona p on ds.codper=p.codper
                        left join tb_packcheck pc on ds.codpacchk=pc.codpacchk
                        left join tb_puesto pu on ds.codpue=pu.codpue
                        left join tb_tipdoc doc on p.codtipdoc=doc.codtipdoc
                        where codsol=".$codsol;
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
       case 10:
            $codchkser = $_POST['codchkser'];
            $sqlquery ="select d.coddel, de.nomdel, de.desdel, 1 as grabado from tb_chkfamilia_delito d, tb_delito de where
                        d.coddel=de.coddel and d.codchkser='$codchkser' order by de.nomdel";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            //echo $codchkser;
            echo '{"delitosgrab":'.json_encode($arr).'}';
            break;
       case 11:
           $codchkser=$_POST['codchkser'];
           $coddel=$_POST['coddel'];
           try {
               $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
                $dbh->beginTransaction();
                $sql = "DELETE from tb_delito_chkservice where codchkser=:codchkser and coddel=:coddel";
                        //recchk=:recchk, coddel=:coddel, codestchk=:codestchk where codsol=:codsol and codper=:codper";
                $stmt=$dbh->prepare($sql);
                $stmt->execute(array(
                    ':codchkser' => $codchkser,
                    ':coddel' => $coddel
                ));
                $dbh->commit();
                echo "{respuesta: {error : 0, mensaje: 'Se elimino correctamente'}}";
            } catch (Exception $e) {
//                echo 'PDO Excepciones.	';
//                echo 'Error con la base de datos: <br />';
//                echo 'SQL Query: ', $sql;
//                echo '<pre>';
                echo 'Error: ,'.$e->getMessage();
//                echo 'Archivo: ' . $e->getFile() . '<br />';
//                echo 'Linea: ' . $e->getLine() . '<br />';
//                echo '</pre>';
//                echo $e->getMessage();
                echo "{respuesta: {error : 1, mensaje: 'No se pudo eliminar el delito, intente nuevamente'}}";

            }

           break;
}
?>
