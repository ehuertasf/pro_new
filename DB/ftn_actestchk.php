<?php

/**
 * Actualizamos el estado de la persona en la grilla detalle de solicitud.
 * @author Ricardo De la Torre G.
 * @version 1.0
 * 
 * @param string $codsol 
 */

function ftn_act_estadochk($codsol){

	$jquery_=mysql_query("SELECT ds.codsol,ds.codper,ds.codpacchk
			FROM tb_detallesolicitud ds LEFT JOIN tb_persona p ON ds.codper=p.codper
			LEFT JOIN tb_packcheck pc ON ds.codpacchk=pc.codpacchk
			LEFT JOIN tb_puesto pu ON ds.codpue=pu.codpue
			LEFT JOIN tb_tipdoc doc ON p.codtipdoc=doc.codtipdoc
			WHERE codsol=".$codsol);

	while($jfila_=mysql_fetch_array($jquery_)){

		$codper=$jfila_[1];
		mysql_query("delete from tmp_estperchk where codper=$codper and codsol=$codsol;") or die(mysql_error());
		mysql_query("delete from tmp_estactchk where codper=$codper and codsol=$codsol;") or die(mysql_error());
		$iquery_=mysql_query("SELECT u.codchk,t.nomtbl FROM tb_detallepackcheck u,tb_check t WHERE u.codchk=t.codchk AND u.codpacchk='".$jfila_[2]."';");
		while($ifila_=mysql_fetch_array($iquery_)){
			$codchk=$ifila_[0];
			$nomtbl=$ifila_[1];
			$oquery_=mysql_query("select codestchk from $nomtbl where codper=$codper and codsol=$codsol;");
			while($ofila_=mysql_fetch_array($oquery_)){
				mysql_query("insert into tmp_estperchk (codsol,codper,codchk,codestchk) values ($codsol,$codper,$codchk,'".$ofila_[0]."')") or die(mysql_error());
			}

		}


		$wquery_=mysql_query("SELECT codchk,codestchk FROM tmp_estperchk WHERE codsol=$codsol AND codper=$codper ORDER BY 2;");
		while($wfila_=mysql_fetch_array($wquery_)){
			if($wfila_[1]!=3){
				mysql_query("insert into tmp_estactchk (codsol,codper,codestchk) values ($codsol,$codper,$wfila_[1])") or die(mysql_error());
				break;
			}else{
				mysql_query("insert into tmp_estactchk (codsol,codper,codestchk) values ($codsol,$codper,3)") or die(mysql_error());
				break;
			}
		}
	}

}

?>
