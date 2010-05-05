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
$result=mysql_query("SELECT a.codchkser,
CONCAT(c.apepatper,' ',c.apematper,', ',c.nomper) AS nombre,
d.despue AS puesto,
a.imgreniec,
a.obsimgreniec,
a.indrefpol, a.refpolchk,
a.indantpol,
a.indreqjud,
a.indrefter,
a.indrefdro,
a.indimpsalpai,
a.indinvpen,a.invpenchk,
e.desdel,
a.recchk
FROM tb_chkservice AS a
LEFT JOIN tb_detallesolicitud AS b ON b.codper=a.codper AND b.codsol=a.codsol
LEFT JOIN tb_persona AS c ON c.codper=a.codper
LEFT JOIN tb_puesto AS d ON d.codpue=b.codpue
LEFT JOIN tb_delito AS e ON e.coddel=a.coddel
WHERE a.codper=$codper AND a.codsol=$codsol",$link);

while($row = mysql_fetch_array($result))
{
		$nombre		= utf8_decode($row['nombre']);
		$puesto		= utf8_decode($row['puesto']);
		$imgreniec	= utf8_decode($row['imgreniec']);

		$obs		= utf8_decode($row['obsimgreniec']);

		$indrefpol= utf8_decode($row['indrefpol']); 	$refpolchk= utf8_decode($row['refpolchk']);
		$indantpol= utf8_decode($row['indantpol']);
		$indreqjud= utf8_decode($row['indreqjud']);
		$indrefter= utf8_decode($row['indrefter']);
		$indrefdro= utf8_decode($row['indrefdro']);
		$indimpsalpai= utf8_decode($row['indimpsalpai']);
		$indinvpen= utf8_decode($row['indinvpen']);		$invpenchk= utf8_decode($row['invpenchk']);

		$desdel= utf8_decode($row['desdel']);
		$recchk= utf8_decode($row['recchk']);

		$sw1=0;
		if($indrefpol==0){$TXTindrefpol='No Registra';}else{$TXTindrefpol='Si Registra';$sw1=1;}
		if($indantpol==0){$TXTindantpol='No Registra';}else{$TXTindantpol='Si Registra';$sw1=1;}
		if($indreqjud==0){$TXTindreqjud='No Registra';}else{$TXTindreqjud='Si Registra';$sw1=1;}
		if($indrefter==0){$TXTindrefter='No Registra';}else{$TXTindrefter='Si Registra';$sw1=1;}
		if($indrefdro==0){$TXTindrefdro='No Registra';}else{$TXTindrefdrol='Si Registra';$sw1=1;}
		if($indimpsalpai==0){$TXTindimpsalpai='No Registra';}else{$TXTindimpsalpai='Si Registra';$sw1=1;}
		$sw2=0;
		if($indinvpen==0){$TXTindinvpen='No Registra';}else{$TXTindinvpen='Si Registra';$sw2=1;}


		//Creación del objeto de la clase heredada
		$pdf=new PDF();
		$pdf->AliasNbPages();
		$pdf->AddPage();
		$pdf->SetDisplayMode('fullpage');
		$pdf->SetMargins(20, 20,20);
		$pdf->SetFont('Arial','BU',14);
		$pdf->SetTextColor(70,125,25);
		$pdf->Cell(0,10,'CHECK SERVICE',0,1,'C');
		$pdf->Ln(2);

		$pdf->SetTextColor(0,0,0);
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'CHECK IDENTIDAD',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$nombre,1,1,'C');
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'PUESTO AL QUE POSTULA',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$puesto,1,1,'C');
		$pdf->Ln(2);
		//$pdf->Image('../files/images_dni/imagen1.png',40,null,0,130);
		$pdf->Image('../files/images_dni/'.$imgreniec,40,null,0,130);

		$pdf->Ln(2);
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(0,7,'OBSERVACIONES',1,1,'C');
		$pdf->SetFont('Arial','',12);
		$pdf->MultiCell(0,5,$obs,1,'J');
		$pdf->Ln(2);
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(0,7,'CHECK DELICTIVO',1,1,'C');
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'Referencia Policial:',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$TXTindrefpol,1,1,'C');

		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'Antecedente Policial:',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$TXTindantpol,1,1,'C');

		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'Requisitoria Judicial:',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$TXTindreqjud,1,1,'C');

		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'Referencia por Terrorismo',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$TXTindrefter,1,1,'C');

		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,'Referencia por Drogas:',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$TXTindrefdro,1,1,'C');

		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,utf8_decode('Impedimento de salida del país:'),1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$TXTindimpsalpai,1,1,'C');

		//$str = utf8_decode('Investigación Penal:');
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(70,7,utf8_decode('Investigación Penal:'),1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$TXTindinvpen,1,1,'C');

		if ($sw1==1 or $sw2==1 ){
		$pdf->AddPage();
		$pdf->SetXY(20,25);
		//$pdf->SetDisplayMode('fullpage');
		//$pdf->SetMargins(20, 20,20);
		$pdf->SetFont('Arial','BU',14);
		$pdf->SetTextColor(70,125,25);
		$pdf->Cell(0,10,'ANEXO CHECK DELICTIVO',0,1,'C');
		$pdf->SetTextColor(0,0,0);
		$pdf->Ln(2);

		if ($sw1==1){
			$pdf->SetFont('Arial','B',12);
			$pdf->Cell(0,7,'INVESTIGACION POLICIAL',1,1,'C');
			$pdf->SetFont('Arial','',12);
			$pdf->MultiCell(0,5,$refpolchk,1,'J');
			$pdf->Ln(2);
		}
		if ($sw2==1){
			$pdf->SetFont('Arial','B',12);
			$pdf->Cell(0,7,'INVESTIGACION PENAL',1,1,'C');
			$pdf->SetFont('Arial','',12);
			$pdf->MultiCell(0,5,$invpenchk,1,'J');
			$pdf->Ln(2);
		}
		$pdf->SetFont('Arial','B',12);
			$pdf->Cell(0,7,'DEFINICION DEL DELITO',1,1,'C');
			$pdf->SetFont('Arial','',12);
			$pdf->MultiCell(0,5,$desdel,1,'J');
			$pdf->Ln(2);

		$pdf->SetFont('Arial','B',12);
			$pdf->Cell(0,7,'RECOMENDACION',1,1,'C');
			$pdf->SetFont('Arial','',12);
			$pdf->MultiCell(0,5,$recchk,1,'J');
			$pdf->Ln(2);
		}
}
if (!isset($swInit)) {
	$pdf->Output();
}

?>