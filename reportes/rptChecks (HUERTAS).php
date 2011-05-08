<?php
	require('../../librerias/fpdf16/fpdf.php');
	require('Class_HeaderFooterPage.php');
	
	ini_set("display_errors", "On");
	error_reporting(E_ALL ^ E_NOTICE);
	include_once("../DB/connect.php");
	global $link;
	$link=conectarse();
	
	global $codper;
	//$codper=2;
	global $codsol;
	//$codsol=10;
	global $swInit;
	$swInit=1;
	$codper=$_GET["codper"];
	$codsol=$_GET["codsol"];
	global $pdf;
	include("rptCheckService.php");
	include("rptCheckLaboral.php");
	include("rptCheckDomiciliario.php");
	$pdf->Output();
	
?>
