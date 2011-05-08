
//Formulario
function frm_reg_persona(){
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


    /********
     Stores
    ********/

    var ds_per = new Ext.data.Store({
                    proxy: new Ext.data.HttpProxy({
                        url: 'DB/persona.php?n=2',
                        method : 'GET'
                    }),
                    reader: new Ext.data.JsonReader({
                        root            : 'busquedaper',
                        totalProperty	: 'totalCount',
                        id              : 'codper'
                        },
                        [{name: 'codper', mapping: 'codper'},
                        {name: 'nomper', mapping: 'nomper'},
                        {name: 'apepatper', mapping: 'apepatper'},
                        {name: 'apematper', mapping: 'apematper'},
                        {name: 'codtipdoc', mapping: 'codtipdoc'},
                        {name: 'numdocper', mapping: 'numdocper'},
                        {name: 'estper',  mapping: 'estper'}
                        ])
                });

    var dstipdocper = new Ext.data.Store({
                            reader  : new Ext.data.JsonReader({
                                            fields  : ['codtipdoc', 'destipdoc'],
                                            root    : 'tipdocper',
                                            id      : 'codtipdoc'
                                    }),
                            proxy: new Ext.data.HttpProxy({
                                            url: 'DB/persona.php?n=1'
                                    }),
                            autoLoad: false
                        });

    var ds_codest = new Ext.data.SimpleStore({
                        fields: ['codest', 'desest'],
                        data : [['1','Activo'],['0','Inactivo']]
                    });


    var ds_listadoper = new Ext.data.Store({
                            id      : 'ds_listadoper',
                            proxy   : new Ext.data.HttpProxy({
                                            url: 'DB/persona.php',
                                            method: 'GET'
                                        }),
                            baseParams  : {n:'0'},
                            reader  : new Ext.data.JsonReader({
                                root : 'listadoper',
                                totalProperty : 'total',
                                id  : 'codper'
                            },[
                                {name:'codper',mapping:'codper'},
                                {name: 'nomper', mapping: 'nomper'},
                                {name: 'apepatper', mapping: 'apepatper'},
                                {name: 'apematper', mapping: 'apematper'},
                                {name: 'codtipdoc', mapping: 'codtipdoc'},
                                {name: 'numdocper', mapping: 'numdocper'},
                                {name: 'estper',  mapping: 'estper'}
                            ])
                        });

    var cm_personas = new Ext.grid.ColumnModel(
        [{
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
            //readonly: true,
            dataIndex: 'nomper',
            hidden: false
        },
        {
            header: 'Documento',
            readonly: true,
            dataIndex: 'codtipdoc',
            hidden: false,
            renderer: function tipdocname(val){
                        return dstipdocper.queryBy(function(rec){
				return rec.data.codtipdoc == val;
			}).itemAt(0).data.destipdoc;
                      }
        },
        {
            header: 'Número',
            readonly: true,
            dataIndex: 'numdocper',
            hidden: false
        },
        {
            header: 'Estado',
            readonly: true,
            dataIndex: 'estper',
            hidden: false,
            renderer: function estadoper(val){
                        return ds_codest.queryBy(function(rec){
				return rec.data.codest == val;
			}).itemAt(0).data.desest;
                      }
        }
        ]
    );

    /*************
       Templates
     ************/

    var tpl_per = new Ext.XTemplate(
        '<tpl for="."><div class="search-item1">',
        '<h3>{numdocper}</h3>',
        '{nomper} {apepatper} {apematper}',
        '</div></tpl>'
        );

    /*********
      Widgets
     ********/

    var egrd_personas = new Ext.grid.EditorGridPanel({
        id : 'egrd_personas',
        store : ds_listadoper,
        width : 526,
        height : 240,
        cm : cm_personas,
        enableColLock:false,
        clicksToEdit:1,
        frame : false,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
        listeners:{
            rowdblclick: function(grid, rowIndex, e){
                                Ext.getCmp('txt_codper').setValue(ds_listadoper.getAt(rowIndex).data.codper);
                                Ext.getCmp('txt_nomper').setValue(ds_listadoper.getAt(rowIndex).data.nomper);
                                Ext.getCmp('txt_apepatper').setValue(ds_listadoper.getAt(rowIndex).data.apepatper);
                                Ext.getCmp('txt_apematper').setValue(ds_listadoper.getAt(rowIndex).data.apematper);
                                Ext.getCmp('cbo_codtipdoc').setValue(ds_listadoper.getAt(rowIndex).data.codtipdoc);
                                Ext.getCmp('cboNumdocper').setValue(ds_listadoper.getAt(rowIndex).data.numdocper);
                                Ext.getCmp('cbo_estper').setValue(ds_listadoper.getAt(rowIndex).data.estper);
                                cboBuscaPersona.disable();
                                desbloqueaPersona();
                        }
                },
        bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: ds_listadoper,
                displayInfo: true
            })
    });

    var cboBuscaPersona = new Ext.form.ComboBox({
        id		: 'cboBuscaPersona',
        store		: ds_per,
        typeAhead       : false,
        labelWidth      : 150,
        fieldLabel	: 'DNI o Nombre',
        loadingText	: 'Buscando...',
        anchor		: '99%',
        pageSize	: 10,
        hideTrigger     : true,
        tpl		: tpl_per,
        itemSelector	: 'div.search-item1',
        onSelect	: function(record){
                                Ext.getCmp("frmResultadoPersona").getForm().loadRecord(record);
                                cboBuscaPersona.disable();
                                cboBuscaPersona.setValue(record.data.numdocper);
                                cboBuscaPersona.collapse();
                                desbloqueaPersona();
                        }
    });

//Boton para nuevas busquedas
    var btnNuevaBus = new Ext.Button({
                        width       : 120,
                        text        : 'Nueva Busqueda',
                        cls         : 'x-btn-text-icon',
                        icon        : 'files/images_app/magnifier-left.png',
                        handler     : inicializaPersona,
                        disabled    : false,
                        tooltip     : 'Prepara el formulario para nueva busqueda'
    });

//Boton para cancelar
    var btnCancelar= new Ext.Button({
                        text		: 'Cancelar',
                        id          : 'btn_cancelapersona',
                        handler     : inicializaPersona,
                        disabled	: true,
                        cls         : 'x-btn-text-icon',
                        icon        : 'files/images_app/delete.gif',
                        tooltip 	: 'Cancela Edición / Grabación'
    });

//Boton para grabar nuevo o editado
    var btnGrabar= new Ext.Button({
                    text		: 'Grabar',
                    id			: 'btnGrabarPersona',
                    disabled	: true,
                    hidden		: false,
                    cls         : 'x-btn-text-icon',
                    icon        : 'files/images_app/disk.png',
                    tooltip 	: 'Grabar Datos de la Persona',
                    handler		: function(){
                        var vcodper= Ext.util.Format.trim(Ext.getCmp('txt_codper').getValue());
                        var vnomper= Ext.util.Format.trim(Ext.getCmp('txt_nomper').getValue());
                        var vapepatper= Ext.util.Format.trim(Ext.getCmp('txt_apepatper').getValue());
                        var vapematper= Ext.util.Format.trim(Ext.getCmp('txt_apematper').getValue());
                        var vcodtipdoc= Ext.getCmp('cbo_codtipdoc').getValue();
                        var vnumdocper = Ext.util.Format.trim(Ext.getCmp('cboNumdocper').getValue());
                        var vestper = Ext.getCmp('cbo_estper').getValue();

                        if(frmResultadoPersona.getForm().isValid()){
                                //alert(regPersona);
                                if(regPersona!=true){
                                    Ext.Ajax.request({
                                        url		: 'DB/persona.php',
                                        params	: {
                                            n		: 3,
                                            codper  : vcodper,
                                            nomper  : vnomper,
                                            apepatper : vapepatper,
                                            apematper: vapematper,
                                            codtipdoc : vcodtipdoc,
                                            numdocper: vnumdocper,
                                            estper   : vestper
                                        },
                                        callback : function(opt,success,response){
                                            if (success) {
                                                var responseData = Ext.util.JSON.decode(response.responseText);
                                                var error = responseData.respuesta.error;
                                                var mensaje = responseData.respuesta.mensaje;
                                                if (error==0){
                                                    btnNuevaBus.enable();
                                                    btnGrabar.disable();
                                                    btnCancelar.disable();
                                                    ds_listadoper.reload();
                                                }
                                                Ext.Msg.show({title: 'Aviso',
                                                         msg: mensaje,
                                                         buttons: Ext.MessageBox.OK,
                                                         icon: Ext.MessageBox.INFO
                                                     });
                                            } else {
                                               Ext.Msg.show({title: 'Error',
                                                         msg: 'Sin respuesta del servidor, comuniquese con Sistemas',
                                                         buttons: Ext.MessageBox.OK,
                                                         icon: Ext.MessageBox.INFO
                                                     });
                                            }
                                        }
                                    }
                                    );
                                }
                                else{
                                    Ext.Ajax.request({
                                        url	: 'DB/persona.php',
                                        params	: {
                                            n       : 4,
                                            codper  : vcodper,
                                            nomper  : vnomper,
                                            apepatper : vapepatper,
                                            apematper: vapematper,
                                            codtipdoc : vcodtipdoc,
                                            numdocper: vnumdocper,
                                            estper   : vestper
                                        },
                                        callback : function(opt,success,response){
                                            if (success) {
                                                var responseData = Ext.util.JSON.decode(response.responseText);
                                                var error = responseData.respuesta.error;
                                                var mensaje = responseData.respuesta.mensaje;
                                                var cod = responseData.respuesta.codper;
                                                if (error==0){
                                                    codper = vcodper;
                                                    nomper = vnomper;
                                                    apepatper= vapepatper;
                                                    apematper= vapematper;
                                                    codtipdoc= vcodtipdoc;
                                                    numdocper= vnumdocper;
                                                    estper= vestper;
                                                    btnNuevaBus.enable();
                                                    btnGrabar.disable();
                                                    btnCancelar.disable();
                                                    Ext.getCmp('txt_codper').setValue(cod);
                                                    bloqueaPersona();
                                                    ds_listadoper.reload();
                                                }
                                                Ext.Msg.show({title: 'Aviso',
                                                         msg: mensaje,
                                                         buttons: Ext.MessageBox.OK,
                                                         icon: Ext.MessageBox.INFO
                                                     });
                                            } else {
                                               Ext.Msg.show({title: 'Error',
                                                         msg: 'Sin respuesta del servidor, comuniquese con Sistemas',
                                                         buttons: Ext.MessageBox.OK,
                                                         icon: Ext.MessageBox.INFO
                                                     });
                                            }
                                        }
                                    });
                                }
                        }else Ext.Msg.show({title: 'Aviso',
                                            msg: 'Formulario no valido, Ingrese los datos obligatorios que se resaltan en rojo',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.ERROR});
                    }
                });

    var frmBuscaPersona = new Ext.FormPanel({
        id          : 'frmBuscaPersona',
        autoWidth   : false,
        autoHeight  : true,
        border      : false,
        style       : 'padding:5px 5px 5px 5px',
        items       : [{
                        layout:'column',
                        border:false,
                        frame:true,
                        items:[{
                            columnWidth	: .75,
                            layout	: 'form',
                            border	: false,
                            labelAlign	: 'left',
                            items	: [cboBuscaPersona]
                        },{
                            columnWidth	: .25,
                            layout	: 'form',
                            border	: false,
                            labelAlign	: 'left',
                            items	: [btnNuevaBus]
                        }]
                      }]
    });

    var frmListaPersonas = new Ext.FormPanel({
        id          : 'frmListaPersonas',
        border      : false,
        autoWidth   : false,
        autoHeight  : false,
        style       : 'padding:5px 5px 5px 5px',
        items       : [{
                        layout	: 'column',
                        border	: false,
                        frame : false,
                        items   :egrd_personas
        }]
    });

var txt_codper = new Ext.form.Hidden({
        id          : 'txt_codper',
        fieldLabel  : 'C&oacute;digo',
        readOnly    : true,
        disabled    : true,
        name        : 'codper'
});

var txt_nomper = new Ext.form.TextField({
        id          :'txt_nomper',
        fieldLabel  : 'Nombres',
        readOnly    : false,
        disabled    : true,
        allowBlank  : false,
        listeners   : {keyup:cambioPersona},
        name        : 'nomper',
        anchor      : '-10',
        plugins     : new Ext.ux.Uppercase()
});

var txt_apepatper = new Ext.form.TextField({
        id          :'txt_apepatper',
        fieldLabel  : 'Ape. Paterno',
        readOnly    :false,
        disabled    : true,
        allowBlank  : false,
        listeners   : {keyup:cambioPersona},
        name        : 'apepatper',
        anchor      : '100%',
        plugins     : new Ext.ux.Uppercase()
});

var txt_apematper = new Ext.form.TextField({
        id          :'txt_apematper',
        fieldLabel  : 'Ape. Materno',
        readOnly    :false,
        disabled    : true,
        allowBlank  : false,
        listeners   : {keyup:cambioPersona},
        name        : 'apematper',
        anchor      : '-10',
        plugins     : new Ext.ux.Uppercase()
});

//var txt_numdocper = new Ext.form.TextField({
//        id          :'txt_numdocper',
//        fieldLabel  : 'Num. Doc.',
//        readOnly    :false,
//        disabled    : true,
//        allowBlank  : false,
//        listeners   : {keyup:cambioPersona},
//        name        : 'numdocper',
//        anchor      : '99%'
//});

var cbo_codtipdoc = new Ext.form.ComboBox({
                xtype       : 'combo',
                id          : 'cbo_codtipdoc',
                name        : 'codtipdoc',
                fieldLabel  : 'Tip. Doc.',
                mode        : 'remote',
                disabled    : true,
                allowBlank  : false,
                store       : dstipdocper,
                editable    : false,
                triggerAction: 'all',
                displayField : 'destipdoc',
                valueField  : 'codtipdoc',
                anchor      : '-10',
                value       : '1',
                listeners   :{
                select      : function (field, newValue, oldValue) {
                                if (newValue != oldValue) {
                                    Ext.getCmp('btnGrabarPersona').enable();
                                }
                            }
                }
});

var cboNumdocper = new Ext.form.ComboBox({
        id		: 'cboNumdocper',
        store		: ds_per,
        typeAhead       : false,
        labelWidth      : 150,
        fieldLabel	: 'Num. Doc.',
        loadingText	: 'Buscando...',
        anchor		: '100%',
        pageSize	: 10,
        disabled        : true,
        hideTrigger     : true,
        tpl		: tpl_per,
        itemSelector	: 'div.search-item'/*,
        onSelect	: function(record){
                                Ext.getCmp("frmResultadoPersona").getForm().loadRecord(record);
                                cboBuscaPersona.disable();
                                cboBuscaPersona.setValue(record.data.numdocper);
                                cboBuscaPersona.collapse();
                                desbloqueaPersona();
                        }*/
    });

var cbo_estper = new Ext.form.ComboBox({
                xtype       : 'combo',
                id          : 'cbo_estper',
                name        : 'estper',
                fieldLabel  : 'Estado',
                mode        : 'local',
                disabled    : true,
                allowBlank  : false,
                store       : ds_codest,
                editable    : false,
                triggerAction: 'all',
                displayField : 'desest',
                valueField  : 'codest',
                anchor      : '100%',
                value       : '1',
                listeners   :{
                    select: function (field, newValue, oldValue) {
                                if (newValue != oldValue) {
                                    Ext.getCmp('btnGrabarPersona').enable();
                                }
                            }
                }
});

    var frmResultadoPersona = new Ext.FormPanel({
        id		: 'frmResultadoPersona',
        autoWidth	: false,
        autoHeight	: false,
        labelWidth	: 90,
        waitMsgTarget   : true,
        border		: true,
        frame           : true,
        style		: 'padding:0px 5px 5px 5px',
        //Se agregan los items del formulario x filas
        items		: [{
                        layout	: 'column',
                        border	: false,
                        style	: 'padding:0px 0px 0px 0px',
                        items:[txt_codper,{
                                columnWidth	: .30,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 60,
                                defaultType	: 'textfield',
                                items		: [cbo_codtipdoc]
                                },{
                                columnWidth	: .70,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 70,
                                defaultType	: 'textfield',
                                items		: [cboNumdocper]
                                }]
                        },{
                        layout	: 'column',
                        border	: false,
                        style	: 'padding:0px 0px 0px 0px',
                        items:[{
                                columnWidth	: .50,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth 	: 60,
                                defaultType	: 'textfield',
                                items		: [txt_nomper]
                                },{
                                columnWidth	: .50,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth 	: 83,
                                defaultType	: 'textfield',
                                items		: [txt_apepatper]
                                }]
                        },{
                        layout	: 'column',
                        border	: false,
                        style	: 'padding:0px 0px 0px 0px',
                        items:[{
                                columnWidth	: .65,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth 	: 83,
                                defaultType	: 'textfield',
                                items		: [txt_apematper]
                                },/*{
                                columnWidth	: .34,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth 	: 65,
                                defaultType	: 'textfield',
                                items		: [txt_numdocper]
                                },*/{
                                columnWidth	: .35,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth 	: 45,
                                defaultType	: 'textfield',
                                items		: [cbo_estper]
                                }]
                        }],
         bbar        : [btnGrabar,btnCancelar,{
                            xtype: 'tbfill'
                        },{
                            text: 'Nuevo',
                            cls: 'x-btn-text-icon',
                            icon: 'files/images_app/add16.gif',
                            id  : 'btn_nuevopersona',
                            handler : inicializaNewPersona,
                            tooltip 	: 'Registrar nueva persona'
                        }]
    });

    //Aqui se construye la ventana
    var win_reg_persona = Ext.getCmp('frm_reg_persona');
    if (!win_reg_persona){
        dstipdocper.load();
        ds_listadoper.load({params: {start: 0, limit: 15}});
        new Ext.Window({
            title	: 'Registro de Personas',
            id          : 'frm_reg_persona',
            layout	: 'fit',
            iconCls     : 'regper',
            width	: 550,
            height	: 470,
            resizable   : false,
            closable    : true,
            items       : [frmBuscaPersona,frmResultadoPersona,frmListaPersonas]
        }).show();

    }else{
          win_reg_persona.show();
    }
}

//Funciones
function cambioPersona(obj){
    var vnomper= obj.getValue();
    var vapepatper = obj.getValue();
    var vapematper = obj.getValue();
    var vcodtipdoc = obj.getValue();
    var vnumdocper = obj.getValue();
    var vestper = obj.getValue();
    if (nomper != vnomper || apepatper!= vapepatper || apematper!= vapematper || codtipdoc!= vcodtipdoc || numdocper != vnumdocper || estper!= vestper) {
        Ext.getCmp('btnGrabarPersona').enable();
        Ext.getCmp('btn_cancelapersona').enable();
    }else{
        Ext.getCmp('btnGrabarPersona').disable();
    }
}

function inicializaPersona(){
    codper='';
    nomper='';
    apepatper='';
    apematper='';
    codtipdoc='';
    numdocper='';
    estper='';
    Ext.getCmp('cboBuscaPersona').setValue('');
    Ext.getCmp('cboBuscaPersona').initComponent();
    Ext.getCmp('cboBuscaPersona').enable();
    Ext.getCmp('cboBuscaPersona').focus();
    regPersona=false;
    Ext.getCmp('frmResultadoPersona').getForm().reset();
    Ext.getCmp('btn_cancelapersona').disable();
    respuesta=-1;
    bloqueaPersona();
}

function inicializaNewPersona(){
    //Limpia Variables
    codper='';
    nomper='';
    apepatper='';
    apematper='';
    codtipdoc='';
    numdocper='';
    estper='';
    //Limpia el Combo
    Ext.getCmp('cboBuscaPersona').setValue('');
    Ext.getCmp('cboBuscaPersona').initComponent();
    Ext.getCmp('cboBuscaPersona').disable();
    desbloqueaPersona();
    //Activa variable que indica que se esta registrando una nueva persona (btnNuevo)
    regPersona=true;
    respuesta=-1;
    Ext.getCmp("frmResultadoPersona").getForm().reset();
    //Enfoca nombre
    Ext.getCmp('cbo_codtipdoc').focus(true);
}

function bloqueaPersona(){
    Ext.getCmp('txt_codper').disable();
    Ext.getCmp('txt_nomper').disable();
    Ext.getCmp('txt_apepatper').disable();
    Ext.getCmp('txt_apematper').disable();
    Ext.getCmp('cbo_codtipdoc').disable();
    Ext.getCmp('cboNumdocper').disable();
    Ext.getCmp('cbo_estper').disable();
    Ext.getCmp('btnGrabarPersona').disable();
}

function desbloqueaPersona(){
    Ext.getCmp('txt_codper').enable();
    Ext.getCmp('txt_nomper').enable();
    Ext.getCmp('txt_apepatper').enable();
    Ext.getCmp('txt_apematper').enable();
    Ext.getCmp('cbo_codtipdoc').enable();
    Ext.getCmp('cboNumdocper').enable();
    Ext.getCmp('cbo_estper').enable();
    Ext.getCmp('btn_cancelapersona').enable();
}


