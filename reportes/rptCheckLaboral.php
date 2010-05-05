<?php
if (!isset($swInit)) {
	require('../../librerias/fpdf16/fpdf.php');
	require('Class_HeaderFooterPage.php');
	
	ini_set("display_errors", "On");
	error_reporting(E_ALL ^ E_NOTICE);
	include_once("../DB/connect.php");
	$link=conectarse();
	$codper=$_GET["codper"];
	$codsol=$_GET["codsol"];
}

$result=mysql_query("SELECT a.codchklab,    
CONCAT(c.apepatper,' ',c.apematper,', ',c.nomper) AS nombre,
d.despue AS puesto,
a.nomperref,
a.nomemp,
a.telemp,
a.perlab, 
a.motces, 
a.percont,
a.carpercont,
a.fecent, 
a.obsent, 
a.noment
FROM tb_chklaboral AS a 
LEFT JOIN tb_detallesolicitud AS b ON b.codper=a.codper AND b.codsol=a.codsol
LEFT JOIN tb_persona AS c ON c.codper=a.codper 
LEFT JOIN tb_puesto AS d ON d.codpue=b.codpue
WHERE a.codper=$codper AND a.codsol=$codsol",$link);


if (!isset($pdf)) {
	$pdf=new PDF();
	$pdf->AliasNbPages();
}


$sw=0;		
while($row = mysql_fetch_array($result))
{		
		$sw=$sw+1;
		$codchklab		= utf8_decode($row['codchklab']);
		$nombre		= utf8_decode($row['nombre']);
		$puesto		= utf8_decode($row['puesto']);
		
		$nomperref	= utf8_decode($row['nomperref']);
		$nomemp		= utf8_decode($row['nomemp']);
		$telemp		= utf8_decode($row['telemp']);		
		$perlab	= utf8_decode($row['perlab']); 	
		$motces= utf8_decode($row['motces']);
		$percont= utf8_decode($row['percont']);
		$carpercont= utf8_decode($row['carpercont']);
		$fecent= utf8_decode($row['fecent']);
		$obsent= utf8_decode($row['obsent']);
		$noment= utf8_decode($row['noment']);		

		//CreaciÃ³n del objeto de la clase heredada

		$pdf->AddPage();
		$pdf->SetDisplayMode('fullpage');
		$pdf->SetMargins(20, 20,20);
		$pdf->SetFont('Arial','BU',14);
		$pdf->SetTextColor(70,125,25);
		$pdf->Cell(0,10,'CHECK LABORAL '.$sw,0,1,'C');

		$pdf->Ln(2);
		$pdf->SetTextColor(0,0,0);
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'Candidato',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$nombre,1,1,'C');
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'Puesto al que postula',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$puesto,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetTextColor(0,0,0);
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'Persona dada como referencia',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$nomperref,1,1,'C');
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'Empresa',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$nomemp,1,1,'C');
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,utf8_decode('TelÃ©fono'),1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$telemp,1,1,'C');
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'Periodo laboral',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$perlab,1,1,'C');
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'Motivo de Cese',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$motces,1,1,'C');

		$qryPreguntas="SELECT b.despre,a.respre FROM tb_respuestas AS a
						LEFT JOIN tb_preguntas AS b ON a.codpre=b.codpre
						WHERE a.codchklab=$codchklab";
		$result_qryPreguntas=mysql_query($qryPreguntas);
		
		$pdf->SetFont('Arial','BU',14);
		$pdf->SetTextColor(0,0,0);
		$pdf->Cell(0,10,'CUESTIONARIO',0,1,'C');
		$pdf->Ln(2);
		$pdf->SetTextColor(0,0,0);
		$sw2=0;
		while($row2 = mysql_fetch_array($result_qryPreguntas))
		{	$sw2=$sw2+1;
			$pdf->SetFont('Arial','B',12);
			//$pdf->Cell(70,7,utf8_decode($row2['despre']),1,1,'L');
			$pdf->MultiCell(0,5,$sw2.' '.utf8_decode($row2['despre']),1,'L');
			$pdf->SetFont('Arial','',12);
			//$pdf->Cell(0,7,utf8_decode($row2['respre']),1,1,'L');
			$pdf->MultiCell(0,5,utf8_decode($row2['respre']),1,'L');
			$pdf->Ln(1);
		}
		
		$pdf->AddPage();
		$pdf->Ln(2);
		$pdf->SetTextColor(0,0,0);
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'Persona de contacto',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$percont,1,1,'C');
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'Cargo de contacto',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$carpercont,1,1,'C');
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'Fecha de entrevista',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$fecent,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(0,7,'Observaciones del entrevistador',1,1,'L');
		$pdf->SetFont('Arial','',12);
		//$pdf->Cell(0,7,$percont,1,1,'C');
		$pdf->MultiCell(0,5,utf8_decode($obsent),1,'J');
		
		$pdf->Ln(2);
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'Nombre del entrevistador',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$noment,1,1,'C');

}

if (!isset($swInit)) {
	$pdf->Output();
}
?>