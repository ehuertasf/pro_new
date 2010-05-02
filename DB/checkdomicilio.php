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
        case 0:
            $codchkdom = $_POST['codchkdom'];
            $sqlquery ="select d.codres, r.desres from tb_residentesdomicilio d, tb_residentes r where
                        d.codres=r.codres and d.codchkdom='$codchkdom' order by r.desres";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"residentesdom":'.json_encode($arr).'}';
            break;
        case 1: //Parentesco
            $sqlquery ="select codpar, despar from tb_parentesco where estpar='1' order by despar";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"parentescos":'.json_encode($arr).'}';
            break;
        case 2:	//Residentes
            $sqlquery ="select codres, desres from tb_residentes where estres='1' order by desres";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"residentes":'.json_encode($arr).'}';
            break;
        case 3:	//Vivienda
            $sqlquery ="select codviv, desviv from tb_vivienda where estviv='1' order by desviv";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"vivienda":'.json_encode($arr).'}';
            break;
        case 4:	//Material
            $sqlquery ="select codtipmat, destipmat from tb_tipomaterial where estipmat='1' order by destipmat";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"material":'.json_encode($arr).'}';
            break;
        case 5:	//Estado Construccion
            $sqlquery ="select codestcon, desestcon from tb_estadoconstruccion where esestcon='1' order by desestcon";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"construccion":'.json_encode($arr).'}';
            break;
        case 6:	//Zonificacion
            $sqlquery ="select codzonif, deszonif from tb_zonificacion where estzonif='1' order by deszonif";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"zonificacion":'.json_encode($arr).'}';
            break;
        case 7:	//Zona Riesgo
            $sqlquery ="select codzonrie, deszonrie from tb_zonariesgo where estzonrie='1' order by deszonrie";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"zonariesgo":'.json_encode($arr).'}';
            break;
        case 8:	//Recomendacion
            $sqlquery ="select codcon, descon from tb_conclusion where estcon='1' order by descon";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"conclusion":'.json_encode($arr).'}';
            break;
        case 9:	//Tipo Via
            $sqlquery ="select codtipvia, destipvia from tb_tipvias where esttipvia='1' order by destipvia";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"vias":'.json_encode($arr).'}';
            break;
        case 10://Departamento
            $sqlquery ="select coddpto, desdpto from tb_departamento where estdpto='1' order by desdpto";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"departamentos":'.json_encode($arr).'}';
            break;
        case 11://Provincia
            $depa = $_GET['depa'];
            $sqlquery ="select codpro, despro from tb_provincia where coddpto='$depa' and estpro='1' order by codpro";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"provincias":'.json_encode($arr).'}';
            break;
        case 12://Distrito
            $depa = $_GET['depa'];
            $prov = $_GET['prov'];
            $sqlquery ="select coddist, desdist from tb_distrito where coddpto='$depa' and codpro='$prov' and estdist='1' order by coddist";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"distritos":'.json_encode($arr).'}';
            break;
        case 13://Tipo Vivienda
            $sqlquery ="select codtipviv, destipviv from tb_tipovivienda where esttipviv='1' order by destipviv";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"tipovivienda":'.json_encode($arr).'}';
            break;
        case 14://Tipo Imagen
            $sqlquery ="select codtipimg, destipimg from tb_tipoimagen where esttipimg='1' order by destipimg";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"tipoimagen":'.json_encode($arr).'}';
            break;
        case 15: //Obtiene Datos CheckDomiciliario
            $codper = $_POST['codper'];
            $codsol = $_POST['codsol'];
            $sqlquery="SELECT codchkdom, coddpto, codpro, coddist, codtipvia, nomviadom, numdom, urbdom, 
                        domici, perent, codpar, otroparent, anoresdom, mesresdom, codviv, codtipviv,
                        otrtipviv, numpis, pisres, codtipmat, otrmatcon, codestcon, arever, colfac, numpue,
                        numven, tipmat, rejpro, pueaccveh, obsinmu, codzonif, otrzonif, codzonrie, codcon,
                        obscon, codestchk FROM tb_chkdomicilio where codper='$codper' and codsol='$codsol'";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"checkdomiciliopersona":'.json_encode($arr).'}';
            break;
        case 16: //Graba CheckDomiciliario
            session_start();
            $usuario  = $_SESSION['us3r1d'];
            $codchkdom = $_POST['codchkdom'];
            $codper = $_POST['codper'];
            $codsol = $_POST['codsol'];
            $coddpto = $_POST['coddpto'];
            $codpro = $_POST['codpro'];
            $coddist = $_POST['coddist'];
            $codtipvia = $_POST['codtipvia'];
            $nomviadom = $_POST['nomviadom'];
            $numdom = $_POST['numdom'];
            $urbdom = $_POST['urbdom'];
            $domici = $_POST['domici'];
            $perent = $_POST['perent'];
            $codpar = $_POST['codpar'];
            $otroparent = $_POST['otroparent'];
            $anoresdom = $_POST['anoresdom'];
            $mesresdom = $_POST['mesresdom'];
            $codviv = $_POST['codviv'];
            $codtipviv = $_POST['codtipviv'];
            $otrtipviv = $_POST['otrtipviv'];
            $numpis = $_POST['numpis'];
            $cpisres = $_POST['pisres'];
            $codtipmat = $_POST['codtipmat'];
            $otrmatcon = $_POST['otrmatcon'];
            $codestcon = $_POST['codestcon'];
            $arever = $_POST['arever'];
            $colfac = $_POST['colfac'];
            $numpue = $_POST['numpue'];
            $numven = $_POST['numven'];
            $tipmat = $_POST['tipmat'];
            $rejpro = $_POST['rejpro'];
            $pueaccveh = $_POST['pueaccveh'];
            $obsinmu = $_POST['obsinmu'];
            $codzonif = $_POST['codzonif'];
            $otrzonif = $_POST['otrzonif'];
            $codzonrie = $_POST['codzonrie'];
            $codcon = $_POST['codcon'];
            $obscon = $_POST['obscon'];
            $codestchk = $_POST['codestchk'];
            $detalle	= $_POST['detalle'];
            $detrecibido = explode("|,|",$detalle);
            $cant_elementos = count($detrecibido);
            try {
                $dbh->beginTransaction();
                //echo 'Paso la configuracion PDO<br>';
                $sqlchkdom="UPDATE tb_chkdomicilio SET coddpto=:coddpto, codpro=:copdro, coddist=:coddist,
                            codtipvia=:codtipvia, nomviadom=:nomviadom, numdom=:numdom, urbdom=:urbdom,
                            domici=:domici, perent=:perent, codpar=:codpar, otroparent=:otroparent,
                            anoresdom=:anoresdom, mesresdom=:mesresdom, codviv=:codviv, codtipviv=:codtipviv,
                            otrtipviv=:otrtipviv, numpis=:numpis, pisres=:pisres, codtipmat=:codtipmat,
                            otrmatcon=:otrmatcon, codestcon=:codestcon, arever=:arever, colfac=:colfac,
                            numpue=:numpue, numven=:numven, tipmat=:tipmat, rejpro=:rejpro, pueaccveh=:pueaccveh,
                            obsinmu=:obsinmu, codzonif=:codzonif, otrzonif=:otrzonif, codzonrie=:codzonrie,
                            codcon=:codcon, obscon=:obscon, fecciechkdom=:fecierre, usuciechkdom=:usucierre,
                            codestchk=:codestchk where codchkdom=:codchkdom";
                $stmt1 =$dbh->prepare($sqlchkdom);
                $stmt1->execute(array(
                    ':coddpto' => $coddpto,
                    ':copdro' => $codpro,
                    ':coddist' => $coddist,
                    ':codtipvia' => $codtipvia,
                    ':nomviadom' => $nomviadom,
                    ':numdom' => $numdom,
                    ':urbdom' => $urbdom,
                    ':domici' => $domici,
                    ':perent' => $perent,
                    ':codpar' => $codpar,
                    ':otroparent' => $otroparent,
                    ':anoresdom' => $anoresdom,
                    ':mesresdom' => $mesresdom,
                    ':codviv' => $codviv,
                    ':codtipviv' => $codtipviv,
                    ':otrtipviv' => $otrtipviv,
                    ':numpis' => $numpis,
                    ':pisres' => $pisres,
                    ':codtipmat' => $codtipmat,
                    ':otrmatcon' => $otrmatcon,
                    ':codestcon' => $codestcon,
                    ':arever' => $arever,
                    ':colfac' => $colfac,
                    ':numpue' => $numpue,
                    ':numven' => $numven,
                    ':tipmat' => $tipmat,
                    ':rejpro' => $rejpro,
                    ':pueaccveh' => $pueaccveh,
                    ':obsinmu' => $obsinmu,
                    ':codzonif' => $codzonif,
                    ':otrzonif' => $otrzonif,
                    ':codzonrie' => $codzonrie,
                    ':codcon' => $codcon,
                    ':obscon' => $obscon,
                    ':fecierre' => date('Y-m-d H:i:s'),
                    ':usucierre' => $usuario,
                    ':codestchk' => $codestchk,
                    ':codchkdom' => $codchkdom
                ));

                //Grabando el detalle de la solicitud
                for($i=0;$i<$cant_elementos;$i++){
                    $elementodetalle = explode("$$",$detrecibido[$i]);
                    $rcodsol     = $elementodetalle[0];
                    $rcodper     = $elementodetalle[1];
                    $rcodchkdom  = $elementodetalle[2];
                    $rcodres     = $elementodetalle[3];

                    $sqldetres = "INSERT INTO tb_residentesdomicilio (codsol,codper,codchkdom,codres)
                                  VALUES (:codsol,:codper,:codchkdom,:codres)";
                    $stmt2 =$dbh->prepare($sqldetres);
                    $stmt2->execute(array(
                        ':codsol' => $rcodsol,
                        ':codper' => $rcodper,
                        ':codchkdom' => $rcodchkdom,
                        ':codres' => $rcodres
                    ));
                }
                $dbh->commit();
                echo "{respuesta: {error : 0, mensaje: 'Se grabaron correctamente los datos', estado: '$codestchk' }}";
                //echo "ok";
            } catch (Exception $exc) {
                $dbh->rollBack();
//                echo 'PDO Excepciones.	';
//                echo 'Error con la base de datos: <br />';
//                echo 'SQL Query: ', $sql;
//                echo '<pre>';
//                echo 'Error: ,'.$e->getMessage();
//                echo 'Archivo: ' . $e->getFile() . '<br />';
//                echo 'Linea: ' . $e->getLine() . '<br />';
//                echo '</pre>';
//                echo $e->getMessage();
                  echo "{respuesta: {error : 1, mensaje: 'Se grabaron correctamente los datos', estado: '$codestchk' }}";
//                echo "error";
            }

            break;
        case 17 :
            $codper = $_POST['codper'];
            $codsol = $_POST['codsol'];
            $codchkdom = $_POST['codchk'];
            $codimg1 = $_POST['codimg1'];
            $codimg2 = $_POST['codimg2'];
            $codimg3 = $_POST['codimg3'];
            $imgactdom1 = $_POST['imgdom1act'];
            $imgactdom2 = $_POST['imgdom2act'];
            $imgactmap = $_POST['imgmapact'];
            $nomimgdom1 =  basename( $_FILES['imgdom1']['name']);
            $nomimgdom2 =  basename( $_FILES['imgdom2']['name']);
            $nomimgmap =  basename( $_FILES['imgmap']['name']);
            $tipimgdom1 = $_POST['vcodtipimg1'];
            $tipimgdom2 = $_POST['vcodtipimg2'];
            $tipimgmap = $_POST['vcodtipimg3'];
            $target_path = "../files/images_dom/";

            if($nomimgdom1!=''){
                $nombre = $codsol."_".$codper."_".$codchkdom."_1.".end(explode(".", $nomimgdom1));
                if(move_uploaded_file($_FILES['imgdom1']['tmp_name'], $target_path.$nombre)) {
                    $archivo1 = $nombre;
                } else{
                    echo "{\"success\":\"false\",\"errors\":{\"reason\":\"Ocurrio un error al cargar el archivo, Intente nuevamente\"},\"respuesta\":{\"estado\":\"-1\"},\"img\":{\"imagen\":\"$nombre\"}}";
                    exit();
                }
            }
            else{
                $nomimgdom1=$imgactdom1;
            }

            if($nomimgdom2!=''){
                $nombre = $codsol."_".$codper."_".$codchkdom."_2.".end(explode(".", $nomimgdom2));
                if(move_uploaded_file($_FILES['imgdom2']['tmp_name'], $target_path.$nombre)) {
                    $archivo2 = $nombre;
                } else{
                    echo "{\"success\":\"false\",\"errors\":{\"reason\":\"Ocurrio un error al cargar el archivo, Intente nuevamente\"},\"respuesta\":{\"estado\":\"-1\"},\"img\":{\"imagen\":\"$nombre\"}}";
                    exit();
                }
            }
            else{
                $nomimgdom1=$imgactdom1;
            }

            if($nomimgmap!=''){
                $nombre = $codsol."_".$codper."_".$codchkdom."_map.".end(explode(".", $nomimgmap));
                if(move_uploaded_file($_FILES['imgmap']['tmp_name'], $target_path.$nombre)) {
                    $archivo3 = $nombre;
                } else{
                    echo "{\"success\":\"false\",\"errors\":{\"reason\":\"Ocurrio un error al cargar el archivo, Intente nuevamente\"},\"respuesta\":{\"estado\":\"-1\"},\"img\":{\"imagen\":\"$nombre\"}}";
                    exit();
                }
            }
            else{
                $nomimgmap=$imgactmap;
            }

            try {
                $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
                $dbh->beginTransaction();
                    $sql = "UPDATE tb_imgdomicilio set codtipimg=:codtipimg, nomimgdom=:nomimgdom
                                  where codsol=:codsol and codper=:codper and codchkdom=:codchkdom and numimgdom=:numero";
                    $stmt2 =$dbh->prepare($sql);
                    $stmt2->execute(array(
                        ':nomimgdom' => $archivo1,
                        ':codtipimg' => $tipimgdom1,
                        ':codsol' => $codsol,
                        ':codper' => $codper,
                        ':codchkdom' => $codchkdom,
                        ':numero' => 0
                    ));

                    $sql = "UPDATE tb_imgdomicilio set codtipimg=:codtipimg, nomimgdom=:nomimgdom
                                  where codsol=:codsol and codper=:codper and codchkdom=:codchkdom and numimgdom=:numero";
                    $stmt2 =$dbh->prepare($sql);
                    $stmt2->execute(array(
                        ':nomimgdom' => $archivo2,
                        ':codtipimg' => $tipimgdom2,
                        ':codsol' => $codsol,
                        ':codper' => $codper,
                        ':codchkdom' => $codchkdom,
                        ':numero' => 1
                    ));

                    $sql = "UPDATE tb_imgdomicilio set codtipimg=:codtipimg, nomimgdom=:nomimgdom
                                  where codsol=:codsol and codper=:codper and codchkdom=:codchkdom and numimgdom=:numero";
                    $stmt2 =$dbh->prepare($sql);
                    $stmt2->execute(array(
                        ':nomimgdom' => $archivo3,
                        ':codtipimg' => $tipimgmap,
                        ':codsol' => $codsol,
                        ':codper' => $codper,
                        ':codchkdom' => $codchkdom,
                        ':numero' => 2
                    ));

                $dbh->commit();
                echo "{respuesta: {error : 0, mensaje: 'Se grabaron correctamente las imagenes', imagen1: '$archivo1', imagen2: '$archivo2', mapa: '$archivo3' }}";

            } catch (Exception $e) {
                $dbh->rollBack();
//                echo 'PDO Excepciones.	';
//                echo 'Error con la base de datos: <br />';
//                echo 'SQL Query: ', $sql;
//                echo '<pre>';
//                echo 'Error: ,'.$e->getMessage();
//                echo 'Archivo: ' . $e->getFile() . '<br />';
//                echo 'Linea: ' . $e->getLine() . '<br />';
//                echo '</pre>';
//                echo $e->getMessage();
                echo "{respuesta: {error : 1, mensaje: 'No se pudo grabar las imagenes en el servidor' }}";
            }


            break;
        case 18: //Obtiene Imagenes CheckDomiciliario
            $codper = $_POST['codper'];
            $codsol = $_POST['codsol'];
            $sqlquery="SELECT codimgdom, codtipimg, nomimgdom
                        FROM tb_imgdomicilio where codper='$codper' and codsol='$codsol' order by numimgdom";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"imagenesdomicilio":'.json_encode($arr).'}';
            break;
//        case 5: //Consultas de solicitud
//            $ponerand=false;
//            $codsol = $_POST['codsol'];
//            $codcli = $_POST['codcli'];
//            $codestsol = $_POST['codestsol'];
//            $desde = $_POST['desde'];
//            $hasta = $_POST['hasta'];
//            $sqlquery ="select s.codsol,s.codcli,c.nomcli,s.fecregsol,s.fecvensol,CONCAT(DATEDIFF(s.fecvensol,s.fecregsol),' dias') as plazo,s.codestsol,e.desestsol,concat(u.nomuser,' ',u.apeuser) as usuario,
//                        (select count(ds.codsol) from tb_detallesolicitud ds where ds.codsol=s.codsol) as canper
//                        from tb_solicitud s left join tb_cliente c on s.codcli=c.codcli
//                        left join tb_estsol e on s.codestsol=e.codestsol
//                        left join tb_users u on s.usuregsol=u.loguser";
//            if($codsol!='' || $codcli!='' || $codestsol!='' || $desde!='' || $hasta!=''){
//                $sqlquery=$sqlquery.' WHERE';
//                if($codsol!=''){
//                    $sqlquery=$sqlquery.' s.codsol='.$codsol;
//                    $ponerand=true;
//                }else{
//                    $ponerand=false;
//                }
//                if($codcli!=''){
//                    if($ponerand==false){
//                        $sqlquery=$sqlquery.' s.codcli='.$codcli;
//                        $ponerand=true;
//                    }else{
//                        $sqlquery=$sqlquery.' and s.codcli='.$codcli;
//                        $ponerand=true;
//                    }
//                }
//                if($codestsol!=''){
//                    if($ponerand==false){
//                        $sqlquery=$sqlquery.' s.codestsol='.$codestsol;
//                        $ponerand=true;
//                    }else{
//                        $sqlquery=$sqlquery.' and s.codestsol='.$codestsol;
//                        $ponerand=true;
//                    }
//                }
//                if($desde!='' && $hasta!=''){
//                    if($ponerand==false){
//                        $sqlquery=$sqlquery.' s.fecregsol BETWEEN \''.$desde.'\' AND \''.$hasta.'\'';
//                        $ponerand=true;
//                    }else{
//                        $sqlquery=$sqlquery.' and s.fecregsol BETWEEN \''.$desde.'\' AND \''.$hasta.'\'';
//                        $ponerand=false;
//                    }
//                }
//            }
//            $stmt = mysql_query($sqlquery);
//            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
//            echo '{"busquedasol":'.json_encode($arr).'}';
//            //echo '{'.$sqlquery.'}';
//            break;
//       case 6: //Lista Paquetes de Check
//            $sqlquery ="select codpacchk,despacchk from tb_packcheck where estpacchk=1";
//            $stmt = mysql_query($sqlquery);
//            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
//            echo '{"packcheck":'.json_encode($arr).'}';
//            break;
//       case 7: //cabecera solicitud
//            $codsol	= $_POST['codsol'];
//            $sqlquery ="select codsol,codcli,fecvensol,obssol,codestsol from tb_solicitud where codsol=".$codsol;
//            $stmt = mysql_query($sqlquery);
//            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
//            echo '{"cabsolicitud":'.json_encode($arr).'}';
//            break;
//       case 8: //cabecera solicitud
//            $codsol	= $_POST['codsol'];
//            $sqlquery ="select ds.codsol,ds.codper,concat(p.nomper,' ',p.apepatper,' ',p.apematper) as nombre,p.codtipdoc,doc.destipdoc,p.numdocper,ds.codpacchk,pc.despacchk,ds.codpue,pu.despue
//                        from tb_detallesolicitud ds left join tb_persona p on ds.codper=p.codper
//                        left join tb_packcheck pc on ds.codpacchk=pc.codpacchk
//                        left join tb_puesto pu on ds.codpue=pu.codpue
//                        left join tb_tipdoc doc on p.codtipdoc=doc.codtipdoc
//                        where codsol=".$codsol;
//            $stmt = mysql_query($sqlquery);
//            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
//            echo '{"detpersol":'.json_encode($arr).'}';
//            break;
//       case 9: //cabecera solicitud
//            $codsol	= $_POST['codsol'];
//            $codper	= $_POST['codper'];
//            $sqlquery ="select sp.codsol,sp.codper,sp.codpacchk,sp.codpue,c.nomobj,concat(p.apepatper,' ',p.apematper,', ',p.nomper) as nombre from tb_detallesolicitud sp
//                            right join tb_detallepackcheck pc on sp.codpacchk=pc.codpacchk
//                            right join tb_check c on pc.codchk=c.codchk
//                            right join tb_persona p on sp.codper=p.codper
//                        where sp.codsol=".$codsol." and sp.codper=".$codper." order by sp.codper,pc.codpacchk,pc.codchk";
//            $stmt = mysql_query($sqlquery);
//            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
//            echo '{"checkspersona":'.json_encode($arr).'}';
//            break;
}
?>
