<?php


function conectarse()
{
    $server = "localhost";
    $username ="root";
    $pass = "rjdg";
    $dbname = "prodb";
    if (!($link=mysql_connect($server,$username,$pass))){
            echo "No se ha podido conectar a la Base de datos";
            exit();
    }
    if (!mysql_select_db($dbname,$link)){
            exit();
    }
    return $link;
}

function conectaPDO(){
    $server = "localhost";
    $username ="root";
    $pass = "rjdg";
    $dbname = "prodb";
    $dbh = new PDO("mysql:host=".$server.";dbname=".$dbname,$username, $pass);
    return $dbh;
}

	function sql_quote($value)
	{
	    if( get_magic_quotes_gpc() )
	    {
	          $value = stripslashes( $value );
	    }
	    if( function_exists( "mysql_real_escape_string" ) )
	    {
	          $value = mysql_real_escape_string( $value );
	    }
	    else
	    {
	          $value = addslashes( $value );
	    }
	    return $value;
	}
?>
