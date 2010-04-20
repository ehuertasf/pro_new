<?php
/**
* Scripts para grabar los datos de los formularios mantenimiento de tipo de documentos y tipo de cliente
* @version 1.0
* @author Ricardo De la Torre
* 17-04-2010
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
                    $dbh->rollBack();
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
				* Grabar cambios en el tipo de documento
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
                    $dbh->rollBack();
					// echo 'Error: ' .$e->getMessage() . ' en el archivo: ' . $e->getFile() . ' en la linea: ' . $e->getLine() . '<br />';
                }
                break;
        }
        break;
}

?>