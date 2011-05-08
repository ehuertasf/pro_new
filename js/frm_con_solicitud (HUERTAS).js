/********************************************
 *  Inicio de formulario frm_con_solicitud  *
 *******************************************/

function frm_con_solicitud(){

//selPersona = false, selPack = false, selPuesto=false;
//vcodper=0,vapepatper='',vapematper='',vnomper='',vdestipdoc='',vnumdocper='',vcodpue=0,vdespue='',vcodpacchk=0,vdespacchk='';
//alert(selPersona);

    Ext.override(Ext.form.Field, {
       fireKey : function(e) {
            if(((Ext.isIE && e.type == 'keydown') || e.type == 'keypress') && e.isSpecialKey()) {
                this.fireEvent('specialkey', this, e);
            }
            else {
                this.fireEvent(e.type, this, e);
            }
        } ,
       initEvents : function() {
            this.el.on("focus", this.onFocus,  this);
            this.el.on("blur", this.onBlur,  this);
            this.el.on("keydown", this.fireKey, this);
            this.el.on("keypress", this.fireKey, this);
            this.el.on("keyup", this.fireKey, this);
            // reference to original value for reset
            this.originalValue = this.getValue();
        }
    });

//Data Store

var ds_estadosol = new Ext.data.Store({
    reader  : new Ext.data.JsonReader({
                    fields  : ['codestsol', 'desestsol'],
                    root    : 'estadossol',
                    id      : 'codestsol'
            }),
    proxy: new Ext.data.HttpProxy({
                    url: 'DB/solicitud.php?n=4'
            }),
    autoLoad: true
});

var ds_consolcli = new Ext.data.Store({
    reader  : new Ext.data.JsonReader({
                    fields  : ['codcli', 'nomcli'],
                    root    : 'solcliente',
                    id      : 'codcli'
            }),
    proxy: new Ext.data.HttpProxy({
                    url: 'DB/clientes.php?n=6'
            }),
    autoLoad: true
});

//Controles

var txt_concodsol = new Ext.form.TextField({
    id          : 'txt_concodsol',
    fieldLabel	: 'N° Solicitud',
    readOnly	: false,
    disabled    : false,
    name	: 'codsol',
    anchor	: '98%'
});

var btn_resetbusq = new Ext.Button({
    text        : 'Nueva Busqueda',
    disabled    : false,
    tooltip     : 'Inicializa para nueva consulta',
    handler     : function(){
                    frmConDatosSolicitud.getForm().reset();
                    stcondetsolper.removeAll();
    }
});

var btn_desbloquea = new Ext.Button({
    text        : 'Desbloquear solicitud',
    disabled    : false,
    tooltip     : 'Desbloquea una solicitud vencida',
    handler     : function(){
                    frmConDatosSolicitud.getForm().reset();
                    stcondetsolper.removeAll();
    }
});

var btn_consolicitudes = new Ext.Button({
    //width       : 150,
    text        : 'Buscar Solicitudes',
    cls         : 'x-btn-text-icon',
    icon        : 'files/images_app/magnifier-left.png',
    disabled    : false,
    tooltip     : 'Consulta solicitudes de acuerdo al criterio ingresado',
    handler     : function(){
                        stcondetsolper.removeAll();
                        var codsol = Ext.util.Format.trim(txt_concodsol.getValue());
                        var codcli = cbo_consolcodcli.getValue();
                        codestsol = cboEstadosol.getValue();
                        //Ext.util.Format.trim(dp_consoldesde.format('Y-m-d'))
                        var predesde = dp_consoldesde.getValue();
                        desde='';
                        if(predesde!=''){
                            desde = predesde.format('Y-m-d')+' 00:00:00';
                        }else{
                            desde = '';
                        }
                        var prehasta = dp_consolhasta.getValue();
                        hasta='';
                        if(prehasta!=''){
                            hasta = prehasta.format('Y-m-d')+' 23:59:59';
                        }else{
                            hasta = '';
                        }
                        if((codsol!='' || codcli!='' || codestsol!='') || (desde!='' && hasta!='')){
                            stcondetsolper.load({params: {n: 5, codsol: codsol, codcli : codcli, codestsol : codestsol, desde : desde, hasta : hasta}});
                        }else{
                            Ext.Msg.show({title: 'Error en Criterios',
                                                    msg: 'Recuerde que debe seleccionar por lo menos un criterio, si la busqueda es por fecha de registro debe ingresar ambas',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.INFO});
                        }
                }
});



var cbo_consolcodcli = new Ext.form.ComboBox({
        id              : 'cbo_consolcodcli',
        name            : 'codcli',
        fieldLabel      : 'Cliente',
        mode            : 'local',
        disabled        : false,
        allowBlank      : true,
        store           : ds_consolcli,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'nomcli',
        valueField      : 'codcli',
        anchor          : '100%'
});

cboEstadosol = new Ext.form.ComboBox({
        fieldLabel  : 'Estado',
        id          : 'cbo_Estadosol',
	store       : ds_estadosol,
        displayField:'desestsol',
        width       : 130,
        valueField  : 'codestsol',
        typeAhead   : true,
        mode        : 'local',
        triggerAction: 'all',
        anchor      :'98%',
        editable    : false,
        forceSelection : true,
        onSelect    : function(record){
                            cboEstadosol.setValue(record.data.codestsol);
                            cboEstadosol.collapse();
                        }
    });

 var dp_consoldesde=new Ext.form.DateField({
        fieldLabel  :'Registrada - Desde',
        id          :'dp_consoldesde',
        name        :'consoldesde',
        width       :110,
        format      :'d/m/Y',
        anchor      :'98%',
        readOnly    :false,
        vtype: 'daterange',
        endDateField: 'dp_consolhasta',
        renderer    :function(value) {return value ? new Date(value).dateFormat('Y-m-d') : '';},
        allowBlank  :true
    });

var dp_consolhasta=new Ext.form.DateField({
        fieldLabel  :'Hasta',
        id          :'dp_consolhasta',
        name        :'consolhasta',
        width       :110,
        format      :'d/m/Y',
        anchor      :'98%',
        readOnly    :false,
        vtype: 'daterange',
        startDateField: 'dp_consoldesde',
        renderer    :function(value) {return value ? new Date(value).dateFormat('Y-m-d') : '';},
        allowBlank  :true
    });

function change_r(rval){
	 //console.log(rval);
	 if(rval > 0) {
		  return '<span style="font-weight:bold;color:white;background-color: red;cursor:pointer;">&nbsp;' + rval + '&nbsp;&nbsp;</span>';
	 } else if(rval==0) {
		  rval='Terminada';
		  return '<span style="color:white;background-color: green">' + rval + '</span>';
	 }else if(rval=='V'){
		  rval='Vencida';
		  return '<span style="color:white;background-color: red">' + rval + '</span>';
	 }

}

var cm_consolicitud = new Ext.grid.ColumnModel(
        [{
            header: 'N° Solicitud',
            readonly: true,
            dataIndex: 'codsol',
            hidden: false,
            width: 80
        },{
            id : 'codcli',
            header: 'codcli',
            readonly: true,
            dataIndex: 'codcli',
            hidden: true
        },
        {
            header: 'Cliente',
            readonly: true,
            dataIndex: 'nomcli',
            hidden: false,
            width: 120
        },
        {
            header: 'Fecha Registro',
            readonly: true,
            dataIndex: 'fecregsol',
            hidden: false,
            width: 120
        },
        {
            header: 'Fecha Vencimiento',
            readonly: true,
            dataIndex: 'fecvensol',
            hidden: false,
            width: 120
        },
        {
            header: 'Plazo',
            readonly: true,
            dataIndex: 'plazo',
            hidden: false,
            width: 60
        },{
            header: 'Dias Restantes',
            readonly: true,
			align:'center',
            dataIndex: 'diasrest',
            hidden: false,
			renderer:change_r,
            width: 60
		},{
            header: 'Cant. Per.',
            readonly: true,
            dataIndex: 'canper',
            hidden: false,
            width: 60
        },
        {
            header: 'codestsol',
            readonly: true,
            dataIndex: 'codestsol',
            hidden: true
        },
        {
            header: 'Estado',
            readonly: true,
            dataIndex: 'desestsol',
            hidden: false
        },
        {
            header: 'Registrado Por',
            readonly: true,
            dataIndex: 'usuario',
            hidden: false
        }
        ]
    );

    stcondetsolper = new Ext.data.Store({
                    proxy: new Ext.data.HttpProxy({
                        url: 'DB/solicitud.php',
                        method : 'POST'
                    }),
                    reader: new Ext.data.JsonReader({
                        root            : 'busquedasol',
                        totalProperty	: 'total',
                        id              : 'codsol'
                        },
                        [{name: 'codsol', mapping: 'codsol'},
                        {name: 'codcli', mapping: 'codcli'},
                        {name: 'nomcli', mapping: 'nomcli'},
                        {name: 'fecregsol', mapping: 'fecregsol'},
                        {name: 'fecvensol', mapping: 'fecvensol'},
                        {name: 'plazo', mapping: 'plazo'},
                        {name: 'canper', mapping: 'canper'},
                        {name: 'codestsol',  mapping: 'codestsol'},
                        {name: 'desestsol',  mapping: 'desestsol'},
                        {name: 'usuario',  mapping: 'usuario'},
			{name: 'diasrest', mapping:'diasrest'}
                        ]),
                    autoLoad : false
                });


    var grd_consolicitud = new Ext.grid.EditorGridPanel({
        id      : 'grd_consolicitud',
        store   : stcondetsolper,
        title   : 'Solicitudes encontradas',
        cm      : cm_consolicitud,
        width   : 350,
        anchor  : '100%',
        height  : 270,
        frame   : true,
        clicksToEdit:1,
	layout    : 'fit',
	autoScroll: true,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
        listeners:{
            rowdblclick: function(grid, rowIndex, e){
                            var sol = stcondetsolper.getAt(rowIndex).data.codsol;
                            var vencida = stcondetsolper.getAt(rowIndex).data.diasrest;

                            if(vencida=='V'){
                                Ext.Msg.show({
                                    title: 'Aviso',
                                    msg: 'No puede consultar esta solicitud porque ya esta vencida, Comuniquese con un Administrador del sistema para desbloquearla',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO
                                });
                            }else{
                                frm_det_solicitud(sol);
                            }

                        }
                }
    });

    var frmResConSolicitud = new Ext.FormPanel({
        id          : 'frmResConSolicitud',
        autoWidth   : false,
        autoHeight  : true,
        border      : false,
        //title       : 'Persona a agregar',
        style       : 'padding:5px 5px 5px 5px',
        items       : [grd_consolicitud]
    });

    var frmConDatosSolicitud = new Ext.FormPanel({
        id          : 'frmConDatosSolicitud',
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
                                items		: [txt_concodsol]
                                },{
                                columnWidth	: .70,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 45,
                                defaultType	: 'textfield',
                                items		: [cbo_consolcodcli]
                                }]
                        },{
                        layout	: 'column',
                        border	: false,
                        items:[{
                                columnWidth	: .25,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 45,
                                defaultType	: 'textfield',
                                items		: [cboEstadosol]
                                },{
                                columnWidth	: .31,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 110,
                                defaultType	: 'textfield',
                                items		: [dp_consoldesde]
                                },{
                                columnWidth	: .20,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 40,
                                defaultType	: 'textfield',
                                items		: [dp_consolhasta]
                                }]
                        }],
        bbar    :   [btn_desbloquea,{xtype: 'tbfill'},btn_consolicitudes,btn_resetbusq]
    });


    var win_con_solicitud = Ext.getCmp('frm_con_solicitud');
    if (!win_con_solicitud){
        new Ext.Window({
            title	: 'Consulta de Solicitudes',
            id          : 'frm_con_solicitud',
            layout	: 'fit',
            iconCls     : 'consol',
            width	: 750,
            height	: 420,
            resizable   : false,
            closable    : true,
            items       : [frmConDatosSolicitud,frmResConSolicitud]
        }).show();

        Ext.Ajax.request({
            url : 'DB/datamttos.php',
            params : {
                x:18
            },
            success:function(response,options){
                var stringData = response.responseText;
                var jsonData = Ext.util.JSON.decode(stringData);
                var empre = jsonData.xcodcli;
                if (empre!='1'){
                    cbo_consolcodcli.setValue(empre);
                    cbo_consolcodcli.setReadOnly(true);
                }
            }
        });


        //cbo_consolcodcli.setValue('2');
        //cbo_consolcodcli.setReadOnly(true);
    }else{
          win_con_solicitud.show();
    }
}

/*****************************************
 *  Fin de formulario frm_con_solicitud  *
 *****************************************/