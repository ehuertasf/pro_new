/********************************************
 *  Inicio de formulario frm_det_solicitud  *
 *******************************************/

var codsolpdf;
var codperpdf;
var estsolper;

function frm_det_solicitud(cod_sol){

///////////////
/*Data Stores*/
///////////////

//Cliente de la solicitud
var ds_detsolcli = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['codcli', 'nomcli'],
                                        root    : 'solcliente',
                                        id      : 'codcli'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/clientes.php?n=6'
                                }),
                        autoLoad: false
                    });
ds_detsolcli.load();

//Cabecera de la solicitud
var ds_cabsol = new Ext.data.Store({
                proxy: new Ext.data.HttpProxy({
                    url: 'DB/solicitud.php',
                    method : 'POST'
                }),
                baseParams:{n:7, codsol:cod_sol},
                reader: new Ext.data.JsonReader({
                    root            : 'cabsolicitud',
                    totalProperty	: 'total',
                    id              : 'codsol'
                    },
                    [{name: 'codsol', mapping: 'codsol'},
                    {name: 'codcli', mapping: 'codcli'},
                    {name: 'fecvensol', mapping: 'fecvensol'},
                    {name: 'obssol', mapping: 'obssol'},
                    {name: 'codestsol', mapping: 'codestsol'}
                    ]),
                autoLoad: false
            });
ds_cabsol.load();

ds_cabsol.on('load',function(){
                    var solicitud = ds_cabsol.getAt(0).data.codsol;
                    var cliente = ds_cabsol.getAt(0).data.codcli;
                    var prefecha = ds_cabsol.getAt(0).data.fecvensol;
                    var tiempo = Ext.util.Format.substr(prefecha,11,5);
                    var obs = ds_cabsol.getAt(0).data.obssol;
                    txt_detcodsol.setValue(solicitud);
                    cbo_detcodcli.setValue(cliente);
                    dp_detfecvensol.setValue(Ext.util.Format.substr(prefecha,8,2)+'/'+Ext.util.Format.substr(prefecha,5,2)+'/'+Ext.util.Format.substr(prefecha,0,4));
                    tp_dethoraentrega.setValue(tiempo);
                    txt_detobssol.setValue(obs);
});

//Detalle de la solicitud



ds_detsol = new Ext.data.Store({
                    proxy: new Ext.data.HttpProxy({
                        url: 'DB/solicitud.php',
                        method : 'POST'
                    }),
                    baseParams:{n:8, codsol:cod_sol},
                    reader: new Ext.data.JsonReader({
                        root            : 'detpersol',
                        totalProperty	: 'total',
                        id              : 'codper'
                        },
                        [{name: 'codsol', mapping: 'codsol'},
                        {name: 'codper', mapping: 'codper'},
                        {name: 'nombre', mapping: 'nombre'},
                        {name: 'codtipdoc', mapping: 'codtipdoc'},
                        {name: 'destipdoc', mapping: 'destipdoc'},
                        {name: 'numdocper', mapping: 'numdocper'},
                        {name: 'codpacchk', mapping: 'codpacchk'},
                        {name: 'despacchk', mapping: 'despacchk'},
                        {name: 'codpue', mapping: 'codpue'},
                        {name: 'despue', mapping: 'despue'},
                        {name: 'estado', mapping: 'estado'}
                        ]),
                    autoLoad: false
                });
ds_detsol.load();

var check_sm1 = new Ext.grid.CheckboxSelectionModel({
				singleSelect : false,
				listeners : {rowselect : function(obj, rowIndex, record){
					                    codsolpdf = record.data.codsol;
					                    codperpdf = record.data.codper;
					                    //alert(record.data.codsol);
					                    //alert(record.data.codper);
				                }

            	}
});
var cm_detpersonas = new Ext.grid.ColumnModel(
        [check_sm1,{
            header: 'codsol',
            readonly: true,
            dataIndex: 'codsol',
            hidden: true
        },{
            id : 'codper',
            header: 'codper',
            readonly: true,
            dataIndex: 'codper',
            hidden: true
        },{
            header: 'Nombre Completo',
            readonly: true,
            dataIndex: 'nombre',
            hidden: false,
            width:250
        },{
            header: 'codtipdoc',
            readonly: true,
            dataIndex: 'codtipdoc',
            hidden: true
        },{
            header: 'Tipo Documento',
            readonly: true,
            dataIndex: 'destipdoc',
            hidden: false
        },{
            header: 'Numero',
            readonly: true,
            dataIndex: 'numdocper',
            hidden: false
        },{
            header: 'codpacchk',
            readonly: true,
            dataIndex: 'codpacchk',
            hidden: true
        },{
            header: 'Check Pack',
            readonly: true,
            dataIndex: 'despacchk',
            hidden: false
        },{
            header: 'codpue',
            readonly: true,
            dataIndex: 'codpue',
            hidden: true
        },{
            header: 'Puesto',
            readonly: true,
            dataIndex: 'despue',
            hidden: false
        },{
            header: 'Estado',
            readonly: true,
            dataIndex: 'estado',
            hidden: false
        }
        ]
    );

var btn_pdf_checkspersona = new Ext.Button({
    text	:'Pdf',
    id		:'xls278',
    width       :60,
    tooltip     :'Imprimir Checks de Persona',
    handler	: pdf_checkspersona,
    cls         :'x-btn-text-icon',
    icon        :'files/images_app/document-pdf-text.png'
});

function pdf_checkspersona(){
     var arreglo  = [];
     var selectedKeys = grd_detpersonas.selModel.selections.keys;
     for(var i=0;i<selectedKeys.length;i++)
	 	{var record = grd_detpersonas.getStore().getById(selectedKeys[i]);
			arreglo.push(record.data.codper);
	    }
	 var xcodperpdf=arreglo.join(',');
    if (arreglo.length==0)
        alert('Seleccione por lo menos 1 registro para generar reporte');
    else
        window.open("reportes/rptChecks2.php?codper="+xcodperpdf+"&codsol="+codsolpdf,"ventana1" , "width=500,height=650,scrollbars=YES,resizable=YES");
};

var grd_detpersonas = new Ext.grid.EditorGridPanel({
        id      : 'grd_detpersonas',
        store   : ds_detsol,
        title   : 'Personas',
        cm      : cm_detpersonas,
        width   : 350,
		sm		: check_sm1,
        anchor  : '100%',
        height  : 300,
        frame   : true,
        clicksToEdit:1,
	layout    : 'fit',
	autoScroll: true,
        tbar : [{xtype: 'tbfill'},btn_pdf_checkspersona],
  /*      selModel: new Ext.grid.RowSelectionModel({
            singleSelect:false,
            listeners : {
                rowselect : function(obj, rowIndex, record){
                    codsolpdf = record.data.codsol;
                    codperpdf = record.data.codper;
                    //alert(record.data.codsol);
                    //alert(record.data.codper);
                }
            }
        }),*/
        listeners:{
            rowdblclick: function(grid, rowIndex, e){
                                var sol = ds_detsol.getAt(rowIndex).data.codsol;
                                var per = ds_detsol.getAt(rowIndex).data.codper;
                                estsolper = ds_detsol.getAt(rowIndex).data.estado;
                                //alert(sol);
                                frm_checks_persona(sol, per);
                        }
                }
    });



    var frmDetBuscaPersona = new Ext.FormPanel({
        id          : 'frmDetBuscaPersona',
        autoWidth   : false,
        autoHeight  : true,
        border      : false,
        //title       : 'Persona a agregar',
        style       : 'padding:5px 5px 5px 5px',
        items       : [grd_detpersonas]
    });



    var dp_detfecvensol=new Ext.form.DateField({
        fieldLabel  :'Fecha Vcto.',
        id          :'dp_detfecvensol',
        name        :'fecvensol',
        width       :110,
        format      :'d/m/Y',
        anchor      :'98%',
        readOnly    :false,
        disabled    :true,
        listeners   :{
            select : function (ele,newvalue,oldvalue){
                            var fecha = new Date();
                            var nuevafecha = newvalue;
                            //alert(fecha);
                            //alert(nuevafecha);
                            if(fecha != '')
                                if(nuevafecha<=fecha){
                                    //alert(fecha);
                                    //alert(nuevafecha);
                                    dp_detfecvensol.setValue('');
                                    dp_detfecvensol.focus();
                                    Ext.Msg.show({title: 'Error de Ingreso',
                                            msg: 'Recuerde que la fecha de vencimiento debe ser mayor a la fecha actual',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO});

                                }
                        }
                    },
        renderer    :function(value) {return value ? new Date(value).dateFormat('Y-m-d') : '';},
        allowBlank  :false
    });

var txt_detcodsol = new Ext.form.TextField({
    id          : 'txt_detsolcodsol',
    fieldLabel	: 'N° Solicitud',
    readOnly	: true,
    disabled    : true,
    name	: 'codsol',
    anchor	: '98%'
});

var txt_detobssol = new Ext.form.TextField({
    id          : 'txt_detobssol',
    fieldLabel	: 'Observación',
    name	: 'obssol',
    allowBlank  : true,
    anchor	: '100%',
    editable    : false,
    disabled    : true
});

var cbo_detcodcli = new Ext.form.ComboBox({
        id              : 'cbo_detsolcodcli',
        name            : 'codcli',
        fieldLabel      : 'Cliente',
        mode            : 'local',
        disabled        : true,
        allowBlank      : false,
        store           : ds_detsolcli,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'nomcli',
        valueField      : 'codcli',
        anchor          : '100%'
})

var tp_dethoraentrega = new Ext.form.TimeField({
            id          : 'tp_detfecvensol',
            fieldLabel	: 'Hora',
            name	: 'hfecvensol',
            allowBlank  : false,
            format      : 'H:i',
            minValue    : '09:00',
            maxValue    : '20:00',
            increment   : 30,
            anchor	: '98%',
            disabled    : true
});

    var frmCabSolicitud = new Ext.FormPanel({
        id          : 'frmCabSolicitud',
        autoWidth   : false,
        autoHeight  : true,
        border      : false,
        frame       : true,
        style       : 'padding:5px 5px 5px 5px',
        //Se agregan los items del formulario x filas
        items		:[{
                        layout	: 'column',
                        border	: false,
                        items:[{
                                columnWidth	: .30,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 70,
                                defaultType	: 'textfield',
                                items		: [txt_detcodsol]
                                },{
                                columnWidth	: .70,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 45,
                                defaultType	: 'textfield',
                                items		: [cbo_detcodcli]
                                }]
                        },{
                        layout	: 'column',
                        border	: false,
                        items:[{
                                columnWidth	: .25,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 75,
                                defaultType	: 'datefield',
                                items		: [dp_detfecvensol]
                                },{
                                columnWidth	: .15,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 30,
                                defaultType	: 'timefield',
                                items		: [tp_dethoraentrega]
                                },{
                                columnWidth	: .60,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 70,
                                defaultType	: 'textfield',
                                items		: [txt_detobssol]
                                }]
                        }]
    })



    var win_det_solicitud = Ext.getCmp('frm_det_solicitud');
    if (!win_det_solicitud){
        new Ext.Window({
            title	: 'Detalle de Solicitud',
            id          : 'frm_det_solicitud',
            iconCls     : 'regsol',
            layout	: 'fit',
            width	: 750,
            height	: 455,
            resizable   : false,
            closable    : true,
            modal       : true,
            items       : [frmCabSolicitud,frmDetBuscaPersona]
        }).show();
    }else{
          win_det_solicitud.show();
    }
}

/********************************************
 *   Fin de formulario frm_det_solicitud    *
 *******************************************/

