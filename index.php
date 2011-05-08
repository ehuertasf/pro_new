<?php 
	session_start();
	if ($_SESSION['p3r1m1t1d0'] != "yes"){
		header("Location: seguridad/login.php");
		exit();
	}
?>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>.::PRO Outsourcing - Sistema de Gesti&oacute;n Humana::.</title>
		
        <style type="text/css">
            body{
                background: url(files/images_app/Logo_PRO.JPG) white center no-repeat fixed;
            }
            .cabeza{
                width:100%;
                height: '85px';
                background-color: #3b63ab;
                background-repeat:no-repeat;
                background-image: url(files/images_app/bg_head.jpg);
            }
            .medio{
                width:100%;
                height: 76%;
                background-color: #FFFFFF;
                background: url(files/images_app/Logo_PRO.JPG) white center no-repeat fixed;
            }
            .pie{
                font-family: "Verdana";
                font-size: '13px';
                padding: '5px';
                color: #FFF;
                width:100%;
                height: '85px';
                background-color: #3b63ab;
                background-repeat: repeat-y;
                background-image: url(files/images_app/bg_pie.jpg);
            }
        </style>

		<link rel="shortcut icon" href="favicon.ico">
		<link rel="stylesheet" type="text/css" href="css/iconos.css" />
		<link rel="stylesheet" type="text/css" href="../librerias/ext-3.1.1/resources/css/ext-all.css" />
		<link rel="stylesheet" type="text/css" href="../librerias/ext-3.1.1/examples/ux/fileuploadfield/css/fileuploadfield.css" />
		<!--<link rel="stylesheet" type="text/css" href="lib/extjs/resources/css/xtheme-black.css" />-->
		<script src="../librerias/ext-3.1.1/adapter/ext/ext-base.js"></script>
		<script src="../librerias/ext-3.1.1/ext-all.js"></script>
		<script src="../librerias/ext-3.1.1/examples/ux/fileuploadfield/FileUploadField.js"></script>
		<script src="../librerias/ext-3.1.1/src/locale/ext-lang-es.js"></script>


    </head>
    <body>
        <script src="js/mnu_main.js" type="text/javascript"></script>
        <script src="js/frm_persona.js" type="text/javascript"></script>
        <script src="js/frm_cliente.js" type="text/javascript"></script>
        <script src="js/frm_regsolicitud.js" type="text/javascript"></script>
        <script src="js/frm_con_solicitud.js" type="text/javascript"></script>
        <script src="js/frm_det_solicitud.js" type="text/javascript"></script>
        <script src="js/frm_checks_persona.js" type="text/javascript"></script>
        <script src="js/main_inter.js" type="text/javascript"></script>
        <script src="js/mttotipodoc.js" type="text/javascript"></script>
        <script src="js/mttotipocli.js" type="text/javascript"></script>
        <script src="js/mttousers.js" type="text/javascript"></script>
        <script src="js/mttotipzona.js" type="text/javascript"></script>
        <script src="js/mttoriesgo.js" type="text/javascript"></script>
        <script src="js/mttotipdelito.js" type="text/javascript"></script>
        <script src="js/mttopuesto.js" type="text/javascript"></script>
        <script src="js/rpt_cliente.js" type="text/javascript"></script>
        <script src="js/rpt_persona.js" type="text/javascript"></script>
        <div class="cabeza"><img src="files/images_app/bg_head.jpg"></div>
        <div id="medio" class="medio"></div>
        <div class="pie">
            <?php
            include("DB/connect.php");
            $link=conectarse();
            $usuario=$_SESSION['us3r1d'];
            $query="SELECT CONCAT(nomuser,\" \",apeuser) AS nick FROM tb_users WHERE loguser='".$usuario."'";
            $querynombre = mysql_query($query) or die(mysql_error());
            while ($tipo = mysql_fetch_array($querynombre)){
                    extract($tipo);
                    echo "<b><i>Nombre de Usuario : ".$nick."</i></b>";
            }
            ?>
        </div>
    </body>
</html>
