/*
SQLyog Community v8.4 RC
MySQL - 5.0.51b-community-nt-log : Database - prodb
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`prodb` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `prodb`;

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

/*Data for the table `tb_check` */

insert  into `tb_check`(`codchk`,`deschk`,`nomobj`,`nomtbl`,`usuregchk`,`fecregchk`,`estchk`) values (1,'Check Service','tbp_checkservice','tb_chkservice','admin','2010-04-25 11:22:51','1'),(2,'Check Domiciliario','tbp_checkdomicilio','tb_chkdomicilio','admin','2010-04-25 11:22:51','1'),(3,'Check Laboral','tbp_checklaboral','tb_chklaboral','admin','2010-04-25 11:22:51','1'),(4,'Check Service Familiar','tbp_checkfam','tb_checkfam','admin','2010-04-25 11:22:51','1');

/*Table structure for table `tb_chkdomicilio` */

DROP TABLE IF EXISTS `tb_chkdomicilio`;

CREATE TABLE `tb_chkdomicilio` (
  `codchkdom` int(10) unsigned NOT NULL auto_increment COMMENT 'Código del Check Domiciliario',
  `codper` int(10) unsigned NOT NULL COMMENT 'Código persona',
  `codsol` int(10) unsigned NOT NULL COMMENT 'Código solicitud',
  `coddpto` int(3) unsigned NOT NULL COMMENT 'Departamento',
  `codpro` int(3) unsigned NOT NULL COMMENT 'Provincia',
  `coddist` int(3) unsigned NOT NULL COMMENT 'Distrito',
  `codtipvia` int(5) unsigned NOT NULL default '1' COMMENT 'Tipo de vía',
  `nomviadom` varchar(60) default NULL COMMENT 'Nombre de la vía',
  `numdom` int(11) unsigned default NULL COMMENT 'Número de domicilio',
  `urbdom` char(50) default NULL COMMENT 'Urbanización',
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
  CONSTRAINT `fk_tb_chkdomicilio_tb_distrito1` FOREIGN KEY (`coddist`, `codpro`, `coddpto`) REFERENCES `tb_distrito` (`coddist`, `codpro`, `coddpto`) ON DELETE NO ACTION ON UPDATE NO ACTION,
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
  CONSTRAINT `fk_{FB02766F-9ABB-49B3-A8B4-3FE3802D0321}` FOREIGN KEY (`codestcon`) REFERENCES `tb_estadoconstruccion` (`codestcon`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_chkdomicilio` */

/*Table structure for table `tb_chklaboral` */

DROP TABLE IF EXISTS `tb_chklaboral`;

CREATE TABLE `tb_chklaboral` (
  `codchklab` int(10) unsigned NOT NULL auto_increment COMMENT 'Código de Check Laboral',
  `codper` int(10) unsigned NOT NULL,
  `codsol` int(10) unsigned NOT NULL,
  `nomperref` varchar(50) default NULL COMMENT 'Persona dada como referencia',
  `codpue` int(5) unsigned NOT NULL COMMENT 'Cargo de la persona de referencia',
  `nomemp` varchar(50) default NULL COMMENT 'Empresa',
  `telemp` varchar(12) default NULL COMMENT 'Teléfono',
  `perlab` varchar(40) default NULL COMMENT 'Periodo laboral',
  `motces` varchar(50) default NULL COMMENT 'Motivo del cese',
  `fecent` date default NULL COMMENT 'Fecha de la entrevista',
  `obsent` text COMMENT 'Observación del entrevistador',
  `noment` varchar(60) default NULL COMMENT 'Nombre del entrevistador',
  `usuciechklab` varchar(20) default NULL,
  `fecciechklab` datetime default NULL,
  `codestchk` int(5) NOT NULL,
  PRIMARY KEY  (`codchklab`,`codper`,`codsol`),
  KEY `fk_tb_chklaboral_tb_estadocheck1` (`codestchk`),
  KEY `fk_{B569A64B-2690-4E0A-B33F-0DCC9122AE88}` (`codsol`,`codper`),
  KEY `fk_{703E680B-E944-4DCD-8E47-7A9FD754A438}` (`codpue`),
  CONSTRAINT `fk_tb_chklaboral_tb_estadocheck1` FOREIGN KEY (`codestchk`) REFERENCES `tb_estadocheck` (`codestchk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{703E680B-E944-4DCD-8E47-7A9FD754A438}` FOREIGN KEY (`codpue`) REFERENCES `tb_puesto` (`codpue`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{B569A64B-2690-4E0A-B33F-0DCC9122AE88}` FOREIGN KEY (`codsol`, `codper`) REFERENCES `tb_detallesolicitud` (`codsol`, `codper`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_chklaboral` */

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
  `coddel` int(5) NOT NULL default '1',
  `codestchk` int(5) NOT NULL default '1',
  `usuciechksrv` varchar(20) default NULL,
  `fecciechksrv` datetime default NULL,
  PRIMARY KEY  (`codchkser`,`codper`,`codsol`),
  KEY `fk_tb_chkservice_tb_delito1` (`coddel`),
  KEY `fk_tb_chkservice_tb_estadocheck1` (`codestchk`),
  KEY `fk_{3DFEFC22-9415-440B-8F6F-4759CBCF235E}` (`codsol`,`codper`),
  CONSTRAINT `fk_tb_chkservice_tb_delito1` FOREIGN KEY (`coddel`) REFERENCES `tb_delito` (`coddel`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tb_chkservice_tb_estadocheck1` FOREIGN KEY (`codestchk`) REFERENCES `tb_estadocheck` (`codestchk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{3DFEFC22-9415-440B-8F6F-4759CBCF235E}` FOREIGN KEY (`codsol`, `codper`) REFERENCES `tb_detallesolicitud` (`codsol`, `codper`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_chkservice` */

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_cliente` */

insert  into `tb_cliente`(`codcli`,`codestcli`,`codtipcli`,`nomcli`,`ruccli`,`dircli`,`telcli`,`usuregcli`,`fecregcli`) values (1,1,1,'Pro Outsourcing','','','','admin','2010-04-25 11:16:47');

/*Table structure for table `tb_conclusion` */

DROP TABLE IF EXISTS `tb_conclusion`;

CREATE TABLE `tb_conclusion` (
  `codcon` int(5) unsigned NOT NULL auto_increment,
  `descon` varchar(25) default NULL,
  `estcon` int(1) unsigned default NULL,
  PRIMARY KEY  (`codcon`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_conclusion` */

/*Table structure for table `tb_cuestionario` */

DROP TABLE IF EXISTS `tb_cuestionario`;

CREATE TABLE `tb_cuestionario` (
  `codcue` int(10) unsigned NOT NULL auto_increment,
  `descue` varchar(50) default NULL,
  `estcue` int(1) unsigned default NULL,
  PRIMARY KEY  (`codcue`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_cuestionario` */

/*Table structure for table `tb_delito` */

DROP TABLE IF EXISTS `tb_delito`;

CREATE TABLE `tb_delito` (
  `coddel` int(5) NOT NULL auto_increment,
  `nomdel` varchar(60) NOT NULL,
  `desdel` text NOT NULL,
  `usuregdel` varchar(20) NOT NULL,
  `fecregdel` datetime NOT NULL,
  `estdel` tinyint(1) NOT NULL,
  PRIMARY KEY  (`coddel`),
  UNIQUE KEY `idx_nomdel` (`nomdel`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Data for the table `tb_delito` */

insert  into `tb_delito`(`coddel`,`nomdel`,`desdel`,`usuregdel`,`fecregdel`,`estdel`) values (1,'No presenta','','admin','2010-04-25 11:24:26',1),(2,'Hurto','Apoderarse de un bien ajeno','admin','2010-04-25 11:24:26',1);

/*Table structure for table `tb_departamento` */

DROP TABLE IF EXISTS `tb_departamento`;

CREATE TABLE `tb_departamento` (
  `coddpto` int(3) unsigned NOT NULL auto_increment,
  `desdpto` varchar(25) NOT NULL,
  `estdpto` int(1) NOT NULL,
  PRIMARY KEY  (`coddpto`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_departamento` */

insert  into `tb_departamento`(`coddpto`,`desdpto`,`estdpto`) values (1,'AMAZONAS',1),(2,'ANCASH',1),(3,'APURIMAC',1),(4,'AREQUIPA',1),(5,'AYACUCHO',1),(6,'CAJAMARCA',1),(7,'CALLAO',1),(8,'CUSCO',1),(9,'HUANCAVELICA',1),(10,'HUANUCO',1),(11,'ICA',1),(12,'JUNIN',1),(13,'LA LIBERTAD',1),(14,'LAMBAYEQUE',1),(15,'LIMA',1),(16,'LORETO',1),(17,'MADRE DE DIOS',1),(18,'MOQUEGUA',1),(19,'PASCO',1),(20,'PIURA',1),(21,'PUNO',1),(22,'SAN MARTIN',1),(23,'TACNA',1),(24,'TUMBES',1),(25,'UCAYALI',1);

/*Table structure for table `tb_detallepackcheck` */

DROP TABLE IF EXISTS `tb_detallepackcheck`;

CREATE TABLE `tb_detallepackcheck` (
  `codchk` int(5) unsigned NOT NULL,
  `codpacchk` int(5) unsigned NOT NULL,
  PRIMARY KEY  (`codchk`,`codpacchk`),
  KEY `fk_{D622E747-22E9-4777-9A68-A158F0D72C63}` (`codpacchk`),
  CONSTRAINT `fk_{31370DB9-7DAD-4CB7-91BA-2C69B0E9EF09}` FOREIGN KEY (`codchk`) REFERENCES `tb_check` (`codchk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{D622E747-22E9-4777-9A68-A158F0D72C63}` FOREIGN KEY (`codpacchk`) REFERENCES `tb_packcheck` (`codpacchk`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_detallepackcheck` */

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
  CONSTRAINT `fk_tb_detallesolicitud_tb_estadocheck1` FOREIGN KEY (`codestchk`) REFERENCES `tb_estadocheck` (`codestchk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{50362FCA-1AFA-43E2-AAD6-787B75914A3A}` FOREIGN KEY (`codpue`) REFERENCES `tb_puesto` (`codpue`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{82D58FF7-A109-4D26-92E3-D5F05917FA84}` FOREIGN KEY (`codpacchk`) REFERENCES `tb_packcheck` (`codpacchk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{B0D1B1D6-29C2-49BE-A947-C518D97166C3}` FOREIGN KEY (`codper`) REFERENCES `tb_persona` (`codper`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{B1A67792-4B97-4CFF-BCA0-F8FB96C5BEEF}` FOREIGN KEY (`codsol`) REFERENCES `tb_solicitud` (`codsol`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_detallesolicitud` */

/*Table structure for table `tb_distrito` */

DROP TABLE IF EXISTS `tb_distrito`;

CREATE TABLE `tb_distrito` (
  `coddpto` int(3) unsigned NOT NULL,
  `codpro` int(3) unsigned NOT NULL,
  `coddist` int(3) unsigned NOT NULL auto_increment,
  `desdist` varchar(25) NOT NULL,
  `estdist` int(1) NOT NULL,
  PRIMARY KEY  (`coddist`,`codpro`,`coddpto`),
  KEY `fk_tb_distrito_tb_provincia1` (`codpro`,`coddpto`),
  CONSTRAINT `fk_tb_distrito_tb_provincia1` FOREIGN KEY (`codpro`, `coddpto`) REFERENCES `tb_provincia` (`codpro`, `coddpto`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_distrito` */

insert  into `tb_distrito`(`coddpto`,`codpro`,`coddist`,`desdist`,`estdist`) values (1,1,1,'CHACHAPOYAS',1),(2,1,1,'HUARAZ',1),(3,1,1,'ABANCAY',1),(4,1,1,'AREQUIPA',1),(5,1,1,'AYACUCHO',1),(6,1,1,'CAJAMARCA',1),(7,1,1,'CALLAO',1),(8,1,1,'CUSCO',1),(9,1,1,'HUANCAVELICA',1),(10,1,1,'HUANUCO',1),(11,1,1,'ICA',1),(12,1,1,'HUANCAYO',1),(13,1,1,'TRUJILLO',1),(14,1,1,'CHICLAYO',1),(15,1,1,'LIMA',1),(16,1,1,'IQUITOS',1),(17,1,1,'TAMBOPATA',1),(18,1,1,'MOQUEGUA',1),(19,1,1,'CHAUPIMARCA',1),(20,1,1,'PIURA',1),(21,1,1,'PUNO',1),(22,1,1,'MOYOBAMBA',1),(23,1,1,'TACNA',1),(24,1,1,'TUMBES',1),(25,1,1,'CALLERIA',1),(1,2,1,'LA PECA',1),(2,2,1,'AIJA',1),(3,2,1,'ANDAHUAYLAS',1),(4,2,1,'CAMANA',1),(5,2,1,'CANGALLO',1),(6,2,1,'CAJABAMBA',1),(8,2,1,'ACOMAYO',1),(9,2,1,'ACOBAMBA',1),(10,2,1,'AMBO',1),(11,2,1,'CHINCHA ALTA',1),(12,2,1,'CONCEPCION',1),(13,2,1,'ASCOPE',1),(14,2,1,'FERRE-AFE',1),(15,2,1,'BARRANCA',1),(16,2,1,'YURIMAGUAS',1),(17,2,1,'MANU',1),(18,2,1,'OMATE',1),(19,2,1,'YANAHUANCA',1),(20,2,1,'AYABACA',1),(21,2,1,'AZANGARO',1),(22,2,1,'BELLAVISTA',1),(23,2,1,'CANDARAVE',1),(24,2,1,'ZORRITOS',1),(25,2,1,'RAYMONDI',1),(1,3,1,'JUMBILLA',1),(2,3,1,'LLAMELLIN',1),(3,3,1,'ANTABAMBA',1),(4,3,1,'CARAVELI',1),(5,3,1,'SANCOS',1),(6,3,1,'CELENDIN',1),(8,3,1,'ANTA',1),(9,3,1,'LIRCAY',1),(10,3,1,'LA UNION',1),(11,3,1,'NAZCA',1),(12,3,1,'CHANCHAMAYO',1),(13,3,1,'BOLIVAR',1),(14,3,1,'LAMBAYEQUE',1),(15,3,1,'CAJATAMBO',1),(16,3,1,'NAUTA',1),(17,3,1,'I-APARI',1),(18,3,1,'ILO',1),(19,3,1,'OXAPAMPA',1),(20,3,1,'HUANCABAMBA',1),(21,3,1,'MACUSANI',1),(22,3,1,'SAN JOSE DE SISA',1),(23,3,1,'LOCUMBA',1),(24,3,1,'ZARUMILLA',1),(25,3,1,'PADRE ABAD',1),(1,4,1,'NIEVA',1),(2,4,1,'CHACAS',1),(3,4,1,'CHALHUANCA',1),(4,4,1,'APLAO',1),(5,4,1,'HUANTA',1),(6,4,1,'CHOTA',1),(8,4,1,'CALCA',1),(9,4,1,'CASTROVIRREYNA',1),(10,4,1,'HUACAYBAMBA',1),(11,4,1,'PALPA',1),(12,4,1,'JAUJA',1),(13,4,1,'CHEPEN',1),(15,4,1,'CANTA',1),(16,4,1,'RAMON CASTILLA',1),(20,4,1,'CHULUCANAS',1),(21,4,1,'JULI',1),(22,4,1,'SAPOSOA',1),(23,4,1,'TARATA',1),(25,4,1,'PURUS',1),(1,5,1,'LAMUD',1),(2,5,1,'CHIQUIAN',1),(3,5,1,'TAMBOBAMBA',1),(4,5,1,'CHIVAY',1),(5,5,1,'SAN MIGUEL',1),(6,5,1,'CONTUMAZA',1),(8,5,1,'YANAOCA',1),(9,5,1,'CHURCAMPA',1),(10,5,1,'LLATA',1),(11,5,1,'PISCO',1),(12,5,1,'JUNIN',1),(13,5,1,'JULCAN',1),(15,5,1,'SAN VICENTE DE CA-ETE',1),(16,5,1,'REQUENA',1),(20,5,1,'PAITA',1),(21,5,1,'ILAVE',1),(22,5,1,'LAMAS',1),(1,6,1,'SAN NICOLAS',1),(2,6,1,'CARHUAZ',1),(3,6,1,'CHINCHEROS',1),(4,6,1,'CHUQUIBAMBA',1),(5,6,1,'PUQUIO',1),(6,6,1,'CUTERVO',1),(8,6,1,'SICUANI',1),(9,6,1,'HUAYTARA',1),(10,6,1,'RUPA-RUPA',1),(12,6,1,'SATIPO',1),(13,6,1,'OTUZCO',1),(15,6,1,'HUARAL',1),(16,6,1,'CONTAMANA',1),(20,6,1,'SULLANA',1),(21,6,1,'HUANCANE',1),(22,6,1,'JUANJUI',1),(1,7,1,'BAGUA GRANDE',1),(2,7,1,'SAN LUIS',1),(3,7,1,'CHUQUIBAMBILLA',1),(4,7,1,'MOLLENDO',1),(5,7,1,'CORACORA',1),(6,7,1,'BAMBAMARCA',1),(8,7,1,'SANTO TOMAS',1),(9,7,1,'PAMPAS',1),(10,7,1,'HUACRACHUCO',1),(12,7,1,'TARMA',1),(13,7,1,'SAN PEDRO DE LLOC',1),(15,7,1,'MATUCANA',1),(20,7,1,'PARI-AS',1),(21,7,1,'LAMPA',1),(22,7,1,'PICOTA',1),(2,8,1,'CASMA',1),(4,8,1,'COTAHUASI',1),(5,8,1,'PAUSA',1),(6,8,1,'JAEN',1),(8,8,1,'ESPINAR',1),(10,8,1,'PANAO',1),(12,8,1,'LA OROYA',1),(13,8,1,'TAYABAMBA',1),(15,8,1,'HUACHO',1),(20,8,1,'SECHURA',1),(21,8,1,'AYAVIRI',1),(22,8,1,'RIOJA',1),(2,9,1,'CORONGO',1),(5,9,1,'QUEROBAMBA',1),(6,9,1,'SAN IGNACIO',1),(8,9,1,'SANTA ANA',1),(10,9,1,'PUERTO INCA',1),(12,9,1,'CHUPACA',1),(13,9,1,'HUAMACHUCO',1),(15,9,1,'OYON',1),(21,9,1,'MOHO',1),(22,9,1,'TARAPOTO',1),(2,10,1,'HUARI',1),(5,10,1,'HUANCAPI',1),(6,10,1,'PEDRO GALVEZ',1),(8,10,1,'PARURO',1),(10,10,1,'JESUS',1),(13,10,1,'SANTIAGO DE CHUCO',1),(15,10,1,'YAUYOS',1),(21,10,1,'PUTINA',1),(22,10,1,'TOCACHE',1),(2,11,1,'HUARMEY',1),(5,11,1,'VILCAS HUAMAN',1),(6,11,1,'SAN MIGUEL',1),(8,11,1,'PAUCARTAMBO',1),(10,11,1,'CHAVINILLO',1),(13,11,1,'CASCAS',1),(21,11,1,'JULIACA',1),(2,12,1,'CARAZ',1),(6,12,1,'SAN PABLO',1),(8,12,1,'URCOS',1),(13,12,1,'VIRU',1),(21,12,1,'SANDIA',1),(2,13,1,'PISCOBAMBA',1),(6,13,1,'SANTA CRUZ',1),(8,13,1,'URUBAMBA',1),(21,13,1,'YUNGUYO',1),(2,14,1,'OCROS',1),(2,15,1,'CABANA',1),(2,16,1,'POMABAMBA',1),(2,17,1,'RECUAY',1),(2,18,1,'CHIMBOTE',1),(2,19,1,'SIHUAS',1),(2,20,1,'YUNGAY',1),(1,1,2,'ASUNCION',1),(2,1,2,'COCHABAMBA',1),(3,1,2,'CHACOCHE',1),(4,1,2,'ALTO SELVA ALEGRE',1),(5,1,2,'ACOCRO',1),(6,1,2,'ASUNCION',1),(7,1,2,'BELLAVISTA',1),(8,1,2,'CCORCA',1),(9,1,2,'ACOBAMBILLA',1),(10,1,2,'AMARILIS',1),(11,1,2,'LA TINGUI-A',1),(13,1,2,'EL PORVENIR',1),(14,1,2,'CHONGOYAPE',1),(15,1,2,'ANCON',1),(16,1,2,'ALTO NANAY',1),(17,1,2,'INAMBARI',1),(18,1,2,'CARUMAS',1),(19,1,2,'HUACHON',1),(21,1,2,'ACORA',1),(22,1,2,'CALZADA',1),(23,1,2,'ALTO DE LA ALIANZA',1),(24,1,2,'CORRALES',1),(25,1,2,'CAMPOVERDE',1),(1,2,2,'ARAMANGO',1),(2,2,2,'CORIS',1),(3,2,2,'ANDARAPA',1),(4,2,2,'JOSE MARIA QUIMPER',1),(5,2,2,'CHUSCHI',1),(6,2,2,'CACHACHI',1),(8,2,2,'ACOPIA',1),(9,2,2,'ANDABAMBA',1),(10,2,2,'CAYNA',1),(11,2,2,'ALTO LARAN',1),(12,2,2,'ACO',1),(13,2,2,'CHICAMA',1),(14,2,2,'CA-ARIS',1),(15,2,2,'PARAMONGA',1),(16,2,2,'BALSAPUERTO',1),(17,2,2,'FITZCARRALD',1),(18,2,2,'CHOJATA',1),(19,2,2,'CHACAYAN',1),(20,2,2,'FRIAS',1),(21,2,2,'ACHAYA',1),(22,2,2,'ALTO BIAVO',1),(23,2,2,'CAIRANI',1),(24,2,2,'CASITAS',1),(25,2,2,'SEPAHUA',1),(1,3,2,'CHISQUILLA',1),(2,3,2,'ACZO',1),(3,3,2,'EL ORO',1),(4,3,2,'ACARI',1),(5,3,2,'CARAPO',1),(6,3,2,'CHUMUCH',1),(8,3,2,'ANCAHUASI',1),(9,3,2,'ANCHONGA',1),(11,3,2,'CHANGUILLO',1),(12,3,2,'PERENE',1),(13,3,2,'BAMBAMARCA',1),(14,3,2,'CHOCHOPE',1),(15,3,2,'COPA',1),(16,3,2,'PARINARI',1),(17,3,2,'IBERIA',1),(18,3,2,'EL ALGARROBAL',1),(19,3,2,'CHONTABAMBA',1),(20,3,2,'CANCHAQUE',1),(21,3,2,'AJOYANI',1),(22,3,2,'AGUA BLANCA',1),(23,3,2,'ILABAYA',1),(24,3,2,'AGUAS VERDES',1),(25,3,2,'IRAZOLA',1),(1,4,2,'EL CENEPA',1),(2,4,2,'ACOCHACA',1),(3,4,2,'CAPAYA',1),(4,4,2,'ANDAGUA',1),(5,4,2,'AYAHUANCO',1),(6,4,2,'ANGUIA',1),(8,4,2,'COYA',1),(9,4,2,'ARMA',1),(10,4,2,'CANCHABAMBA',1),(11,4,2,'LLIPATA',1),(12,4,2,'ACOLLA',1),(13,4,2,'PACANGA',1),(15,4,2,'ARAHUAY',1),(16,4,2,'PEBAS',1),(20,4,2,'BUENOS AIRES',1),(21,4,2,'DESAGUADERO',1),(22,4,2,'ALTO SAPOSOA',1),(23,4,2,'CHUCATAMANI',1),(1,5,2,'CAMPORREDONDO',1),(2,5,2,'ABELARDO PARDO LEZAMETA',1),(3,5,2,'COTABAMBAS',1),(4,5,2,'ACHOMA',1),(5,5,2,'ANCO',1),(6,5,2,'CHILETE',1),(8,5,2,'CHECCA',1),(9,5,2,'ANCO',1),(10,5,2,'ARANCAY',1),(11,5,2,'HUANCANO',1),(12,5,2,'CARHUAMAYO',1),(13,5,2,'CALAMARCA',1),(15,5,2,'ASIA',1),(16,5,2,'ALTO TAPICHE',1),(20,5,2,'AMOTAPE',1),(21,5,2,'CAPAZO',1),(22,5,2,'ALONSO DE ALVARADO',1),(1,6,2,'CHIRIMOTO',1),(2,6,2,'ACOPAMPA',1),(3,6,2,'ANCO_HUALLO',1),(4,6,2,'ANDARAY',1),(5,6,2,'AUCARA',1),(6,6,2,'CALLAYUC',1),(8,6,2,'CHECACUPE',1),(9,6,2,'AYAVI',1),(10,6,2,'DANIEL ALOMIAS ROBLES',1),(12,6,2,'COVIRIALI',1),(13,6,2,'AGALLPAMPA',1),(15,6,2,'ATAVILLOS ALTO',1),(16,6,2,'INAHUAYA',1),(20,6,2,'BELLAVISTA',1),(21,6,2,'COJATA',1),(22,6,2,'CAMPANILLA',1),(1,7,2,'CAJARURO',1),(2,7,2,'SAN NICOLAS',1),(3,7,2,'CURPAHUASI',1),(4,7,2,'COCACHACRA',1),(5,7,2,'CHUMPI',1),(6,7,2,'CHUGUR',1),(8,7,2,'CAPACMARCA',1),(9,7,2,'ACOSTAMBO',1),(10,7,2,'CHOLON',1),(12,7,2,'ACOBAMBA',1),(13,7,2,'GUADALUPE',1),(15,7,2,'ANTIOQUIA',1),(20,7,2,'EL ALTO',1),(21,7,2,'CABANILLA',1),(22,7,2,'BUENOS AIRES',1),(2,8,2,'BUENA VISTA ALTA',1),(4,8,2,'ALCA',1),(5,8,2,'COLTA',1),(6,8,2,'BELLAVISTA',1),(8,8,2,'CONDOROMA',1),(10,8,2,'CHAGLLA',1),(12,8,2,'CHACAPALPA',1),(13,8,2,'BULDIBUYO',1),(15,8,2,'AMBAR',1),(20,8,2,'BELLAVISTA DE LA UNION',1),(21,8,2,'ANTAUTA',1),(22,8,2,'AWAJUN',1),(2,9,2,'ACO',1),(5,9,2,'BELEN',1),(6,9,2,'CHIRINOS',1),(8,9,2,'ECHARATE',1),(10,9,2,'CODO DEL POZUZO',1),(12,9,2,'AHUAC',1),(13,9,2,'CHUGAY',1),(15,9,2,'ANDAJES',1),(21,9,2,'CONIMA',1),(22,9,2,'ALBERTO LEVEAU',1),(2,10,2,'ANRA',1),(5,10,2,'ALCAMENCA',1),(6,10,2,'CHANCAY',1),(8,10,2,'ACCHA',1),(10,10,2,'BA-OS',1),(13,10,2,'ANGASMARCA',1),(15,10,2,'ALIS',1),(21,10,2,'ANANEA',1),(22,10,2,'NUEVO PROGRESO',1),(2,11,2,'COCHAPETI',1),(5,11,2,'ACCOMARCA',1),(6,11,2,'BOLIVAR',1),(8,11,2,'CAICAY',1),(10,11,2,'CAHUAC',1),(13,11,2,'LUCMA',1),(21,11,2,'CABANA',1),(2,12,2,'HUALLANCA',1),(6,12,2,'SAN BERNARDINO',1),(8,12,2,'ANDAHUAYLILLAS',1),(13,12,2,'CHAO',1),(21,12,2,'CUYOCUYO',1),(2,13,2,'CASCA',1),(6,13,2,'ANDABAMBA',1),(8,13,2,'CHINCHERO',1),(21,13,2,'ANAPIA',1),(2,14,2,'ACAS',1),(2,15,2,'BOLOGNESI',1),(2,16,2,'HUAYLLAN',1),(2,17,2,'CATAC',1),(2,18,2,'CACERES DEL PERU',1),(2,19,2,'ACOBAMBA',1),(2,20,2,'CASCAPARA',1),(1,1,3,'BALSAS',1),(2,1,3,'COLCABAMBA',1),(3,1,3,'CIRCA',1),(4,1,3,'CAYMA',1),(5,1,3,'ACOS VINCHOS',1),(6,1,3,'CHETILLA',1),(7,1,3,'CARMEN DE LA LEGUA REYNO',1),(8,1,3,'POROY',1),(9,1,3,'ACORIA',1),(10,1,3,'CHINCHAO',1),(11,1,3,'LOS AQUIJES',1),(13,1,3,'FLORENCIA DE MORA',1),(14,1,3,'ETEN',1),(15,1,3,'ATE',1),(16,1,3,'FERNANDO LORES',1),(17,1,3,'LAS PIEDRAS',1),(18,1,3,'CUCHUMBAYA',1),(19,1,3,'HUARIACA',1),(21,1,3,'AMANTANI',1),(22,1,3,'HABANA',1),(23,1,3,'CALANA',1),(24,1,3,'LA CRUZ',1),(25,1,3,'IPARIA',1),(1,2,3,'COPALLIN',1),(2,2,3,'HUACLLAN',1),(3,2,3,'CHIARA',1),(4,2,3,'MARIANO NICOLAS VALCARCE',1),(5,2,3,'LOS MOROCHUCOS',1),(6,2,3,'CONDEBAMBA',1),(8,2,3,'ACOS',1),(9,2,3,'ANTA',1),(10,2,3,'COLPAS',1),(11,2,3,'CHAVIN',1),(12,2,3,'ANDAMARCA',1),(13,2,3,'CHOCOPE',1),(14,2,3,'INCAHUASI',1),(15,2,3,'PATIVILCA',1),(16,2,3,'BARRANCA',1),(17,2,3,'MADRE DE DIOS',1),(18,2,3,'COALAQUE',1),(19,2,3,'GOYLLARISQUIZGA',1),(20,2,3,'JILILI',1),(21,2,3,'ARAPA',1),(22,2,3,'BAJO BIAVO',1),(23,2,3,'CAMILACA',1),(25,2,3,'TAHUANIA',1),(1,3,3,'CHURUJA',1),(2,3,3,'CHACCHO',1),(3,3,3,'HUAQUIRCA',1),(4,3,3,'ATICO',1),(5,3,3,'SACSAMARCA',1),(6,3,3,'CORTEGANA',1),(8,3,3,'CACHIMAYO',1),(9,3,3,'CALLANMARCA',1),(11,3,3,'EL INGENIO',1),(12,3,3,'PICHANAQUI',1),(13,3,3,'CONDORMARCA',1),(14,3,3,'ILLIMO',1),(15,3,3,'GORGOR',1),(16,3,3,'TIGRE',1),(17,3,3,'TAHUAMANU',1),(18,3,3,'PACOCHA',1),(19,3,3,'HUANCABAMBA',1),(20,3,3,'EL CARMEN DE LA FRONTERA',1),(21,3,3,'AYAPATA',1),(22,3,3,'SAN MARTIN',1),(23,3,3,'ITE',1),(24,3,3,'MATAPALO',1),(25,3,3,'CURIMANA',1),(1,4,3,'RIO SANTIAGO',1),(3,4,3,'CARAYBAMBA',1),(4,4,3,'AYO',1),(5,4,3,'HUAMANGUILLA',1),(6,4,3,'CHADIN',1),(8,4,3,'LAMAY',1),(9,4,3,'AURAHUA',1),(10,4,3,'COCHABAMBA',1),(11,4,3,'RIO GRANDE',1),(12,4,3,'APATA',1),(13,4,3,'PUEBLO NUEVO',1),(15,4,3,'HUAMANTANGA',1),(16,4,3,'YAVARI',1),(20,4,3,'CHALACO',1),(21,4,3,'HUACULLANI',1),(22,4,3,'EL ESLABON',1),(23,4,3,'ESTIQUE',1),(1,5,3,'COCABAMBA',1),(2,5,3,'ANTONIO RAYMONDI',1),(3,5,3,'COYLLURQUI',1),(4,5,3,'CABANACONDE',1),(5,5,3,'AYNA',1),(6,5,3,'CUPISNIQUE',1),(8,5,3,'KUNTURKANKI',1),(9,5,3,'CHINCHIHUASI',1),(10,5,3,'CHAVIN DE PARIARCA',1),(11,5,3,'HUMAY',1),(12,5,3,'ONDORES',1),(13,5,3,'CARABAMBA',1),(15,5,3,'CALANGO',1),(16,5,3,'CAPELO',1),(20,5,3,'ARENAL',1),(21,5,3,'PILCUYO',1),(22,5,3,'BARRANQUITA',1),(1,6,3,'COCHAMAL',1),(2,6,3,'AMASHCA',1),(3,6,3,'COCHARCAS',1),(4,6,3,'CAYARANI',1),(5,6,3,'CABANA',1),(6,6,3,'CHOROS',1),(8,6,3,'COMBAPATA',1),(9,6,3,'CORDOVA',1),(10,6,3,'HERMILIO VALDIZAN',1),(12,6,3,'LLAYLLA',1),(15,6,3,'ATAVILLOS BAJO',1),(16,6,3,'PADRE MARQUEZ',1),(20,6,3,'IGNACIO ESCUDERO',1),(21,6,3,'HUATASANI',1),(22,6,3,'HUICUNGO',1),(1,7,3,'CUMBA',1),(2,7,3,'YAUYA',1),(3,7,3,'GAMARRA',1),(4,7,3,'DEAN VALDIVIA',1),(5,7,3,'CORONEL CASTA-EDA',1),(6,7,3,'HUALGAYOC',1),(8,7,3,'CHAMACA',1),(9,7,3,'ACRAQUIA',1),(10,7,3,'SAN BUENAVENTURA',1),(12,7,3,'HUARICOLCA',1),(13,7,3,'JEQUETEPEQUE',1),(15,7,3,'CALLAHUANCA',1),(20,7,3,'LA BREA',1),(21,7,3,'CALAPUJA',1),(22,7,3,'CASPISAPA',1),(2,8,3,'COMANDANTE NOEL',1),(4,8,3,'CHARCANA',1),(5,8,3,'CORCULLA',1),(6,8,3,'CHONTALI',1),(8,8,3,'COPORAQUE',1),(10,8,3,'MOLINO',1),(12,8,3,'HUAY-HUAY',1),(13,8,3,'CHILLIA',1),(15,8,3,'CALETA DE CARQUIN',1),(20,8,3,'BERNAL',1),(21,8,3,'CUPI',1),(22,8,3,'ELIAS SOPLIN VARGAS',1),(2,9,3,'BAMBAS',1),(5,9,3,'CHALCOS',1),(6,9,3,'HUARANGO',1),(8,9,3,'HUAYOPATA',1),(10,9,3,'HONORIA',1),(12,9,3,'CHONGOS BAJO',1),(13,9,3,'COCHORCO',1),(15,9,3,'CAUJUL',1),(21,9,3,'HUAYRAPATA',1),(22,9,3,'CACATACHI',1),(2,10,3,'CAJAY',1),(5,10,3,'APONGO',1),(6,10,3,'EDUARDO VILLANUEVA',1),(8,10,3,'CCAPI',1),(10,10,3,'JIVIA',1),(13,10,3,'CACHICADAN',1),(15,10,3,'AYAUCA',1),(21,10,3,'PEDRO VILCA APAZA',1),(22,10,3,'POLVORA',1),(2,11,3,'CULEBRAS',1),(5,11,3,'CARHUANCA',1),(6,11,3,'CALQUIS',1),(8,11,3,'CHALLABAMBA',1),(10,11,3,'CHACABAMBA',1),(13,11,3,'MARMOT',1),(21,11,3,'CABANILLAS',1),(2,12,3,'HUATA',1),(6,12,3,'SAN LUIS',1),(8,12,3,'CAMANTI',1),(13,12,3,'GUADALUPITO',1),(21,12,3,'LIMBANI',1),(2,13,3,'ELEAZAR GUZMAN BARRON',1),(6,13,3,'CATACHE',1),(8,13,3,'HUAYLLABAMBA',1),(21,13,3,'COPANI',1),(2,14,3,'CAJAMARQUILLA',1),(2,15,3,'CONCHUCOS',1),(2,16,3,'PAROBAMBA',1),(2,17,3,'COTAPARACO',1),(2,18,3,'COISHCO',1),(2,19,3,'ALFONSO UGARTE',1),(2,20,3,'MANCOS',1),(1,1,4,'CHETO',1),(2,1,4,'HUANCHAY',1),(3,1,4,'CURAHUASI',1),(4,1,4,'CERRO COLORADO',1),(5,1,4,'CARMEN ALTO',1),(6,1,4,'COSPAN',1),(7,1,4,'LA PERLA',1),(8,1,4,'SAN JERONIMO',1),(9,1,4,'CONAYCA',1),(10,1,4,'CHURUBAMBA',1),(11,1,4,'OCUCAJE',1),(12,1,4,'CARHUACALLANGA',1),(13,1,4,'HUANCHACO',1),(14,1,4,'ETEN PUERTO',1),(15,1,4,'BARRANCO',1),(16,1,4,'INDIANA',1),(17,1,4,'LABERINTO',1),(18,1,4,'SAMEGUA',1),(19,1,4,'HUAYLLAY',1),(20,1,4,'CASTILLA',1),(21,1,4,'ATUNCOLLA',1),(22,1,4,'JEPELACIO',1),(23,1,4,'CIUDAD NUEVA',1),(24,1,4,'PAMPAS DE HOSPITAL',1),(25,1,4,'MASISEA',1),(1,2,4,'EL PARCO',1),(2,2,4,'LA MERCED',1),(3,2,4,'HUANCARAMA',1),(4,2,4,'MARISCAL CACERES',1),(5,2,4,'MARIA PARADO DE BELLIDO',1),(6,2,4,'SITACOCHA',1),(8,2,4,'MOSOC LLACTA',1),(9,2,4,'CAJA',1),(10,2,4,'CONCHAMARCA',1),(11,2,4,'CHINCHA BAJA',1),(12,2,4,'CHAMBARA',1),(13,2,4,'MAGDALENA DE CAO',1),(14,2,4,'MANUEL ANTONIO MESONES M',1),(15,2,4,'SUPE',1),(16,2,4,'CAHUAPANAS',1),(17,2,4,'HUEPETUHE',1),(18,2,4,'ICHU-A',1),(19,2,4,'PAUCAR',1),(20,2,4,'LAGUNAS',1),(21,2,4,'ASILLO',1),(22,2,4,'HUALLAGA',1),(23,2,4,'CURIBAYA',1),(25,2,4,'YURUA',1),(1,3,4,'COROSHA',1),(2,3,4,'CHINGAS',1),(3,3,4,'JUAN ESPINOZA MEDRANO',1),(4,3,4,'ATIQUIPA',1),(5,3,4,'SANTIAGO DE LUCANAMARCA',1),(6,3,4,'HUASMIN',1),(8,3,4,'CHINCHAYPUJIO',1),(9,3,4,'CCOCHACCASA',1),(11,3,4,'MARCONA',1),(12,3,4,'SAN LUIS DE SHUARO',1),(13,3,4,'LONGOTEA',1),(14,3,4,'JAYANCA',1),(15,3,4,'HUANCAPON',1),(16,3,4,'TROMPETEROS',1),(19,3,4,'PALCAZU',1),(20,3,4,'HUARMACA',1),(21,3,4,'COASA',1),(22,3,4,'SANTA ROSA',1),(24,3,4,'PAPAYAL',1),(3,4,4,'CHAPIMARCA',1),(4,4,4,'CHACHAS',1),(5,4,4,'IGUAIN',1),(6,4,4,'CHIGUIRIP',1),(8,4,4,'LARES',1),(9,4,4,'CAPILLAS',1),(10,4,4,'PINRA',1),(11,4,4,'SANTA CRUZ',1),(12,4,4,'ATAURA',1),(15,4,4,'HUAROS',1),(16,4,4,'SAN PABLO',1),(20,4,4,'LA MATANZA',1),(21,4,4,'KELLUYO',1),(22,4,4,'PISCOYACU',1),(23,4,4,'ESTIQUE-PAMPA',1),(1,5,4,'COLCAMAR',1),(2,5,4,'AQUIA',1),(3,5,4,'HAQUIRA',1),(4,5,4,'CALLALLI',1),(5,5,4,'CHILCAS',1),(6,5,4,'GUZMANGO',1),(8,5,4,'LANGUI',1),(9,5,4,'EL CARMEN',1),(10,5,4,'JACAS GRANDE',1),(11,5,4,'INDEPENDENCIA',1),(12,5,4,'ULCUMAYO',1),(13,5,4,'HUASO',1),(15,5,4,'CERRO AZUL',1),(16,5,4,'EMILIO SAN MARTIN',1),(20,5,4,'COLAN',1),(21,5,4,'SANTA ROSA',1),(22,5,4,'CAYNARACHI',1),(1,6,4,'HUAMBO',1),(2,6,4,'ANTA',1),(3,6,4,'HUACCANA',1),(4,6,4,'CHICHAS',1),(5,6,4,'CARMEN SALCEDO',1),(6,6,4,'CUJILLO',1),(8,6,4,'MARANGANI',1),(9,6,4,'HUAYACUNDO ARMA',1),(10,6,4,'JOSE CRESPO Y CASTILLO',1),(12,6,4,'MAZAMARI',1),(13,6,4,'CHARAT',1),(15,6,4,'AUCALLAMA',1),(16,6,4,'PAMPA HERMOSA',1),(20,6,4,'LANCONES',1),(21,6,4,'INCHUPALLA',1),(22,6,4,'PACHIZA',1),(1,7,4,'EL MILAGRO',1),(3,7,4,'HUAYLLATI',1),(4,7,4,'ISLAY',1),(5,7,4,'PACAPAUSA',1),(8,7,4,'COLQUEMARCA',1),(9,7,4,'AHUAYCHA',1),(12,7,4,'HUASAHUASI',1),(13,7,4,'PACASMAYO',1),(15,7,4,'CARAMPOMA',1),(20,7,4,'LOBITOS',1),(21,7,4,'NICASIO',1),(22,7,4,'PILLUANA',1),(2,8,4,'YAUTAN',1),(4,8,4,'HUAYNACOTAS',1),(5,8,4,'LAMPA',1),(6,8,4,'COLASAY',1),(8,8,4,'OCORURO',1),(10,8,4,'UMARI',1),(12,8,4,'MARCAPOMACOCHA',1),(13,8,4,'HUANCASPATA',1),(15,8,4,'CHECRAS',1),(20,8,4,'CRISTO NOS VALGA',1),(21,8,4,'LLALLI',1),(22,8,4,'NUEVA CAJAMARCA',1),(2,9,4,'CUSCA',1),(5,9,4,'CHILCAYOC',1),(6,9,4,'LA COIPA',1),(8,9,4,'MARANURA',1),(10,9,4,'TOURNAVISTA',1),(12,9,4,'HUACHAC',1),(13,9,4,'CURGOS',1),(15,9,4,'COCHAMARCA',1),(21,9,4,'TILALI',1),(22,9,4,'CHAZUTA',1),(2,10,4,'CHAVIN DE HUANTAR',1),(5,10,4,'ASQUIPATA',1),(6,10,4,'GREGORIO PITA',1),(8,10,4,'COLCHA',1),(10,10,4,'QUEROPALCA',1),(13,10,4,'MOLLEBAMBA',1),(15,10,4,'AYAVIRI',1),(21,10,4,'QUILCAPUNCU',1),(22,10,4,'SHUNTE',1),(2,11,4,'HUAYAN',1),(5,11,4,'CONCEPCION',1),(6,11,4,'CATILLUC',1),(8,11,4,'COLQUEPATA',1),(10,11,4,'APARICIO POMARES',1),(13,11,4,'SAYAPULLO',1),(21,11,4,'CARACOTO',1),(2,12,4,'HUAYLAS',1),(6,12,4,'TUMBADEN',1),(8,12,4,'CCARHUAYO',1),(21,12,4,'PATAMBUCO',1),(2,13,4,'FIDEL OLIVAS ESCUDERO',1),(6,13,4,'CHANCAYBA-OS',1),(8,13,4,'MACHUPICCHU',1),(21,13,4,'CUTURAPI',1),(2,14,4,'CARHUAPAMPA',1),(2,15,4,'HUACASCHUQUE',1),(2,16,4,'QUINUABAMBA',1),(2,17,4,'HUAYLLAPAMPA',1),(2,18,4,'MACATE',1),(2,19,4,'CASHAPAMPA',1),(2,20,4,'MATACOTO',1),(1,1,5,'CHILIQUIN',1),(2,1,5,'INDEPENDENCIA',1),(3,1,5,'HUANIPACA',1),(4,1,5,'CHARACATO',1),(5,1,5,'CHIARA',1),(6,1,5,'ENCA-ADA',1),(7,1,5,'LA PUNTA',1),(8,1,5,'SAN SEBASTIAN',1),(9,1,5,'CUENCA',1),(10,1,5,'MARGOS',1),(11,1,5,'PACHACUTEC',1),(12,1,5,'CHACAPAMPA',1),(13,1,5,'LA ESPERANZA',1),(14,1,5,'JOSE LEONARDO ORTIZ',1),(15,1,5,'BRE-A',1),(16,1,5,'LAS AMAZONAS',1),(18,1,5,'SAN CRISTOBAL',1),(19,1,5,'NINACACA',1),(20,1,5,'CATACAOS',1),(21,1,5,'CAPACHICA',1),(22,1,5,'SORITOR',1),(23,1,5,'INCLAN',1),(24,1,5,'SAN JACINTO',1),(25,1,5,'YARINACOCHA',1),(1,2,5,'IMAZA',1),(2,2,5,'SUCCHA',1),(3,2,5,'HUANCARAY',1),(4,2,5,'NICOLAS DE PIEROLA',1),(5,2,5,'PARAS',1),(8,2,5,'POMACANCHI',1),(9,2,5,'MARCAS',1),(10,2,5,'HUACAR',1),(11,2,5,'EL CARMEN',1),(12,2,5,'COCHAS',1),(13,2,5,'PAIJAN',1),(14,2,5,'PITIPO',1),(15,2,5,'SUPE PUERTO',1),(16,2,5,'JEBEROS',1),(18,2,5,'LA CAPILLA',1),(19,2,5,'SAN PEDRO DE PILLAO',1),(20,2,5,'MONTERO',1),(21,2,5,'CAMINACA',1),(22,2,5,'SAN PABLO',1),(23,2,5,'HUANUARA',1),(1,3,5,'CUISPES',1),(2,3,5,'MIRGAS',1),(3,3,5,'OROPESA',1),(4,3,5,'BELLA UNION',1),(6,3,5,'JORGE CHAVEZ',1),(8,3,5,'HUAROCONDO',1),(9,3,5,'CHINCHO',1),(11,3,5,'VISTA ALEGRE',1),(12,3,5,'SAN RAMON',1),(13,3,5,'UCHUMARCA',1),(14,3,5,'MOCHUMI',1),(15,3,5,'MANAS',1),(16,3,5,'URARINAS',1),(19,3,5,'POZUZO',1),(20,3,5,'LALAQUIZ',1),(21,3,5,'CORANI',1),(22,3,5,'SHATOJA',1),(3,4,5,'COLCABAMBA',1),(4,4,5,'CHILCAYMARCA',1),(5,4,5,'LURICOCHA',1),(6,4,5,'CHIMBAN',1),(8,4,5,'PISAC',1),(9,4,5,'CHUPAMARCA',1),(11,4,5,'TIBILLO',1),(12,4,5,'CANCHAYLLO',1),(15,4,5,'LACHAQUI',1),(20,4,5,'MORROPON',1),(21,4,5,'PISACOMA',1),(22,4,5,'SACANCHE',1),(23,4,5,'SITAJARA',1),(1,5,5,'CONILA',1),(2,5,5,'CAJACAY',1),(3,5,5,'MARA',1),(4,5,5,'CAYLLOMA',1),(5,5,5,'CHUNGUI',1),(6,5,5,'SAN BENITO',1),(8,5,5,'LAYO',1),(9,5,5,'LA MERCED',1),(10,5,5,'JIRCAN',1),(11,5,5,'PARACAS',1),(15,5,5,'CHILCA',1),(16,5,5,'MAQUIA',1),(20,5,5,'LA HUACA',1),(21,5,5,'CONDURIRI',1),(22,5,5,'CU-UMBUQUI',1),(1,6,5,'LIMABAMBA',1),(2,6,5,'ATAQUERO',1),(3,6,5,'OCOBAMBA',1),(4,6,5,'IRAY',1),(5,6,5,'CHAVI-A',1),(6,6,5,'LA RAMADA',1),(8,6,5,'PITUMARCA',1),(9,6,5,'LARAMARCA',1),(10,6,5,'LUYANDO',1),(12,6,5,'PAMPA HERMOSA',1),(13,6,5,'HUARANCHAL',1),(15,6,5,'CHANCAY',1),(16,6,5,'SARAYACU',1),(20,6,5,'MARCAVELICA',1),(21,6,5,'PUSI',1),(22,6,5,'PAJARILLO',1),(1,7,5,'JAMALCA',1),(3,7,5,'MAMARA',1),(4,7,5,'MEJIA',1),(5,7,5,'PULLO',1),(8,7,5,'LIVITACA',1),(9,7,5,'COLCABAMBA',1),(12,7,5,'LA UNION',1),(13,7,5,'SAN JOSE',1),(15,7,5,'CHICLA',1),(20,7,5,'LOS ORGANOS',1),(21,7,5,'OCUVIRI',1),(22,7,5,'PUCACACA',1),(4,8,5,'PAMPAMARCA',1),(5,8,5,'MARCABAMBA',1),(6,8,5,'HUABAL',1),(8,8,5,'PALLPATA',1),(12,8,5,'MOROCOCHA',1),(13,8,5,'HUAYLILLAS',1),(15,8,5,'HUALMAY',1),(20,8,5,'VICE',1),(21,8,5,'MACARI',1),(22,8,5,'PARDO MIGUEL',1),(2,9,5,'LA PAMPA',1),(5,9,5,'HUACA-A',1),(6,9,5,'NAMBALLE',1),(8,9,5,'OCOBAMBA',1),(10,9,5,'YUYAPICHIS',1),(12,9,5,'HUAMANCACA CHICO',1),(13,9,5,'MARCABAL',1),(15,9,5,'NAVAN',1),(22,9,5,'CHIPURANA',1),(2,10,5,'HUACACHI',1),(5,10,5,'CANARIA',1),(6,10,5,'ICHOCAN',1),(8,10,5,'HUANOQUITE',1),(10,10,5,'RONDOS',1),(13,10,5,'MOLLEPATA',1),(15,10,5,'AZANGARO',1),(21,10,5,'SINA',1),(22,10,5,'UCHIZA',1),(2,11,5,'MALVAS',1),(5,11,5,'HUAMBALPA',1),(6,11,5,'EL PRADO',1),(8,11,5,'HUANCARANI',1),(10,11,5,'JACAS CHICO',1),(2,12,5,'MATO',1),(8,12,5,'CCATCA',1),(21,12,5,'PHARA',1),(2,13,5,'LLAMA',1),(6,13,5,'LA ESPERANZA',1),(8,13,5,'MARAS',1),(21,13,5,'OLLARAYA',1),(2,14,5,'COCHAS',1),(2,15,5,'HUANDOVAL',1),(2,17,5,'LLACLLIN',1),(2,18,5,'MORO',1),(2,19,5,'CHINGALPO',1),(2,20,5,'QUILLO',1),(1,1,6,'CHUQUIBAMBA',1),(2,1,6,'JANGAS',1),(3,1,6,'LAMBRAMA',1),(4,1,6,'CHIGUATA',1),(5,1,6,'OCROS',1),(6,1,6,'JESUS',1),(7,1,6,'VENTANILLA',1),(8,1,6,'SANTIAGO',1),(9,1,6,'HUACHOCOLPA',1),(10,1,6,'QUISQUI',1),(11,1,6,'PARCONA',1),(12,1,6,'CHICCHE',1),(13,1,6,'LAREDO',1),(14,1,6,'LA VICTORIA',1),(15,1,6,'CARABAYLLO',1),(16,1,6,'MAZAN',1),(18,1,6,'TORATA',1),(19,1,6,'PALLANCHACRA',1),(21,1,6,'CHUCUITO',1),(22,1,6,'YANTALO',1),(23,1,6,'PACHIA',1),(24,1,6,'SAN JUAN DE LA VIRGEN',1),(25,1,6,'NUEVA REQUENA',1),(3,2,6,'HUAYANA',1),(4,2,6,'OCO-A',1),(5,2,6,'TOTOS',1),(8,2,6,'RONDOCAN',1),(9,2,6,'PAUCARA',1),(10,2,6,'SAN FRANCISCO',1),(11,2,6,'GROCIO PRADO',1),(12,2,6,'COMAS',1),(13,2,6,'RAZURI',1),(14,2,6,'PUEBLO NUEVO',1),(16,2,6,'LAGUNAS',1),(18,2,6,'LLOQUE',1),(19,2,6,'SANTA ANA DE TUSI',1),(20,2,6,'PACAIPAMPA',1),(21,2,6,'CHUPA',1),(22,2,6,'SAN RAFAEL',1),(23,2,6,'QUILAHUANI',1),(1,3,6,'FLORIDA',1),(2,3,6,'SAN JUAN DE RONTOY',1),(3,3,6,'PACHACONAS',1),(4,3,6,'CAHUACHO',1),(6,3,6,'JOSE GALVEZ',1),(8,3,6,'LIMATAMBO',1),(9,3,6,'CONGALLA',1),(12,3,6,'VITOC',1),(13,3,6,'UCUNCHA',1),(14,3,6,'MORROPE',1),(19,3,6,'PUERTO BERMUDEZ',1),(20,3,6,'SAN MIGUEL DE EL FAIQUE',1),(21,3,6,'CRUCERO',1),(3,4,6,'COTARUSE',1),(4,4,6,'CHOCO',1),(5,4,6,'SANTILLANA',1),(6,4,6,'CHOROPAMPA',1),(8,4,6,'SAN SALVADOR',1),(9,4,6,'COCAS',1),(12,4,6,'CURICACA',1),(15,4,6,'SAN BUENAVENTURA',1),(20,4,6,'SALITRAL',1),(21,4,6,'POMATA',1),(22,4,6,'TINGO DE SAPOSOA',1),(23,4,6,'SUSAPAYA',1),(1,5,6,'INGUILPATA',1),(2,5,6,'CANIS',1),(3,5,6,'CHALLHUAHUACHO',1),(4,5,6,'COPORAQUE',1),(5,5,6,'LUIS CARRANZA',1),(6,5,6,'SANTA CRUZ DE TOLED',1),(8,5,6,'PAMPAMARCA',1),(9,5,6,'LOCROJA',1),(10,5,6,'MIRAFLORES',1),(11,5,6,'SAN ANDRES',1),(15,5,6,'COAYLLO',1),(16,5,6,'PUINAHUA',1),(20,5,6,'TAMARINDO',1),(22,5,6,'PINTO RECODO',1),(1,6,6,'LONGAR',1),(2,6,6,'MARCARA',1),(3,6,6,'ONGOY',1),(4,6,6,'RIO GRANDE',1),(5,6,6,'CHIPAO',1),(6,6,6,'PIMPINGOS',1),(8,6,6,'SAN PABLO',1),(9,6,6,'OCOYO',1),(10,6,6,'MARIANO DAMASO BERAUN',1),(12,6,6,'PANGOA',1),(13,6,6,'LA CUESTA',1),(15,6,6,'IHUARI',1),(16,6,6,'VARGAS GUERRA',1),(20,6,6,'MIGUEL CHECA',1),(21,6,6,'ROSASPATA',1),(1,7,6,'LONYA GRANDE',1),(3,7,6,'MICAELA BASTIDAS',1),(4,7,6,'PUNTA DE BOMBON',1),(5,7,6,'PUYUSCA',1),(8,7,6,'LLUSCO',1),(9,7,6,'DANIEL HERNANDEZ',1),(12,7,6,'PALCA',1),(15,7,6,'CUENCA',1),(20,7,6,'MANCORA',1),(21,7,6,'PALCA',1),(22,7,6,'SAN CRISTOBAL',1),(4,8,6,'PUYCA',1),(5,8,6,'OYOLO',1),(6,8,6,'LAS PIRIAS',1),(8,8,6,'PICHIGUA',1),(12,8,6,'PACCHA',1),(13,8,6,'HUAYO',1),(15,8,6,'HUAURA',1),(20,8,6,'RINCONADA LLICUAR',1),(21,8,6,'NU-OA',1),(22,8,6,'POSIC',1),(2,9,6,'YANAC',1),(5,9,6,'MORCOLLA',1),(6,9,6,'SAN JOSE DE LOURDES',1),(8,9,6,'QUELLOUNO',1),(12,9,6,'SAN JUAN DE YSCOS',1),(13,9,6,'SANAGORAN',1),(15,9,6,'PACHANGARA',1),(22,9,6,'EL PORVENIR',1),(2,10,6,'HUACCHIS',1),(5,10,6,'CAYARA',1),(6,10,6,'JOSE MANUEL QUIROZ',1),(8,10,6,'OMACHA',1),(10,10,6,'SAN FRANCISCO DE ASIS',1),(13,10,6,'QUIRUVILCA',1),(15,10,6,'CACRA',1),(5,11,6,'INDEPENDENCIA',1),(6,11,6,'LA FLORIDA',1),(8,11,6,'KOS-IPATA',1),(10,11,6,'OBAS',1),(2,12,6,'PAMPAROMAS',1),(8,12,6,'CUSIPATA',1),(21,12,6,'QUIACA',1),(2,13,6,'LLUMPA',1),(6,13,6,'NINABAMBA',1),(8,13,6,'OLLANTAYTAMBO',1),(21,13,6,'TINICACHI',1),(2,14,6,'CONGAS',1),(2,15,6,'LACABAMBA',1),(2,17,6,'MARCA',1),(2,18,6,'NEPE-A',1),(2,19,6,'HUAYLLABAMBA',1),(2,20,6,'RANRAHIRCA',1),(1,1,7,'GRANADA',1),(2,1,7,'LA LIBERTAD',1),(3,1,7,'PICHIRHUA',1),(4,1,7,'JACOBO HUNTER',1),(5,1,7,'PACAYCASA',1),(6,1,7,'LLACANORA',1),(8,1,7,'SAYLLA',1),(9,1,7,'HUAYLLAHUARA',1),(10,1,7,'SAN FRANCISCO DE CAYRAN',1),(11,1,7,'PUEBLO NUEVO',1),(12,1,7,'CHILCA',1),(13,1,7,'MOCHE',1),(14,1,7,'LAGUNAS',1),(15,1,7,'CHACLACAYO',1),(16,1,7,'NAPO',1),(19,1,7,'PAUCARTAMBO',1),(20,1,7,'CURA MORI',1),(21,1,7,'COATA',1),(23,1,7,'PALCA',1),(3,2,7,'KISHUARA',1),(4,2,7,'QUILCA',1),(8,2,7,'SANGARARA',1),(9,2,7,'POMACOCHA',1),(10,2,7,'SAN RAFAEL',1),(11,2,7,'PUEBLO NUEVO',1),(12,2,7,'HEROINAS TOLEDO',1),(13,2,7,'SANTIAGO DE CAO',1),(16,2,7,'MANSERICHE',1),(18,2,7,'MATALAQUE',1),(19,2,7,'TAPUC',1),(20,2,7,'PAIMAS',1),(21,2,7,'JOSE DOMINGO CHOQUEHUANC',1),(1,3,7,'JAZAN',1),(3,3,7,'SABAINO',1),(4,3,7,'CHALA',1),(6,3,7,'MIGUEL IGLESIAS',1),(8,3,7,'MOLLEPATA',1),(9,3,7,'HUANCA-HUANCA',1),(10,3,7,'CHUQUIS',1),(14,3,7,'MOTUPE',1),(19,3,7,'VILLA RICA',1),(20,3,7,'SONDOR',1),(21,3,7,'ITUATA',1),(3,4,7,'HUAYLLO',1),(4,4,7,'HUANCARQUI',1),(5,4,7,'SIVIA',1),(6,4,7,'COCHABAMBA',1),(8,4,7,'TARAY',1),(9,4,7,'HUACHOS',1),(12,4,7,'EL MANTARO',1),(15,4,7,'STA.ROSA DE QUIVES',1),(20,4,7,'SAN JUAN DE BIGOTE',1),(21,4,7,'ZEPITA',1),(23,4,7,'TARUCACHI',1),(1,5,7,'LONGUITA',1),(2,5,7,'COLQUIOC',1),(4,5,7,'HUAMBO',1),(5,5,7,'SANTA ROSA',1),(6,5,7,'TANTARICA',1),(8,5,7,'QUEHUE',1),(9,5,7,'PAUCARBAMBA',1),(10,5,7,'MONZON',1),(11,5,7,'SAN CLEMENTE',1),(15,5,7,'IMPERIAL',1),(16,5,7,'SAQUENA',1),(20,5,7,'VICHAYAL',1),(22,5,7,'RUMISAPA',1),(1,6,7,'MARISCAL BENAVIDES',1),(2,6,7,'PARIAHUANCA',1),(3,6,7,'URANMARCA',1),(4,6,7,'SALAMANCA',1),(5,6,7,'HUAC-HUAS',1),(6,6,7,'QUEROCOTILLO',1),(8,6,7,'SAN PEDRO',1),(9,6,7,'PILPICHACA',1),(12,6,7,'RIO NEGRO',1),(15,6,7,'LAMPIAN',1),(20,6,7,'QUERECOTILLO',1),(21,6,7,'TARACO',1),(1,7,7,'YAMON',1),(3,7,7,'PATAYPAMPA',1),(5,7,7,'SAN FRANCISCO DE RAVACAY',1),(8,7,7,'QUI-OTA',1),(9,7,7,'HUACHOCOLPA',1),(12,7,7,'PALCAMAYO',1),(15,7,7,'HUACHUPAMPA',1),(21,7,7,'PARATIA',1),(22,7,7,'SAN HILARION',1),(4,8,7,'QUECHUALLA',1),(5,8,7,'PARARCA',1),(6,8,7,'POMAHUACA',1),(8,8,7,'SUYCKUTAMBO',1),(12,8,7,'SANTA BARBARA DE CARHUAC',1),(13,8,7,'ONGON',1),(15,8,7,'LEONCIO PRADO',1),(21,8,7,'ORURILLO',1),(22,8,7,'SAN FERNANDO',1),(2,9,7,'YUPAN',1),(5,9,7,'PAICO',1),(6,9,7,'TABACONAS',1),(8,9,7,'KIMBIRI',1),(12,9,7,'SAN JUAN DE JARPA',1),(13,9,7,'SARIN',1),(22,9,7,'HUIMBAYOC',1),(2,10,7,'HUACHIS',1),(5,10,7,'COLCA',1),(6,10,7,'JOSE SABOGAL',1),(8,10,7,'PACCARITAMBO',1),(10,10,7,'SAN MIGUEL DE CAURI',1),(13,10,7,'SANTA CRUZ DE CHUCA',1),(15,10,7,'CARANIA',1),(5,11,7,'SAURAMA',1),(6,11,7,'LLAPA',1),(10,11,7,'PAMPAMARCA',1),(2,12,7,'PUEBLO LIBRE',1),(8,12,7,'HUARO',1),(21,12,7,'SAN JUAN DEL ORO',1),(2,13,7,'LUCMA',1),(6,13,7,'PULAN',1),(8,13,7,'YUCAY',1),(21,13,7,'UNICACHI',1),(2,14,7,'LLIPA',1),(2,15,7,'LLAPO',1),(2,17,7,'PAMPAS CHICO',1),(2,18,7,'SAMANCO',1),(2,19,7,'QUICHES',1),(2,20,7,'SHUPLUY',1),(1,1,8,'HUANCAS',1),(2,1,8,'OLLEROS',1),(3,1,8,'SAN PEDRO DE CACHORA',1),(4,1,8,'LA JOYA',1),(5,1,8,'QUINUA',1),(6,1,8,'LOS BA-OS DEL INCA',1),(8,1,8,'WANCHAQ',1),(9,1,8,'IZCUCHACA',1),(10,1,8,'SAN PEDRO DE CHAULAN',1),(11,1,8,'SALAS',1),(12,1,8,'CHONGOS ALTO',1),(13,1,8,'POROTO',1),(14,1,8,'MONSEFU',1),(15,1,8,'CHORRILLOS',1),(16,1,8,'PUNCHANA',1),(19,1,8,'SAN FRANCISCO DE ASIS DE',1),(20,1,8,'EL TALLAN',1),(21,1,8,'HUATA',1),(23,1,8,'POCOLLAY',1),(3,2,8,'PACOBAMBA',1),(4,2,8,'SAMUEL PASTOR',1),(9,2,8,'ROSARIO',1),(10,2,8,'TOMAY KICHWA',1),(11,2,8,'SAN JUAN DE YANAC',1),(12,2,8,'MANZANARES',1),(13,2,8,'CASA GRANDE',1),(16,2,8,'MORONA',1),(18,2,8,'PUQUINA',1),(19,2,8,'VILCABAMBA',1),(20,2,8,'SAPILLICA',1),(21,2,8,'MU-ANI',1),(1,3,8,'RECTA',1),(4,3,8,'CHAPARRA',1),(6,3,8,'OXAMARCA',1),(8,3,8,'PUCYURA',1),(9,3,8,'HUAYLLAY GRANDE',1),(14,3,8,'OLMOS',1),(20,3,8,'SONDORILLO',1),(21,3,8,'OLLACHEA',1),(3,4,8,'JUSTO APU SAHUARAURA',1),(4,4,8,'MACHAGUAY',1),(5,4,8,'LLOCHEGUA',1),(6,4,8,'CONCHAN',1),(8,4,8,'YANATILE',1),(9,4,8,'HUAMATAMBO',1),(12,4,8,'HUAMALI',1),(20,4,8,'SANTA CATALINA DE MOSSA',1),(23,4,8,'TICACO',1),(1,5,8,'LONYA CHICO',1),(2,5,8,'HUALLANCA',1),(4,5,8,'HUANCA',1),(5,5,8,'TAMBO',1),(6,5,8,'YONAN',1),(8,5,8,'TUPAC AMARU',1),(9,5,8,'SAN MIGUEL DE MAYOCC',1),(10,5,8,'PUNCHAO',1),(11,5,8,'TUPAC AMARU INCA',1),(15,5,8,'LUNAHUANA',1),(16,5,8,'SOPLIN',1),(22,5,8,'SAN ROQUE DE CUMBAZA',1),(1,6,8,'MILPUC',1),(2,6,8,'SAN MIGUEL DE ACO',1),(3,6,8,'RANRACANCHA',1),(4,6,8,'YANAQUIHUA',1),(5,6,8,'LARAMATE',1),(6,6,8,'SAN ANDRES DE CUTERVO',1),(8,6,8,'TINTA',1),(9,6,8,'QUERCO',1),(12,6,8,'RIO TAMBO',1),(13,6,8,'MACHE',1),(15,6,8,'PACARAOS',1),(20,6,8,'SALITRAL',1),(21,6,8,'VILQUE CHICO',1),(3,7,8,'PROGRESO',1),(5,7,8,'UPAHUACHO',1),(8,7,8,'VELILLE',1),(12,7,8,'SAN PEDRO DE CAJAS',1),(15,7,8,'HUANZA',1),(21,7,8,'PUCARA',1),(22,7,8,'SHAMBOYACU',1),(4,8,8,'SAYLA',1),(5,8,8,'SAN JAVIER DE ALPABAMBA',1),(6,8,8,'PUCARA',1),(8,8,8,'ALTO PICHIGUA',1),(12,8,8,'SANTA ROSA DE SACCO',1),(13,8,8,'PARCOY',1),(15,8,8,'PACCHO',1),(21,8,8,'SANTA ROSA',1),(22,8,8,'YORONGOS',1),(5,9,8,'SAN PEDRO DE LARCAY',1),(8,9,8,'SANTA TERESA',1),(12,9,8,'TRES DE DICIEMBRE',1),(13,9,8,'SARTIMBAMBA',1),(22,9,8,'JUAN GUERRA',1),(2,10,8,'HUANTAR',1),(5,10,8,'HUAMANQUIQUIA',1),(8,10,8,'PILLPINTO',1),(13,10,8,'SITABAMBA',1),(15,10,8,'CATAHUASI',1),(5,11,8,'VISCHONGO',1),(6,11,8,'NANCHOC',1),(10,11,8,'CHORAS',1),(2,12,8,'SANTA CRUZ',1),(8,12,8,'LUCRE',1),(21,12,8,'YANAHUAYA',1),(2,13,8,'MUSGA',1),(6,13,8,'SAUCEPAMPA',1),(2,14,8,'SAN CRISTOBAL DE RAJAN',1),(2,15,8,'PALLASCA',1),(2,17,8,'PARARIN',1),(2,18,8,'SANTA',1),(2,19,8,'RAGASH',1),(2,20,8,'YANAMA',1),(1,1,9,'LA JALCA',1),(2,1,9,'PAMPAS',1),(3,1,9,'TAMBURCO',1),(4,1,9,'MARIANO MELGAR',1),(5,1,9,'SAN JOSE DE TICLLAS',1),(6,1,9,'MAGDALENA',1),(9,1,9,'LARIA',1),(10,1,9,'SANTA MARIA DEL VALLE',1),(11,1,9,'SAN JOSE DE LOS MOLINOS',1),(13,1,9,'SALAVERRY',1),(14,1,9,'NUEVA ARICA',1),(15,1,9,'CIENEGUILLA',1),(16,1,9,'PUTUMAYO',1),(19,1,9,'SIMON BOLIVAR',1),(20,1,9,'LA ARENA',1),(21,1,9,'MA-AZO',1),(23,1,9,'SAMA',1),(3,2,9,'PACUCHA',1),(11,2,9,'SAN PEDRO DE HUACARPANA',1),(12,2,9,'MARISCAL CASTILLA',1),(16,2,9,'PASTAZA',1),(18,2,9,'QUINISTAQUILLAS',1),(20,2,9,'SICCHEZ',1),(21,2,9,'POTONI',1),(1,3,9,'SAN CARLOS',1),(4,3,9,'HUANUHUANU',1),(6,3,9,'SOROCHUCO',1),(8,3,9,'ZURITE',1),(9,3,9,'JULCAMARCA',1),(14,3,9,'PACORA',1),(21,3,9,'SAN GABAN',1),(3,4,9,'LUCRE',1),(4,4,9,'ORCOPAMPA',1),(6,4,9,'HUAMBOS',1),(9,4,9,'MOLLEPAMPA',1),(12,4,9,'HUARIPAMPA',1),(20,4,9,'SANTO DOMINGO',1),(1,5,9,'LUYA',1),(2,5,9,'HUASTA',1),(4,5,9,'ICHUPAMPA',1),(9,5,9,'SAN PEDRO DE CORIS',1),(10,5,9,'PU-OS',1),(15,5,9,'MALA',1),(16,5,9,'TAPICHE',1),(22,5,9,'SHANAO',1),(1,6,9,'OMIA',1),(2,6,9,'SHILLA',1),(5,6,9,'LEONCIO PRADO',1),(6,6,9,'SAN JUAN DE CUTERVO',1),(9,6,9,'QUITO-ARMA',1),(15,6,9,'SAN MIGUEL DE ACOS',1),(3,7,9,'SAN ANTONIO',1),(9,7,9,'HUARIBAMBA',1),(12,7,9,'TAPO',1),(15,7,9,'HUAROCHIRI',1),(21,7,9,'SANTA LUCIA',1),(22,7,9,'TINGO DE PONASA',1),(4,8,9,'TAURIA',1),(5,8,9,'SAN JOSE DE USHUA',1),(6,8,9,'SALLIQUE',1),(12,8,9,'SUITUCANCHA',1),(13,8,9,'PATAZ',1),(15,8,9,'SANTA LEONOR',1),(21,8,9,'UMACHIRI',1),(22,8,9,'YURACYACU',1),(5,9,9,'SAN SALVADOR DE QUIJE',1),(8,9,9,'VILCABAMBA',1),(12,9,9,'YANACANCHA',1),(22,9,9,'LA BANDA DE SHILCAYO',1),(2,10,9,'MASIN',1),(5,10,9,'HUANCARAYLLA',1),(8,10,9,'YAURISQUE',1),(15,10,9,'CHOCOS',1),(6,11,9,'NIEPOS',1),(2,12,9,'SANTO TORIBIO',1),(8,12,9,'MARCAPATA',1),(21,12,9,'ALTO INAMBARI',1),(6,13,9,'SEXI',1),(2,14,9,'SAN PEDRO',1),(2,15,9,'PAMPAS',1),(2,17,9,'TAPACOCHA',1),(2,18,9,'NUEVO CHIMBOTE',1),(2,19,9,'SAN JUAN',1),(1,1,10,'LEIMEBAMBA',1),(2,1,10,'PARIACOTO',1),(4,1,10,'MIRAFLORES',1),(5,1,10,'SAN JUAN BAUTISTA',1),(6,1,10,'MATARA',1),(9,1,10,'MANTA',1),(10,1,10,'YARUMAYO',1),(11,1,10,'SAN JUAN BAUTISTA',1),(13,1,10,'SIMBAL',1),(14,1,10,'OYOTUN',1),(15,1,10,'COMAS',1),(16,1,10,'TORRES CAUSANA',1),(19,1,10,'TICLACAYAN',1),(20,1,10,'LA UNION',1),(21,1,10,'PAUCARCOLLA',1),(23,1,10,'CORONEL GREGORIO ALBARRA',1),(3,2,10,'PAMPACHIRI',1),(11,2,10,'SUNAMPE',1),(12,2,10,'MATAHUASI',1),(16,2,10,'SANTA CRUZ',1),(18,2,10,'UBINAS',1),(20,2,10,'SUYO',1),(21,2,10,'SAMAN',1),(1,3,10,'SHIPASBAMBA',1),(4,3,10,'JAQUI',1),(6,3,10,'SUCRE',1),(9,3,10,'SAN ANTONIO DE ANTAPARCO',1),(14,3,10,'SALAS',1),(21,3,10,'USICAYOS',1),(3,4,10,'POCOHUANCA',1),(4,4,10,'PAMPACOLCA',1),(6,4,10,'LAJAS',1),(9,4,10,'SAN JUAN',1),(12,4,10,'HUERTAS',1),(20,4,10,'YAMANGO',1),(1,5,10,'LUYA VIEJO',1),(2,5,10,'HUAYLLACAYAN',1),(4,5,10,'LARI',1),(9,5,10,'PACHAMARCA',1),(10,5,10,'SINGA',1),(15,5,10,'NUEVO IMPERIAL',1),(16,5,10,'JENARO HERRERA',1),(22,5,10,'TABALOSOS',1),(1,6,10,'SANTA ROSA',1),(2,6,10,'TINCO',1),(5,6,10,'LLAUTA',1),(6,6,10,'SAN LUIS DE LUCMA',1),(9,6,10,'SAN ANTONIO DE CUSICANCH',1),(13,6,10,'PARANDAY',1),(15,6,10,'STA.CRUZ DE ANDAMARCA',1),(3,7,10,'SANTA ROSA',1),(9,7,10,'-AHUIMPUQUIO',1),(15,7,10,'LAHUAYTAMBO',1),(21,7,10,'VILAVILA',1),(22,7,10,'TRES UNIDOS',1),(4,8,10,'TOMEPAMPA',1),(5,8,10,'SARA SARA',1),(6,8,10,'SAN FELIPE',1),(12,8,10,'YAULI',1),(13,8,10,'PIAS',1),(15,8,10,'SANTA MARIA',1),(5,9,10,'SANTIAGO DE PAUCARAY',1),(8,9,10,'PICHARI',1),(22,9,10,'MORALES',1),(2,10,10,'PAUCAS',1),(5,10,10,'HUAYA',1),(15,10,10,'COCHAS',1),(6,11,10,'SAN GREGORIO',1),(2,12,10,'YURACMARCA',1),(8,12,10,'OCONGATE',1),(6,13,10,'UTICYACU',1),(2,14,10,'SANTIAGO DE CHILCAS',1),(2,15,10,'SANTA ROSA',1),(2,17,10,'TICAPAMPA',1),(2,19,10,'SICSIBAMBA',1),(1,1,11,'LEVANTO',1),(2,1,11,'PIRA',1),(4,1,11,'MOLLEBAYA',1),(5,1,11,'SANTIAGO DE PISCHA',1),(6,1,11,'NAMORA',1),(9,1,11,'MARISCAL CACERES',1),(10,1,11,'PILLCO MARCA',1),(11,1,11,'SANTIAGO',1),(12,1,11,'CHUPURO',1),(13,1,11,'VICTOR LARCO HERRERA',1),(14,1,11,'PICSI',1),(15,1,11,'EL AGUSTINO',1),(19,1,11,'TINYAHUARCO',1),(20,1,11,'LAS LOMAS',1),(21,1,11,'PICHACANI',1),(3,2,11,'POMACOCHA',1),(11,2,11,'TAMBO DE MORA',1),(12,2,11,'MITO',1),(16,2,11,'TENIENTE CESAR LOPEZ ROJ',1),(18,2,11,'YUNGA',1),(21,2,11,'SAN ANTON',1),(1,3,11,'VALERA',1),(4,3,11,'LOMAS',1),(6,3,11,'UTCO',1),(9,3,11,'SANTO TOMAS DE PATA',1),(10,3,11,'MARIAS',1),(14,3,11,'SAN JOSE',1),(3,4,11,'SAN JUAN DE CHAC-A',1),(4,4,11,'TIPAN',1),(6,4,11,'LLAMA',1),(9,4,11,'SANTA ANA',1),(12,4,11,'JANJAILLO',1),(1,5,11,'MARIA',1),(2,5,11,'LA PRIMAVERA',1),(4,5,11,'LLUTA',1),(10,5,11,'TANTAMAYO',1),(15,5,11,'PACARAN',1),(16,5,11,'YAQUERANA',1),(22,5,11,'ZAPATERO',1),(1,6,11,'TOTORA',1),(2,6,11,'YUNGAR',1),(5,6,11,'LUCANAS',1),(6,6,11,'SANTA CRUZ',1),(9,6,11,'SAN FRANCISCO DE SANGAYA',1),(13,6,11,'SALPO',1),(15,6,11,'SUMBILCA',1),(3,7,11,'TURPAY',1),(9,7,11,'PAZOS',1),(15,7,11,'LANGA',1),(4,8,11,'TORO',1),(6,8,11,'SAN JOSE DEL ALTO',1),(13,8,11,'SANTIAGO DE CHALLAS',1),(15,8,11,'SAYAN',1),(5,9,11,'SORAS',1),(22,9,11,'PAPAPLAYA',1),(2,10,11,'PONTO',1),(5,10,11,'SARHUA',1),(15,10,11,'COLONIA',1),(6,11,11,'SAN SILVESTRE DE COCHAN',1),(8,12,11,'OROPESA',1),(6,13,11,'YAUYUCAN',1),(2,15,11,'TAUCA',1),(1,1,12,'MAGDALENA',1),(2,1,12,'TARICA',1),(4,1,12,'PAUCARPATA',1),(5,1,12,'SOCOS',1),(6,1,12,'SAN JUAN',1),(9,1,12,'MOYA',1),(11,1,12,'SUBTANJALLA',1),(12,1,12,'COLCA',1),(14,1,12,'PIMENTEL',1),(15,1,12,'INDEPENDENCIA',1),(16,1,12,'BELEN',1),(19,1,12,'VICCO',1),(21,1,12,'PLATERIA',1),(3,2,12,'SAN ANTONIO DE CACHI',1),(12,2,12,'NUEVE DE JULIO',1),(21,2,12,'SAN JOSE',1),(1,3,12,'YAMBRASBAMBA',1),(4,3,12,'QUICACHA',1),(6,3,12,'LA LIBERTAD DE PALLAN',1),(9,3,12,'SECCLLA',1),(14,3,12,'TUCUME',1),(3,4,12,'SA-AYCA',1),(4,4,12,'U-ON',1),(6,4,12,'MIRACOSTA',1),(9,4,12,'TANTARA',1),(12,4,12,'JULCAN',1),(1,5,12,'OCALLI',1),(2,5,12,'MANGAS',1),(4,5,12,'MACA',1),(15,5,12,'QUILMANA',1),(1,6,12,'VISTA ALEGRE',1),(5,6,12,'OCA-A',1),(6,6,12,'SANTO DOMINGO DE LA CAPI',1),(9,6,12,'SAN ISIDRO',1),(15,6,12,'VEINTISIETE DE NOVIEMBRE',1),(3,7,12,'VILCABAMBA',1),(15,7,12,'LARAOS',1),(6,8,12,'SANTA ROSA',1),(13,8,12,'TAURIJA',1),(15,8,12,'VEGUETA',1),(22,9,12,'SAN ANTONIO',1),(2,10,12,'RAHUAPAMPA',1),(5,10,12,'VILCANCHOS',1),(15,10,12,'HONGOS',1),(6,11,12,'TONGOD',1),(8,12,12,'QUIQUIJANA',1),(1,1,13,'MARISCAL CASTILLA',1),(4,1,13,'POCSI',1),(5,1,13,'TAMBILLO',1),(9,1,13,'NUEVO OCCORO',1),(11,1,13,'TATE',1),(12,1,13,'CULLHUAS',1),(14,1,13,'REQUE',1),(15,1,13,'JESUS MARIA',1),(16,1,13,'SAN JUAN BAUTISTA',1),(19,1,13,'YANACANCHA',1),(21,1,13,'SAN ANTONIO',1),(3,2,13,'SAN JERONIMO',1),(12,2,13,'ORCOTUNA',1),(21,2,13,'SAN JUAN DE SALINAS',1),(4,3,13,'YAUCA',1),(10,3,13,'PACHAS',1),(3,4,13,'SORAYA',1),(4,4,13,'URACA',1),(6,4,13,'PACCHA',1),(9,4,13,'TICRAPO',1),(12,4,13,'LEONOR ORDO-EZ',1),(1,5,13,'OCUMAL',1),(2,5,13,'PACLLON',1),(4,5,13,'MADRIGAL',1),(15,5,13,'SAN ANTONIO',1),(5,6,13,'OTOCA',1),(6,6,13,'SANTO TOMAS',1),(9,6,13,'SANTIAGO DE CHOCORVOS',1),(13,6,13,'SINSICAP',1),(3,7,13,'VIRUNDO',1),(9,7,13,'QUISHUAR',1),(15,7,13,'MARIATANA',1),(13,8,13,'URPAY',1),(22,9,13,'SAUCE',1),(2,10,13,'RAPAYAN',1),(15,10,13,'HUAMPARA',1),(6,11,13,'UNION AGUA BLANCA',1),(1,1,14,'MOLINOPAMPA',1),(4,1,14,'POLOBAYA',1),(5,1,14,'VINCHOS',1),(9,1,14,'PALCA',1),(11,1,14,'YAUCA DEL ROSARIO',1),(12,1,14,'EL TAMBO',1),(14,1,14,'SANTA ROSA',1),(15,1,14,'LA MOLINA',1),(20,1,14,'TAMBO GRANDE',1),(21,1,14,'TIQUILLACA',1),(3,2,14,'SAN MIGUEL DE CHACCRAMPA',1),(12,2,14,'SAN JOSE DE QUERO',1),(21,2,14,'SANTIAGO DE PUPUJA',1),(3,4,14,'TAPAIRIHUA',1),(4,4,14,'VIRACO',1),(6,4,14,'PION',1),(12,4,14,'LLOCLLAPAMPA',1),(1,5,14,'PISUQUIA',1),(2,5,14,'SAN MIGUEL DE CORPANQUI',1),(4,5,14,'SAN ANTONIO DE CHUCA',1),(15,5,14,'SAN LUIS',1),(5,6,14,'SAISA',1),(6,6,14,'SOCOTA',1),(9,6,14,'SANTIAGO DE QUIRAHUARA',1),(13,6,14,'USQUIL',1),(3,7,14,'CURASCO',1),(9,7,14,'SALCABAMBA',1),(15,7,14,'RICARDO PALMA',1),(22,9,14,'SHAPAJA',1),(2,10,14,'SAN MARCOS',1),(15,10,14,'HUANCAYA',1),(1,1,15,'MONTEVIDEO',1),(4,1,15,'QUEQUE-A',1),(5,1,15,'JESUS NAZARENO',1),(9,1,15,'PILCHACA',1),(14,1,15,'SA-A',1),(15,1,15,'LA VICTORIA',1),(21,1,15,'VILQUE',1),(3,2,15,'SANTA MARIA DE CHICMO',1),(12,2,15,'SANTA ROSA DE OCOPA',1),(21,2,15,'TIRAPATA',1),(3,4,15,'TINTAY',1),(6,4,15,'QUEROCOTO',1),(12,4,15,'MARCO',1),(1,5,15,'PROVIDENCIA',1),(2,5,15,'TICLLOS',1),(4,5,15,'SIBAYO',1),(15,5,15,'STA.CRUZ DE FLORES',1),(5,6,15,'SAN CRISTOBAL',1),(6,6,15,'TORIBIO CASANOVA',1),(9,6,15,'SANTO DOMINGO DE CAPILLA',1),(9,7,15,'SALCAHUASI',1),(15,7,15,'SAN ANDRES DE TUPICOCHA',1),(2,10,15,'SAN PEDRO DE CHANA',1),(15,10,15,'HUANGASCAR',1),(1,1,16,'OLLEROS',1),(4,1,16,'SABANDIA',1),(9,1,16,'VILCA',1),(12,1,16,'HUACRAPUQUIO',1),(14,1,16,'CAYALTI',1),(15,1,16,'LINCE',1),(3,2,16,'TALAVERA',1),(10,3,16,'QUIVILLA',1),(3,4,16,'TORAYA',1),(6,4,16,'SAN JUAN DE LICUPIS',1),(12,4,16,'MASMA',1),(1,5,16,'SAN CRISTOBAL',1),(4,5,16,'TAPAY',1),(15,5,16,'ZU-IGA',1),(5,6,16,'SAN JUAN',1),(9,6,16,'TAMBO',1),(9,7,16,'SAN MARCOS DE ROCCHAC',1),(15,7,16,'SAN ANTONIO',1),(2,10,16,'UCO',1),(15,10,16,'HUANTAN',1),(1,1,17,'QUINJALCA',1),(4,1,17,'SACHACA',1),(9,1,17,'YAULI',1),(12,1,17,'HUALHUAS',1),(14,1,17,'PATAPO',1),(15,1,17,'LOS OLIVOS',1),(3,2,17,'TUMAY HUARACA',1),(10,3,17,'RIPAN',1),(3,4,17,'YANACA',1),(6,4,17,'TACABAMBA',1),(12,4,17,'MASMA CHICCHE',1),(1,5,17,'SAN FRANCISCO DEL YESO',1),(4,5,17,'TISCO',1),(5,6,17,'SAN PEDRO',1),(9,7,17,'SURCUBAMBA',1),(15,7,17,'SAN BARTOLOME',1),(15,10,17,'HUA-EC',1),(1,1,18,'SAN FCO. DE DAGUAS',1),(4,1,18,'SAN JUAN DE SIGUAS',1),(9,1,18,'ASCENSION',1),(14,1,18,'POMALCA',1),(15,1,18,'LURIGANCHO',1),(3,2,18,'TURPO',1),(6,4,18,'TOCMOCHE',1),(12,4,18,'MOLINOS',1),(1,5,18,'SAN JERONIMO',1),(4,5,18,'TUTI',1),(5,6,18,'SAN PEDRO DE PALCO',1),(9,7,18,'TINTAY PUNCU',1),(15,7,18,'SAN DAMIAN',1),(15,10,18,'LARAOS',1),(1,1,19,'SAN ISIDRO DE MAINO',1),(4,1,19,'SAN JUAN DE TARUCANI',1),(9,1,19,'HUANDO',1),(12,1,19,'HUANCAN',1),(14,1,19,'PUCALA',1),(15,1,19,'LURIN',1),(3,2,19,'KAQUIABAMBA',1),(6,4,19,'CHALAMARCA',1),(12,4,19,'MONOBAMBA',1),(1,5,19,'SN J.DE LOPECANCHA',1),(4,5,19,'YANQUE',1),(5,6,19,'SANCOS',1),(15,7,19,'SAN JUAN DE IRIS',1),(15,10,19,'LINCHA',1),(1,1,20,'SOLOCO',1),(4,1,20,'SANTA ISABEL DE SIGUAS',1),(12,1,20,'HUASICANCHA',1),(14,1,20,'TUMAN',1),(15,1,20,'MAGDALENA DEL MAR',1),(12,4,20,'MUQUI',1),(1,5,20,'SANTA CATALINA',1),(4,5,20,'MAJES',1),(5,6,20,'SANTA ANA DE HUAYCAHUACH',1),(15,7,20,'SAN JUAN DE TANTARANCHE',1),(15,10,20,'MADEAN',1),(1,1,21,'SONCHE',1),(4,1,21,'SANTA RITA DE SIGUAS',1),(12,1,21,'HUAYUCACHI',1),(15,1,21,'MAGDALENA VIEJA',1),(10,3,21,'CHUQUIS',1),(12,4,21,'MUQUIYAUYO',1),(1,5,21,'SANTO TOMAS',1),(5,6,21,'SANTA LUCIA',1),(15,7,21,'SAN LORENZO DE QUINTI',1),(15,10,21,'MIRAFLORES',1),(4,1,22,'SOCABAYA',1),(12,1,22,'INGENIO',1),(15,1,22,'MIRAFLORES',1),(10,3,22,'SILLAPATA',1),(12,4,22,'PACA',1),(1,5,22,'TINGO',1),(15,7,22,'SAN MATEO',1),(15,10,22,'OMAS',1),(4,1,23,'TIABAYA',1),(15,1,23,'PACHACAMAC',1),(10,3,23,'YANAS',1),(12,4,23,'PACCHA',1),(1,5,23,'TRITA',1),(15,7,23,'SAN MATEO DE OTAO',1),(15,10,23,'PUTINZA',1),(4,1,24,'UCHUMAYO',1),(12,1,24,'PARIAHUANCA',1),(15,1,24,'PUCUSANA',1),(12,4,24,'PANCAN',1),(15,7,24,'SAN PEDRO DE CASTA',1),(15,10,24,'QUINCHES',1),(4,1,25,'VITOR',1),(12,1,25,'PILCOMAYO',1),(15,1,25,'PUENTE PIEDRA',1),(12,4,25,'PARCO',1),(15,7,25,'SAN PEDRO DE HUANCAYRE',1),(15,10,25,'QUINOCAY',1),(4,1,26,'YANAHUARA',1),(12,1,26,'PUCARA',1),(15,1,26,'PUNTA HERMOSA',1),(12,4,26,'POMACANCHA',1),(15,7,26,'SANGALLAYA',1),(15,10,26,'SAN JOAQUIN',1),(4,1,27,'YARABAMBA',1),(12,1,27,'QUICHUAY',1),(15,1,27,'PUNTA NEGRA',1),(12,4,27,'RICRAN',1),(15,7,27,'STA.CRUZ DE COCACHACRA',1),(15,10,27,'SAN PEDRO DE PILAS',1),(4,1,28,'YURA',1),(12,1,28,'QUILCAS',1),(15,1,28,'RIMAC',1),(12,4,28,'SAN LORENZO',1),(15,7,28,'SANTA EULALIA',1),(15,10,28,'TANTA',1),(4,1,29,'JOSE LUIS BUSTAMANTE Y R',1),(12,1,29,'SAN AGUSTIN',1),(15,1,29,'SAN BARTOLO',1),(12,4,29,'SAN PEDRO DE CHUNAN',1),(15,7,29,'SANTIAGO DE ANCHUCAYA',1),(15,10,29,'TAURIPAMPA',1),(12,1,30,'SAN JERONIMO DE TUNAN',1),(15,1,30,'SAN BORJA',1),(12,4,30,'SAUSA',1),(15,7,30,'SANTIAGO DE TUNA',1),(15,10,30,'TOMAS',1),(15,1,31,'SAN ISIDRO',1),(12,4,31,'SINCOS',1),(15,7,31,'STO.DGO.DE LOS OLLEROS',1),(15,10,31,'TUPE',1),(12,1,32,'SA-O',1),(15,1,32,'SAN JUAN DE LURIGANCHO',1),(12,4,32,'TUNAN MARCA',1),(15,7,32,'SURCO',1),(15,10,32,'VI-AC',1),(12,1,33,'SAPALLANGA',1),(15,1,33,'SAN JUAN DE MIRAFLORES',1),(12,4,33,'YAULI',1),(15,10,33,'VITIS',1),(12,1,34,'SICAYA',1),(15,1,34,'SAN LUIS',1),(12,4,34,'YAUYOS',1),(12,1,35,'SANTO DOMINGO DE ACOBAMB',1),(15,1,35,'SAN MARTIN DE PORRES',1),(12,1,36,'VIQUES',1),(15,1,36,'SAN MIGUEL',1),(15,1,37,'SANTA ANITA',1),(15,1,38,'SANTA MARIA DEL MAR',1),(15,1,39,'SANTA ROSA',1),(15,1,40,'SANTIAGO DE SURCO',1),(15,1,41,'SURQUILLO',1),(15,1,42,'VILLA EL SALVADOR',1),(15,1,43,'VILLA MARIA DEL TRIUNFO',1);

/*Table structure for table `tb_estadocheck` */

DROP TABLE IF EXISTS `tb_estadocheck`;

CREATE TABLE `tb_estadocheck` (
  `codestchk` int(5) NOT NULL auto_increment,
  `desestchk` varchar(45) NOT NULL,
  `estdeschk` tinyint(1) NOT NULL,
  `valestchk` decimal(1,1) NOT NULL,
  PRIMARY KEY  (`codestchk`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `tb_estadocheck` */

insert  into `tb_estadocheck`(`codestchk`,`desestchk`,`estdeschk`,`valestchk`) values (1,'Pendiente',1,'0.0'),(2,'Iniciado',1,'0.5'),(3,'Finalizado',1,'0.9');

/*Table structure for table `tb_estadoconstruccion` */

DROP TABLE IF EXISTS `tb_estadoconstruccion`;

CREATE TABLE `tb_estadoconstruccion` (
  `codestcon` int(5) unsigned NOT NULL auto_increment,
  `desestcon` varchar(25) default NULL,
  `esestcon` int(1) unsigned default NULL,
  PRIMARY KEY  (`codestcon`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_estadoconstruccion` */

insert  into `tb_estadoconstruccion`(`codestcon`,`desestcon`,`esestcon`) values (1,'Terminada',1),(2,'En Construccion',1),(3,'En Ampliacion',1);

/*Table structure for table `tb_estcliente` */

DROP TABLE IF EXISTS `tb_estcliente`;

CREATE TABLE `tb_estcliente` (
  `codestcli` int(5) unsigned NOT NULL auto_increment COMMENT 'Código del estado del cliente',
  `desestcli` varchar(25) NOT NULL COMMENT 'Descripción del estado del cliente',
  `clihab` tinyint(4) NOT NULL COMMENT 'Indica si el estado del cliente lo habilita para generar solicitudes',
  PRIMARY KEY  (`codestcli`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_estcliente` */

insert  into `tb_estcliente`(`codestcli`,`desestcli`,`clihab`) values (1,'Activo',1),(2,'Inactivo',0),(3,'Bloqueado',0),(4,'Deudor',1);

/*Table structure for table `tb_estsol` */

DROP TABLE IF EXISTS `tb_estsol`;

CREATE TABLE `tb_estsol` (
  `codestsol` int(11) NOT NULL auto_increment,
  `desestsol` varchar(25) NOT NULL,
  `estestsol` tinyint(1) NOT NULL,
  PRIMARY KEY  (`codestsol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `tb_estsol` */

insert  into `tb_estsol`(`codestsol`,`desestsol`,`estestsol`) values (1,'Registrada',1),(2,'En Proceso',1),(3,'Terminada',1);

/*Table structure for table `tb_imgdomicilio` */

DROP TABLE IF EXISTS `tb_imgdomicilio`;

CREATE TABLE `tb_imgdomicilio` (
  `codimgdom` int(10) unsigned NOT NULL auto_increment,
  `codsol` int(10) unsigned NOT NULL,
  `codper` int(10) unsigned NOT NULL,
  `codchkdom` int(10) unsigned NOT NULL,
  `codtipimg` int(5) unsigned NOT NULL,
  `nomimgdom` varchar(50) default 'defaut.jpg',
  `numimgdom` int(1) unsigned default NULL,
  PRIMARY KEY  (`codimgdom`,`codsol`,`codper`,`codchkdom`),
  KEY `fk_{39F06787-8BCD-4B05-94FA-8481A99DAF0D}` (`codtipimg`),
  KEY `fk_{E191B052-32F0-4094-82BD-15889A918C89}` (`codchkdom`,`codper`,`codsol`),
  CONSTRAINT `fk_{39F06787-8BCD-4B05-94FA-8481A99DAF0D}` FOREIGN KEY (`codtipimg`) REFERENCES `tb_tipoimagen` (`codtipimg`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{E191B052-32F0-4094-82BD-15889A918C89}` FOREIGN KEY (`codchkdom`, `codper`, `codsol`) REFERENCES `tb_chkdomicilio` (`codchkdom`, `codper`, `codsol`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_imgdomicilio` */

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

/*Data for the table `tb_opciones` */

/*Table structure for table `tb_packcheck` */

DROP TABLE IF EXISTS `tb_packcheck`;

CREATE TABLE `tb_packcheck` (
  `codpacchk` int(5) unsigned NOT NULL auto_increment COMMENT 'Código del Pack de Checks',
  `despacchk` varchar(35) NOT NULL COMMENT 'Descripción del Pack de Checks',
  `usuregpacchk` varchar(20) NOT NULL,
  `fecregpacchk` datetime NOT NULL,
  `estpacchk` int(1) unsigned NOT NULL COMMENT 'Estado del Pack de Checks',
  PRIMARY KEY  (`codpacchk`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_packcheck` */

insert  into `tb_packcheck`(`codpacchk`,`despacchk`,`usuregpacchk`,`fecregpacchk`,`estpacchk`) values (1,'Check Basico','admin','2010-04-25 11:25:44',1),(2,'Check Ejecutivo','admin','2010-04-25 11:25:44',1),(3,'Check Completo','admin','2010-04-25 11:25:44',0);

/*Table structure for table `tb_parentesco` */

DROP TABLE IF EXISTS `tb_parentesco`;

CREATE TABLE `tb_parentesco` (
  `codpar` int(5) unsigned NOT NULL auto_increment,
  `despar` varchar(25) default NULL,
  `estpar` int(1) unsigned default NULL,
  PRIMARY KEY  (`codpar`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_parentesco` */

insert  into `tb_parentesco`(`codpar`,`despar`,`estpar`) values (1,'Padre',1),(2,'Madre',1),(3,'Hermano(a)',1),(4,'Primo(a)',1),(5,'Cuñado(a)',1),(6,'Otros',1);

/*Table structure for table `tb_perfil` */

DROP TABLE IF EXISTS `tb_perfil`;

CREATE TABLE `tb_perfil` (
  `codperf` int(5) unsigned NOT NULL auto_increment,
  `desperf` varchar(45) NOT NULL,
  `estperf` tinyint(1) NOT NULL,
  `usuregperf` varchar(20) NOT NULL,
  `fecregperf` datetime NOT NULL,
  PRIMARY KEY  (`codperf`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `tb_perfil` */

insert  into `tb_perfil`(`codperf`,`desperf`,`estperf`,`usuregperf`,`fecregperf`) values (1,'Administrador',1,'admin','2010-04-25 11:12:49'),(2,'Usuario',1,'admin','2010-04-25 11:12:49'),(3,'Consulta',1,'admin','2010-04-25 11:12:49');

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

/*Data for the table `tb_perfilopciones` */

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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_persona` */

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

/*Data for the table `tb_preguntas` */

/*Table structure for table `tb_provincia` */

DROP TABLE IF EXISTS `tb_provincia`;

CREATE TABLE `tb_provincia` (
  `coddpto` int(3) unsigned NOT NULL,
  `codpro` int(3) unsigned NOT NULL auto_increment,
  `despro` varchar(25) NOT NULL,
  `estpro` int(1) NOT NULL,
  PRIMARY KEY  (`codpro`,`coddpto`),
  KEY `fk_tb_provincia_tb_departamento1` (`coddpto`),
  CONSTRAINT `fk_tb_provincia_tb_departamento1` FOREIGN KEY (`coddpto`) REFERENCES `tb_departamento` (`coddpto`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_provincia` */

insert  into `tb_provincia`(`coddpto`,`codpro`,`despro`,`estpro`) values (1,1,'CHACHAPOYAS',1),(2,1,'HUARAS',1),(3,1,'ABANCAY',1),(4,1,'AREQUIPA',1),(5,1,'HUAMANGA',1),(6,1,'CAJAMARCA',1),(7,1,'CALLAO',1),(8,1,'CUSCO',1),(9,1,'HUANCAVELICA',1),(10,1,'HUANUCO',1),(11,1,'ICA',1),(12,1,'HUANCAYO',1),(13,1,'TRUJILLO',1),(14,1,'CHICLAYO',1),(15,1,'LIMA',1),(16,1,'MAYNAS',1),(17,1,'TAMBOPATA',1),(18,1,'MARISCAL NIETO',1),(19,1,'PASCO',1),(20,1,'PIURA',1),(21,1,'PUNO',1),(22,1,'MOYOBAMBA',1),(23,1,'TACNA',1),(24,1,'TUMBES',1),(25,1,'CORONEL PORTILLO',1),(1,2,'BAGUA',1),(2,2,'AIJA',1),(3,2,'ANDAHUAYLAS',1),(4,2,'CAMANA',1),(5,2,'CANGALLO',1),(6,2,'CAJABAMBA',1),(8,2,'ACOMAYO',1),(9,2,'ACOBAMBA',1),(10,2,'AMBO',1),(11,2,'CHINCHA',1),(12,2,'CONCEPCION',1),(13,2,'ASCOPE',1),(14,2,'FERRE-AFE',1),(15,2,'BARRANCA',1),(16,2,'ALTO AMAZONAS',1),(17,2,'MANU',1),(18,2,'GRAL.SANCHEZ CERRO',1),(19,2,'DANIEL ALCIDES CARRION',1),(20,2,'AYABACA',1),(21,2,'AZANGARO',1),(22,2,'BELLAVISTA',1),(23,2,'CANDARAVE',1),(24,2,'CONTRALMIRANTE VILLAR',1),(25,2,'ATALAYA',1),(1,3,'BONGARA',1),(2,3,'ANTONIO RAYMONDI',1),(3,3,'ANTABAMBA',1),(4,3,'CARAVELI',1),(5,3,'HUANCA SANCOS',1),(6,3,'CELENDIN',1),(8,3,'ANTA',1),(9,3,'ANGARAES',1),(10,3,'DOS DE MAYO',1),(11,3,'NAZCA',1),(12,3,'CHANCHAMAYO',1),(13,3,'BOLIVAR',1),(14,3,'LAMBAYEQUE',1),(15,3,'CAJATAMBO',1),(16,3,'LORETO',1),(17,3,'TAHUAMANU',1),(18,3,'ILO',1),(19,3,'OXAPAMPA',1),(20,3,'HUANCABAMBA',1),(21,3,'CARABAYA',1),(22,3,'EL DORADO',1),(23,3,'JORGE BASADRE',1),(24,3,'ZARUMILLA',1),(25,3,'PADRE ABAD',1),(1,4,'CONDORCANQUI',1),(2,4,'ASUNCION',1),(3,4,'AYMARAES',1),(4,4,'CASTILLA',1),(5,4,'HUANTA',1),(6,4,'CHOTA',1),(8,4,'CALCA',1),(9,4,'CASTROVIRREYNA',1),(10,4,'HUACAYBAMBA',1),(11,4,'PALPA',1),(12,4,'JAUJA',1),(13,4,'CHEPEN',1),(15,4,'CANTA',1),(16,4,'MARISCAL RAMON CASTILLA',1),(20,4,'MORROPON',1),(21,4,'CHUCUITO',1),(22,4,'HUALLAGA',1),(23,4,'TARATA',1),(25,4,'PURUS',1),(1,5,'LUYA',1),(2,5,'BOLOGNESI',1),(3,5,'COTABAMBAS',1),(4,5,'CAYLLOMA',1),(5,5,'LA MAR',1),(6,5,'CONTUMAZA',1),(8,5,'CANAS',1),(9,5,'CHURCAMPA',1),(10,5,'HUAMALIES',1),(11,5,'PISCO',1),(12,5,'JUNIN',1),(13,5,'JULCAN',1),(15,5,'CA-ETE',1),(16,5,'REQUENA',1),(20,5,'PAITA',1),(21,5,'EL COLLAO',1),(22,5,'LAMAS',1),(1,6,'RODRIGUEZ DE MENDOZA',1),(2,6,'CARHUAZ',1),(3,6,'CHINCHEROS',1),(4,6,'CONDESUYOS',1),(5,6,'LUCANAS',1),(6,6,'CUTERVO',1),(8,6,'CANCHIS',1),(9,6,'HUAYTARA',1),(10,6,'LEONCIO PRADO',1),(12,6,'SATIPO',1),(13,6,'OTUZCO',1),(15,6,'HUARAZ',1),(16,6,'UCAYALI',1),(20,6,'SULLANA',1),(21,6,'HUANCANE',1),(22,6,'MARISCAL CACERES',1),(1,7,'UTCUBAMBA',1),(2,7,'CARLOS F.FITZCARRALD',1),(3,7,'GRAU',1),(4,7,'ISLAY',1),(5,7,'PARINACOCHAS',1),(6,7,'HUALGAYOC',1),(8,7,'CHUMBIVILCAS',1),(9,7,'TAYACAJA',1),(10,7,'MARA-ON',1),(12,7,'TARMA',1),(13,7,'PACASMAYO',1),(15,7,'HUAROCHIRI',1),(20,7,'TALARA',1),(21,7,'LAMPA',1),(22,7,'PICOTA',1),(2,8,'CASMA',1),(4,8,'LA UNION',1),(5,8,'PAUCAR DEL SARA SARA',1),(6,8,'JAEN',1),(8,8,'ESPINAR',1),(10,8,'PACHITEA',1),(12,8,'YAULI',1),(13,8,'PATAZ',1),(15,8,'HUAURA',1),(20,8,'SECHURA',1),(21,8,'MELGAR',1),(22,8,'RIOJA',1),(2,9,'CORONGO',1),(5,9,'SUCRE',1),(6,9,'SAN IGNACIO',1),(8,9,'LA CONVENCION',1),(10,9,'PUERTO INCA',1),(12,9,'CHUPACA',1),(13,9,'SANCHEZ CARRION',1),(15,9,'OYON',1),(21,9,'MOHO',1),(22,9,'SAN MARTIN',1),(2,10,'HUARI',1),(5,10,'VICTOR FAFARDO',1),(6,10,'SAN MARCOS',1),(8,10,'PARURO',1),(10,10,'LAURICOCHA',1),(13,10,'SANTIAGO DE CHUCO',1),(15,10,'YAUYOS',1),(21,10,'SAN ANTONIO DE PUTINA',1),(22,10,'TOCACHE',1),(2,11,'HUARMEY',1),(5,11,'VILCAS HUAMAN',1),(6,11,'SAN MIGUEL',1),(8,11,'PAUCARTAMBO',1),(10,11,'YAROWILCA',1),(13,11,'GRAN CHIMU',1),(21,11,'SAN ROMAN',1),(2,12,'HUAYLAS',1),(6,12,'SAN PABLO',1),(8,12,'QUISPICANCHI',1),(13,12,'VIRU',1),(21,12,'SANDIA',1),(2,13,'MARISCAL LUZURIAGA',1),(6,13,'SANTA CRUZ',1),(8,13,'URUBAMBA',1),(21,13,'YUNGUYO',1),(2,14,'OCROS',1),(2,15,'PALLASCA',1),(2,16,'POMABAMBA',1),(2,17,'RECUAY',1),(2,18,'SANTA',1),(2,19,'SIHUAS',1),(2,20,'YUNGAY',1);

/*Table structure for table `tb_puesto` */

DROP TABLE IF EXISTS `tb_puesto`;

CREATE TABLE `tb_puesto` (
  `codpue` int(5) unsigned NOT NULL auto_increment COMMENT 'Código del puesto',
  `despue` varchar(25) NOT NULL COMMENT 'Descripción del puesto',
  `estpue` tinyint(1) NOT NULL COMMENT 'Estado del puesto',
  PRIMARY KEY  (`codpue`),
  UNIQUE KEY `idx_despue` (`despue`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_puesto` */

insert  into `tb_puesto`(`codpue`,`despue`,`estpue`) values (1,'Vendedor',1),(2,'Operador',1);

/*Table structure for table `tb_residentes` */

DROP TABLE IF EXISTS `tb_residentes`;

CREATE TABLE `tb_residentes` (
  `codres` int(5) unsigned NOT NULL auto_increment,
  `desres` varchar(25) default NULL,
  `estres` int(1) unsigned default NULL,
  PRIMARY KEY  (`codres`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_residentes` */

insert  into `tb_residentes`(`codres`,`desres`,`estres`) values (1,'Conyugue',1),(2,'Hijos',1),(3,'Padres',1),(4,'Hermanos',1),(5,'Otros',1);

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

/*Data for the table `tb_residentesdomicilio` */

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

/*Data for the table `tb_respuestas` */

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
  PRIMARY KEY  (`codsol`),
  KEY `fk_tb_solicitud_tb_estsol1` (`codestsol`),
  KEY `fk_{41145C50-667A-4575-B0CB-27782C2DB542}` (`codcli`),
  CONSTRAINT `fk_tb_solicitud_tb_estsol1` FOREIGN KEY (`codestsol`) REFERENCES `tb_estsol` (`codestsol`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_{41145C50-667A-4575-B0CB-27782C2DB542}` FOREIGN KEY (`codcli`) REFERENCES `tb_cliente` (`codcli`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_solicitud` */

/*Table structure for table `tb_tipcliente` */

DROP TABLE IF EXISTS `tb_tipcliente`;

CREATE TABLE `tb_tipcliente` (
  `codtipcli` int(5) unsigned NOT NULL auto_increment COMMENT 'Código del tipo de cliente',
  `destipcli` varchar(50) NOT NULL COMMENT 'Descripción del tipo de cliente',
  `esttipcli` char(1) NOT NULL COMMENT 'Estado del tipo de cliente',
  PRIMARY KEY  (`codtipcli`),
  UNIQUE KEY `idxdestipcli` (`destipcli`),
  UNIQUE KEY `idx_desctipcliente_` (`destipcli`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_tipcliente` */

insert  into `tb_tipcliente`(`codtipcli`,`destipcli`,`esttipcli`) values (1,'Financiera','1'),(2,'Banco','1'),(3,'Comunicaciones','1');

/*Table structure for table `tb_tipdoc` */

DROP TABLE IF EXISTS `tb_tipdoc`;

CREATE TABLE `tb_tipdoc` (
  `codtipdoc` int(5) NOT NULL auto_increment,
  `destipdoc` varchar(45) character set latin1 NOT NULL,
  `esttipdoc` tinyint(1) NOT NULL,
  PRIMARY KEY  (`codtipdoc`),
  UNIQUE KEY `idx_desctipdoc` (`destipdoc`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Data for the table `tb_tipdoc` */

insert  into `tb_tipdoc`(`codtipdoc`,`destipdoc`,`esttipdoc`) values (1,'DNI',1),(2,'LM',1),(3,'Pasaporte',1),(4,'CE',1);

/*Table structure for table `tb_tipoimagen` */

DROP TABLE IF EXISTS `tb_tipoimagen`;

CREATE TABLE `tb_tipoimagen` (
  `codtipimg` int(5) unsigned NOT NULL auto_increment,
  `destipimg` varchar(25) default NULL,
  `esttipimg` int(11) unsigned default NULL,
  PRIMARY KEY  (`codtipimg`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_tipoimagen` */

insert  into `tb_tipoimagen`(`codtipimg`,`destipimg`,`esttipimg`) values (1,'Zona Alto Riesgo',1),(2,'Zona Inubicable',1),(3,'No Permitieron tomar foto',1),(4,'Imagen Tomada',1);

/*Table structure for table `tb_tipomaterial` */

DROP TABLE IF EXISTS `tb_tipomaterial`;

CREATE TABLE `tb_tipomaterial` (
  `codtipmat` int(5) unsigned NOT NULL auto_increment,
  `destipmat` varchar(25) default NULL,
  `estipmat` int(1) unsigned default NULL,
  PRIMARY KEY  (`codtipmat`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_tipomaterial` */

insert  into `tb_tipomaterial`(`codtipmat`,`destipmat`,`estipmat`) values (1,'Noble',1),(2,'Madera/Triplay',1),(3,'Adobe',1),(4,'Otros',1);

/*Table structure for table `tb_tipovivienda` */

DROP TABLE IF EXISTS `tb_tipovivienda`;

CREATE TABLE `tb_tipovivienda` (
  `codtipviv` int(5) NOT NULL,
  `destipviv` varchar(35) NOT NULL,
  `esttipviv` int(1) unsigned NOT NULL,
  PRIMARY KEY  (`codtipviv`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_tipovivienda` */

insert  into `tb_tipovivienda`(`codtipviv`,`destipviv`,`esttipviv`) values (1,'Casa',1),(2,'Departamento',1),(3,'Otros',1);

/*Table structure for table `tb_tipvias` */

DROP TABLE IF EXISTS `tb_tipvias`;

CREATE TABLE `tb_tipvias` (
  `codtipvia` int(5) unsigned NOT NULL auto_increment COMMENT 'Código de Tipo de vía',
  `destipvia` varchar(5) default NULL COMMENT 'Descripción de Tipo de vía',
  `esttipvia` int(1) unsigned default NULL COMMENT 'Estado de Tipo de vía',
  PRIMARY KEY  (`codtipvia`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_tipvias` */

insert  into `tb_tipvias`(`codtipvia`,`destipvia`,`esttipvia`) values (1,'Av.',1),(2,'Cl.',1),(3,'Jr.',1),(4,'Psj.',1);

/*Table structure for table `tb_users` */

DROP TABLE IF EXISTS `tb_users`;

CREATE TABLE `tb_users` (
  `coduser` int(11) NOT NULL auto_increment,
  `nomuser` varchar(50) NOT NULL,
  `apeuser` varchar(50) NOT NULL,
  `loguser` varchar(20) NOT NULL,
  `pasuser` varchar(100) NOT NULL default '',
  `usuregusu` varchar(20) NOT NULL,
  `fecregusu` datetime NOT NULL,
  `codperf` int(5) unsigned NOT NULL,
  `estuser` tinyint(1) NOT NULL,
  `codcli` int(10) default NULL,
  PRIMARY KEY  (`coduser`),
  UNIQUE KEY `user` (`loguser`),
  KEY `fk_tb_users_tb_perfil1` (`codperf`),
  CONSTRAINT `fk_tb_users_tb_perfil1` FOREIGN KEY (`codperf`) REFERENCES `tb_perfil` (`codperf`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

/*Data for the table `tb_users` */

insert  into `tb_users`(`coduser`,`nomuser`,`apeuser`,`loguser`,`pasuser`,`usuregusu`,`fecregusu`,`codperf`,`estuser`,`codcli`) values (1,'Administrador','Sistemas','admin','0192023a7bbd73250516f069df18b500','','2010-04-25 11:13:09',1,1,1);

/*Table structure for table `tb_vivienda` */

DROP TABLE IF EXISTS `tb_vivienda`;

CREATE TABLE `tb_vivienda` (
  `codviv` int(5) unsigned NOT NULL auto_increment,
  `desviv` varchar(25) default NULL,
  `estviv` int(1) unsigned default NULL,
  PRIMARY KEY  (`codviv`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_vivienda` */

insert  into `tb_vivienda`(`codviv`,`desviv`,`estviv`) values (1,'Propia',1),(2,'Alquilada',1),(3,'Familiar',1);

/*Table structure for table `tb_zonariesgo` */

DROP TABLE IF EXISTS `tb_zonariesgo`;

CREATE TABLE `tb_zonariesgo` (
  `codzonrie` int(5) unsigned NOT NULL auto_increment,
  `deszonrie` varchar(25) default NULL,
  `estzonrie` int(1) unsigned default NULL,
  PRIMARY KEY  (`codzonrie`),
  UNIQUE KEY `idx_deszonrie` (`deszonrie`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_zonariesgo` */

insert  into `tb_zonariesgo`(`codzonrie`,`deszonrie`,`estzonrie`) values (1,'Alto',1),(2,'Mediano',1),(3,'Nulo',1);

/*Table structure for table `tb_zonificacion` */

DROP TABLE IF EXISTS `tb_zonificacion`;

CREATE TABLE `tb_zonificacion` (
  `codzonif` int(5) unsigned NOT NULL auto_increment,
  `deszonif` varchar(25) default NULL,
  `estzonif` int(1) unsigned default NULL,
  PRIMARY KEY  (`codzonif`),
  UNIQUE KEY `idx_deszonif` (`deszonif`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1 PACK_KEYS=0;

/*Data for the table `tb_zonificacion` */

insert  into `tb_zonificacion`(`codzonif`,`deszonif`,`estzonif`) values (1,'Residencial',1),(2,'Urbanizacion',1),(3,'Cooperativa',1),(4,'Comercial',1),(5,'Asociacion',1),(6,'AA.HH',1),(7,'Industrial',1),(8,'Otros',1);

/*Table structure for table `tmp_estactchk` */

DROP TABLE IF EXISTS `tmp_estactchk`;

CREATE TABLE `tmp_estactchk` (
  `codsol` int(10) default NULL,
  `codper` int(10) default NULL,
  `codestchk` int(5) default NULL,
  KEY `idx_codsol` (`codsol`),
  KEY `idx_codper` (`codper`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Data for the table `tmp_estactchk` */

/*Table structure for table `tmp_estperchk` */

DROP TABLE IF EXISTS `tmp_estperchk`;

CREATE TABLE `tmp_estperchk` (
  `codsol` int(10) default NULL,
  `codper` int(10) default NULL,
  `codchk` int(10) default NULL,
  `codestchk` int(10) default NULL,
  KEY `idx_codsol` (`codsol`),
  KEY `idx_codper` (`codper`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Data for the table `tmp_estperchk` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
