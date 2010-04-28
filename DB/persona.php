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
        case 0: //Lista Personas
              $query = "select codper,nomper,apepatper,apematper,codtipdoc,numdocper,estper from tb_persona order by apepatper, apematper, nomper";
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
                    echo '({"total":"'.$nbrows.'","listadoper":'.$jsonresult.'})';
                  } else {
                    echo '({"total":"0", "listadoper":""})';
                  }
            break;
        case 1: //Tipos de Documentos
            $sqlquery ="select codtipdoc,destipdoc from tb_tipdoc where esttipdoc=1";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
            echo '{"tipdocper":'.json_encode($arr).'}';
            break;
        case 2:	//Resultado de Busqueda
            $txtbuscar=$_GET["query"];
            $sqlquery ="select * from tb_persona where numdocper like '%".$txtbuscar."%' or CONCAT(nomper,' ',apepatper,' ',apematper) like '%".$txtbuscar."%'";
            $stmt = mysql_query($sqlquery);
            while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
                    echo '{"busquedaper":'.json_encode($arr).'}';
            break;
        case 3: //Actualiza Persona
            $codper	= $_POST['codper'];
            $nomper	= $_POST['nomper'];
            $apepatper	= $_POST['apepatper'];
            $apematper	= $_POST['apematper'];
            $codtipdoc	= $_POST['codtipdoc'];
            $numdocper	= $_POST['numdocper'];
            $estper     = $_POST['estper'];
            if ($codper!='' ){
                try {
                    $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
                    $dbh->beginTransaction();
                    $sql = "UPDATE tb_persona SET nomper=:nomper, apepatper=:apepatper,apematper=:apematper,codtipdoc=:codtipdoc,numdocper=:numdocper,estper=:estper WHERE codper=:codper" ;
                    $stmt=$dbh->prepare($sql);
                    $stmt->execute(array(
                        ':nomper' => $nomper,
                        ':apepatper' => $apepatper,
                        ':apematper' => $apematper,
                        ':codtipdoc' => $codtipdoc,
                        ':numdocper' => $numdocper,
                        ':estper' => $estper,
                        ':codper' => $codper
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
            $nomper	= $_POST['nomper'];
            $apepatper	= $_POST['apepatper'];
            $apematper	= $_POST['apematper'];
            $codtipdoc	= $_POST['codtipdoc'];
            $numdocper	= $_POST['numdocper'];
            $estper	= $_POST['estper'];
            $fecha	= date('Y-m-d H:i:s');
            try {
                $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
                $dbh->beginTransaction();
                $sql = "INSERT INTO tb_persona(nomper,apepatper,apematper,numdocper,estper,fecregper,usuregper,codtipdoc)
                                values(:nomper,:apepatper,:apematper,:numdocper,:estper,:fecha,:user,:codtipdoc)" ;
                $stmt=$dbh->prepare($sql);
                $stmt->execute(array(
                    ':nomper' => $nomper,
                    ':apepatper' => $apepatper,
                    ':apematper' => $apematper,
                    ':codtipdoc' => $codtipdoc,
                    ':numdocper' => $numdocper,
                    ':estper' => $estper,
                    ':user' => $user,
                    ':fecha' => $fecha
                ));
                $codper=$dbh->lastInsertId();
                $dbh->commit();
                echo "{respuesta: {error : 0, mensaje: 'Se grabaron correctamente los datos', codper: $codper} }";
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
                  //echo $e->getMessage();
                echo "{respuesta: {error : 1, mensaje: 'Ocurrio un error al grabar los datos comuniquese con Sistemas' }}";
            }
            break;
}
?>
