<?php

/**
 * Actualizamos el estado de la persona en la grilla detalle de solicitud.
 * @author Ricardo De la Torre G.
 * @version 1.0
 * 
 * @param string $codsol 
 */

function ftn_act_estadochk($codsol,$loguser){


	$jquery_=mysql_query("SELECT ds.codsol,ds.codper,ds.codpacchk
			FROM tb_detallesolicitud ds LEFT JOIN tb_persona p ON ds.codper=p.codper
			LEFT JOIN tb_packcheck pc ON ds.codpacchk=pc.codpacchk
			LEFT JOIN tb_puesto pu ON ds.codpue=pu.codpue
			LEFT JOIN tb_tipdoc doc ON p.codtipdoc=doc.codtipdoc
			WHERE codsol=".$codsol);

	while($jfila_=mysql_fetch_array($jquery_)){

		$codper=$jfila_[1];
		mysql_query("delete from tmp_estperchk where codper=$codper and codsol=$codsol and loguser='".$loguser."';") or die("error al seleccionar de tabla tmp_estperchk"); //or die(mysql_error());
		mysql_query("delete from tmp_estactchk where codper=$codper and codsol=$codsol and loguser='".$loguser."';") or die("error al seleccionar de tabla tmp_estactchk"); //or die(mysql_error());
		$iquery_=mysql_query("SELECT u.codchk,t.nomtbl FROM tb_detallepackcheck u,tb_check t WHERE u.codchk=t.codchk AND u.codpacchk='".$jfila_[2]."';");
		while($ifila_=mysql_fetch_array($iquery_)){
			$codchk=$ifila_[0];
			$nomtbl=$ifila_[1];
                        switch ($nomtbl){
                            case 'tb_chkservice':
                                $oquery_=mysql_query("select codestchk,codchkser from $nomtbl where codper=$codper and codsol=$codsol;");
                                break;
                            case 'tb_chkfamiliar':
                                $oquery_=mysql_query("select codestchk,codchkser from $nomtbl where codper=$codper and codsol=$codsol;");
                                break;
                            case 'tb_chkdomicilio':
                                $oquery_=mysql_query("select codestchk,codchkdom from $nomtbl where codper=$codper and codsol=$codsol;");
                                break;
                            case 'tb_chklaboral':
                                $oquery_=mysql_query("select codestchk,codchklab from $nomtbl where codper=$codper and codsol=$codsol;");
                                break;
                        }
			
			while($ofila_=mysql_fetch_array($oquery_)){
				mysql_query("insert into tmp_estperchk (codsol,codper,codchk,codestchk,fe_mov,loguser,codchkreg) values ($codsol,$codper,$codchk,'".$ofila_[0]."',NOW(),'".$loguser."','".$ofila_[1]."')") or die("error al insertar en tabla tmp_estperchk"); //or die(mysql_error());
			}

		}


		$wquery_=mysql_query("SELECT codchk,codestchk,codchkreg FROM tmp_estperchk WHERE codsol=$codsol AND codper=$codper ORDER BY 2;");
		while($wfila_=mysql_fetch_array($wquery_)){
			if($wfila_[1]!=3){
				mysql_query("insert into tmp_estactchk (codsol,codper,codestchk,fe_mov,loguser,codchkreg) values ($codsol,$codper,$wfila_[1],NOW(),'".$loguser."','".$wfila_[2]."')") or die("error al insertar en tabla tmp_estactchk"); //or die(mysql_error());
				break;
			}else{
				mysql_query("insert into tmp_estactchk (codsol,codper,codestchk,fe_mov,loguser,codchkreg) values ($codsol,$codper,3,NOW(),'".$loguser."','".$wfila_[2]."')") or die("error al insertar en tabla tmp_estperchk 2"); //or die(mysql_error());

                                mysql_query("update tb_detallesolicitud set codestchk=3 where codsol=$codsol and codper=$codper and codpacchk='".$jfila_[2]."'") or die("error al actualizar en tabla tb_detallesolicitud"); //or die(mysql_error());

				break;
			}
		}
	}

}

?>
