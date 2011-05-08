/*
SQLyog Community v8.4 
MySQL - 5.0.45-community-nt-log : Database - prodb2
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`prodb2` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `prodb2`;

/*Table structure for table `tb_check` */

DROP TABLE IF EXISTS `tb_check`;

CREATE TABLE `tb_check` (
  `codchk` int(5) unsigned NOT NULL auto_increment COMMENT 'Código del Check',
  `deschk` varchar(50) NOT NULL COMMENT 'Descripción del Check',
  `nomobj` varchar(45) NOT NULL COMMENT 'Nombre del objeto que sirve para recolectar datos',
  `nomtbl` varchar(45) NOT NULL COMMENT 'Nombre de la tabla donde se guardan los datos del check',
  `usuregchk` varchar(20) NOT NULL,
  `fecregchk` datetime NOT NULL,
  `estchk` char(1) NOT NULL COMMENT 'Estado del Check',
  PRIMARY KEY  (`codchk`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_chkdomicilio` */

DROP TABLE IF EXISTS `tb_chkdomicilio`;

CREATE TABLE `tb_chkdomicilio` (
  `codchkdom` int(10) unsigned NOT NULL auto_increment COMMENT 'Código del Check Domiciliario',
  `codper` int(10) unsigned NOT NULL COMMENT 'Código persona',
  `codsol` int(10) unsigned NOT NULL COMMENT 'Código solicitud',
  `coddpto` int(3) unsigned zerofill NOT NULL COMMENT 'Departamento',
  `codpro` int(3) unsigned zerofill NOT NULL COMMENT 'Provincia',
  `coddist` int(3) unsigned zerofill NOT NULL COMMENT 'Distrito',
  `codtipvia` int(5) unsigned NOT NULL default '1' COMMENT 'Tipo de vía',
  `nomviadom` varchar(60) default NULL COMMENT 'Nombre de la vía',
  `numdom` int(11) unsigned default NULL COMMENT 'Número de domicilio',
  `urbdom` char(60) default NULL COMMENT 'Urbanización',
  `domici` int(1) unsigned default NULL COMMENT 'Domiciliado o No Domiciliado',
  `perent` varchar(50) default NULL COMMENT 'Persona entrevistada en la visita',
  `codpar` int(5) unsigned NOT NULL default '1' COMMENT 'Parentesco de la persona entrevistada',
  `otroparent` varchar(40) default NULL COMMENT 'Otro parentesco',
  `anoresdom` int(2) unsigned default NULL COMMENT 'Años que reside en domicilio',
  `mesresdom` int(2) unsigned default NULL COMMENT 'Meses que reside en domicilio',
  `otrrescon` varchar(25) default NULL COMMENT 'En caso de Reside con sea Otros',
  `codviv` int(5) unsigned NOT NULL default '1' COMMENT 'Vivienda propia, alquilada, etc',
  `codtipviv` int(5) NOT NULL default '1' COMMENT 'Código de tipo de vivienda',
  `otrtipviv` varchar(20) default NULL,
  `numpis` int(5) unsigned default NULL COMMENT 'Número de pisos del domicilio',
  `pisres` int(5) unsigned default NULL COMMENT 'Piso en el que reside',
  `codtipmat` int(5) unsigned NOT NULL default '1' COMMENT 'Tipo de material de construcción',
  `otrmatcon` varchar(25) default NULL COMMENT 'En caso Material de la casa sea Otro',
  `codestcon` int(5) unsigned NOT NULL default '1' COMMENT 'Estado de la construcción',
  `arever` int(1) unsigned default NULL COMMENT 'Areas Verdes',
  `colfac` varchar(20) default NULL COMMENT 'Color de Fachada',
  `numpue` int(2) unsigned default NULL COMMENT 'Número de Puertas',
  `numven` int(2) unsigned default NULL COMMENT 'Número de Ventanas',
  `tipmat` varchar(20) default NULL COMMENT 'Tipo de material de puerta y ventanas',
  `rejpro` int(1) unsigned default NULL COMMENT 'Rejas de Protección',
  `pueaccveh` int(1) unsigned default NULL COMMENT 'Puerta de Acceso Vehicular',
  `obsinmu` text COMMENT 'Observación del inmueble',
  `codzonif` int(5) unsigned NOT NULL default '1' COMMENT 'Zonificación',
  `otrzonif` varchar(25) default NULL COMMENT 'En caso Tipo de zona sea Otro',
  `codzonrie` int(5) unsigned NOT NULL default '1' COMMENT 'Zona de riesgo delictivo',
  `codcon` int(5) unsigned NOT NULL default '1' COMMENT 'Conclusión',
  `obscon` text COMMENT 'Observación de conclusión',
  `fecciechkdom` datetime default NULL COMMENT 'Fecha cierre de check domiciliario',
  `usuciechkdom` varchar(15) default NULL COMMENT 'Usuario que cerro check domiciliario',
  `codestchk` int(5) NOT NULL default '1' COMMENT 'Estado del check',
  PRIMARY KEY  (`codchkdom`,`codper`,`codsol`),
  KEY `fk_tb_chkdomicilio_tb_estadocheck1` (`codestchk`),
  KEY `fk_{84D3D6F8-0673-41C1-A28A-DCA73F311AF1}` (`codtipvia`),
  KEY `fk_{409D4D4A-B2DD-4CBA-99E9-302656FCE7C5}` (`codsol`,`codper`),
  KEY `fk_{C59A7D06-98BB-4FC2-8E63-50AA6BD70DE3}` (`codpar`),
  KEY `fk_{9905FD21-D6BC-4C02-A794-B1B590E14A6A}` (`codtipviv`),
  KEY `fk_{B0BC4BF5-DCD7-4B35-8EAF-8C2B839E81FC}` (`codtipmat`),
  KEY `fk_{FB02766F-9ABB-49B3-A8B4-3FE3802D0321}` (`codestcon`),
  KEY `fk_{8CC09536-EE41-465D-A0E8-5F74B151233B}` (`codviv`),
  KEY `fk_{82978D58-0AC7-4F30-8D45-A063600AD080}` (`codzonrie`),
  KEY `fk_{D22B8B0C-BBF9-4C6C-BA98-A5B3D654CA53}` (`codcon`),
  KEY `fk_{C61B265E-F024-4FEC-96C5-8413A7B75EE1}` (`codzonif`),
  KEY `fk_tb_chkdomicilio_tb_distrito1` (`coddist`,`codpro`,`coddpto`),
  CONSTRAINT `fk_tb_chkdomicilio_tb_estadocheck1` FOREIGN KEY (`codestchk`) REFERENCES `tb_estadocheck` (`codestchk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{409D4D4A-B2DD-4CBA-99E9-302656FCE7C5}` FOREIGN KEY (`codsol`, `codper`) REFERENCES `tb_detallesolicitud` (`codsol`, `codper`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{82978D58-0AC7-4F30-8D45-A063600AD080}` FOREIGN KEY (`codzonrie`) REFERENCES `tb_zonariesgo` (`codzonrie`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{84D3D6F8-0673-41C1-A28A-DCA73F311AF1}` FOREIGN KEY (`codtipvia`) REFERENCES `tb_tipvias` (`codtipvia`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{8CC09536-EE41-465D-A0E8-5F74B151233B}` FOREIGN KEY (`codviv`) REFERENCES `tb_vivienda` (`codviv`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{9905FD21-D6BC-4C02-A794-B1B590E14A6A}` FOREIGN KEY (`codtipviv`) REFERENCES `tb_tipovivienda` (`codtipviv`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{B0BC4BF5-DCD7-4B35-8EAF-8C2B839E81FC}` FOREIGN KEY (`codtipmat`) REFERENCES `tb_tipomaterial` (`codtipmat`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{C59A7D06-98BB-4FC2-8E63-50AA6BD70DE3}` FOREIGN KEY (`codpar`) REFERENCES `tb_parentesco` (`codpar`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{C61B265E-F024-4FEC-96C5-8413A7B75EE1}` FOREIGN KEY (`codzonif`) REFERENCES `tb_zonificacion` (`codzonif`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{D22B8B0C-BBF9-4C6C-BA98-A5B3D654CA53}` FOREIGN KEY (`codcon`) REFERENCES `tb_conclusion` (`codcon`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{FB02766F-9ABB-49B3-A8B4-3FE3802D0321}` FOREIGN KEY (`codestcon`) REFERENCES `tb_estadoconstruccion` (`codestcon`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tb_chkdomicilio_tb_distrito1` FOREIGN KEY (`coddist`, `codpro`, `coddpto`) REFERENCES `tb_distrito` (`coddist`, `codpro`, `coddpto`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_chkfamilia_delito` */

DROP TABLE IF EXISTS `tb_chkfamilia_delito`;

CREATE TABLE `tb_chkfamilia_delito` (
  `coddel` int(5) NOT NULL,
  `codchkser` int(10) unsigned NOT NULL,
  `codper` int(10) unsigned NOT NULL,
  `codsol` int(10) unsigned NOT NULL,
  PRIMARY KEY  (`coddel`,`codchkser`,`codper`,`codsol`),
  KEY `fk_tb_chkfamiliar_has_tb_delito_tb_delito1` (`coddel`),
  KEY `fk_tb_chkfamiliar_has_tb_delito_tb_chkfamiliar1` (`codchkser`,`codper`,`codsol`),
  CONSTRAINT `fk_tb_chkfamiliar_has_tb_delito_tb_chkfamiliar1` FOREIGN KEY (`codchkser`, `codper`, `codsol`) REFERENCES `tb_chkfamiliar` (`codchkser`, `codper`, `codsol`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tb_chkfamiliar_has_tb_delito_tb_delito1` FOREIGN KEY (`coddel`) REFERENCES `tb_delito` (`coddel`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `tb_chkfamiliar` */

DROP TABLE IF EXISTS `tb_chkfamiliar`;

CREATE TABLE `tb_chkfamiliar` (
  `codchkser` int(10) unsigned NOT NULL auto_increment COMMENT 'Código del Chek Service',
  `codper` int(10) unsigned NOT NULL,
  `codsol` int(10) unsigned NOT NULL,
  `imgreniec` varchar(50) default 'default.jpg' COMMENT 'Imagen de RENIEC',
  `obsimgreniec` text COMMENT 'Observación de la Imagen de RENIEC',
  `indrefpol` tinyint(1) default '0',
  `indantpol` tinyint(1) default '0',
  `indreqjud` tinyint(1) default '0',
  `indrefter` tinyint(1) default '0',
  `indrefdro` tinyint(1) default '0',
  `indimpsalpai` tinyint(1) default '0',
  `refpolchk` text COMMENT 'Referencia Policial',
  `indinvpen` tinyint(1) default '0',
  `invpenchk` text COMMENT 'Investigación Penal',
  `recchk` text COMMENT 'Recomendación',
  `codestchk` int(5) NOT NULL default '1',
  `usuciechksrv` varchar(20) default NULL,
  `fecciechksrv` datetime default NULL,
  PRIMARY KEY  (`codchkser`,`codper`,`codsol`),
  KEY `fk_tb_chkservice_tb_estadocheck1` (`codestchk`),
  KEY `fk_{3DFEFC22-9415-440B-8F6F-4759CBCF235E}` (`codsol`,`codper`),
  CONSTRAINT `fk_tb_chkservice_tb_estadocheck10` FOREIGN KEY (`codestchk`) REFERENCES `tb_estadocheck` (`codestchk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{3DFEFC22-9415-440B-8F6F-4759CBCF235E}0` FOREIGN KEY (`codsol`, `codper`) REFERENCES `tb_detallesolicitud` (`codsol`, `codper`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_chklaboral` */

DROP TABLE IF EXISTS `tb_chklaboral`;

CREATE TABLE `tb_chklaboral` (
  `codchklab` int(10) unsigned NOT NULL auto_increment COMMENT 'Código de Check Laboral',
  `codper` int(10) unsigned NOT NULL,
  `codsol` int(10) unsigned NOT NULL,
  `nomperref` varchar(50) default NULL COMMENT 'Persona dada como referencia',
  `nomemp` varchar(50) default NULL COMMENT 'Empresa',
  `telemp` varchar(12) default NULL COMMENT 'Teléfono',
  `perlab` varchar(40) default NULL COMMENT 'Periodo laboral',
  `motces` varchar(50) default NULL COMMENT 'Motivo del cese',
  `percont` varchar(80) default NULL,
  `carpercont` varchar(60) default NULL,
  `fecent` date default NULL COMMENT 'Fecha de la entrevista',
  `obsent` text COMMENT 'Observación del entrevistador',
  `noment` varchar(60) default NULL COMMENT 'Nombre del entrevistador',
  `usuciechklab` varchar(20) default NULL,
  `fecciechklab` datetime default NULL,
  `codestchk` int(5) NOT NULL,
  `codcue` int(10) unsigned NOT NULL,
  `cueresp` tinyint(1) default NULL,
  `codcon` int(5) unsigned NOT NULL,
  PRIMARY KEY  (`codchklab`,`codper`,`codsol`),
  KEY `fk_tb_chklaboral_tb_estadocheck1` (`codestchk`),
  KEY `fk_{B569A64B-2690-4E0A-B33F-0DCC9122AE88}` (`codsol`,`codper`),
  KEY `fk_tb_chklaboral_tb_cuestionario1` (`codcue`),
  KEY `fk_tb_chklaboral_tb_conclusion1` (`codcon`),
  CONSTRAINT `fk_tb_chklaboral_tb_estadocheck1` FOREIGN KEY (`codestchk`) REFERENCES `tb_estadocheck` (`codestchk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{B569A64B-2690-4E0A-B33F-0DCC9122AE88}` FOREIGN KEY (`codsol`, `codper`) REFERENCES `tb_detallesolicitud` (`codsol`, `codper`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tb_chklaboral_tb_cuestionario1` FOREIGN KEY (`codcue`) REFERENCES `tb_cuestionario` (`codcue`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tb_chklaboral_tb_conclusion1` FOREIGN KEY (`codcon`) REFERENCES `tb_conclusion` (`codcon`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_chkservice` */

DROP TABLE IF EXISTS `tb_chkservice`;

CREATE TABLE `tb_chkservice` (
  `codchkser` int(10) unsigned NOT NULL auto_increment COMMENT 'Código del Chek Service',
  `codper` int(10) unsigned NOT NULL,
  `codsol` int(10) unsigned NOT NULL,
  `imgreniec` varchar(50) default 'default.jpg' COMMENT 'Imagen de RENIEC',
  `obsimgreniec` text COMMENT 'Observación de la Imagen de RENIEC',
  `indrefpol` tinyint(1) default '0',
  `indantpol` tinyint(1) default '0',
  `indreqjud` tinyint(1) default '0',
  `indrefter` tinyint(1) default '0',
  `indrefdro` tinyint(1) default '0',
  `indimpsalpai` tinyint(1) default '0',
  `refpolchk` text COMMENT 'Referencia Policial',
  `indinvpen` tinyint(1) default '0',
  `invpenchk` text COMMENT 'Investigación Penal',
  `recchk` text COMMENT 'Recomendación',
  `codestchk` int(5) NOT NULL default '1',
  `usuciechksrv` varchar(20) default NULL,
  `fecciechksrv` datetime default NULL,
  PRIMARY KEY  (`codchkser`,`codper`,`codsol`),
  KEY `fk_tb_chkservice_tb_estadocheck1` (`codestchk`),
  KEY `fk_{3DFEFC22-9415-440B-8F6F-4759CBCF235E}` (`codsol`,`codper`),
  CONSTRAINT `fk_tb_chkservice_tb_estadocheck1` FOREIGN KEY (`codestchk`) REFERENCES `tb_estadocheck` (`codestchk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{3DFEFC22-9415-440B-8F6F-4759CBCF235E}` FOREIGN KEY (`codsol`, `codper`) REFERENCES `tb_detallesolicitud` (`codsol`, `codper`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=257 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_cliente` */

DROP TABLE IF EXISTS `tb_cliente`;

CREATE TABLE `tb_cliente` (
  `codcli` int(10) unsigned NOT NULL auto_increment COMMENT 'Código de cliente',
  `codestcli` int(5) unsigned NOT NULL,
  `codtipcli` int(5) unsigned NOT NULL,
  `nomcli` varchar(50) NOT NULL COMMENT 'Nombre de Cliente o Razón Social',
  `ruccli` varchar(12) NOT NULL COMMENT 'RUC cliente',
  `dircli` varchar(80) NOT NULL COMMENT 'Dirección del cliente',
  `telcli` varchar(12) NOT NULL COMMENT 'Teléfono del Cliente',
  `usuregcli` varchar(20) NOT NULL,
  `fecregcli` datetime NOT NULL,
  PRIMARY KEY  (`codcli`),
  UNIQUE KEY `ruccliente` (`ruccli`),
  KEY `fk_{6822434B-078D-46EC-B17C-6BD8EFA14EBC}` (`codtipcli`),
  KEY `fk_{0C03C078-9AAC-42D6-BF94-FB2F7B468636}` (`codestcli`),
  CONSTRAINT `fk_{0C03C078-9AAC-42D6-BF94-FB2F7B468636}` FOREIGN KEY (`codestcli`) REFERENCES `tb_estcliente` (`codestcli`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{6822434B-078D-46EC-B17C-6BD8EFA14EBC}` FOREIGN KEY (`codtipcli`) REFERENCES `tb_tipcliente` (`codtipcli`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_conclusion` */

DROP TABLE IF EXISTS `tb_conclusion`;

CREATE TABLE `tb_conclusion` (
  `codcon` int(5) unsigned NOT NULL auto_increment,
  `descon` varchar(25) default NULL,
  `estcon` int(1) unsigned default NULL,
  PRIMARY KEY  (`codcon`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_cuestionario` */

DROP TABLE IF EXISTS `tb_cuestionario`;

CREATE TABLE `tb_cuestionario` (
  `codcue` int(10) unsigned NOT NULL auto_increment,
  `descue` varchar(50) default NULL,
  `estcue` int(1) unsigned default NULL,
  PRIMARY KEY  (`codcue`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_delito` */

DROP TABLE IF EXISTS `tb_delito`;

CREATE TABLE `tb_delito` (
  `coddel` int(5) NOT NULL auto_increment,
  `nomdel` varchar(180) NOT NULL,
  `desdel` text NOT NULL,
  `usuregdel` varchar(20) NOT NULL,
  `fecregdel` datetime NOT NULL,
  `estdel` tinyint(1) NOT NULL,
  PRIMARY KEY  (`coddel`)
) ENGINE=InnoDB AUTO_INCREMENT=210 DEFAULT CHARSET=latin1;

/*Table structure for table `tb_delito_chkservice` */

DROP TABLE IF EXISTS `tb_delito_chkservice`;

CREATE TABLE `tb_delito_chkservice` (
  `coddel` int(5) NOT NULL,
  `codchkser` int(10) unsigned NOT NULL,
  `codper` int(10) unsigned NOT NULL,
  `codsol` int(10) unsigned NOT NULL,
  PRIMARY KEY  (`coddel`,`codchkser`,`codper`,`codsol`),
  KEY `fk_tb_delito_has_tb_chkservice_tb_chkservice1` (`codchkser`,`codper`,`codsol`),
  CONSTRAINT `fk_tb_delito_has_tb_chkservice_tb_delito1` FOREIGN KEY (`coddel`) REFERENCES `tb_delito` (`coddel`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tb_delito_has_tb_chkservice_tb_chkservice1` FOREIGN KEY (`codchkser`, `codper`, `codsol`) REFERENCES `tb_chkservice` (`codchkser`, `codper`, `codsol`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `tb_departamento` */

DROP TABLE IF EXISTS `tb_departamento`;

CREATE TABLE `tb_departamento` (
  `coddpto` int(3) unsigned zerofill NOT NULL auto_increment,
  `desdpto` varchar(25) NOT NULL,
  `estdpto` int(1) NOT NULL,
  PRIMARY KEY  (`coddpto`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_detallepackcheck` */

DROP TABLE IF EXISTS `tb_detallepackcheck`;

CREATE TABLE `tb_detallepackcheck` (
  `codchk` int(5) unsigned NOT NULL,
  `codpacchk` int(5) unsigned NOT NULL,
  PRIMARY KEY  (`codchk`,`codpacchk`),
  KEY `fk_{D622E747-22E9-4777-9A68-A158F0D72C63}` (`codpacchk`),
  KEY `fk_{31370DB9-7DAD-4CB7-91BA-2C69B0E9EF09}` (`codchk`),
  CONSTRAINT `fk_{31370DB9-7DAD-4CB7-91BA-2C69B0E9EF09}` FOREIGN KEY (`codchk`) REFERENCES `tb_check` (`codchk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{D622E747-22E9-4777-9A68-A158F0D72C63}` FOREIGN KEY (`codpacchk`) REFERENCES `tb_packcheck` (`codpacchk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_detallesolicitud` */

DROP TABLE IF EXISTS `tb_detallesolicitud`;

CREATE TABLE `tb_detallesolicitud` (
  `codsol` int(10) unsigned NOT NULL,
  `codper` int(10) unsigned NOT NULL,
  `codpue` int(5) unsigned NOT NULL,
  `codpacchk` int(5) unsigned NOT NULL,
  `codestchk` int(5) NOT NULL,
  PRIMARY KEY  (`codsol`,`codper`),
  KEY `fk_{B0D1B1D6-29C2-49BE-A947-C518D97166C3}` (`codper`),
  KEY `fk_{82D58FF7-A109-4D26-92E3-D5F05917FA84}` (`codpacchk`),
  KEY `fk_{50362FCA-1AFA-43E2-AAD6-787B75914A3A}` (`codpue`),
  KEY `fk_tb_detallesolicitud_tb_estadocheck1` (`codestchk`),
  KEY `fk_{B1A67792-4B97-4CFF-BCA0-F8FB96C5BEEF}` (`codsol`),
  CONSTRAINT `fk_{50362FCA-1AFA-43E2-AAD6-787B75914A3A}` FOREIGN KEY (`codpue`) REFERENCES `tb_puesto` (`codpue`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{82D58FF7-A109-4D26-92E3-D5F05917FA84}` FOREIGN KEY (`codpacchk`) REFERENCES `tb_packcheck` (`codpacchk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{B0D1B1D6-29C2-49BE-A947-C518D97166C3}` FOREIGN KEY (`codper`) REFERENCES `tb_persona` (`codper`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{B1A67792-4B97-4CFF-BCA0-F8FB96C5BEEF}` FOREIGN KEY (`codsol`) REFERENCES `tb_solicitud` (`codsol`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tb_detallesolicitud_tb_estadocheck1` FOREIGN KEY (`codestchk`) REFERENCES `tb_estadocheck` (`codestchk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_distrito` */

DROP TABLE IF EXISTS `tb_distrito`;

CREATE TABLE `tb_distrito` (
  `coddpto` int(3) unsigned zerofill NOT NULL,
  `codpro` int(3) unsigned zerofill NOT NULL,
  `coddist` int(3) unsigned zerofill NOT NULL auto_increment,
  `desdist` varchar(25) NOT NULL,
  `estdist` int(1) NOT NULL,
  PRIMARY KEY  (`coddist`,`codpro`,`coddpto`),
  KEY `fk_tb_distrito_tb_provincia1` (`codpro`,`coddpto`),
  CONSTRAINT `fk_tb_distrito_tb_provincia1` FOREIGN KEY (`codpro`, `coddpto`) REFERENCES `tb_provincia` (`codpro`, `coddpto`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_estadocheck` */

DROP TABLE IF EXISTS `tb_estadocheck`;

CREATE TABLE `tb_estadocheck` (
  `codestchk` int(5) NOT NULL auto_increment,
  `desestchk` varchar(45) NOT NULL,
  `estdeschk` tinyint(1) NOT NULL,
  `valestchk` decimal(1,1) NOT NULL,
  PRIMARY KEY  (`codestchk`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Table structure for table `tb_estadoconstruccion` */

DROP TABLE IF EXISTS `tb_estadoconstruccion`;

CREATE TABLE `tb_estadoconstruccion` (
  `codestcon` int(5) unsigned NOT NULL auto_increment,
  `desestcon` varchar(25) default NULL,
  `esestcon` int(1) unsigned default NULL,
  PRIMARY KEY  (`codestcon`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_estcliente` */

DROP TABLE IF EXISTS `tb_estcliente`;

CREATE TABLE `tb_estcliente` (
  `codestcli` int(5) unsigned NOT NULL auto_increment COMMENT 'Código del estado del cliente',
  `desestcli` varchar(25) NOT NULL COMMENT 'Descripción del estado del cliente',
  `clihab` tinyint(4) NOT NULL COMMENT 'Indica si el estado del cliente lo habilita para generar solicitudes',
  PRIMARY KEY  (`codestcli`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_estsol` */

DROP TABLE IF EXISTS `tb_estsol`;

CREATE TABLE `tb_estsol` (
  `codestsol` int(11) NOT NULL auto_increment,
  `desestsol` varchar(25) NOT NULL,
  `estestsol` tinyint(1) NOT NULL,
  PRIMARY KEY  (`codestsol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Table structure for table `tb_imgdomicilio` */

DROP TABLE IF EXISTS `tb_imgdomicilio`;

CREATE TABLE `tb_imgdomicilio` (
  `codimgdom` int(10) unsigned NOT NULL auto_increment,
  `codsol` int(10) unsigned NOT NULL,
  `codper` int(10) unsigned NOT NULL,
  `codchkdom` int(10) unsigned NOT NULL,
  `codtipimg` int(5) unsigned NOT NULL,
  `nomimgdom` varchar(50) default NULL,
  `numimgdom` int(1) unsigned default NULL,
  PRIMARY KEY  (`codimgdom`,`codsol`,`codper`,`codchkdom`),
  KEY `fk_{39F06787-8BCD-4B05-94FA-8481A99DAF0D}` (`codtipimg`),
  KEY `fk_{E191B052-32F0-4094-82BD-15889A918C89}` (`codchkdom`,`codper`,`codsol`),
  CONSTRAINT `fk_{39F06787-8BCD-4B05-94FA-8481A99DAF0D}` FOREIGN KEY (`codtipimg`) REFERENCES `tb_tipoimagen` (`codtipimg`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{E191B052-32F0-4094-82BD-15889A918C89}` FOREIGN KEY (`codchkdom`, `codper`, `codsol`) REFERENCES `tb_chkdomicilio` (`codchkdom`, `codper`, `codsol`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_opciones` */

DROP TABLE IF EXISTS `tb_opciones`;

CREATE TABLE `tb_opciones` (
  `codopc` int(5) NOT NULL auto_increment,
  `nomopc` varchar(45) NOT NULL,
  `estopc` tinyint(1) NOT NULL,
  `usuregopc` varchar(20) default NULL,
  `fecregopc` datetime default NULL,
  PRIMARY KEY  (`codopc`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `tb_packcheck` */

DROP TABLE IF EXISTS `tb_packcheck`;

CREATE TABLE `tb_packcheck` (
  `codpacchk` int(5) unsigned NOT NULL auto_increment COMMENT 'Código del Pack de Checks',
  `despacchk` varchar(35) NOT NULL COMMENT 'Descripción del Pack de Checks',
  `usuregpacchk` varchar(20) NOT NULL,
  `fecregpacchk` datetime NOT NULL,
  `estpacchk` int(1) unsigned NOT NULL COMMENT 'Estado del Pack de Checks',
  PRIMARY KEY  (`codpacchk`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_parentesco` */

DROP TABLE IF EXISTS `tb_parentesco`;

CREATE TABLE `tb_parentesco` (
  `codpar` int(5) unsigned NOT NULL auto_increment,
  `despar` varchar(25) default NULL,
  `estpar` int(1) unsigned default NULL,
  PRIMARY KEY  (`codpar`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_perfil` */

DROP TABLE IF EXISTS `tb_perfil`;

CREATE TABLE `tb_perfil` (
  `codperf` int(5) unsigned zerofill NOT NULL auto_increment,
  `desperf` varchar(45) NOT NULL,
  `estperf` tinyint(1) NOT NULL,
  `usuregperf` varchar(20) NOT NULL,
  `fecregperf` datetime NOT NULL,
  PRIMARY KEY  (`codperf`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Table structure for table `tb_perfilopciones` */

DROP TABLE IF EXISTS `tb_perfilopciones`;

CREATE TABLE `tb_perfilopciones` (
  `codperf` int(5) unsigned zerofill NOT NULL,
  `codopc` int(5) NOT NULL,
  PRIMARY KEY  (`codperf`,`codopc`),
  KEY `fk_tb_perfil_has_tb_opciones_tb_perfil1` (`codperf`),
  KEY `fk_tb_perfil_has_tb_opciones_tb_opciones1` (`codopc`),
  CONSTRAINT `fk_tb_perfil_has_tb_opciones_tb_opciones1` FOREIGN KEY (`codopc`) REFERENCES `tb_opciones` (`codopc`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tb_perfil_has_tb_opciones_tb_perfil1` FOREIGN KEY (`codperf`) REFERENCES `tb_perfil` (`codperf`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_persona` */

DROP TABLE IF EXISTS `tb_persona`;

CREATE TABLE `tb_persona` (
  `codper` int(10) unsigned NOT NULL auto_increment COMMENT 'Código de persona',
  `nomper` varchar(50) NOT NULL COMMENT 'Nombre de la persona',
  `apepatper` varchar(50) NOT NULL COMMENT 'Apellido Paterno de la persona',
  `apematper` varchar(50) NOT NULL COMMENT 'Apellido Materno de la persona',
  `numdocper` varchar(20) NOT NULL COMMENT 'Número del documento',
  `estper` tinyint(1) NOT NULL COMMENT 'Estado de la persona',
  `fecregper` datetime NOT NULL COMMENT 'Fecha de registro de la persona',
  `usuregper` varchar(20) NOT NULL COMMENT 'Usuario que registro la persona',
  `codtipdoc` int(5) NOT NULL,
  PRIMARY KEY  (`codper`),
  UNIQUE KEY `documento` (`codtipdoc`,`numdocper`),
  KEY `fk_tb_persona_tb_tipdoc1` (`codtipdoc`),
  CONSTRAINT `fk_tb_persona_tb_tipdoc1` FOREIGN KEY (`codtipdoc`) REFERENCES `tb_tipdoc` (`codtipdoc`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=250 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_preguntas` */

DROP TABLE IF EXISTS `tb_preguntas`;

CREATE TABLE `tb_preguntas` (
  `codpre` int(10) unsigned NOT NULL auto_increment,
  `codcue` int(10) unsigned NOT NULL,
  `despre` text,
  `estpre` int(1) unsigned default NULL,
  PRIMARY KEY  (`codpre`,`codcue`),
  KEY `fk_{F039D057-846E-407D-B80D-9B3A9C34E805}` (`codcue`),
  CONSTRAINT `fk_{F039D057-846E-407D-B80D-9B3A9C34E805}` FOREIGN KEY (`codcue`) REFERENCES `tb_cuestionario` (`codcue`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_provincia` */

DROP TABLE IF EXISTS `tb_provincia`;

CREATE TABLE `tb_provincia` (
  `coddpto` int(3) unsigned zerofill NOT NULL,
  `codpro` int(3) unsigned zerofill NOT NULL auto_increment,
  `despro` varchar(25) NOT NULL,
  `estpro` int(1) NOT NULL,
  PRIMARY KEY  (`codpro`,`coddpto`),
  KEY `fk_tb_provincia_tb_departamento1` (`coddpto`),
  CONSTRAINT `fk_tb_provincia_tb_departamento1` FOREIGN KEY (`coddpto`) REFERENCES `tb_departamento` (`coddpto`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_puesto` */

DROP TABLE IF EXISTS `tb_puesto`;

CREATE TABLE `tb_puesto` (
  `codpue` int(5) unsigned NOT NULL auto_increment COMMENT 'Código del puesto',
  `despue` varchar(70) NOT NULL default '' COMMENT 'Descripción del puesto',
  `estpue` tinyint(1) NOT NULL COMMENT 'Estado del puesto',
  PRIMARY KEY  (`codpue`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_residentes` */

DROP TABLE IF EXISTS `tb_residentes`;

CREATE TABLE `tb_residentes` (
  `codres` int(5) unsigned NOT NULL auto_increment,
  `desres` varchar(25) default NULL,
  `estres` int(1) unsigned default NULL,
  PRIMARY KEY  (`codres`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_residentesdomicilio` */

DROP TABLE IF EXISTS `tb_residentesdomicilio`;

CREATE TABLE `tb_residentesdomicilio` (
  `codsol` int(10) unsigned NOT NULL,
  `codper` int(10) unsigned NOT NULL,
  `codchkdom` int(10) unsigned NOT NULL,
  `codres` int(5) unsigned NOT NULL,
  PRIMARY KEY  (`codsol`,`codper`,`codchkdom`,`codres`),
  KEY `fk_{D77FC40C-1426-446B-B967-A657B3E60B0A}` (`codchkdom`,`codper`,`codsol`),
  KEY `fk_{10B08CF4-674A-4DCF-8490-36D643A743E6}` (`codres`),
  CONSTRAINT `fk_{10B08CF4-674A-4DCF-8490-36D643A743E6}` FOREIGN KEY (`codres`) REFERENCES `tb_residentes` (`codres`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{D77FC40C-1426-446B-B967-A657B3E60B0A}` FOREIGN KEY (`codchkdom`, `codper`, `codsol`) REFERENCES `tb_chkdomicilio` (`codchkdom`, `codper`, `codsol`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_respuestas` */

DROP TABLE IF EXISTS `tb_respuestas`;

CREATE TABLE `tb_respuestas` (
  `codsol` int(10) unsigned NOT NULL,
  `codper` int(10) unsigned NOT NULL,
  `codchklab` int(10) unsigned NOT NULL,
  `codcue` int(10) unsigned NOT NULL,
  `codpre` int(10) unsigned NOT NULL,
  `respre` text COMMENT 'Respuesta de la pregunta',
  PRIMARY KEY  (`codsol`,`codper`,`codchklab`,`codcue`,`codpre`),
  KEY `fk_{53EFD12C-4F4B-4317-9CB4-0FE88A0DA9C2}` (`codchklab`,`codper`,`codsol`),
  KEY `fk_{FAA21FAA-4CBD-47F1-BC1F-3F174C42DE37}` (`codpre`,`codcue`),
  CONSTRAINT `fk_{53EFD12C-4F4B-4317-9CB4-0FE88A0DA9C2}` FOREIGN KEY (`codchklab`, `codper`, `codsol`) REFERENCES `tb_chklaboral` (`codchklab`, `codper`, `codsol`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{FAA21FAA-4CBD-47F1-BC1F-3F174C42DE37}` FOREIGN KEY (`codpre`, `codcue`) REFERENCES `tb_preguntas` (`codpre`, `codcue`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_solicitud` */

DROP TABLE IF EXISTS `tb_solicitud`;

CREATE TABLE `tb_solicitud` (
  `codsol` int(10) unsigned NOT NULL auto_increment COMMENT 'Código de Solicitud',
  `fecregsol` datetime NOT NULL COMMENT 'Fecha de registro de la solicitud',
  `fecvensol` datetime NOT NULL COMMENT 'Fecha de vencimiento de la solicitud',
  `codcli` int(10) unsigned NOT NULL,
  `usuregsol` varchar(20) NOT NULL COMMENT 'Usuario que registró la solicitud',
  `obssol` text,
  `codestsol` int(11) NOT NULL,
  `fecciesol` datetime NOT NULL,
  PRIMARY KEY  (`codsol`),
  KEY `fk_tb_solicitud_tb_estsol1` (`codestsol`),
  KEY `fk_{41145C50-667A-4575-B0CB-27782C2DB542}` (`codcli`),
  CONSTRAINT `fk_tb_solicitud_tb_estsol1` FOREIGN KEY (`codestsol`) REFERENCES `tb_estsol` (`codestsol`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{41145C50-667A-4575-B0CB-27782C2DB542}` FOREIGN KEY (`codcli`) REFERENCES `tb_cliente` (`codcli`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_tipcliente` */

DROP TABLE IF EXISTS `tb_tipcliente`;

CREATE TABLE `tb_tipcliente` (
  `codtipcli` int(5) unsigned NOT NULL auto_increment COMMENT 'Código del tipo de cliente',
  `destipcli` varchar(50) NOT NULL COMMENT 'Descripción del tipo de cliente',
  `esttipcli` char(1) NOT NULL COMMENT 'Estado del tipo de cliente',
  PRIMARY KEY  (`codtipcli`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_tipdoc` */

DROP TABLE IF EXISTS `tb_tipdoc`;

CREATE TABLE `tb_tipdoc` (
  `codtipdoc` int(5) NOT NULL auto_increment,
  `destipdoc` varchar(45) NOT NULL,
  `esttipdoc` tinyint(1) NOT NULL,
  PRIMARY KEY  (`codtipdoc`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*Table structure for table `tb_tipoimagen` */

DROP TABLE IF EXISTS `tb_tipoimagen`;

CREATE TABLE `tb_tipoimagen` (
  `codtipimg` int(5) unsigned NOT NULL auto_increment,
  `destipimg` varchar(25) default NULL,
  `esttipimg` int(11) unsigned default NULL,
  PRIMARY KEY  (`codtipimg`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_tipomaterial` */

DROP TABLE IF EXISTS `tb_tipomaterial`;

CREATE TABLE `tb_tipomaterial` (
  `codtipmat` int(5) unsigned NOT NULL auto_increment,
  `destipmat` varchar(25) default NULL,
  `estipmat` int(1) unsigned default NULL,
  PRIMARY KEY  (`codtipmat`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_tipovivienda` */

DROP TABLE IF EXISTS `tb_tipovivienda`;

CREATE TABLE `tb_tipovivienda` (
  `codtipviv` int(5) NOT NULL,
  `destipviv` varchar(35) NOT NULL,
  `esttipviv` int(1) unsigned NOT NULL,
  PRIMARY KEY  (`codtipviv`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_tipvias` */

DROP TABLE IF EXISTS `tb_tipvias`;

CREATE TABLE `tb_tipvias` (
  `codtipvia` int(5) unsigned NOT NULL auto_increment COMMENT 'Código de Tipo de vía',
  `destipvia` varchar(5) default NULL COMMENT 'Descripción de Tipo de vía',
  `esttipvia` int(1) unsigned default NULL COMMENT 'Estado de Tipo de vía',
  PRIMARY KEY  (`codtipvia`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_users` */

DROP TABLE IF EXISTS `tb_users`;

CREATE TABLE `tb_users` (
  `coduser` int(11) NOT NULL auto_increment COMMENT 'Código Interno del usuario',
  `codcli` int(10) unsigned NOT NULL COMMENT 'Cliente al cual esta asociado el usuario',
  `nomuser` varchar(50) NOT NULL COMMENT 'Nombre',
  `apeuser` varchar(50) NOT NULL COMMENT 'Apellidos',
  `loguser` varchar(20) NOT NULL COMMENT 'Login',
  `pasuser` varchar(45) NOT NULL COMMENT 'Contraseña',
  `usuregusu` varchar(20) NOT NULL COMMENT 'Usuario que registró',
  `fecregusu` datetime NOT NULL COMMENT 'Fecha que se registr',
  `codperf` int(5) unsigned zerofill NOT NULL COMMENT 'Perfil Asignado',
  `estuser` tinyint(1) NOT NULL COMMENT 'Estado del usuario',
  `teluser` varchar(15) NOT NULL COMMENT 'Teléfono del usuario',
  `emailuser` varchar(60) NOT NULL COMMENT 'Correo del usuario',
  PRIMARY KEY  (`coduser`),
  UNIQUE KEY `user` (`loguser`),
  KEY `fk_tb_users_tb_perfil1` (`codperf`),
  KEY `fk_tb_users_tb_cliente1` (`codcli`),
  CONSTRAINT `fk_tb_users_tb_perfil1` FOREIGN KEY (`codperf`) REFERENCES `tb_perfil` (`codperf`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tb_users_tb_cliente1` FOREIGN KEY (`codcli`) REFERENCES `tb_cliente` (`codcli`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

/*Table structure for table `tb_vivienda` */

DROP TABLE IF EXISTS `tb_vivienda`;

CREATE TABLE `tb_vivienda` (
  `codviv` int(5) unsigned NOT NULL auto_increment,
  `desviv` varchar(25) default NULL,
  `estviv` int(1) unsigned default NULL,
  PRIMARY KEY  (`codviv`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_zonariesgo` */

DROP TABLE IF EXISTS `tb_zonariesgo`;

CREATE TABLE `tb_zonariesgo` (
  `codzonrie` int(5) unsigned NOT NULL auto_increment,
  `deszonrie` varchar(25) default NULL,
  `estzonrie` int(1) unsigned default NULL,
  PRIMARY KEY  (`codzonrie`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tb_zonificacion` */

DROP TABLE IF EXISTS `tb_zonificacion`;

CREATE TABLE `tb_zonificacion` (
  `codzonif` int(5) unsigned NOT NULL auto_increment,
  `deszonif` varchar(25) default NULL,
  `estzonif` int(1) unsigned default NULL,
  PRIMARY KEY  (`codzonif`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Table structure for table `tmp_estactchk` */

DROP TABLE IF EXISTS `tmp_estactchk`;

CREATE TABLE `tmp_estactchk` (
  `codsol` int(10) NOT NULL,
  `codper` int(10) NOT NULL,
  `codestchk` int(5) default NULL,
  `fe_mov` datetime default NULL,
  `loguser` varchar(20) NOT NULL,
  PRIMARY KEY  (`codsol`,`loguser`,`codper`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Table structure for table `tmp_estperchk` */

DROP TABLE IF EXISTS `tmp_estperchk`;

CREATE TABLE `tmp_estperchk` (
  `codsol` int(10) NOT NULL,
  `codper` int(10) NOT NULL,
  `codchk` int(10) NOT NULL,
  `codestchk` int(10) NOT NULL,
  `fe_mov` datetime default NULL,
  `loguser` varchar(20) NOT NULL,
  PRIMARY KEY  (`codsol`,`codper`,`codchk`,`codestchk`,`loguser`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
