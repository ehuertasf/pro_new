<?php
    /**
     * Script para generar el reporte excel de personas por cliente.
     * El reporte se generara dependiendo de a que cliente pertenece el usuario que se ha logeado.
     * Si es un usuario administrador se generara un excel con todas las personas de todos los clientes encontrados
     * en el rango de fecha indicado.
     * @version 1.0
     * @version 1.1 se agrego la columna del check laboral (02-05-2010)
     * @author Ricardo De la Torre
     */
    header("Cache-control: No-Cache");
    header("Pragma: No-Cache");
    header("Content-type: application/vnd.ms-excel");
    header("Content-Disposition: attachment; filename=rpt_cliente.xls");
    set_time_limit(0);

    ini_set("display_errors", "Off");
    error_reporting(E_ALL ^ E_NOTICE);

    $dsn = 'mysql:host=localhost;dbname=prodb;';
    $user = 'root';
    $password = 'rjdg';
    try
    {
        $dbh = new PDO($dsn, $user, $password);
    }catch (PDOException $e){
        echo 'Conexion fallida: ' . $e->getMessage();
    }


?>

<html>
<head>
    <title>Pro Outsourcing</title>
</head>
<body>

<table border="0" cellpadding="0" cellspacing="0" >
    <tr>
        <td colspan='9' align="center"  style="height: 23px; font-family: sans-serif; font-size: 10px;"><b>REPORTE POR CLIENTE</b></td>
    </tr>
</table>

<?php
        session_start();
        
	$f_ini	=$_GET["fini"];
	$f_fin	=$_GET["ffin"];

	$f_ini=substr($f_ini,6,4)."-".substr($f_ini,3,2)."-".substr($f_ini,0,2);
	$f_fin=substr($f_fin,6,4)."-".substr($f_fin,3,2)."-".substr($f_fin,0,2);

        $dbh->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

        $qry="SELECT codcli FROM tb_users WHERE loguser=:session";
        $stmt0 = $dbh->prepare($qry);
        $stmt0->bindParam(':session', $_SESSION['us3r1d']);
        $stmt0->execute();
        while ($row0 = $stmt0->fetch(PDO::FETCH_ASSOC)) {
            $idcli=$row0["codcli"];
        }

        
        $sql="SELECT CONCAT(a.apepatper,' ',a.apematper,', ',a.nomper) AS APELLIDOS_NOMBRES,a.numdocper AS DNI,
            (SELECT d.nomdel FROM tb_chkservice c,tb_delito d WHERE c.coddel=d.coddel AND c.codper=a.codper) AS CHECK_DELICTIVO,
            (SELECT f.descon FROM tb_chkdomicilio e,tb_conclusion f WHERE e.codcon=f.codcon AND e.codper=a.codper  ) AS CHECK_DOMICILIARIO,
            (SELECT GROUP_CONCAT(g.descon SEPARATOR '/') FROM tb_chklaboral v,tb_conclusion g WHERE v.codcon=g.codcon AND codper=u.codper AND codsol=u.codsol) AS CHECK_LABORAL,
            z.nomcli AS CLIENTE,w.fecvensol AS FECHA_ENTREGA,w.fecciesol AS FECHA_CIERRE,r.despue AS PUESTO,w.obssol AS OBSERVACION
            FROM tb_persona a,tb_detallesolicitud u,tb_solicitud w,tb_cliente z,tb_puesto r
            WHERE a.codper=u.codper  AND u.codsol=w.codsol AND w.codcli=z.codcli AND u.codpue=r.codpue ";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':fini', $f_ini);
        $stmt->bindParam(':ffin', $f_fin);
        $stmt->bindParam(':ccli', $idcli);
        $stmt->execute();
        ?>
    <br>
        <table cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td>Fecha Inicial :<?=$f_ini?></td>
            </tr>
            <tr>
                <td>Fecha Final :<?=$f_fin?></td>
            </tr>
        </table>
        <br>
        <table cellpadding="0" cellspacing="0" border="1">

            <tr>
                <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #A1A6A7; color: white"><b>ITEM</b></td>
                <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #A1A6A7; color: white"><b>APELLIDOS Y NOMBRES</b></td>
                <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #A1A6A7; color: white"><b>DNI</b></td>
                <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #A1A6A7; color: white"><b>CHECK DELICTIVO</b></td>
                <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #A1A6A7; color: white"><b>CHECK DOMICILIARIO</b></td>
                <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #A1A6A7; color: white"><b>CHECK LABORAL</b></td>
                <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #A1A6A7; color: white"><b>CLIENTE</b></td>
                <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #A1A6A7; color: white"><b>FECHA DE ENTREGA</b></td>
                <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #A1A6A7; color: white"><b>FECHA DE CIERRE</b></td>
                <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #A1A6A7; color: white"><b>PUESTO</b></td>
                <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #A1A6A7; color: white"><b>OBSERVACION</b></td>
            </tr>
            
            <?php
            $cont=1;
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                ?>
                <tr>
                    <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #CCFFCC"><b><?=$cont?></b></td>
                    <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #CCFFCC"><b><?=$row["APELLIDOS_NOMBRES"]?></b></td>
                    <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #CCFFCC"><b><?=$row["DNI"]?></b></td>
                    <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #CCFFCC"><b><?=$row["CHECK_DELICTIVO"]?></b></td>
                    <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #CCFFCC"><b><?=$row["CHECK_DOMICILIARIO"]?></b></td>
                    <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #CCFFCC"><b><?=$row["CHECK_LABORAL"]?></b></td>
                    <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #CCFFCC"><b><?=$row["CLIENTE"]?></b></td>
                    <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #CCFFCC"><b><?=$row["FECHA_ENTREGA"]?></b></td>
                    <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #CCFFCC"><b><?=$row["FECHA_CIERRE"]?></b></td>
                    <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #CCFFCC"><b><?=$row["PUESTO"]?></b></td>
                    <td align="center" valign="middle" style="border:1px solid #999999; height: 23px; font-family: sans-serif; font-size: 10px; background: #CCFFCC"><b><?=$row["OBSERVACION"]?></b></td>
                </tr>
            <?php
                $cont++;
            }
        ?>
        </table>


</body>
</html>


