<?php
require('../../librerias/fpdf16/fpdf.php');
require('Class_HeaderFooterPage.php');

ini_set("display_errors", "On");
error_reporting(E_ALL ^ E_NOTICE);
include_once("../DB/connect.php");
$link=conectarse();

//$codper=1;
//$codsol=5;
$codper=$_GET["codper"];
$codsol=$_GET["codsol"];

$result=mysql_query("SELECT a.codchkdom,
CONCAT(c.nomper,' ',c.apepatper,' ',c.apematper) AS nombre,
CONCAT(i.destipvia,' ',a.nomviadom,' ',a.numdom,' ',a.urbdom,' - ',h.desdist,' ',g.despro,' ',desdpto) AS domicilio,
a.domici,
a.perent,IF (a.codpar=6,a.otroparent,(SELECT w.despar FROM tb_parentesco AS w WHERE w.codpar=a.codpar LIMIT 1)) AS parentesco,
a.anoresdom, a.mesresdom,
(SELECT GROUP_CONCAT(z2.desres ORDER BY z2.codres ASC SEPARATOR ',') FROM tb_residentesdomicilio AS z1 LEFT JOIN tb_residentes AS z2 ON z1.codres=z2.codres WHERE z1.codchkdom=a.codchkdom GROUP BY z1.codchkdom) AS residecon,
d.desviv,
IF (a.codtipviv=3,otrtipviv,(SELECT z3.destipviv FROM tb_tipovivienda AS z3 WHERE z3.codtipviv=a.codtipviv LIMIT 1)) AS tipo_vivienda,
a.numpis, a.pisres,
IF (a.codtipmat=4,otrmatcon,(SELECT z4.destipmat FROM tb_tipomaterial AS z4 WHERE z4.codtipmat=a.codtipmat LIMIT 1)) AS tipo_material,
e.desestcon,
a.arever,
a.colfac, a.numpue,a.numven, a.tipmat, a.rejpro, a.pueaccveh, a.obsinmu,
IF (a.codzonif=8,otrzonif,(SELECT z5.deszonif FROM tb_zonificacion AS z5 WHERE z5.codzonif=a.codzonif LIMIT 1)) AS zonificacion,
j.deszonrie,
k.descon,
obscon,
(SELECT GROUP_CONCAT(z.nomimgdom ORDER BY z.numimgdom ASC SEPARATOR ',') FROM tb_imgdomicilio AS z WHERE z.codchkdom=a.codchkdom GROUP BY z.codchkdom) AS fotos
FROM tb_chkdomicilio AS a
LEFT JOIN tb_persona AS c ON c.codper=a.codper
LEFT JOIN tb_vivienda AS d ON d.codviv=a.codviv
LEFT JOIN tb_estadoconstruccion AS e ON e.codestcon=a.codestcon
LEFT JOIN tb_departamento AS f ON f.coddpto=a.coddpto
LEFT JOIN tb_provincia AS g ON g.coddpto=a.coddpto AND g.codpro=a.codpro
LEFT JOIN tb_distrito AS h ON h.coddpto=a.coddpto AND h.codpro=a.codpro AND h.coddist=a.coddist
LEFT JOIN tb_tipvias AS i ON i.codtipvia=a.codtipvia
LEFT JOIN tb_zonariesgo AS j ON j.codzonrie=a.codzonrie
LEFT JOIN tb_conclusion AS k ON k.codcon=a.codcon
WHERE a.codper=$codper AND a.codsol=$codsol",$link);

while($row = mysql_fetch_array($result))
{
		$nombre		= utf8_decode($row['nombre']);
		$domicilio	= utf8_decode($row['domicilio']);

		$domiciliado	= utf8_decode($row['domici']);
		$txtdomiciliadoSI='';$txtdomiciliadoNO='';
		if ($domiciliado==1) $txtdomiciliadoSI='X'; else $txtdomiciliadoNO='X';


		$persona_entrevistada	= utf8_decode($row['perent']);
		$parentesco	= utf8_decode($row['parentesco']);
		$anoresdom 	= utf8_decode($row['anoresdom']);
		$mesresdom 	= utf8_decode($row['mesresdom']);
		$reside_con	= utf8_decode($row['residecon']);
		$vivienda	= utf8_decode($row['desviv']);
		$tipo_vivienda= utf8_decode($row['tipo_vivienda']);
		$numpis	= utf8_decode($row['numpis']);
		$pisres 	= utf8_decode($row['pisres']);


		$tipo_material	= utf8_decode($row['tipo_material']);
		$desestcon		= utf8_decode($row['desestcon']);
		$arever			= utf8_decode($row['arever']);
		$txtareverSI='';$txtareverNO='';
		if ($arever==1) $txtareverSI='X'; else $txtareverNO='X';
		$colfac	= utf8_decode($row['colfac']);
		$tipmat	= utf8_decode($row['tipmat']);
		$numpue	= utf8_decode($row['numpue']);
		$numven	= utf8_decode($row['numven']);
		$rejpro		= utf8_decode($row['rejpro']);
		if ($rejpro==1) $txtrejpro='X'; else $txtrejpro='';
		$pueaccveh	= utf8_decode($row['pueaccveh']);
		if ($pueaccveh==1) $txtpueaccveh='X'; else $txtpueaccveh='';
		$obsinmu	= utf8_decode($row['obsinmu']);
		$zonificacion	= utf8_decode($row['zonificacion']);
		$deszonrie		= utf8_decode($row['deszonrie']);
		$descon			= utf8_decode($row['descon']);
		$obscon			= utf8_decode($row['obscon']);

		$fotos = explode(",", $row['fotos']);

		//Creación del objeto de la clase heredada
		$pdf=new PDF();
		$pdf->AliasNbPages();
		$pdf->AddPage();
		$pdf->SetDisplayMode('fullpage');
		$pdf->SetMargins(20, 20,20);
		$pdf->SetFont('Arial','BU',14);
		$pdf->SetTextColor(70,125,25);
		$pdf->Cell(0,10,'FICHA DE CHECH DOMICILIARIO',0,1,'C');

		$pdf->Ln(2);
		$pdf->SetTextColor(0,0,0);
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(55,7,'NOMBRES Y APELLIDOS',0,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$nombre,1,1,'C');
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(55,7,'DIRECCION',0,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->MultiCell(0,5,$domicilio,1,'L');

		//$pdf->Ln(2);
		//$pdf->Image('../files/images_dni/imagen1.png',40,null,0,130);
		$pdf->Ln(2);
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(35);
		$pdf->Cell(33,7,'DOMICILIADO',0,0,'L');
		$pdf->SetFont('Arial','',16);
		$pdf->Cell(6,7,$txtdomiciliadoSI,1,0,'C');
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(5);
		$pdf->Cell(40,7,'NO DOMICILIADO',0,0,'L');
		$pdf->SetFont('Arial','',16);
		$pdf->Cell(6,7,$txtdomiciliadoNO,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','BU',12);
		$pdf->Cell(0,7,'I. INFORMACION PROPORCIONADA POR EL ENTREVISTADO:',0,1,'L');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(47,7,'Persona Entrevistada:',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(60,7,$persona_entrevistada,1,0,'C');
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(27,7,'Parentesco:',1,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$parentesco,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(50,7,'Tiempo que Reside:',0,0,'L');
		$pdf->Cell(15,7,utf8_decode('Años'),0,0,'R');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(10,7,$anoresdom,1,0,'C');
		$pdf->Cell(5);
		$pdf->Cell(40,7,'Meses',0,0,'R');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(10,7,$mesresdom,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(50,7,'Reside con:',0,0,'L');
		$pdf->Cell(0,7,$reside_con,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(50,7,'Vivienda:',0,0,'L');
		$pdf->Cell(0,7,$vivienda,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','BU',12);
		$pdf->Cell(0,7,'II. DESCRIPCION DEL INMUEBLE:',0,1,'L');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(50,7,'Tipo de Vivienda:',0,0,'L');
		$pdf->Cell(0,7,$tipo_vivienda,1,1,'C');


		$pdf->Ln(2);
		$pdf->Cell(65,7,utf8_decode('Número de Pisos:'),0,0,'R');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(10,7,$numpis,1,0,'C');
		$pdf->Cell(5);
		$pdf->Cell(40,7,'Piso en el que reside',0,0,'R');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(10,7,$pisres,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(50,7,utf8_decode('Material de Construcción:'),0,0,'L');
		$pdf->Cell(0,7,$tipo_material,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(55,7,utf8_decode('Estado de la Construcción:'),0,0,'L');
		$pdf->Cell(0,7,$desestcon,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(50,7,'Vivienda con Areas Verdes:',0,0,'L');
		$pdf->Cell(15,7,utf8_decode('Si'),0,0,'R');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(10,7,$txtareverSI,1,0,'C');
		$pdf->Cell(5);
		$pdf->Cell(40,7,'No',0,0,'R');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(10,7,$txtareverNO,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(50,7,utf8_decode('Color de la Fachada:'),0,0,'L');
		$pdf->Cell(0,7,$colfac,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(50,7,utf8_decode('Tipo de Material:'),0,0,'L');
		$pdf->Cell(0,7,$tipmat,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(65,7,utf8_decode('Nº Puertas de Ingreso'),0,0,'R');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(10,7,$numpue,1,0,'C');
		$pdf->Cell(5);
		$pdf->Cell(40,7,utf8_decode('Nº Ventanas'),0,0,'R');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(10,7,$numven,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(65,7,utf8_decode('Rejas de Protección'),0,0,'R');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(10,7,$txtrejpro,1,0,'C');
		$pdf->Cell(5);
		$pdf->Cell(40,7,utf8_decode('P. de Acc. Vehicular'),0,0,'R');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(10,7,$txtpueaccveh,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(50,7,utf8_decode('Observaciones:'),0,0,'L');
		$pdf->MultiCell(0,5,$obsinmu,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','BU',12);
		$pdf->Cell(0,7,'III. DESCRIPCION DE LA ZONA:',0,1,'L');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(50,7,utf8_decode('Zonificación:'),0,0,'L');
		$pdf->Cell(0,7,$zonificacion,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(50,7,utf8_decode('Zona de Riesgo Delictivo:'),0,0,'L');
		$pdf->Cell(0,7,$deszonrie,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(50,7,utf8_decode('Conclusiones:'),0,0,'L');
		$pdf->Cell(0,7,$deszonrie,1,1,'C');

		$pdf->Ln(2);
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(50,7,utf8_decode('Observaciones:'),0,0,'L');
		$pdf->MultiCell(0,5,$obscon,1,'C');



		$pdf->AddPage();
		$pdf->SetXY(20,25);

		$pdf->SetFont('Arial','BU',14);
		$pdf->SetTextColor(70,125,25);
		$pdf->Cell(0,10,'CHECK FOTOGRAFICO DE LA VIVIENDA Y ALREDEDORES',0,1,'C');
		$pdf->SetTextColor(0,0,0);

		$pdf->Ln(2);
		$pdf->SetTextColor(0,0,0);
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(55,7,'NOMBRES Y APELLIDOS',0,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$nombre,1,1,'C');
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(55,7,'DIRECCION',0,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->MultiCell(0,5,$domicilio,1,'L');

		$pdf->Ln(5);
		$pdf->Image("../files/images_dom/$fotos[0]",40,null,130,100);
		$pdf->Ln(2);
		$pdf->Image("../files/images_dom/$fotos[1]",40,null,130,100);
		$pdf->Ln(2);


		$pdf->AddPage();
		$pdf->SetXY(20,25);

		$pdf->SetFont('Arial','BU',14);
		$pdf->SetTextColor(70,125,25);
		$pdf->Cell(0,10,'MAPA DE ZONIFICACION - CHECK DOMICILIARIO',0,1,'C');
		$pdf->SetTextColor(0,0,0);

		$pdf->Ln(2);
		$pdf->SetTextColor(0,0,0);
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(55,7,'NOMBRES Y APELLIDOS',0,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->Cell(0,7,$nombre,1,1,'C');
		$pdf->SetFont('Arial','B',12);
		$pdf->Cell(55,7,'DIRECCION',0,0,'L');
		$pdf->SetFont('Arial','',12);
		$pdf->MultiCell(0,5,$domicilio,1,'L');

		$pdf->Ln(5);
		$pdf->Image("../files/images_dom/$fotos[2]",30,null,0,120);

$pdf->Output();
}
?>