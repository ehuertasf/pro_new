<?php
/**
 * Actualizamos el estado de la solicitud a Finalizada siempre y cuando los checks de
 * cada una de las personas asociadas a la solicitud tiene estado finalizado
 * @version 1.0
 * @author Ricardo De la Torre G.
 * 17-04-2010
 */

include_once("connect.php");
$link=conectarse();
$dbh=conectaPDO();


$codsol = (isset($_POST['codsol']) ? $_POST['codsol'] : $_GET['codsol']);


include("ftn_actestchk.php");

$i=0;
$iquery_=mysql_query("select codestchk from tmp_estactchk where codsol=$codsol order by 1 asc;");
while($irow=mysql_fetch_array($iquery_)){
	if($irow[0]!=3){
		$i++;
	}
}

if($i==0){
	try {
		$dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
		$dbh->beginTransaction();
		$sql="update tb_solicitud set codestsol=3 where codsol=:xcodsol";
		$stmt=$dbh->prepare($sql);
		$stmt->execute(array(
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
