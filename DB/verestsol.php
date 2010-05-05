<?php
/**
 * Actualizamos el estado de la solicitud a Finalizada siempre y cuando los checks de
 * cada una de las personas asociadas a la solicitud tiene estado finalizado
 * @version 1.0
 * @author Ricardo De la Torre
 * 17-04-2010
 */

include_once("connect.php");
$link=conectarse();
$dbh=conectaPDO();


$codsol = (isset($_POST['codsol']) ? $_POST['codsol'] : $_GET['codsol']);
$logus = (isset($_POST['logus']) ? $_POST['logus'] : $_GET['logus']);

include("ftn_actestchk.php");
ftn_act_estadochk($codsol,$logus);
$i=0;
$iquery_=mysql_query("select codestchk from tmp_estactchk where codsol=$codsol order by 1 asc;");
while($irow=mysql_fetch_array($iquery_)){
	if($irow[0]!=3){
		$i++;
	}
}

if($i==0){
	try {
                mysql_query("UPDATE tb_solicitud SET fecciesol=NOW() WHERE codsol=$codsol;") or die(mysql_error());

		$dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
		$dbh->beginTransaction();
		$sql1="update tb_solicitud set codestsol=3 where codsol=:xcodsol";
		$stmt=$dbh->prepare($sql1);
		$stmt->execute(array(
			':xcodsol' => $codsol
		));

                $sql2="UPDATE tb_solicitud SET fecciesol=NOW() WHERE codsol=:xcodsol";
                $stmt2=$dbh->prepare($sql2);
		$stmt2->execute(array(
			':xcodsol' => $codsol
		));

                $sql3="UPDATE tb_detallesolicitud SET codestchk=3 WHERE codsol=:xcodsol";
                $stmt3=$dbh->prepare($sql3);
		$stmt3->execute(array(
			':xcodsol' => $codsol
		));

		$dbh->commit();




	} catch (Exception $e) {
		$dbh->rollBack();
//     echo 'SQL Query: ', $sql;
	}
		echo 1;
}else{
	echo 2;
}

?>
