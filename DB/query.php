<?php
	ini_set("display_errors", "On");
	error_reporting(E_ALL ^ E_NOTICE);
	include("funciones.php");
	nocache();
	include_once("connect.php");
   	$link=conectarse();
	//include("funciones.php");
	$arr = array();
	$arr1 = array();
	$n=$_GET['n'];
	if(!$n) $n=$_POST['n'];
	$fechayhora = date("Y-m-d H:i", time());
	switch ($n){
		case 11: //
            $sqlquery ="select codtipdoc,destipdoc from tb_tipdoc where esttipdoc=1";
			$stmt = mysql_query($sqlquery);
			while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
			echo '{"tipdocper":'.json_encode($arr).'}';
			break;
			break;
			
		case 15: //	
			break;
			
		case 16: //	Combo Estado de Material
			break;
			
		case 17:  // 
			break;

		case 18:  // 
			$sqlquery ="select id,centro from tb_centro where flag=1";
			$stmt = mysql_query($sqlquery);
			while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
			echo '{"centro":'.json_encode($arr).'}';
			break;
		case 181:  // 
			$sqlquery1 ="select codpacchk,despacchk from tb_packcheck where estpacchk='A'";
			$stmt1 = mysql_query($sqlquery1);
			while($obj1 = mysql_fetch_object($stmt1)) {$arr1[] = $obj1;}
			echo '{"despacchk":'.json_encode($arr1).'}';
			break;
			//Nota: la variable del echo debe de ser la descripcion del query (despacchk) 
		case 182:  // 
			$sqlquery2 ="select codpue,despue from tb_puesto where estpue='A'";
			$stmt2 = mysql_query($sqlquery2);
			while($obj2 = mysql_fetch_object($stmt2)) {$arr2[] = $obj2;}
			echo '{"despue":'.json_encode($arr2).'}';
			break;

		case 183:  // 
			$sqlquery2 ="select codestcli,desestcli from tb_estcliente";
			$stmt2 = mysql_query($sqlquery2);
			while($obj2 = mysql_fetch_object($stmt2)) {$arr2[] = $obj2;}
			echo '{"desestcli":'.json_encode($arr2).'}';
			break;
				
				
		case 19:  ////////////////////////////// INSERT MATERIALES

			$id_ptr		= $_GET['id_ptr'];
			$cod_ptr	= $_GET['cod_ptr'];
			$cod_mat	= $_GET['cod_mat'];
			$precio		= $_GET['precio'];
			$cant		= $_GET['cant'];
			$tipo_ing	= $_GET['tipo_ing'];
			$centro		= $_GET['centro'];
			$almacen	= $_GET['almacen'];
			$usuario	= $_GET['usuario'];
			$f_registro = date('Y-m-d H:i:s'); //HOY

			$qry_Insert = "INSERT INTO detalle_registro_ptr(id_reg_ptr,reg_ptr,c_material,precio,cantidad,tp_ing,centro,almacen,fec_registro,usu_registro) 
								values ($id_ptr,'$cod_ptr','$cod_mat',$precio,$cant,$tipo_ing,'$centro','$almacen','$f_registro','$usuario')" ;
			$result_Insert = mysql_query($qry_Insert) or die ("Error(1) al insertar material");
			if ($result_Insert) echo 'Grabacion Satisfactora';
			else 'Error(2) al insertar material';
			break;

	case 191:  ////////////////////////////// INSERT MATERIALES

			$codsolx	= $_GET['codsol'];
			$codperx	= $_GET['codperx'];
			$codchkx 	= $_GET['codchkx'];
			$codpuex	= $_GET['codpuex'];
			$codpacchkx	= $_GET['codpacchkx'];
			$usuario	= $_GET['usuario'];
			$f_registro = date('Y-m-d H:i:s'); //HOY

			$qry_Insert = "INSERT INTO tb_solicitud_has_tb_persona2(codsol,codper,codpue,codpacchk,fec_registro,usu_registro)
								values ('$codsolx','$codperx','$codpuex','$codpacchkx','$f_registro','$usuario')" ;
			$result_Insert = mysql_query($qry_Insert) or die ("Error(1) al insertar Persona");
			if ($result_Insert) echo 'Grabacion Satisfactora';
			else 'Error(2) al insertar Persona';
			break;

		case 20:  ////////////////////////////// ELIMINA MATERIALES

			$idDetaReg		= $_GET['idDetaReg'];
			$qry_Delete = "	DELETE FROM  detalle_registro_ptr WHERE id_deta_reg=$idDetaReg" ;
			$result_Delete = mysql_query($qry_Delete) or die ("Error(1) eliminar material");
			if ($result_Delete) echo 'Material eliminado';
			else 'Error(2) al eliminar material';
			break;

	   case 201:  ////////////////////////////// ELIMINA MATERIALES

			$idcodpersol= $_GET['idcodpersol'];
			//$idcodpersol= '1';
			
			$qry_Delete = "	DELETE FROM  tb_solicitud_has_tb_persona2 WHERE codsolper=$idcodpersol" ;
			$result_Delete = mysql_query($qry_Delete) or die ("Error(1) al eliminar la Persona");
			if ($result_Delete) echo 'Persona eliminado';
			else 'Error(2) al eliminar Persona';
			break;
		case 21:  ////////////////////////////// INSERT MANO OBRA

			$id_ptr		= $_GET['id_ptr'];
			$cod_ptr	= $_GET['cod_ptr'];
			$cod_mano	= $_GET['cod_mano'];
			$baremo		= $_GET['baremo'];
			$cant		= $_GET['cant'];
			$tipo_ing	= $_GET['tipo_ing'];
			$usuario	= $_GET['usuario'];
			$f_registro = date('Y-m-d H:i:s'); //HOY

			$qry_Insert = "INSERT INTO detalle_registro_ptr(id_reg_ptr,reg_ptr,c_material,cantidad,baremo,tp_ing,fec_registro,usu_registro) 
								values ($id_ptr,'$cod_ptr','$cod_mano',$cant,$baremo,$tipo_ing,'$f_registro','$usuario')" ;
			$result_Insert = mysql_query($qry_Insert) or die ("Error(1) al insertar manbo de obra");
			if ($result_Insert) echo 'Grabacion Satisfactora';
			else 'Error(2) al insertar mano de obra';
			break;

		case 22:  ////////////////////////////// ELIMINA MANO OBRA

			$idDetaReg		= $_GET['idDetaReg'];
			$qry_Delete = "	DELETE FROM  detalle_registro_ptr WHERE id_deta_reg=$idDetaReg" ;
			$result_Delete = mysql_query($qry_Delete) or die ("Error(1) eliminar mano de obra");
			if ($result_Delete) echo 'Mano de obra eliminada';
			else 'Error(2) al eliminar mano de obra';
			break;
		case 23:  ////////////////////////////// INSERT ELEMENTOS
			$cod_ptr	= $_GET['cod_ptr'];
			$cod_elem	= $_GET['cod_elem'];
			$armario	= $_GET['armario'];
			$obs		= $_GET['observ'];
			$cant		= $_GET['cant'];			
			$cproy		= $_GET['c_proyecto'];
			$usuario	= $_GET['usuario'];
			$f_registro = date('Y-m-d H:i:s'); //HOY

			$qry_Insert = "INSERT INTO tb_elementos(reg_ptr,armario,elemento,observacion,cantidad,c_proy,fecha,usu_registro) 
								values ('$cod_ptr','$armario',$cod_elem,'$obs',$cant,'$cproy','$f_registro','$usuario')" ;
			$result_Insert = mysql_query($qry_Insert) or die ("Error(1) al insertar elemento");
			if ($result_Insert) echo 'Grabacion Satisfactora';
			else 'Error(2) al insertar elemento';
			break;

		case 24:  ////////////////////////////// ELIMINA ELEMENTOS

			$idDetaReg		= $_GET['idDetaReg'];
			$qry_Delete = "	DELETE FROM  tb_elementos WHERE id=$idDetaReg" ;
			$result_Delete = mysql_query($qry_Delete) or die ("Error(1) eliminar elemento");
			if ($result_Delete) echo 'Elemento eliminado';
			else 'Error(2) al eliminar elemento';
			break;
	
	    case 25:	///////////////Combo Busca PTR
			$txtbuscar=$_POST["query"];	
			if(!$txtbuscar) $txtbuscar=$_GET["query"];
			/*
			$sqlquery ="select a.id_reg,a.reg_ptr,h.id_estado,h.flag_mat,
						concat(a.est_propuesta,' - ',h.desc_estado) as estado,
						concat(a.c_proyecto,' - ',c.des_proy) as proyecto,
						concat(a.tp_planta,' - ',b.des_tpplanta) as tipo_planta,
						concat(a.c_tarea,' - ',d.des_tareas) as tarea,
						concat(a.c_categoria,' - ',e.des_origenproy) as origen,
						concat(a.contrata,' - ',f.desc_contratasap) as eecc,
						concat(a.c_tpmante,' - ',g.des_tpmante) as t_mant,
						a.c_tpcuenta,a.c_proyecto,a.titulo_obra,a.ubicacion 
						from cab_registro_ptr a 
						left join tb_tipo_planta b on b.cod_tpplanta=a.tp_planta
						left join tb_proyecto c on c.cod_proy=a.c_proyecto 
						left join tb_tareas d on d.cod_tareas=a.c_tarea
						left join tb_origen_proy e on e.cod_origenproy=a.c_categoria
						left join contratas_sap f on f.cod_contratasap=a.contrata
						left join tb_tpmantenimiento g on g.cod_tpmante=a.c_tpmante
						left join sap_estados h on h.id_estado=a.est_propuesta
						where a.reg_ptr like '%".$txtbuscar."%' order by a.reg_ptr,a.est_propuesta ";
			*/

				$sqlquery ="select a.id_reg,a.reg_ptr,h.id_estado,h.flag_mat,
						concat(a.est_propuesta,' - ',h.desc_estado) as estado,
						concat(a.c_proyecto,' - ',c.des_proy) as proyecto,
						concat(a.tp_planta,' - ',b.des_tpplanta) as tipo_planta,
						concat(a.c_tarea,' - ',d.des_tareas) as tarea,
						concat(a.c_categoria,' - ',e.des_origenproy) as origen,
						concat(a.contrata,' - ',f.desc_contratasap) as eecc,
						concat(a.c_tpmante,' - ',g.des_tpmante) as t_mant,
						a.c_tpcuenta,a.c_proyecto,a.titulo_obra,a.ubicacion,
						concat(a.jefatura,' ',i.desc_jefatura) as desc_jefatura,
						j.desc_depa,
						k.des_prov,
						l.des_dis,
						a.cliente_causante,
						a.ubicacion,
						m.desc_cate_proy,
						a.licencia,
						a.titulo_obra,
						a.fundamento,
						a.observaciones,
						a.jefatura,
						a.tp_planta,
						a.c_proyecto,
						a.c_tarea,
						a.c_categoria,
						a.contrata,
						a.c_tpmante,
						a.c_dpto,
						a.c_prov,
						a.c_dist,
						a.vale,
						a.grafo,
						a.cc,
						a.cb,
						a.est_programacion as st_prg,
						a.resp_telefonica as resp_telefonica,
						a.resp_contrata as resp_contrata,
						a.resp_telefono1 as resp_telefonox ,
						a.resp_telefono2  as resp_telefonoxx,
						a.resp_excluyente as resp_excluyente,
						a.reg_ptr 
						from cab_registro_ptr a 
						left join tb_tipo_planta b on b.cod_tpplanta=a.tp_planta
						left join tb_proyecto c on c.cod_proy=a.c_proyecto 
						left join tb_tareas d on d.cod_tareas=a.c_tarea
						left join tb_origen_proy e on e.cod_origenproy=a.c_categoria
						left join contratas_sap f on f.cod_contratasap=a.contrata
						left join tb_tpmantenimiento g on g.cod_tpmante=a.c_tpmante
						left join sap_estados h on h.id_estado=a.est_propuesta
						left join tb_jefatura i on i.cod_jefatura=a.jefatura
						left join tb_dpto j on j.pref_dep=a.c_dpto
						left join tb_provincia k on k.cod_prov=a.c_prov
						left join tb_distrito l on l.cod_dis=a.c_dist
						left join tb_categoria_proyecto m on m.id_cate_proy=a.c_categoria
						where a.reg_ptr like '%".$txtbuscar."%' group by a.reg_ptr  order by a.reg_ptr,a.est_propuesta ";		
			//print $sqlquery;
			$stmt = mysql_query($sqlquery);
			while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
				echo '{"results":'.json_encode($arr).'}';
			break;
	
	case 251:	///////////////Combo Busca PTR
			$txtbuscar=$_POST["query"];	
			if(!$txtbuscar) $txtbuscar=$_GET["query"];
				$sqlquery ="select * from tb_persona where numdocper like '%".$txtbuscar."%' or nomper like '%".$txtbuscar."%' or apepatper like '%".$txtbuscar."%' or apematper like '%".$txtbuscar."%' ";
			//print $sqlquery;
			$stmt = mysql_query($sqlquery);
			while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
				echo '{"results":'.json_encode($arr).'}';
			break;
		
	case 253:	///////////////Combo Busca PTR
			$txtbuscar=$_POST["query"];	
			if(!$txtbuscar) $txtbuscar=$_GET["query"];
				$sqlquery ="select * from tb_cliente2 where codcli like '%".$txtbuscar."%' or nomcli like '%".$txtbuscar."%' or ruccli like '%".$txtbuscar."%'  ";
			//print $sqlquery;
			$stmt = mysql_query($sqlquery);
			while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
				echo '{"results":'.json_encode($arr).'}';
			break;
					
	case 252:	///////////////Combo Busca PTR
			$txtbuscar=$_POST["query"];	
			if(!$txtbuscar) $txtbuscar=$_GET["query"];
				$sqlquery ="select  a.item,a.codsol,a.fecregsol,a.fecvensol,a.codcli,b.nomcli,b.ruccli,b.nomconcli,a.usureg,a.estsol,a.fecremi,a.obssol from tb_solicitud2 a 
				left outer join tb_cliente2 b on a.codcli=b.codcli where a.codsol like '%".$txtbuscar."%' or b.nomcli like '%".$txtbuscar."%' or b.ruccli like '%".$txtbuscar."%'";		
			//print $sqlquery;
			$stmt = mysql_query($sqlquery);
			while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
				echo '{"results":'.json_encode($arr).'}';
			break;

	
			case 26:	///////////////Combo Busca MATERIALES
			$txtbuscar=$_POST["query"];	
			if(!$txtbuscar) $txtbuscar=$_GET["query"];
			$sqlquery ="SELECT cod_materiales,des_materiales,centro,precio,moneda,medida 
						from tb_materiales 
						where cod_materiales like '%$txtbuscar%' or des_materiales like '%$txtbuscar%' 
						order by des_materiales";
			
			$stmt = mysql_query($sqlquery);
			while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
				echo '{"material":'.json_encode($arr).'}';
			break;
			
			
			
			case 261:	///////////////Combo Busca MATERIALES
			$txtbuscar=$_POST["query"];	
			if(!$txtbuscar) $txtbuscar=$_GET["query"];
			$sqlquery ="SELECT codper,nomper,apepatper,apematper,codtipdoc,numdocper,estper from tb_persona 
						where  numdocper like '%$txtbuscar%' or concat(nomper,apematper,apematper) like '%$txtbuscar%' 
						order by concat(nomper,apematper,apematper)";
			
			$stmt = mysql_query($sqlquery);
			while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
				echo '{"persona":'.json_encode($arr).'}';
			break;
			
			
			
	case 27:	//////////////////////////Carga Grid Materiales de PTR Seleccionada
			
			$reg_ptr=$_GET['reg_ptr'];
			$tp_ing=$_GET['tp_ing'];
			if ($reg_ptr!='' and $tp_ing!=''){
				$sqlquery ="select 'Materiales' as grupo,
							a.id_deta_reg,a.id_reg_ptr,a.reg_ptr,a.c_material,a.precio,a.cantidad,a.centro,a.almacen,
							b.des_materiales,b.moneda,b.medida,a.precio*a.cantidad as total
							from detalle_registro_ptr a
							left join tb_materiales b on a.c_material=b.cod_materiales 
							where a.reg_ptr='$reg_ptr' and a.tp_ing=$tp_ing";
				//echo $sqlquery;			
				$stmt = mysql_query($sqlquery);
				while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
				echo '{"results":'.json_encode($arr).'}';
			}
		break;
	
					
	case 271:	//////////////////////////Carga Grid Materiales de PTR Seleccionada
			
			$codsol=$_GET['codsol'];
			//$codsol='1005';
			
			//$tp_ing=$_GET['tp_ing'];
			//if ($nrodoc!=''){
				$sqlquery ="select 'Persona' as grupo,a.codsolper,a.codsol,a.codper,b.nomper,b.apepatper,b.apematper,b.numdocper,a.codchk,c.despue,e.despacchk 
							from tb_solicitud_has_tb_persona2 a
							left outer join tb_persona b on a.codper=b.codper 
							left outer join tb_puesto c on a.codpue=c.codpue 
							left outer join tb_packcheck e on a.codpacchk=e.codpacchk
							where a.codsol='$codsol'";
				//echo $sqlquery;			
				$stmt = mysql_query($sqlquery);
				while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
				echo '{"results":'.json_encode($arr).'}';
		//	}
		break;
		
		case 28:	///////////////Combo Busca MANO DE OBRA

	$txtbuscar=$_POST["query"];	
			if(!$txtbuscar) $txtbuscar=$_GET["query"];
			$sqlquery ="SELECT cod_obra,des_obra,uni_obra,baremo,bar,detalle_obra  
						from tb_mano_obra where cod_obra like '%$txtbuscar%' or des_obra like '%$txtbuscar%'";
			$stmt = mysql_query($sqlquery);
			while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
				echo '{"mano_obra":'.json_encode($arr).'}';
			break;
			
	case 29:	//////////////////////////Carga Grid Materiales de PTR Seleccionada
			$reg_ptr=$_GET['reg_ptr'];
			$tp_ing=$_GET['tp_ing'];
			if ($reg_ptr!='' and $tp_ing!=''){
				$sqlquery ="select 'Mano de Obra' as grupo,
							a.id_deta_reg,a.id_reg_ptr,a.reg_ptr,
							a.c_material,a.cantidad,a.baremo,
							b.des_obra,a.cantidad*a.baremo as total
							from detalle_registro_ptr a
							left join tb_mano_obra b on a.c_material=b.cod_obra 
							where a.reg_ptr='$reg_ptr' and a.tp_ing=$tp_ing";
				$stmt = mysql_query($sqlquery);
				while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
				echo '{"results":'.json_encode($arr).'}';
			}
		break;
	
	case 30:	///////////////Combo Busca CATALOGO ELEMENTOS
			$txtbuscar=$_POST["query"];	
			if(!$txtbuscar) $txtbuscar=$_GET["query"];
			if (isset($txtbuscar)) $txt_buscar="and desc_elemento like '%$txtbuscar%'";
			$cproy=trim($_POST["cproy"]);	
			
			if (isset($cproy) and trim($cproy)!=''){ 
				if ($cproy=='PC5' or $cproy=='PC2' or $cproy=='PC6')	$txt_cproy="trim(tipo)='1' or trim(tipo)= '".$cproy."'";
				else $txt_cproy="trim(tipo)='1'";
			}else return;
			
			$sqlquery ="SELECT idtb_catalogo_elemento,concat(idtb_catalogo_elemento,' - ',desc_elemento) as desc_elemento,tipo,unidad  
					from tb_catalogo_elemento where ".$txt_cproy.$txt_buscar;
			$stmt = mysql_query($sqlquery);
			while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
				echo '{"elemento":'.json_encode($arr).'}';
			break;
			
	case 31:	//////////////////////////Carga Grid Elementos de Red, de PTR Seleccionada
			
			$reg_ptr=$_GET['reg_ptr'];
			if ($reg_ptr!=''){
				$sqlquery ="select 'Elementos de Red' as grupo,
							a.id,a.reg_ptr,a.armario,a.elemento,a.observacion,a.cantidad,a.c_proy,
							b.desc_elemento
							from tb_elementos a
							left join tb_catalogo_elemento b on a.elemento=b.idtb_catalogo_elemento
							where a.reg_ptr='$reg_ptr'";
				$stmt = mysql_query($sqlquery);
				while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
				echo '{"results":'.json_encode($arr).'}';
			}
		break;
	case 32:	///////////////Combo Busca CENTRAL
			$txtbuscar=trim($_POST["query"]);	
			if(!$txtbuscar) $txtbuscar=trim($_GET["query"]);
			$sqlquery ="select idcentral_serie,cod_mdf,ds_mdf,group_concat(serie order by serie separator '-') as series  
						from tb_central_serie 
						where cod_mdf like '$txtbuscar%' GROUP BY cod_mdf order by cod_mdf";
			
			$stmt = mysql_query($sqlquery);
			while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
				echo '{"central":'.json_encode($arr).'}';
			break;
			


			
	case 33:	//////////////////////////Carga programacion de PTR Seleccionada
			
			$reg_ptr=$_GET['reg_ptr'];
			$tp_ing=$_GET['tp_ing'];
			if ($reg_ptr!='' and $tp_ing!=''){
				$sqlquery ="select 'Programacion' as grupo,
							id_deta_prog,id_reg_ptr,reg_ptr,central,titulo_obra,direccion,series,
							fech_ini,fech_fin,cab1,cab2,armar,par1,par2,tp_ing,fecha_reg,usuario_reg,ct
							from tb_det_programacion
							where reg_ptr='$reg_ptr' and tp_ing='$tp_ing'";
				//echo $sqlquery;			
				$stmt = mysql_query($sqlquery);
				while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
				echo '{"results":'.json_encode($arr).'}';
			}
		break;
		
	case 331:	//////////////////////////Carga programacion de PTR Seleccionada
			
			$reg_ptr=$_GET['reg_ptr'];
			$tp_ing=$_GET['tp_ing'];
			if ($reg_ptr!='' and $tp_ing!=''){
				$sqlquery ="select 'Avance Programacion' as grupo,
							item,id_reg_ptr,reg_ptr,documento,remitente,avance,
							observ,est_prg,user,fech_reg,fech_culm   
							from tb_avan_programacion
							where reg_ptr='$reg_ptr' and tp_ing='$tp_ing'";
				//echo $sqlquery;			
				$stmt = mysql_query($sqlquery);
				while($obj = mysql_fetch_object($stmt)) {$arr[] = $obj;}
				echo '{"results":'.json_encode($arr).'}';
			}
		break;
		
		case 341:  ////////////////////////////// INSERT PROGRAMACION

			//$item		= $_GET['item'];
			$id_ptr		= $_GET['id_ptr'];
			$cod_ptr	= $_GET['cod_ptr'];
		//	$cod_ptr	= $_GET['cod_ptr'];
			$documento	= $_GET['documento'];
			$remitente  = $_GET['remitente'];
			$fech_culm	= $_GET['fech_culm'];
			$avance		= $_GET['avance'];
			$observ		= $_GET['observ'];
			$est_prg 	= $_GET['est_prg'];
			$usuario    = $_GET['user'];
			$fech_reg   = date('Y-m-d H:i:s');
			$tp_ing     = $_GET['tp_ing'];
			
			$qry_Insert="INSERT INTO tb_avan_programacion(id_reg_ptr,reg_ptr,documento,remitente,avance,observ,est_prg,user,fech_reg,tp_ing,fech_culm)
						values($id_ptr,'$cod_ptr','$documento','$remitente','$avance','$observ','$est_prg','$usuario','$fech_reg','4','$fech_culm')";

			//	$result= mysql_query($qry) or die ("Error(1) al actualizar ubicacion");
/*				
			$qry_Insert = "INSERT INTO detalle_registro_ptr(id_reg_ptr,reg_ptr,c_material,precio,cantidad,tp_ing,centro,almacen,fec_registro,usu_registro) 
								values ($id_ptr,'$cod_ptr','$cod_mat',$precio,$cant,$tipo_ing,'$centro','$almacen','$f_registro','$usuario')" ;
							*/
			$result_Insert = mysql_query($qry_Insert) or die('Invalid query: ' . mysql_error());
			//or die ("Error(1) al insertar detalle de programacion");
			if ($result_Insert) echo 'Grabacion Satisfactora';
			else 'Error(2) al insertar detalle de programacion';
			
			$qry_u = "UPDATE cab_registro_ptr SET est_programacion='$est_prg' WHERE id_reg=$id_ptr" ;
			$result_qry_u = mysql_query($qry_u) or die('Invalid query: ' . mysql_error());
			//or die ("Error(1) al insertar detalle de programacion");
			if ($result_qry_u) echo 'Grabacion Satisfactora';
			else 'Error(2) al insertar detalle de programacion';
			
			
			
			break;	

	
			
	case 34:  ////////////////////////////// INSERT PROGRAMACION

			$id_ptr		= $_GET['id_ptr'];
			$cod_ptr	= $_GET['cod_ptr'];
			$central	= $_GET['central'];
			$titulo_obra= $_GET['titulo_obra'];
			$ubicacion	= $_GET['ubicacion'];
			$series		= $_GET['series'];
			$fec_ini	= $_GET['fec_ini'];
			$fec_fin	= $_GET['fec_fin'];
			$cab1		= $_GET['cab1'];
			$cab2		= $_GET['cab2'];
			$armario	= $_GET['armario'];
			$par1		= $_GET['par1'];
			$par2		= $_GET['par2'];
			$ct			= $_GET['ct'];
			$usuario	= $_GET['usuario'];
			$f_registro = date('Y-m-d H:i:s'); //HOY
			$qry_Insert="INSERT INTO tb_det_programacion(id_reg_ptr,reg_ptr,central,titulo_obra,direccion,series,fech_ini,fech_fin,cab1,cab2,armar,par1,par2,tp_ing,fecha_reg,usuario_reg,ct)
						values(	$id_ptr,'$cod_ptr','$central','$titulo_obra','$ubicacion','$series','$fec_ini','$fec_fin','$cab1','$cab2','$armario','$par1','$par2','3','$f_registro','$usuario','$ct')";
/*
			$qry_Insert = "INSERT INTO detalle_registro_ptr(id_reg_ptr,reg_ptr,c_material,precio,cantidad,tp_ing,centro,almacen,fec_registro,usu_registro) 
								values ($id_ptr,'$cod_ptr','$cod_mat',$precio,$cant,$tipo_ing,'$centro','$almacen','$f_registro','$usuario')" ;
							*/
			$result_Insert = mysql_query($qry_Insert) or die('Invalid query: ' . mysql_error());
			//or die ("Error(1) al insertar detalle de programacion");
			if ($result_Insert) echo 'Grabacion Satisfactora';
			else 'Error(2) al insertar detalle de programacion';
			break;	

	case 35:  ////////////////////////////// ELIMINA PROGRAMACION

			$idDetaReg		= $_GET['idDetaReg'];
			$qry_Delete = "	DELETE FROM  tb_det_programacion WHERE id_deta_prog=$idDetaReg" ;
			$result_Delete = mysql_query($qry_Delete) or die ("Error(1) al eliminar item de programacion");
			if ($result_Delete) echo 'Item de programacion eliminado';
			else 'Error(2) al eliminar item de programacion';
			break;	
	
	case 351:  ////////////////////////////// ELIMINA PROGRAMACION

			$idDetaReg		= $_GET['idDetaReg'];
			$qry_Delete = "	DELETE FROM  tb_avan_programacion WHERE item=$idDetaReg" ;
			$result_Delete = mysql_query($qry_Delete) or die ("Error(1) al eliminar item de Avance de la programacion");
			if ($result_Delete) echo 'Item de Avance de la programaci�n programacion eliminado';
			else 'Error(2) al eliminar item de Avance de la programacion';
			break;	
					
	case 36:  ////////////////////////////// ACTUALIZACION DE UBICACION EN PROGRAMACION

			$id_ptr		= $_GET['id_ptr'];
			$resx		= $_GET['resx'];
			$contr		= $_GET['contr'];
			$telx		= $_GET['telx'];
			$telxx		= $_GET['telxx'];
			$resexc		= $_GET['resexc'];
			$ubi		= $_GET['ubi'];
			
			if ($id_ptr!='' and $ubi!=''){
				$qry = "UPDATE cab_registro_ptr SET ubicacion='$ubi',resp_telefonica='$resx',resp_contrata='$contr',resp_telefono1='$telx',resp_telefono2='$telxx',resp_excluyente='$resexc'  WHERE id_reg=$id_ptr" ;
				$result= mysql_query($qry) or die ("Error(1) al actualizar ubicacion");
				if ($result) echo 1;
				else 'Error(2) al actualizar ubicacion';
			}
			break;			
	
	case 3611:  ////////////////////////////// ACTUALIZACION DE UBICACION EN PROGRAMACION

			$id_ptr		= $_GET['id_ptr'];
			$stg		= $_GET['stg'];
			if ($id_ptr!='' ){
				$qry = "UPDATE cab_registro_ptr SET est_programacion='J1' WHERE id_reg=$id_ptr" ;
				$result= mysql_query($qry) or die ("Error(1) al actualizar el estado de la programaci�n");
				if ($result) echo 1;
				else 'Error(2) al actualizar el estado de la programaci�n';
			}
			break;			
	
	case 3612:  ////////////////////////////// ACTUALIZACION DE UBICACION EN PROGRAMACION

			$codper		= $_GET['codper'];
			$nomper		= $_GET['nomper'];
			$apepatper	= $_GET['apepatper'];
			$apematper	= $_GET['apematper'];
			$codtipdoc	= $_GET['codtipdoc'];
			$numdocper	= $_GET['numdocper'];
			$estper	= $_GET['estper'];
			if ($codper!='' ){
				$qry = "UPDATE tb_persona SET nomper='$nomper', apepatper='$apepatper',apematper='$apematper',codtipdoc='$codtipdoc',numdocper='$numdocper',estper='$estper' WHERE codper='$codper'" ;
				$result= mysql_query($qry) or die ("Error(1) al actualizar Persona");
				if ($result)
                    echo 1;
				else 'Error(2) al actualizar Persona';
			}
			break;			
	
	
	
		case 3613:  ////////////////////////////// ACTUALIZACION DE UBICACION EN PROGRAMACION

			$codper		= $_GET['codper'];
			$nomper		= $_GET['nomper'];
			$apepatper	= $_GET['apepatper'];
			$apematper	= $_GET['apematper'];
			$codtipdoc	= $_GET['codtipdoc'];
			$numdocper	= $_GET['numdocper'];
			$estper	= $_GET['estper'];
			if ($nomper!='' && $numdocper!='' ){
				$qry = "INSERT INTO tb_persona(nomper,apepatper,apematper,codtipdoc,numdocper,estper)
						values('$nomper','$apepatper','$apematper','$codtipdoc','$numdocper','$estper')" ;
				$result= mysql_query($qry) or die ('Error : '.mysql_error());
                $resp = mysql_insert_id($link);
				if ($result)
                    echo $resp;				
			} else 
                echo '-1';
			break;	

        case 3614:  ////////////////////////////// ACTUALIZACION DEL CLIENTE

			$idcli		= $_GET['idcli'];
			$codcli		= $_GET['codcli'];
			$codestcli	= $_GET['codestcli'];
			$codtipcli	= $_GET['codtipcli'];
			$nomcli		= $_GET['nomcli'];
			$ruccli		= $_GET['ruccli'];
			$nomconcli	= $_GET['nomconcli'];
			$telconcli	= $_GET['telconcli'];
			$dircli		= $_GET['dircli'];
			
			
			
			if ($ruccli!='' ){
				$qry = "UPDATE tb_cliente2 SET codestcli='$codestcli', codtipcli='$codtipcli',nomcli='$nomcli',ruccli='$ruccli',nomconcli='$nomconcli',telconcli='$telconcli',dircli='$dircli' WHERE ruccli='$ruccli'" ;
				$result= mysql_query($qry) or die ("Error(1) al actualizar el Cliente");
				if ($result)
                    echo 1;
				else 'Error(2) al actualizar  el Cliente';
			}
			break;			
	
	
	
		case 3615:  ////////////////////////////// AGREGA CLIENTE
			
			$idcli		= $_GET['idcli'];
			$codcli		= $_GET['codcli'];
			$codestcli	= $_GET['codestcli'];
			$codtipcli	= $_GET['codtipcli'];
			$nomcli		= $_GET['nomcli'];
			$ruccli		= $_GET['ruccli'];
			$nomconcli	= $_GET['nomconcli'];
			$telconcli	= $_GET['telconcli'];
			$dircli		= $_GET['dircli'];
			
			
			if ($ruccli!='' ){
				$qry = "INSERT INTO tb_cliente2(codcli,codestcli,codtipcli,nomcli,ruccli,nomconcli,telconcli,dircli)
						values('$codcli','$codestcli','$codtipcli','$nomcli','$ruccli','$nomconcli','$telconcli','$dircli')" ;
				$result= mysql_query($qry) or die ('Error : '.mysql_error());
                $resp = mysql_insert_id($link);
				if ($result)
                    echo $resp;				
			} else 
                echo '-1';
			break;	

	}
	
?>