<?php
   class PDF extends FPDF
		{
		//Cabecera de página
		function Header()
		{
		    //Logo
		    $this->Image('../files/images_app/Logo_PRO.JPG',20,8,33);
		    //Arial bold 15
		    $this->SetFont('Arial','B',15);
		    //Movernos a la derecha
		    $this->Cell(160);
		    //Título
			$this->Image('../files/images_app/confidencial.png',160,8,33);
		    //$this->Cell(0,10,'Title',1,0,'C');
		    //Salto de línea
		    $this->Ln(15);
		}
		
		//Pie de página
		function Footer()
		{
		    //Posición: a 1,5 cm del final
		    $this->SetY(-15);
		    //Arial italic 8
		    $this->SetFont('Arial','I',8);
		    //Número de página
		    $this->Cell(0,10,utf8_decode('Página ').$this->PageNo().'/{nb}',0,0,'C');
		}
		/*
		function AcceptPageBreak()
		{
		    if($this->col<2)
		    {
		        //Go to next column
		        $this->SetCol($this->col+1);
		        $this->SetY(10);
		        return false;
		    }
		    else
		    {
		        //Regrese a la primera columna y emita un salto de página
		        $this->SetCol(0);
		        return true;
		    }
		}
		*/
		}
?>
