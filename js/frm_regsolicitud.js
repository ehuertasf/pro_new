
function frm_reg_solicitud(){

selPersona = false, selPack = false, selPuesto=false;
vcodper=0,vapepatper='',vapematper='',vnomper='',vdestipdoc='',vnumdocper='',vcodpue=0,vdespue='',vcodpacchk=0,vdespacchk='';
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

    var ds_solper = new Ext.data.Store({
                    proxy: new Ext.data.HttpProxy({
                        url: 'DB/solicitud.php?n=2',
                        method : 'GET'
                    }),
                    reader: new Ext.data.JsonReader({
                        root            : 'busquedaper',
                        totalProperty	: 'total',
                        id              : 'codper'
                        },
                        [{name: 'codper', mapping: 'codper'},
                        {name: 'nomper', mapping: 'nomper'},
                        {name: 'apepatper', mapping: 'apepatper'},
                        {name: 'apematper', mapping: 'apematper'},
                        {name: 'codtipdoc', mapping: 'codtipdoc'},
                        {name: 'numdocper', mapping: 'numdocper'},
                        {name: 'destipdoc',  mapping: 'destipdoc'}
                        ])
                });

    var ds_packcheck = new Ext.data.Store({
                            reader  : new Ext.data.JsonReader({
                                            fields  : ['codpacchk', 'despacchk'],
                                            root    : 'packcheck',
                                            id      : 'codtipdoc'
                                    }),
                            proxy: new Ext.data.HttpProxy({
                                            url: 'DB/solicitud.php?n=6'
                                    }),
                            autoLoad: true
                        });

    var ds_puestos = new Ext.data.Store({
                            reader  : new Ext.data.JsonReader({
                                            fields  : ['codpue', 'despue'],
                                            root    : 'puestos',
                                            id      : 'codpue'
                                    }),
                            proxy: new Ext.data.HttpProxy({
                                            url: 'DB/solicitud.php?n=1'
                                    }),
                            autoLoad: true
                        });

    var tpl_solper = new Ext.XTemplate(
        '<tpl for="."><div class="search-item">',
        '<h3>{nomper} {apepatper} {apematper}</h3>',
        'DNI : {numdocper}',
        '</div></tpl>'
        );


    var cboSolBuscaPersona = new Ext.form.ComboBox({
        id		: 'cboSolBuscaPersona',
        store		: ds_solper,
        typeAhead       : false,
        border          : true,
        width           : 240,
        fieldLabel	: 'Nombre',
        loadingText	: 'Buscando...',
        anchor		: '98%',
        pageSize	: 10,
        hideTrigger     : true,
        tpl		: tpl_solper,
        itemSelector	: 'div.search-item',
        onSelect	: function(record){
                            selPersona=true;
                            cboSolBuscaPersona.setValue(record.data.nomper+' '+record.data.apepatper+' '+record.data.apematper);
                            cboSolBuscaPersona.collapse();
                            vcodper=record.data.codper;
                            vnumdocper=record.data.numdocper;
                            vapepatper=record.data.apepatper;
                            vapematper=record.data.apematper;
                            vnomper=record.data.nomper;
                            vdestipdoc=record.data.destipdoc;
                        }
    });

    var cbopackcheck = new Ext.form.ComboBox({
        fieldLabel  : 'Check Pack',
        id          : 'cbo_packcheck',
	store       : ds_packcheck,
        displayField:'despacchk',
        valueField  : 'codpacchk',
        typeAhead   : true,
        width       : 110,
        mode        : 'local',
        triggerAction: 'all',
        anchor      :'98%',
        editable    : false,
        forceSelection : true,
        hideTrigger : false,
        lazyRender : true,
        selectOnFocus:true,
        onSelect    : function(record){
                            selPack=true;
                            cbopackcheck.setValue(record.data.despacchk);
                            cbopackcheck.collapse();
                            vcodpacchk=record.data.codpacchk;
                            vdespacchk=record.data.despacchk;
                        }
    });

    var cboPuestos = new Ext.form.ComboBox({
        fieldLabel  : 'Puesto',
        id          : 'cbo_puestos',
	store       : ds_puestos,
        displayField:'despue',
        width       : 130,
        valueField  : 'codpue',
        typeAhead   : true,
        mode        : 'local',
        triggerAction: 'all',
        anchor      :'98%',
        editable    : false,
        forceSelection : true,
        hideTrigger : false,
        lazyRender : true,
        selectOnFocus:true,
        onSelect    : function(record){
                    selPuesto=true;
                    cboPuestos.setValue(record.data.despue);
                    cboPuestos.collapse();
                    vcodpue=record.data.codpue;
                    vdespue=record.data.despue;
                }
    });

var cm_solpersonas = new Ext.grid.ColumnModel(
        [{
            header: 'N°',
            readonly: true,
            dataIndex: 'item',
            hidden: false,
            width: 30
        },{
            id : 'codper',
            header: 'codper',
            readonly: true,
            dataIndex: 'codper',
            hidden: true
        },
        {
            header: 'Apellido Paterno',
            readonly: true,
            dataIndex: 'apepatper',
            hidden: false
        },
        {
            header: 'Apellido Materno',
            readonly: true,
            dataIndex: 'apematper',
            hidden: false
        },
        {
            header: 'Nombres',
            readonly: true,
            dataIndex: 'nomper',
            hidden: false
        },
        {
            header: 'Documento',
            readonly: true,
            dataIndex: 'destipdoc',
            hidden: false
        },
        {
            header: 'Número',
            readonly: true,
            dataIndex: 'numdocper',
            hidden: false
        },
        {
            header: 'codpue',
            readonly: true,
            dataIndex: 'codpue',
            hidden: true
        },
        {
            header: 'Puesto',
            readonly: true,
            dataIndex: 'despue',
            hidden: false
        },
        {
            header: 'codpacchk',
            readonly: true,
            dataIndex: 'codpacchk',
            hidden: true
        },
        {
            header: 'Check Pack',
            readonly: true,
            dataIndex: 'despacchk',
            hidden: false
        }
        ]
    );

    var newPersona = Ext.data.Record.create([
        {name: 'item', type: 'int'},
        {name: 'codper', type: 'int'},
        {name: 'apepatper', type: 'string'},
        {name: 'apematper', type: 'string'},
        {name: 'nomper', type: 'string'},
        {name: 'destipdoc', type: 'string'},
        {name: 'numdocper', type: 'string'},
        {name: 'codpue', type: 'int'},
        {name: 'despue', type: 'string'},
        {name: 'codpacchk', type: 'int'},
        {name: 'despacchk', type: 'string'}
    ]);


    var stdetsolper = new Ext.data.Store({
            reader	:   new Ext.data.JsonReader(newPersona),
            proxy	:   new Ext.data.HttpProxy({url: "DB/solicitud.php?n=100"}),
            sortInfo	:   {field:'item', direction:'ASC'},
            autoLoad    :   false
    });

    var grd_personas = new Ext.grid.EditorGridPanel({
        id      : 'grd_personas',
        store   : stdetsolper,
        title   : 'Personas',
        cm      : cm_solpersonas,
        width   : 350,
        anchor  : '100%',
        height  : 300,
        frame   : true,
        clicksToEdit:1,
	layout    : 'fit',
	autoScroll: true,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
        tbar    :['Persona : ',cboSolBuscaPersona,' Puesto : ',cboPuestos,' Check Pack : ',cbopackcheck,'-',
                {
                    xtype   : 'tbbutton',
                    cls     : 'x-btn-icon',
                    icon    : 'files/images_app/plus.png',
                    handler : function(){
                            duplicado=false;
                            var cant_registros = stdetsolper.getCount();
                            for (var i = 0; i < cant_registros; i++) {
                                var record = grd_personas.getStore().getAt(i);
                                var codpersona = record.data.codper;
                                //console.log(codpersona);
                                if (vcodper == codpersona) {
                                    duplicado=true;
                                    break;
                                }
                            }
                            if(duplicado==false){
                                if(selPersona==true && selPuesto==true && selPack==true){
                                    var p = new newPersona({
                                       item         : stdetsolper.getCount() + 1,
                                       codper       : vcodper,
                                       apepatper    : vapepatper,
                                       apematper    : vapematper,
                                       nomper       : vnomper,
                                       destipdoc    : vdestipdoc,
                                       numdocper    : vnumdocper,
                                       codpue       : vcodpue,
                                       despue       : vdespue,
                                       codpacchk    : vcodpacchk,
                                       despacchk    : vdespacchk
                                    });
                                    //alert(p.get('item'));
                                    stdetsolper.insert(stdetsolper.getCount(), p);
                                    grd_personas.getView().refresh();
                                    stdetsolper.reload();
                                    //restablece campos para agregar mas personas
                                    cboSolBuscaPersona.clearValue();
                                    selPersona=false;
                                    cboPuestos.clearValue();
                                    selPuesto=false;
                                    cbopackcheck.clearValue();
                                    selPack=false;
                                    cboSolBuscaPersona.focus();
                                    vcodper=-1;
                                }else{
                                    Ext.Msg.show({title: 'Error de Ingreso',
                                                    msg: 'Debe seleccionar los datos necesarios antes de agregar una persona a la solicitud',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.ERROR});
                                }
                            }else{
                                Ext.Msg.show({title: 'Error de Ingreso',
                                                    msg: 'La persona que intenta agregar ya esta en la lista',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.INFO});
                            }
                         } //fin de funcion
                },
                {
                    xtype   : 'tbbutton',
                    cls     : 'x-btn-icon',
                    icon    : 'files/images_app/minus.png',
                    handler : function handleDelete() {
                                    var selectedKeys = grd_personas.selModel.selections.keys;
                                    if(selectedKeys.length > 0) {
                                        Ext.Msg.confirm('ALERTA!','Realmente desea eliminar el registro?', function borraPersona(btn){
                                        if (btn == 'yes') {
                                            //alert(btn);
                                            var selectedRow = grd_personas.getSelectionModel().getSelected();
                                            if (selectedRow) stdetsolper.remove(selectedRow);
                                            var cant_registros = stdetsolper.getCount();
                                                //alert(cant_registros);
                                                for (var i = 0; i < cant_registros; i++) {
                                                    var record = grd_personas.getStore().getAt(i);
                                                    record.beginEdit();
                                                    record.data.item = i+1;
                                                    record.endEdit();
                                                    record.commit();
                                                }
                                        }
                                    });
                                    }else{
                                        Ext.Msg.alert('Recuerde!','Seleccione un registro para eliminar');
                                    }
                                }
                }
        ]

    });
    stdetsolper.load();

var btn_grabasol = new Ext.Button({
    text : 'Grabar Solicitud',
    cls  : 'x-btn-text-icon',
    icon : 'files/images_app/disk.png',
    handler : function(){
        var cant_registros = stdetsolper.getCount();
        var array_detalle = [];
                if(cant_registros>0){
                    if(frmDatosSolicitud.getForm().isValid()){
                        Ext.Msg.confirm('Confirmación','¿Confirma que desea grabar la solicitud?', function GrabaSolicitud(btn){
                            if (btn == 'yes') {
                            //arma información del detalle
                                for (var i = 0; i < cant_registros; i++) {
                                    var record = grd_personas.getStore().getAt(i);
                                    var xcodper = record.data.codper;
                                    var xcodpue = record.data.codpue;
                                    var xcodpacchk = record.data.codpacchk;
                                    var item = xcodper + '$$' + xcodpue + '$$' + xcodpacchk;
                                    array_detalle.push(item);
                                }
                                //arma datos de la cabecera
                                var codcli = cbo_codcli.getValue();
                                var fecvensol = dp_fecvensol.getValue();
                                var tfecvensol = tp_horaentrega.getValue();
                                var obssol = txt_obssol.getValue();
                                var detalle = array_detalle.join('|,|');
                                Ext.Ajax.request({
                                    url : 'DB/solicitud.php',
                                    params : {
                                        n   : 3,
                                        codcli : codcli,
                                        fecvensol : Ext.util.Format.trim(fecvensol.format('Y-m-d'))+' '+Ext.util.Format.trim(tfecvensol)+':00',
                                        obssol : Ext.util.Format.trim(obssol),
                                        detalle : detalle
                                    },
                                    callback : function(opt,success,response){
                                        if (success) {
                                                var responseData = Ext.util.JSON.decode(response.responseText);
                                                var error = responseData.respuesta.error;
                                                var mensaje = responseData.respuesta.mensaje;
                                                var cod = responseData.respuesta.codsol;
                                                if (error==0){
                                                    frmDatosSolicitud.getForm().reset();
                                                    stdetsolper.removeAll();
                                                    cboSolBuscaPersona.clearValue();
                                                    selPersona=false;
                                                    cboPuestos.clearValue();
                                                    selPuesto=false;
                                                    cbopackcheck.clearValue();
                                                    selPack=false;
                                                }
                                                Ext.Msg.show({title: 'Aviso',
                                                         msg: mensaje+' '+cod,
                                                         buttons: Ext.MessageBox.OK,
                                                         icon: Ext.MessageBox.INFO
                                                     });
                                            } else {
                                               Ext.Msg.show({title: 'Error',
                                                         msg: 'Sin respuesta del servidor, comuniquese con Sistemas',
                                                         buttons: Ext.MessageBox.OK,
                                                         icon: Ext.MessageBox.ERROR
                                                     });
                                            }
                                    }
                                });
                            }
                        });
                    }
                    else{
                        Ext.Msg.alert('Advertencia!','Faltan Datos obligatorios de la solicitud');
                    }
                }else{
                    Ext.Msg.alert('Advertencia!','No se han agregado personas en esta solicitud');
                }
        }
});

var btn_cancelasol = new Ext.Button({
    text:'Cancelar',
    cls  : 'x-btn-text-icon',
    icon  : 'files/images_app/delete.gif',
    handler : function(){
        Ext.Msg.confirm('ALERTA!','¿Desea cancelar el registro de la solicitud?', function borraPersona(btn){
                        if (btn == 'yes') {
                            frmDatosSolicitud.getForm().reset();
                            stdetsolper.removeAll();
                            cboSolBuscaPersona.clearValue();
                            selPersona=false;
                            cboPuestos.clearValue();
                            selPuesto=false;
                            cbopackcheck.clearValue();
                            selPack=false;
                                }
                        });

    }
});

    var frmSolBuscaPersona = new Ext.FormPanel({
        id          : 'frmSolBuscaPersona',
        autoWidth   : false,
        autoHeight  : true,
        border      : false,
        style       : 'padding:5px 5px 5px 5px',
        items       : [grd_personas]
    });

    var ds_solcli = new Ext.data.Store({
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

    var dp_fecvensol=new Ext.form.DateField({
        fieldLabel  :'Fecha Vcto.',
        id          :'dp_fecvensol',
        name        :'fecvensol',
        width       :110,
        format      :'d/m/Y',
        anchor      :'98%',
        readOnly    :false,
        listeners   :{
            select : function (ele,newvalue,oldvalue){
                            var fecha = new Date();
                            var nuevafecha = newvalue;
                            if(fecha != '')
                                if(nuevafecha.format("d/m/Y")<fecha.format("d/m/Y")){
                                    //alert(fecha.format("d/m/Y"));
                                    //alert(nuevafecha.format("d/m/Y"));
                                    dp_fecvensol.setValue('');
                                    dp_fecvensol.focus();
                                    Ext.Msg.show({title: 'Error de Ingreso',
                                            msg: 'Recuerde que la fecha de vencimiento debe ser mayor o igual a la fecha actual',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO});

                                }
                        }
                    },
        renderer    :function(value) {return value ? new Date(value).dateFormat('Y-m-d') : '';},
        allowBlank  :false
    });

var txt_codsol = new Ext.form.TextField({
    id          : 'txt_solcodsol',
    fieldLabel	: 'N° Solicitud',
    readOnly	: true,
    disabled    : true,
    name	: 'codsol',
    anchor	: '98%'
});

var txt_obssol = new Ext.form.TextField({
    id          : 'txt_obssol',
    fieldLabel	: 'Observación',
    name	: 'obssol',
    allowBlank  : true,
    anchor	: '100%',
    plugins     : new Ext.ux.Uppercase()
});

var cbo_codcli = new Ext.form.ComboBox({
        id              : 'cbo_solcodcli',
        name            : 'codcli',
        fieldLabel      : 'Cliente',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        store           : ds_solcli,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'nomcli',
        valueField      : 'codcli',
        anchor          : '100%'
})

var tp_horaentrega = new Ext.form.TimeField({
            id          : 'tp_fecvensol',
            fieldLabel	: 'Hora',
            name	: 'hfecvensol',
            allowBlank  : false,
            format      : 'H:i',
            increment   : 30,
            anchor	: '98%'
});

    var frmDatosSolicitud = new Ext.FormPanel({
        id          : 'frmDatosSolicitud',
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
                                items		: [txt_codsol]
                                },{
                                columnWidth	: .70,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 45,
                                defaultType	: 'textfield',
                                items		: [cbo_codcli]
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
                                items		: [dp_fecvensol]
                                },{
                                columnWidth	: .15,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 30,
                                defaultType	: 'timefield',
                                items		: [tp_horaentrega]
                                },{
                                columnWidth	: .60,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 70,
                                defaultType	: 'textfield',
                                items		: [txt_obssol]
                                }]
                        }],
            bbar    :   [{xtype: 'tbfill'},btn_grabasol,btn_cancelasol]
    })


    var win_reg_solicitud = Ext.getCmp('frm_reg_solicitud');
    if (!win_reg_solicitud){
        new Ext.Window({
            title	: 'Registro de Solicitudes',
            id          : 'frm_reg_solicitud',
            iconCls     : 'regsol',
            layout	: 'fit',
            width	: 750,
            height	: 455,
            resizable   : false,
            closable    : true,
            items       : [frmDatosSolicitud,frmSolBuscaPersona]
        }).show();
    }else{
          win_reg_solicitud.show();
    }
}

