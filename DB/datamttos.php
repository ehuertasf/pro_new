<?php
/**
* Scripts para grabar los datos de los formularios mantenimiento de tipo de documentos, tipo de clientes y usuarios
* @version 1.0 Codigo PHP para los mantenimientos de tipo de documento y de clientes (17-04-2010)
* @version 1.1 Se agrego scripts para el mantenimiento de usuarios (20-04-2010)
* @author Ricardo De la Torre
*/
header("Content-type: application/json; charset=UTF-8");
header("Cache-control: No-Cache");
header("Pragma: No-Cache");

include_once("connect.php");
$link=conectarse();
$dbh=conectaPDO();
$x = (isset($_POST['x']) ? $_POST['x'] : $_GET['x']);

/*
* El case 1 y 2 corresponden al formulario mantenimiento de tipos de documentos
* Los case 3 y 4 corresponden al formulario mantenimiento de tipos de cliente
*/

switch ($x){
    case 1:
        /*
        * Listar tipos de documento
        */
        $isql_="SELECT codtipdoc,destipdoc,IF(esttipdoc=1,'Activo','Inactivo') as esttipdoc,esttipdoc as est FROM tb_tipdoc ORDER BY 2";
        $iqry_=mysql_query($isql_);
        while($obj = mysql_fetch_object($iqry_)) {
            $arr[] = $obj;
        }
        echo '{"tipdoc":'.json_encode($arr).'}';
        break;
    case 2 :

        $accion=$_POST["accion"];

        switch ($accion){
            case 1:
                /*
                * Grabar nuevo tipo de documento
                * Agregar indice unico a la tabla tb_tipdoc, para evitar que se repitan los nombres de tipos de documentos
                * ALTER TABLE `prodb`.`tb_tipdoc` ADD UNIQUE `idx_desctipdoc` (`destipdoc`);
                */

                if($_POST["activo"]=='true') $estado=1;
                if($_POST["inactivo"]=='true') $estado=0;

                try{
                    $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

                    $dbh->beginTransaction();
                    $sql="INSERT IGNORE INTO tb_tipdoc (destipdoc,esttipdoc) VALUES(:xdesc,:xesta);";
                    $stmt = $dbh->prepare($sql);
                    $stmt->execute(array(
                        ':xdesc'=>trim($_POST["desc"]),
                        ':xesta'=>$estado

                    ));
                    $n=$dbh->lastInsertId();
                    $dbh->commit();
                    if($n==0) {
                        print 2;
                    }else{
                        print 1;
                    }

                }catch (PDOException $e){
                    $dbh->rollBack();
		// echo 'Error: ' .$e->getMessage() . ' en el archivo: ' . $e->getFile() . ' en la linea: ' . $e->getLine() . '<br />';
                }
                break;
            case 2:
                /*
                * Grabar cambios en el tipo de documento
                */
                if($_POST["activo"]=='true') $estado=1;
                if($_POST["inactivo"]=='true') $estado=0;

                try{
                    $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

                    $sql="update tb_tipdoc set destipdoc=:xdesc,esttipdoc=:xest where codtipdoc=:xid;";
                    $stmt = $dbh->prepare($sql);
                    $stmt->bindParam(':xid',$_POST["id"]);
                    $stmt->bindParam(':xdesc',trim($_POST["desc"]));
                    $stmt->bindParam(':xest',$estado);
                    $stmt->execute();
                    print 3;

                }catch (PDOException $e){
		// echo 'Error: ' .$e->getMessage() . ' en el archivo: ' . $e->getFile() . ' en la linea: ' . $e->getLine() . '<br />';
                }
                break;

        }
        break;
    case 3:
        /*
        * Listar tipos de cliente
        */
        $isql_="SELECT codtipcli,destipcli,IF(esttipcli=1,'Activo','Inactivo') as esttipcli,esttipcli as est FROM tb_tipcliente ORDER BY 2";
        $iqry_=mysql_query($isql_);
        while($obj = mysql_fetch_object($iqry_)) {
            $arr[] = $obj;
        }
        echo '{"tipcli":'.json_encode($arr).'}';
        break;
    case 4:
        $accion=$_POST["accion"];

        switch ($accion){
            case 1:
                /*
                * Grabar nuevo tipo de cliente
                * Agregar indice unico a la tabla tb_tipcliente, para evitar que se repitan los nombres de tipos de cliente
                * ALTER TABLE `prodb`.`tb_tipcliente` ADD UNIQUE `idx_desctipcliente` (`destipcli`);
                */

                if($_POST["activo"]=='true') $estado=1;
                if($_POST["inactivo"]=='true') $estado=0;

                try{
                    $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

                    $dbh->beginTransaction();
                    $sql="INSERT IGNORE INTO tb_tipcliente (destipcli,esttipcli) VALUES(:xdesc,:xesta);";
                    $stmt = $dbh->prepare($sql);
                    $stmt->execute(array(
                        ':xdesc'=>trim($_POST["desc"]),
                        ':xesta'=>$estado

                    ));
                    $n=$dbh->lastInsertId();
                    $dbh->commit();
                    if($n==0) {
                        print 2;
                    }else{
                        print 1;
                    }

                }catch (PDOException $e){
                    $dbh->rollBack();
		// echo 'Error: ' .$e->getMessage() . ' en el archivo: ' . $e->getFile() . ' en la linea: ' . $e->getLine() . '<br />';
                }
                break;
            case 2:
                /*
                * Grabar cambios en el tipo de cliente
                */
                if($_POST["activo"]=='true') $estado=1;
                if($_POST["inactivo"]=='true') $estado=0;

                try{
                    $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

                    $sql="update tb_tipcliente set destipcli=:xdesc,esttipcli=:xest where codtipcli=:xid;";
                    $stmt = $dbh->prepare($sql);
                    $stmt->bindParam(':xid',$_POST["id"]);
                    $stmt->bindParam(':xdesc',trim($_POST["desc"]));
                    $stmt->bindParam(':xest',$estado);
                    $stmt->execute();
                    print 3;

                }catch (PDOException $e){                    
		// echo 'Error: ' .$e->getMessage() . ' en el archivo: ' . $e->getFile() . ' en la linea: ' . $e->getLine() . '<br />';
                }
                break;
        }
        break;
	case 5:
		/*
		 * Listar usuarios
		 */
		$isql_="SELECT a.coduser,a.nomuser,a.apeuser,a.loguser,a.pasuser,IF(a.estuser=1,'Activo','Inactivo') AS estuser,a.estuser AS est,
                        b.nomcli,c.desperf,a.codperf
                        FROM tb_users a,tb_cliente b,tb_perfil c
                        WHERE a.codcli=b.codcli AND a.codperf=c.codperf
                        ORDER BY nomuser ASC;";
        $iqry_=mysql_query($isql_);
        while($obj = mysql_fetch_object($iqry_)) {
            $arr[] = $obj;
        }
        echo '{"users":'.json_encode($arr).'}';
		break;
	case 6:
		$accion=$_POST["accion"];
		session_start();
		
        switch ($accion){
            case 1:
                /*
                * Grabar nuevo usuario
                */

                try{
                    $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

                    $dbh->beginTransaction();
                    $sql="INSERT IGNORE INTO tb_users (nomuser,apeuser,loguser,pasuser,codcli,codperf,estuser,fecregusu,usuregusu)
                            VALUES(:xnombre,:xapellido,:xlogin,:xpass,:xcodcli,:xcodperf,:xestado,NOW(),:xcodusuario);";
                    $stmt = $dbh->prepare($sql);
                    $stmt->execute(array(
                        ':xnombre'=>ucfirst(trim($_POST["nombre"])),
                        ':xapellido'=>ucfirst(trim($_POST["apellido"])),
                        ':xlogin'=>trim($_POST["login"]),
                        ':xpass'=>md5(trim($_POST["pass"])),
                        ':xcodcli'=>trim($_POST["empresa"]),
                        ':xcodperf'=>trim($_POST["perfil"]),
                        ':xcodusuario'=> $_SESSION['us3r1d'],
                        ':xestado'=>$_POST["rb-tuser"]
                    ));
                    $n=$dbh->lastInsertId();
                    $dbh->commit();
                    if($n==0) {
                        echo "{ success:false }";
                    }else{
                        echo "{ success:true }";
                    }

                }catch (PDOException $e){
                    $dbh->rollBack();
					 echo 'Error: ' .$e->getMessage() . ' en el archivo: ' . $e->getFile() . ' en la linea: ' . $e->getLine() . '<br />';
                }
                break;
            case 2:
                /*
                * Grabar cambios en usuario
                */

                try{
                    $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

                    if($_POST["xcaso_"]==0){
                        /*
                         * Actualizamos datos de usuarios que no pertenecen a Pro Outsourcing
                         */
                        $sql="update tb_users set nomuser=:xnomuser,apeuser=:xapeuser,estuser=:xest where coduser=:xcoduser;";

                        $stmt = $dbh->prepare($sql);
                        $stmt->bindParam(':xcoduser',$_POST["id"]);
                        $stmt->bindParam(':xnomuser',trim($_POST["nombre"]));
                        $stmt->bindParam(':xapeuser',trim($_POST["apellido"]));
                        $stmt->bindParam(':xest',$_POST["rb-tuser"]);
                        $stmt->execute();
                        echo "{ success:true }";

                    }elseif($_POST["xcaso_"]==1){
                        $sql="update tb_users set nomuser=:xnomuser,apeuser=:xapeuser,estuser=:xest,codperf=:xcodperf where coduser=:xcoduser;";
                        $stmt = $dbh->prepare($sql);
                        $stmt->bindParam(':xcoduser',$_POST["id"]);
                        $stmt->bindParam(':xnomuser',trim($_POST["nombre"]));
                        $stmt->bindParam(':xapeuser',trim($_POST["apellido"]));
                        $stmt->bindParam(':xest',$_POST["rb-tuser"]);
                        $stmt->bindParam(':xcodperf',$_POST["codperf"]);
                        $stmt->execute();
                        echo "{ success:true }";
                    }elseif($_POST["xcaso_"]==2){
                        $sql="update tb_users set pasuser=:xpasuser where coduser=:xcoduser;";
                        $stmt = $dbh->prepare($sql);
                        $stmt->bindParam(':xcoduser',$_POST["id"]);
                        $stmt->bindParam(':xpasuser',md5($_POST["pass"]));
                        $stmt->execute();
                        echo "{ success:true }";
					}
                    


                }catch (PDOException $e){
                    
                     echo 'Error: ' .$e->getMessage() . ' en el archivo: ' . $e->getFile() . ' en la linea: ' . $e->getLine() . '<br />';
                }
                break;
        }
		break;
	case 7:
		/*
		 * Lista los perfiles
		 */
                $i = (isset($_POST['i']) ? $_POST['i'] : $_GET['i']);

				if($i==1){
					//Pertenece a Pro Outsourcing
					$isql_="SELECT codperf,desperf FROM tb_perfil ORDER BY 2 ASC;";
				}else{
					//Si es un cliente solo puede tener el perfil Cliente
					$isql_="SELECT codperf,desperf FROM tb_perfil where codperf=3 ORDER BY 2 ASC;";
				}


                $iqry_=mysql_query($isql_);
                while($obj = mysql_fetch_object($iqry_)) {
                    $arr[] = $obj;
                }
                echo '{"perfiles":'.json_encode($arr).'}';
		break;
	case 8:
		/*
		 * Consulto los datos de un usuario para editar
		 */
		$id=$_POST["id"];
		$qry="SELECT a.coduser,a.nomuser,a.apeuser,a.loguser,a.pasuser,a.codperf,b.desperf,a.estuser,a.codcli,c.nomcli
                    FROM tb_users a,tb_perfil b,tb_cliente c WHERE a.codperf=b.codperf AND a.codcli=c.codcli AND a.coduser=$id";
		$rqry=mysql_query($qry);
                while($obj = mysql_fetch_array($rqry)) {
			$coduser=$obj['coduser'];
                        $nombre=$obj['nomuser'];
			$apeuser=$obj['apeuser'];
			$login=$obj['loguser'];
			$pass=$obj['pasuser'];
			$codperf=$obj['codperf'];
			$estado=$obj['estuser'];
			$codcli=$obj['codcli'];
                        $nomperfil=$obj['desperf'];
                        $nomcliente=$obj['nomcli'];
                }
		$response = array('nombre'=>$nombre, 'apeuser'=>$apeuser,'login'=>$login,'pass'=>$pass,
                        'codperf'=>$codperf,'estado'=>$estado,'codcli'=>$codcli,'desperf'=>$nomperfil,'nomcliente'=>$nomcliente );
                $json_response = json_encode($response);
		echo $json_response;		
            break;
        case 9:
                /*
                 * Verificamos si el login ya existe, cuando se ingresa un nuev usuario
                 */
            try{
                $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
                $j_ubica="select count(*) as total from tb_users where loguser=:xvalor";

                $stmt =$dbh->prepare($j_ubica);
                $stmt->bindParam(':xvalor',trim($_POST["v"]));
                $stmt->execute();

                while($row=$stmt->fetch(PDO::FETCH_ASSOC)){
                    $cant = $row['total'];
                }

                if($cant>0){
                    print 2;
                }else{
                    print 1;
                }
            }catch (PDOException $e){
                //solo lo descomento para ver los errores
                //echo 'Error: ' .$e->getMessage() . ' en el archivo: ' . $e->getFile() . ' en la linea: ' . $e->getLine() . '<br />';
            }
            break;

}

?>