<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
include_once("connect.php");
$link=conectarse();
$dbh=conectaPDO();
$n = (isset($_POST['n']) ? $_POST['n'] : $_GET['n']);
switch ($n){
        case 0: //Lista Clientes
              $query = "select codcli,codestcli,codtipcli,nomcli,ruccli,dircli,telcli from tb_cliente order by nomcli";
              $result = mysql_query($query);
              $nbrows = mysql_num_rows($result);
              $start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);
              $end = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);
              $limit = $query." LIMIT ".$start.",".$end;
              $result = mysql_query($limit);
              if($nbrows>0){
                    while($rec = mysql_fetch_array($result)){
                      $arr[] = $rec;
                    }
                    $jsonresult = json_encode($arr);
                    echo '({"total":"'.$nbrows.'","listadocli":'.$jsonresult.'})';
                  } else {
                    echo '({"total":"0", "listadocli":""})';
                  }
            break;
        case 1: //Tipos de Documentos
            $sqlquery ="select codestcli,desestcli from tb_estcliente";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"estcli":'.json_encode($arr).'}';
            break;
        case 2:	//Resultado de Busqueda
            $txtbuscar=$_GET["query"];
            $sqlquery ="select * from tb_cliente where ruccli like '%".$txtbuscar."%' or nomcli like '%".$txtbuscar."%'";
            //print $sqlquery;
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
                    echo '{"busquedacli":'.json_encode($arr).'}';
            break;
        case 3: //Actualiza Cliente
            $codcli	= $_POST['codcli'];
            $nomcli	= $_POST['nomcli'];
            $ruccli	= $_POST['ruccli'];
            $dircli	= $_POST['dircli'];
            $telcli	= $_POST['telcli'];
            $codestcli	= $_POST['codestcli'];
            $codtipcli	= $_POST['codtipcli'];
            if ($codcli!='' ){
                try {
                    $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
                    $dbh->beginTransaction();
                    $sql = "UPDATE tb_cliente SET nomcli=:nomcli, ruccli=:ruccli,dircli=:dircli,
                        telcli=:telcli,codestcli=:codestcli,codtipcli=:codtipcli WHERE codcli=:codcli" ;
                    $stmt=$dbh->prepare($sql);
                    $stmt->execute(array(
                        ':nomcli' => $nomcli,
                        ':ruccli' => $ruccli,
                        ':dircli' => $dircli,
                        ':telcli' => $telcli,
                        ':codestcli' => $codestcli,
                        ':codtipcli' => $codtipcli,
                        ':codcli' => $codcli
                    ));
                    $dbh->commit();
                    echo "{respuesta: {error : 0, mensaje: 'Se actualizaron correctamente los datos' }}";
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
   //                 echo $e->getMessage();
                    echo "{respuesta: {error : 1, mensaje: 'Ocurrio un error al actualizar los datos comuniquese con Sistemas' }}";
                }
            }
            break;
        case 4: //Graba Nueva Persona
            session_start();
            $user       = $_SESSION['us3r1d'];
            $nomcli	= $_POST['nomcli'];
            $ruccli	= $_POST['ruccli'];
            $dircli	= $_POST['dircli'];
            $telcli	= $_POST['telcli'];
            $codestcli	= $_POST['codestcli'];
            $codtipcli	= $_POST['codtipcli'];
            $fecha	= date('Y-m-d H:i:s');
            try {
                $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
                $dbh->beginTransaction();
                $sql = "INSERT INTO tb_cliente(codestcli,codtipcli,nomcli,ruccli,dircli,telcli,usuregcli,fecregcli)
                                values(:codestcli,:codtipcli,:nomcli,:ruccli,:dircli,:telcli,:user,:fecha)" ;
                $stmt=$dbh->prepare($sql);
                $stmt->execute(array(
                    ':codestcli' => $codestcli,
                    ':codtipcli' => $codtipcli,
                    ':nomcli' => $nomcli,
                    ':ruccli' => $ruccli,
                    ':dircli' => $dircli,
                    ':telcli' => $telcli,
                    ':user' => $user,
                    ':fecha' => $fecha
                ));
                $codcli=$dbh->lastInsertId();
                $dbh->commit();
                echo "{respuesta: {error : 0, mensaje: 'Se grabaron correctamente los datos', codcli: $codcli} }";
            } catch (Exception $e) {
                $dbh->rollBack();
//                echo "{respuesta: {error : 1, mensaje: 'Ocurrio un error al grabar los datos comuniquese con Sistemas' }}";
            }
            break;
        case 5: //Tipos de Documentos
            $sqlquery ="select codtipcli,destipcli from tb_tipcliente where esttipcli=1";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"tipcli":'.json_encode($arr).'}';
            break;
        case 6: //Clientes habiles para solcicitudes
            $sqlquery ="select c.codcli,c.nomcli from tb_cliente c left join tb_estcliente e
                        on c.codestcli=e.codestcli where e.clihab=1";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"solcliente":'.json_encode($arr).'}';
            break;
        case 7: //Listado de clientes sin usar limit
			$query = "select codcli,codestcli,codtipcli,nomcli,ruccli,dircli,telcli from tb_cliente order by nomcli";
            $result = mysql_query($query);


            while($obj = mysql_fetch_object($result)) {
                    $arr[] = $obj;
            }
            echo '{"listadocli":'.json_encode($arr).'}';
            break;

}
?>
