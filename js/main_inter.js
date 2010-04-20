Ext.apply(Ext.form.VTypes, {
    daterange : function(val, field) {
        var date = field.parseDate(val);

        if(!date){
            return;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    },

    password : function(val, field) {
        if (field.initialPassField) {
            var pwd = Ext.getCmp(field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },

    passwordText : 'Las contraseñas no coinciden'
});


/****************************************
 * Inicio de formulario frm_reg_persona *
 ****************************************/

var codper='',nomper='',apepatper='',apematper='',codtipdoc='',numdocper='',estper='';
var regPersona;


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
        '<tpl for="."><div class="search-item">',
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
                                Ext.getCmp('txt_numdocper').setValue(ds_listadoper.getAt(rowIndex).data.numdocper);
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
        itemSelector	: 'div.search-item',
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
                        var vnumdocper = Ext.util.Format.trim(Ext.getCmp('txt_numdocper').getValue());
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

var txt_codper = new Ext.form.TextField({
        id          :'txt_codper',
        fieldLabel  : 'C&oacute;digo',
        readOnly    : true,
        disabled    : true,
        name        : 'codper',
        anchor      : '99%'
});

var txt_nomper = new Ext.form.TextField({
        id          :'txt_nomper',
        fieldLabel  : 'Nombres',
        readOnly    : false,
        disabled    : true,
        allowBlank  : false,
        listeners   : {keyup:cambioPersona},
        name        : 'nomper',
        anchor      : '100%'
});

var txt_apepatper = new Ext.form.TextField({
        id          :'txt_apepatper',
        fieldLabel  : 'Ape. Paterno',
        readOnly    :false,
        disabled    : true,
        allowBlank  : false,
        listeners   : {keyup:cambioPersona},
        name        : 'apepatper',
        anchor      : '99%'
});

var txt_apematper = new Ext.form.TextField({
        id          :'txt_apematper',
        fieldLabel  : 'Ape. Materno',
        readOnly    :false,
        disabled    : true,
        allowBlank  : false,
        listeners   : {keyup:cambioPersona},
        name        : 'apematper',
        anchor      : '100%'
});

var txt_numdocper = new Ext.form.TextField({
        id          :'txt_numdocper',
        fieldLabel  : 'Num. Doc.',
        readOnly    :false,
        disabled    : true,
        allowBlank  : false,
        listeners   : {keyup:cambioPersona},
        name        : 'numdocper',
        anchor      : '99%'
});

var cbo_codtipdoc = new Ext.form.ComboBox({
                xtype       : 'combo',
                id          : 'cbo_codtipdoc',
                name        : 'codtipdoc',
                fieldLabel  : 'Tip. Doc.',
                mode        : 'local',
                disabled    : true,
                allowBlank  : false,
                store       : dstipdocper,
                editable    : false,
                triggerAction: 'all',
                displayField : 'destipdoc',
                valueField  : 'codtipdoc',
                anchor      : '99%',
                listeners   :{
                select      : function (field, newValue, oldValue) {
                                if (newValue != oldValue) {
                                    Ext.getCmp('btnGrabarPersona').enable();
                                }
                            }
                }
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
                        items:[{
                                columnWidth	: .25,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 42,
                                defaultType	: 'textfield',
                                items		: [txt_codper]
                                },{
                                columnWidth	: .75,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 50,
                                defaultType	: 'textfield',
                                items		: [txt_nomper]
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
                                labelWidth 	: 80,
                                defaultType	: 'textfield',
                                items		: [txt_apepatper]
                                },{
                                columnWidth	: .50,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth 	: 83,
                                defaultType	: 'textfield',
                                items		: [txt_apematper]
                                }]
                        },{
                        layout	: 'column',
                        border	: false,
                        style	: 'padding:0px 0px 0px 0px',
                        items:[{
                                columnWidth	: .33,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth 	: 60,
                                defaultType	: 'textfield',
                                items		: [cbo_codtipdoc]
                                },{
                                columnWidth	: .34,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth 	: 65,
                                defaultType	: 'textfield',
                                items		: [txt_numdocper]
                                },{
                                columnWidth	: .33,
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
    Ext.getCmp('txt_nomper').focus(true);
}

function bloqueaPersona(){
    Ext.getCmp('txt_codper').disable();
    Ext.getCmp('txt_nomper').disable();
    Ext.getCmp('txt_apepatper').disable();
    Ext.getCmp('txt_apematper').disable();
    Ext.getCmp('cbo_codtipdoc').disable();
    Ext.getCmp('txt_numdocper').disable();
    Ext.getCmp('cbo_estper').disable();
    Ext.getCmp('btnGrabarPersona').disable();
}

function desbloqueaPersona(){
    Ext.getCmp('txt_codper').enable();
    Ext.getCmp('txt_nomper').enable();
    Ext.getCmp('txt_apepatper').enable();
    Ext.getCmp('txt_apematper').enable();
    Ext.getCmp('cbo_codtipdoc').enable();
    Ext.getCmp('txt_numdocper').enable();
    Ext.getCmp('cbo_estper').enable();
    Ext.getCmp('btn_cancelapersona').enable();
}

/****************************************
 * Fin de formulario frm_reg_persona *
 ****************************************/

/****************************************
 * Inicio de formulario frm_reg_cliente *
 ****************************************/

//Variables
var codcli='',nomcli='',ruccli='',dircli='',telcli='',nomconcli='',telconcli='';
var regCliente;

//Formulario
function frm_reg_cliente(){
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

    var ds_cli = new Ext.data.Store({
                    proxy: new Ext.data.HttpProxy({
                        url: 'DB/clientes.php?n=2',
                        method : 'GET'
                    }),
                    reader: new Ext.data.JsonReader({
                        root            : 'busquedacli',
                        totalProperty	: 'total',
                        id              : 'codcli'
                        },
                        [{name: 'codcli', mapping: 'codcli'},
                        {name: 'codestcli', mapping: 'codestcli'},
                        {name: 'codtipcli', mapping: 'codtipcli'},
                        {name: 'nomcli', mapping: 'nomcli'},
                        {name: 'ruccli', mapping: 'ruccli'},
                        {name: 'dircli', mapping: 'dircli'},
                        {name: 'telcli',  mapping: 'telcli'}
                        ])
                });

    var ds_estcli = new Ext.data.Store({
                            reader  : new Ext.data.JsonReader({
                                            fields  : ['codestcli', 'desestcli'],
                                            root    : 'estcli',
                                            id      : 'codestcli'
                                    }),
                            proxy: new Ext.data.HttpProxy({
                                            url: 'DB/clientes.php?n=1'
                                    }),
                            autoLoad: false
                        });

    var ds_tipcli = new Ext.data.Store({
                            reader  : new Ext.data.JsonReader({
                                            fields  : ['codtipcli', 'destipcli'],
                                            root    : 'tipcli',
                                            id      : 'codtipcli'
                                    }),
                            proxy: new Ext.data.HttpProxy({
                                            url: 'DB/clientes.php?n=5'
                                    }),
                            autoLoad: false
                        });

    var ds_listadocli = new Ext.data.Store({
                            id      : 'ds_listadocli',
                            proxy   : new Ext.data.HttpProxy({
                                            url: 'DB/clientes.php',
                                            method: 'GET'
                                        }),
                            baseParams  : {n:'0'},
                            reader  : new Ext.data.JsonReader({
                                root : 'listadocli',
                                totalProperty : 'total',
                                id  : 'codcli'
                            },[{name: 'codcli', mapping: 'codcli'},
                                {name: 'codestcli', mapping: 'codestcli'},
                                {name: 'codtipcli', mapping: 'codtipcli'},
                                {name: 'nomcli', mapping: 'nomcli'},
                                {name: 'ruccli', mapping: 'ruccli'},
                                {name: 'dircli', mapping: 'dircli'},
                                {name: 'telcli',  mapping: 'telcli'}
                                ])
                        });

    var cm_clientes = new Ext.grid.ColumnModel(
        [{
            header: 'codcli',
            readonly: true,
            dataIndex: 'codcli',
            hidden: true
        },
        {
            header: 'Raz. Social o Nombre',
            readonly: true,
            dataIndex: 'nomcli',
            hidden: false
        },
        {
            header: 'RUC',
            readonly: true,
            dataIndex: 'ruccli',
            hidden: false
        },
        {
            header: 'Dirección',
            readonly: true,
            dataIndex: 'dircli',
            hidden: false
        },
        {
            header: 'Teléfono',
            readonly: true,
            dataIndex: 'telcli',
            hidden: false
        },
        {
            header: 'Tipo Cliente',
            readonly: true,
            dataIndex: 'codtipcli',
            hidden: false,
            renderer: function tipcli(val){
                        return ds_tipcli.queryBy(function(rec){
				return rec.data.codtipcli == val;
			}).itemAt(0).data.destipcli;
                      }
        },
        {
            header: 'Estado',
            readonly: true,
            dataIndex: 'codestcli',
            hidden: false,
            renderer: function estadocli(val){
                        return ds_estcli.queryBy(function(rec){
				return rec.data.codestcli == val;
			}).itemAt(0).data.desestcli;
                      }
        }
        ]
    );
    //cm_personas.defaultSortable=false;

    /*************
       Templates
     ************/

    var tpl_cli = new Ext.XTemplate(
        '<tpl for="."><div class="search-item">',
        '<h3>{nomcli}</h3>',
        '{ruccli}',
        '</div></tpl>'
        );

    /*********
      Widgets
     ********/

    var egrd_clientes = new Ext.grid.EditorGridPanel({
        id : 'egrd_clientes',
        store : ds_listadocli,
        width : 526,
        height : 200,
        cm : cm_clientes,
        enableColLock:false,
        clicksToEdit:1,
        frame : false,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
        listeners:{
            rowdblclick: function(grid, rowIndex, e){
                                //alert("doble click!!!");
                                Ext.getCmp('txt_codcli').setValue(ds_listadocli.getAt(rowIndex).data.codcli);
                                Ext.getCmp('txt_nomcli').setValue(ds_listadocli.getAt(rowIndex).data.nomcli);
                                Ext.getCmp('txt_ruccli').setValue(ds_listadocli.getAt(rowIndex).data.ruccli);
                                Ext.getCmp('txt_telcli').setValue(ds_listadocli.getAt(rowIndex).data.telcli);
                                Ext.getCmp('txt_dircli').setValue(ds_listadocli.getAt(rowIndex).data.dircli);
                                Ext.getCmp('cbo_codtipcli').setValue(ds_listadocli.getAt(rowIndex).data.codtipcli);
                                Ext.getCmp('cbo_codestcli').setValue(ds_listadocli.getAt(rowIndex).data.codestcli);
                                cboBuscaCliente.disable();
                                desbloqueaCliente();
                        }
                },
        bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: ds_listadocli,
                displayInfo: true
            })
    });

    var cboBuscaCliente = new Ext.form.ComboBox({
        id		: 'cboBuscaCliente',
        store		: ds_cli,
        typeAhead       : false,
        border          : true,
        fieldLabel	: 'RUC o Raz. Soc.',
        loadingText	: 'Buscando...',
        anchor		: '99%',
        pageSize	: 10,
        hideTrigger     : true,
        tpl		: tpl_cli,
        itemSelector	: 'div.search-item',
        onSelect	: function(record){
                                Ext.getCmp("frmResultadoClientes").getForm().loadRecord(record);
                                cboBuscaCliente.disable();
                                cboBuscaCliente.setValue(record.data.ruccli);
                                cboBuscaCliente.collapse();
                                desbloqueaCliente();
                        }
    });

//Boton para nuevas busquedas
    var btnNuevaBusCli = new Ext.Button({
                        width       : 120,
                        text        : 'Nueva Busqueda',
                        cls         : 'x-btn-text-icon',
                        icon        : 'files/images_app/magnifier-left.png',
                        handler     : inicializaCliente,
                        disabled    : false,
                        tooltip     : 'Prepara el formulario para nueva busqueda'
    });

//Boton para cancelar
    var btnCancelarCli= new Ext.Button({
                        text		: 'Cancelar',
                        id          : 'btn_cancelacliente',
                        handler     : inicializaCliente,
                        disabled	: true,
                        cls         : 'x-btn-text-icon',
                        icon        : 'files/images_app/delete.gif',
                        tooltip 	: 'Cancela Edición / Grabación'
    });

//Boton para grabar nuevo o editado
    var btnGrabarCli= new Ext.Button({
                    text		: 'Grabar',
                    id			: 'btnGrabarCliente',
                    disabled	: true,
                    hidden		: false,
                    cls         : 'x-btn-text-icon',
                    icon        : 'files/images_app/disk.png',
                    tooltip 	: 'Grabar Datos del Cliente',
                    handler		: function(){
                        var vcodcli= Ext.util.Format.trim(Ext.getCmp('txt_codcli').getValue());
                        var vnomcli= Ext.util.Format.trim(Ext.getCmp('txt_nomcli').getValue());
                        var vruccli= Ext.util.Format.trim(Ext.getCmp('txt_ruccli').getValue());
                        var vdircli= Ext.util.Format.trim(Ext.getCmp('txt_dircli').getValue());
                        var vtelcli= Ext.util.Format.trim(Ext.getCmp('txt_telcli').getValue());
                        var vcodtipcli= Ext.getCmp('cbo_codtipcli').getValue();
                        var vcodestcli = Ext.getCmp('cbo_codestcli').getValue();

                        if(frmResultadoClientes.getForm().isValid()){
                                if(regCliente!=true){
                                    Ext.Ajax.request({
                                        url     : 'DB/clientes.php',
                                        params	: {
                                            n		: 3,
                                            codcli  : vcodcli,
                                            nomcli  : vnomcli,
                                            ruccli : vruccli,
                                            dircli: vdircli,
                                            telcli : vtelcli,
                                            codtipcli   : vcodtipcli,
                                            codestcli : vcodestcli
                                        },
                                        callback : function(opt,success,response){
                                            if (success) {
                                                var responseData = Ext.util.JSON.decode(response.responseText);
                                                var error = responseData.respuesta.error;
                                                var mensaje = responseData.respuesta.mensaje;
                                                if (error==0){
                                                    btnNuevaBusCli.enable();
                                                    btnGrabarCli.disable();
                                                    btnCancelarCli.disable();
                                                    ds_listadocli.reload();
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
                                                         icon: Ext.MessageBox.ERROR
                                                     });
                                            }
                                        }
                                    });
                                }
                                else{
                                    Ext.Ajax.request({
                                        url		: 'DB/clientes.php',
                                        params	: {
                                            n       : 4,
                                            codcli  : vcodcli,
                                            nomcli  : vnomcli,
                                            ruccli : vruccli,
                                            dircli: vdircli,
                                            telcli : vtelcli,
                                            codtipcli   : vcodtipcli,
                                            codestcli : vcodestcli
                                        },
                                        callback : function(opt,success,response){
                                            if (success) {
                                                var responseData = Ext.util.JSON.decode(response.responseText);
                                                var error = responseData.respuesta.error;
                                                var mensaje = responseData.respuesta.mensaje;
                                                var cod = responseData.respuesta.codcli;
                                                if (error==0){
                                                    codcli = vcodcli;
                                                    nomcli = vnomcli;
                                                    ruccli= vruccli;
                                                    dircli= vdircli;
                                                    telcli= vtelcli;
                                                    codtipcli = vcodtipcli,
                                                    codestcli = vcodestcli
                                                    btnNuevaBusCli.enable();
                                                    btnGrabarCli.disable();
                                                    btnCancelarCli.disable();
                                                    Ext.getCmp('txt_codcli').setValue(cod);
                                                    bloqueaCliente();
                                                    ds_listadocli.reload();
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
                                                         icon: Ext.MessageBox.ERROR
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

    var frmBuscaCliente = new Ext.FormPanel({
        id          : 'frmBuscaCliente',
        autoWidth   : true,
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
                            border	: true,
                            labelAlign	: 'left',
                            items	: [cboBuscaCliente]
                        },{
                            columnWidth	: .25,
                            layout	: 'form',
                            border	: true,
                            labelAlign	: 'left',
                            items	: [btnNuevaBusCli]
                        }]
                      }]
    });

    var frmListaClientes = new Ext.FormPanel({
        id          : 'frmListaClientes',
        border      : false,
        autoWidth   : false,
        autoHeight  : false,
        style       : 'padding:5px 5px 5px 5px',
        items       : [{
                        layout	: 'column',
                        border	: false,
                        frame : false,
                        //style	: 'padding:10px 5px 0px 5px',
                        items   :egrd_clientes
        }]
    });

    var frmResultadoClientes = new Ext.FormPanel({
        id		: 'frmResultadoClientes',
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
                        style	: 'padding:5px 5px 0px 5px',
                        items:[{
                                columnWidth	: .25,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 42,
                                defaultType	: 'textfield',
                                items		: [{
                                            id          : 'txt_codcli',
                                            fieldLabel	: 'C&oacute;digo',
                                            readOnly	: true,
                                            disabled    : true,
                                            name		: 'codcli',
                                            anchor		: '99%'
                                            }]
                                },{
                                columnWidth	: .75,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth      : 115,
                                defaultType	: 'textfield',
                                items		: [{
                                            id          :'txt_nomcli',
                                            fieldLabel	: 'Raz. Soc. o Nombre',
                                            readOnly	: false,
                                            disabled    : true,
                                            allowBlank  : false,
                                            listeners	: {keyup:cambioCliente},
                                            name		: 'nomcli',
                                            anchor		: '100%'
                                            }]
                                }]
                        },{
                        layout	: 'column',
                        border	: false,
                        style	: 'padding:0px 5px 0px 5px',
                        items:[{
                                columnWidth	: .25,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth 	: 25,
                                defaultType	: 'textfield',
                                items		: [{
                                            id          :'txt_ruccli',
                                            fieldLabel	: 'RUC',
                                            readOnly	:false,
                                            disabled    : true,
                                            allowBlank  : false,
                                            listeners	: {keyup:cambioCliente},
                                            name		: 'ruccli',
                                            anchor		: '99%'
                                            }]
                                },{
                                columnWidth	: .40,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth 	: 70,
                                defaultType	: 'textfield',
                                items		: [{
                                            xtype: 'combo',
                                            id  : 'cbo_codtipcli',
                                            name: 'codtipcli',
                                            fieldLabel: 'Tip. Cliente',
                                            mode: 'local',
                                            disabled    : true,
                                            allowBlank  : false,
                                            store: ds_tipcli,
                                            editable : false,
                                            triggerAction: 'all',
                                            displayField : 'destipcli',
                                            valueField: 'codtipcli',
                                            anchor  : '99%',
                                            listeners :{
                                                select: function (field, newValue, oldValue) {
                                                            if (newValue != oldValue) {
                                                                Ext.getCmp('btnGrabarCliente').enable();
                                                            }
                                                        }
                                            }
                                            }]
                                },{
                                columnWidth	: .35,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth 	: 45,
                                defaultType	: 'textfield',
                                items		: [{
                                            xtype: 'combo',
                                            id  : 'cbo_codestcli',
                                            name: 'codestcli',
                                            fieldLabel: 'Estado',
                                            mode: 'local',
                                            disabled    : true,
                                            allowBlank  : false,
                                            store: ds_estcli,
                                            editable : false,
                                            triggerAction: 'all',
                                            displayField : 'desestcli',
                                            valueField: 'codestcli',
                                            anchor  : '100%',
                                            listeners :{
                                                select: function (field, newValue, oldValue) {
                                                            if (newValue != oldValue) {
                                                                Ext.getCmp('btnGrabarCliente').enable();
                                                            }
                                                        }
                                            }
                                            }]
                                }]
                        },{
                        layout	: 'column',
                        border	: false,
                        style	: 'padding:0px 5px 0px 5px',
                        items:[{
                                columnWidth	: .72,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth 	: 55,
                                defaultType	: 'textfield',
                                items		: [{
                                            id          :'txt_dircli',
                                            fieldLabel	: 'Dirección',
                                            readOnly	:false,
                                            disabled    : true,
                                            allowBlank  : true,
                                            listeners	: {keyup:cambioCliente},
                                            name		: 'dircli',
                                            anchor      : '99%'
                                            }]
                                },{
                                columnWidth	: .28,
                                layout		: 'form',
                                border		: false,
                                labelAlign	: 'left',
                                labelWidth 	: 50,
                                defaultType	: 'textfield',
                                items		: [{
                                            id          :'txt_telcli',
                                            fieldLabel	: 'Teléfono',
                                            readOnly	:false,
                                            disabled    : true,
                                            allowBlank  : true,
                                            listeners	: {keyup:cambioCliente},
                                            name	: 'telcli',
                                            anchor      : '99%'
                                            }]
                                }]
                        }],
         bbar        : [btnGrabarCli,btnCancelarCli,{
                            xtype: 'tbfill'
                        },{
                            text: 'Nuevo',
                            cls: 'x-btn-text-icon',
                            icon: 'files/images_app/add16.gif',
                            id  : 'btn_nuevocliente',
                            handler : inicializaNewCliente,
                            tooltip 	: 'Registrar nuevo cliente'
                        }]
    });

    //Aqui se construye la ventana
    var win_reg_cliente = Ext.getCmp('frm_reg_cliente');
    if (!win_reg_cliente){
        ds_estcli.load();
        ds_tipcli.load();
        ds_listadocli.load({params: {start: 0, limit: 15}});
        new Ext.Window({
            title	: 'Registro de Clientes',
            id          : 'frm_reg_cliente',
            layout	: 'fit',
            iconCls     : 'regcli',
            width	: 550,
            height	: 470,
            resizable   : false,
            closable    : true,
            items       : [frmBuscaCliente,frmResultadoClientes,frmListaClientes]
        }).show();

    }else{
          win_reg_cliente.show();
    }
}

//Funciones
function cambioCliente(obj){
    var vnomcli= obj.getValue();
    var vruccli = obj.getValue();
    var vdircli = obj.getValue();
    var vtelcli = obj.getValue();
    if (nomcli != vnomcli || ruccli!= vruccli || dircli!= vdircli || telcli!= vtelcli) {
        Ext.getCmp('btnGrabarCliente').enable();
        Ext.getCmp('btn_cancelacliente').enable();
    }else{
        Ext.getCmp('btnGrabarCliente').disable();
    }
}

function inicializaCliente(){
    nomcli='';
    ruccli='';
    dircli='';
    telcli='';
    Ext.getCmp('cboBuscaCliente').setValue('');
    Ext.getCmp('cboBuscaCliente').initComponent();
    Ext.getCmp('cboBuscaCliente').enable();
    Ext.getCmp('cboBuscaCliente').focus();
    regCliente=false;
    Ext.getCmp('frmResultadoClientes').getForm().reset();
    Ext.getCmp('btn_cancelacliente').disable();
    respuesta=-1;
    bloqueaCliente();
}

function inicializaNewCliente(){
    //Limpia Variables
    codcli='';
    nomcli='';
    ruccli='';
    dircli='';
    telcli='';
    //Limpia el Combo
    Ext.getCmp('cboBuscaCliente').setValue('');
    Ext.getCmp('cboBuscaCliente').initComponent();
    Ext.getCmp('cboBuscaCliente').disable();
    desbloqueaCliente();
    //Activa variable que indica que se esta registrando una nueva persona (btnNuevo)
    regCliente=true;
    respuesta=-1;
    Ext.getCmp("frmResultadoClientes").getForm().reset();
    //Enfoca nombre
    Ext.getCmp('txt_nomcli').focus(true);
}

function bloqueaCliente(){
    Ext.getCmp('txt_codcli').disable();
    Ext.getCmp('txt_nomcli').disable();
    Ext.getCmp('txt_ruccli').disable();
    Ext.getCmp('txt_dircli').disable();
    Ext.getCmp('txt_telcli').disable();
    Ext.getCmp('cbo_codestcli').disable();
    Ext.getCmp('cbo_codtipcli').disable();
    Ext.getCmp('btnGrabarCliente').disable();
}

function desbloqueaCliente(){
    Ext.getCmp('txt_codcli').enable();
    Ext.getCmp('txt_nomcli').enable();
    Ext.getCmp('txt_ruccli').enable();
    Ext.getCmp('txt_dircli').enable();
    Ext.getCmp('txt_telcli').enable();
    Ext.getCmp('cbo_codestcli').enable();
    Ext.getCmp('cbo_codtipcli').enable();
    Ext.getCmp('btn_cancelacliente').enable();
}

/****************************************
 *  Fin de formulario frm_reg_cliente   *
 ****************************************/

/********************************************
 *  Inicio de formulario frm_reg_solicitud  *
 *******************************************/

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
                                if(nuevafecha<=fecha){
                                    //alert(fecha);
                                    //alert(nuevafecha);
                                    dp_fecvensol.setValue('');
                                    dp_fecvensol.focus();
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
    anchor	: '100%'
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

/*****************************************
 *  Fin de formulario frm_reg_solicitud  *
 *****************************************/

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
                        var codestsol = cboEstadosol.getValue();
                        //Ext.util.Format.trim(dp_consoldesde.format('Y-m-d'))
                        var predesde = dp_consoldesde.getValue();
                        var desde='';
                        if(predesde!=''){
                            desde = predesde.format('Y-m-d')+' 00:00:00';
                        }else{
                            desde = '';
                        }
                        var prehasta = dp_consolhasta.getValue();
                        var hasta='';
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

var cboEstadosol = new Ext.form.ComboBox({
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
        },
        {
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

    var stcondetsolper = new Ext.data.Store({
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
                        {name: 'usuario',  mapping: 'usuario'}
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
                                //alert(sol);
                                frm_det_solicitud(sol);
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
        bbar    :   [{xtype: 'tbfill'},btn_consolicitudes,btn_resetbusq]
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
    }else{
          win_con_solicitud.show();
    }
}

/*****************************************
 *  Fin de formulario frm_con_solicitud  *
 *****************************************/

/********************************************
 *  Inicio de formulario frm_det_solicitud  *
 *******************************************/

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
var ds_detsol = new Ext.data.Store({
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
                        ]),
                    autoLoad: false
                });
ds_detsol.load();


var cm_detpersonas = new Ext.grid.ColumnModel(
        [{
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
        }
        ]
    );


    var grd_detpersonas = new Ext.grid.EditorGridPanel({
        id      : 'grd_detpersonas',
        store   : ds_detsol,
        title   : 'Personas',
        cm      : cm_detpersonas,
        width   : 350,
        anchor  : '100%',
        height  : 300,
        frame   : true,
        clicksToEdit:1,
	layout    : 'fit',
	autoScroll: true,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
        listeners:{
            rowdblclick: function(grid, rowIndex, e){
                                var sol = ds_detsol.getAt(rowIndex).data.codsol;
                                var per = ds_detsol.getAt(rowIndex).data.codper;
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

/********************************************
 *  Inicio de formulario frm_checks_persona *
 *******************************************/

function frm_checks_persona(cod_sol, cod_per){

var refpol=false,antpol=false,reqjud=false,refter=false,refdro=false,impsal=false,invpen=false;
var selResidente=false, vcodres="", vdesres="";
//var resiregist=0;
///////////////
/*Data Stores*/
///////////////

///////////////////////////////Elementos Compartidos/////////////////////////////////////

//Puestos
var ds_chksrvpuestos = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['codpue', 'despue'],
                                        root    : 'puestos',
                                        id      : 'codpue'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/solicitud.php?n=1'
                                }),
                        autoLoad: false
                    });
ds_chksrvpuestos.load();

//EstadosCheck
var ds_estadoscheck = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['codestchk', 'desestchk'],
                                        root    : 'estadoscheck',
                                        id      : 'codestchk'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/checkservice.php?n=2'
                                }),
                        autoLoad: false
                    });
ds_estadoscheck.load();

///////////////////////////////Controles de Check Service/////////////////////////////////////

///*Data Stores*///

//Delitos
var ds_delitos = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['coddel', 'nomdel', 'desdel'],
                                        root    : 'delitos',
                                        id      : 'coddel'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/checkservice.php?n=1'
                                }),
                        autoLoad: false
                    });
ds_delitos.load();

//Registra o No registra antecedentes
var ds_registra = new Ext.data.SimpleStore({
                        fields: ['codreg', 'desreg'],
                        data : [['1','Registra'],['0','No Registra']]
                    });

/////////////////////
/*Controles Ocultos*/
/////////////////////

//Imagen Actual Reniec
var hid_imgactreniec = new Ext.form.Hidden({
    id          : 'hid_imgactreniec',
    readOnly	: false,
    name	: 'imgreniecact',
    hidemode    : 'display',
    hidelabel   : true
});

///*Controles Texto*///

//Nombre de la persona
var txt_chksrvnomper = new Ext.form.TextField({
    id          : 'txt_chksrvnomper',
    fieldLabel	: 'Check Identidad',
    width : 300,
    readOnly	: true,
    disabled    : false,
    name	: 'nombrechksrvc',
    anchor	: '98%'
});

//Investigación Policial
var txt_invpol = new Ext.form.TextArea({
    id          : 'txt_invpol',
    fieldLabel	: 'Investigación Policial',
    readOnly	: false,
    disabled    : true,
    name	: 'refpolchk',
    anchor	: '100%',
    height      : 87
});

//Investigación penal
var txt_invpen = new Ext.form.TextArea({
    id          : 'txt_invpen',
    fieldLabel	: 'Investigación Penal',
    readOnly	: false,
    disabled    : true,
    name	: 'invpenchk',
    anchor	: '100%',
    height      : 89
});

//Definición del delito
var txt_defdel = new Ext.form.TextArea({
    id          : 'txt_defdel',
    fieldLabel	: 'Def. Delito',
    height      : 53,
    readOnly	: true,
    disabled    : false,
    name	: 'defdel',
    anchor	: '100%'
});

//Recomendación
var txt_recome = new Ext.form.TextArea({
    id          : 'txt_recome',
    fieldLabel	: 'Recomendación',
    height      : 38,
    readOnly	: false,
    disabled    : false,
    allowBlank  : false,
    name	: 'recchk',
    anchor	: '100%'
});

//Observación DNI
var txt_obsdni = new Ext.form.TextField({
    id          : 'txt_obsdni',
    fieldLabel	: 'Observación DNI',
    readOnly	: false,
    disabled    : false,
    name	: 'obsimgreniec',
    anchor	: '100%'
});

///*Controles UploadFile*///

//Imagen DNI
var upf_imagendni = new Ext.ux.form.FileUploadField({
    id : 'upf_imagendni',
    emptyText: 'Seleccione la imagen del DNI',
    fieldLabel: 'Imagen DNI',
    name : 'imgreniec',
    anchor: '-10',
    allowBlank : true,
    buttonText: '',
    buttonCfg: {
        iconCls: 'upload-icon'
    }
});

///*Controles Botones*///

var btnImgCargada = new Ext.Button({
        text        : 'Imagen Cargada',
        tooltip     : 'Muestra la imagen cargada en el Check',
        width : 144,
        handler     : function(){
                            var win_imdDni = Ext.getCmp('frm_imgDni');
                            var PreviewDNI = new Ext.Component({
                                autoEl: {
                                    tag: 'img', src: 'files/images_dni/'+hid_imgactreniec.getValue(), id: 'photoPreview'
                                }
                            });

                            var frmpnlImagen = new Ext.FormPanel({
                                frame: true,
                                border: false,
                                autoScroll: true,
                                items:[PreviewDNI]
                            });
                            if (!win_imdDni){
                                new Ext.Window({
                                    title	: 'Imagen DNI',
                                    id          : 'frm_imgDni',
                                    iconCls     : 'regper',
                                    layout	: 'fit',
                                    width	: 300,
                                    height	: 300,
                                    resizable   : false,
                                    closable    : true,
                                    modal       : true,
                                    items       : [frmpnlImagen]
                                }).show();
                            }else{
                                  win_imdDni.show();
                            }
        }
    });

///*Controles ComboBox*///

//Puestos
var cboCheckPuestos = new Ext.form.ComboBox({
    fieldLabel  : 'Puesto al que postula',
    id          : 'cboCheckPuestos',
    store       : ds_chksrvpuestos,
    displayField: 'despue',
    valueField  : 'codpue',
    typeAhead   : true,
    mode        : 'local',
    triggerAction: 'all',
    anchor      :'100%',
    disabled    : false,
    forceSelection : true,
    hideTrigger : false,
    lazyRender : true,
    selectOnFocus:true
});

//Delitos
var cboDelitos = new Ext.form.ComboBox({
    fieldLabel  : 'Delito',
    id          : 'cboDelitos',
    name        : 'coddel',
    store       : ds_delitos,
    displayField: 'nomdel',
    valueField  : 'coddel',
    hiddenName  : 'vcoddel',
    triggerAction: 'all',
    anchor      :'98%',
    disabled    : false,
    editable : false,
    lazyRender : true,
    readOnly : true,
    onSelect    : function(record){
                    var id=record.data.coddel.toString();
                    var registro = ds_delitos.getById(id);
                    txt_defdel.setValue(registro.data.desdel);
                    cboDelitos.setValue(record.data.coddel);
                    cboDelitos.collapse();
                    txt_recome.focus();
                },
    value : '1'
    });

//Estados Check
var cboEstadoCheckService = new Ext.form.ComboBox({
        id              : 'cboEstadoCheckService',
        name            : 'codestchk',
        fieldLabel      : 'Guardar con Estado',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        store           : ds_estadoscheck,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'desestchk',
        valueField      : 'codestchk',
        hiddenName      : 'vcodestchk',
        anchor          : '100%'
});

//Referencia Policial
var cbo_refpol = new Ext.form.ComboBox({
        id              : 'cbo_refpol',
        name            : 'indrefpol',
        fieldLabel      : 'Referencia Policial',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        store           : ds_registra,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'desreg',
        valueField      : 'codreg',
        hiddenName      : 'vindrefpol',
        anchor          : '100%',
        value           : '0',
        onSelect    : function(record){
                            var seleccionado=record.data.codreg;
                            //alert(seleccionado);
                            if(seleccionado=='1'){
                                refpol=true;
                            }
                            else {
                                refpol=false;
                            }
                            if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                txt_invpol.enable();
                                //cboDelitos.enable();
                                cboDelitos.setReadOnly(false);
                            }
                            else{
                                txt_invpol.setValue('');
                                txt_invpol.disable();
                                cboDelitos.setValue('1');
                                cboDelitos.setReadOnly(true);
                                txt_defdel.setValue('');
                            }
                            cbo_refpol.setValue(record.data.codreg);
                            cbo_refpol.collapse();
                        }
});

//Antecedente Policial
var cbo_antpol = new Ext.form.ComboBox({
        id              : 'cbo_antpol',
        name            : 'indantpol',
        fieldLabel      : 'Antecedente Policial',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        store           : ds_registra,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'desreg',
        valueField      : 'codreg',
        hiddenName      : 'vindantpol',
        anchor          : '100%',
        value           : '0',
        onSelect    : function(record){
                            var seleccionado=record.data.codreg;
                            //alert(seleccionado);
                            if(seleccionado=='1'){
                                antpol=true;
                            }
                            else {
                                antpol=false;
                            }
                            if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                txt_invpol.enable();
                                //cboDelitos.enable();
                                cboDelitos.setReadOnly(false);
                            }
                            else{
                                txt_invpol.setValue('');
                                txt_invpol.disable();
                                cboDelitos.setValue('1');
                                cboDelitos.setReadOnly(true);
                                txt_defdel.setValue('');
                            }
                            cbo_antpol.setValue(record.data.codreg);
                            cbo_antpol.collapse();
                        }
});

//Requisitoria Judicial
var cbo_reqjud = new Ext.form.ComboBox({
        id              : 'cbo_reqjud',
        name            : 'indreqjud',
        fieldLabel      : 'Requisitoria Judicial',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        store           : ds_registra,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'desreg',
        valueField      : 'codreg',
        hiddenName      : 'vindreqjud',
        anchor          : '100%',
        value           : '0',
        onSelect    : function(record){
                            var seleccionado=record.data.codreg;
                            //alert(seleccionado);
                            if(seleccionado=='1'){
                                reqjud=true;
                            }
                            else {
                                reqjud=false;
                            }
                            if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                txt_invpol.enable();
                                //cboDelitos.enable();
                                cboDelitos.setReadOnly(false);
                            }
                            else{
                                txt_invpol.setValue('');
                                txt_invpol.disable();
                                cboDelitos.setValue('1');
                                cboDelitos.setReadOnly(true);
                                txt_defdel.setValue('');
                            }
                            cbo_reqjud.setValue(record.data.codreg);
                            cbo_reqjud.collapse();
                        }
});

//Referencia por Terrorismo
var cbo_refter = new Ext.form.ComboBox({
        id              : 'cbo_refter',
        name            : 'indrefter',
        fieldLabel      : 'Referencia Terrorismo',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        store           : ds_registra,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'desreg',
        valueField      : 'codreg',
        hiddenName      : 'vindrefter',
        anchor          : '100%',
        value           : '0',
        onSelect    : function(record){
                            var seleccionado=record.data.codreg;
                            //alert(seleccionado);
                            if(seleccionado=='1'){
                                refter=true;
                            }
                            else {
                                refter=false;
                            }
                            if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                txt_invpol.enable();
                                //cboDelitos.enable();
                                cboDelitos.setReadOnly(false);
                            }
                            else{
                                txt_invpol.setValue('');
                                txt_invpol.disable();
                                cboDelitos.setValue('1');
                                cboDelitos.setReadOnly(true);
                                txt_defdel.setValue('');
                            }
                            cbo_refter.setValue(record.data.codreg);
                            cbo_refter.collapse();
                        }
});

//Referencia por Drogas
var cbo_refdro = new Ext.form.ComboBox({
        id              : 'cbo_refdro',
        name            : 'indrefdro',
        fieldLabel      : 'Referencia Drogas',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        store           : ds_registra,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'desreg',
        valueField      : 'codreg',
        hiddenName      : 'vindrefdro',
        anchor          : '100%',
        value           : '0',
        onSelect    : function(record){
                            var seleccionado=record.data.codreg;
                            //alert(seleccionado);
                            if(seleccionado=='1'){
                                refdro=true;
                            }
                            else {
                                refdro=false;
                            }
                            if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                txt_invpol.enable();
                                //cboDelitos.enable();
                                cboDelitos.setReadOnly(false);
                            }
                            else{
                                txt_invpol.setValue('');
                                txt_invpol.disable();
                                cboDelitos.setValue('1');
                                cboDelitos.setReadOnly(true);
                                txt_defdel.setValue('');
                            }
                            cbo_refdro.setValue(record.data.codreg);
                            cbo_refdro.collapse();
                        }
});

//Impedimento de salida
var cbo_impsal = new Ext.form.ComboBox({
        id              : 'cbo_impsal',
        name            : 'indimpsalpai',
        fieldLabel      : 'Imp. de salida del País',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        store           : ds_registra,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'desreg',
        valueField      : 'codreg',
        hiddenName      : 'vindimpsalpai',
        anchor          : '100%',
        value           : '0',
        onSelect    : function(record){
                            var seleccionado=record.data.codreg;
                            //alert(seleccionado);
                            if(seleccionado=='1'){
                                impsal=true;
                            }
                            else {
                                impsal=false;
                            }
                            if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                txt_invpol.enable();
                                //cboDelitos.enable();
                                cboDelitos.setReadOnly(false);
                            }
                            else{
                                txt_invpol.setValue('');
                                txt_invpol.disable();
                                cboDelitos.setValue('1');
                                cboDelitos.setReadOnly(true);
                                txt_defdel.setValue('');
                            }
                            cbo_impsal.setValue(record.data.codreg);
                            cbo_impsal.collapse();
                        }
});

//Investigación penal
var cbo_invpen = new Ext.form.ComboBox({
        id              : 'cbo_invpen',
        name            : 'indinvpen',
        fieldLabel      : 'Investigación Penal',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        store           : ds_registra,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'desreg',
        valueField      : 'codreg',
        hiddenName      : 'vindinvpen',
        anchor          : '100%',
        value           : '0',
        onSelect    : function(record){
                            var seleccionado=record.data.codreg;
                            if(seleccionado=='1'){
                                        invpen=true;
                                    }
                            else {
                                invpen=false;
                            }
                            if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                txt_invpen.enable();
                                //cboDelitos.enable();
                                cboDelitos.setReadOnly(false);
                            }
                            else{
                                txt_invpen.setValue('');
                                txt_invpen.disable();
                                cboDelitos.setValue('1');
                                cboDelitos.setReadOnly(true);
                                txt_defdel.setValue('');
                            }
                            cbo_invpen.setValue(record.data.codreg);
                            cbo_invpen.collapse();
        }
});

///*FieldSets*///

var fldstCombosAntecedentes = new Ext.form.FieldSet({
        columnWidth: 0.4,
        collapsible: false,
        border : false,
        autoHeight:true,
        labelWidth  : 140,
        defaults: {
            anchor: '-10'
        },
        defaultType: 'textfield',
        items :[
            cbo_refpol,
            cbo_antpol,
            cbo_reqjud,
            cbo_refter,
            cbo_refdro,
            cbo_impsal,
            cbo_invpen
        ]
});

//texto de referencias Policiales y Penales
var fldstDescAntecedentes = new Ext.form.FieldSet({
        columnWidth: 0.6,
        //title: 'Fieldset 1',
        collapsible: false,
        border : false,
        autoHeight:true,
        labelWidth  : 80,
        defaultType: 'textfield',
        items :[
            txt_invpol,
            txt_invpen
        ]
});

//Panel principal para el CheckService

var frmCheckService = new Ext.FormPanel({
    frame       : false,
    border      : false,
    fileUpload  : true,
    style       : 'padding:1px 1px 1px 1px',
    items       : [hid_imgactreniec,
        {
            layout  : 'column',
            border  : false,
            frame   : false,
            style   : 'padding: 5px 0px 5px 0px',
            items   : [
                {
                    columnWidth	: 0.8,
                    layout : 'form',
                    labelWidth : 75,
                    border : false,
                    items  : [upf_imagendni]
                },
                {
                    columnWidth	: 0.2,
                    //layout : 'form',
                    //labelWidth : 100,
                    border : false,
                    items  : [btnImgCargada]
                }
            ]
        },{
            layout  : 'column',
            border  : false,
            frame   : false,
            style   : 'padding: 0px 0px 5px 0px',
            items   : [
                {
                    columnWidth	: 1.0,
                    layout : 'form',
                    labelWidth : 100,
                    border : false,
                    items  : [txt_obsdni]
                }
            ]
        },
        {
            layout : 'column',
            frame : false,
            //title : 'Check Delictivo',
            border : false,
            height : 200,
            items : [fldstCombosAntecedentes,fldstDescAntecedentes]
        },
        {
            layout : 'column',
            border : false,
            frame  : false,
            style  : 'padding: 5px 0px 1px 1px',
            items : [
                {
                    columnWidth	: 0.3,
                    layout : 'form',
                    labelWidth : 45,
                    border : false,
                    items  : [cboDelitos]
                },
                {
                    columnWidth	: 0.7,
                    layout : 'form',
                    labelWidth : 70,
                    border : false,
                    items  : [txt_defdel]
                }
            ]
        },
        {
            layout : 'column',
            border : false,
            frame  : false,
            style  : 'padding: 5px 0px 1px 1px',
            items : [
                {
                    columnWidth	: 1.0,
                    layout : 'form',
                    labelWidth : 100,
                    border : false,
                    items  : [txt_recome]
                }
            ]
        },
                {
            layout : 'column',
            border : false,
            frame  : true,
            style  : 'padding: 5px 0px 1px 1px',
            items : [
                {
                    columnWidth	: 0.4,
                    layout : 'form',
                    labelWidth : 120,
                    border : false,
                    items  : [cboEstadoCheckService]
                }
            ]
        }
    ]
});

///////////////////////////////Controles de Check Domiciliario/////////////////////////////////////

///*Data Stores*///

//Indicador si domicilia o no
var ds_domicilia = new Ext.data.SimpleStore({
                        fields: ['codinddom', 'desinddom'],
                        data : [['1','Si'],['0','No']]
                    });

// Parentescos
var ds_parentescos = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['codpar', 'despar'],
                                        root    : 'parentescos',
                                        id      : 'codpar'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/checkdomicilio.php?n=1'
                                }),
                        autoLoad: false
                    });
ds_parentescos.load();

//Residentes
var ds_residentes = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['codres', 'desres'],
                                        root    : 'residentes',
                                        id      : 'codres'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/checkdomicilio.php?n=2'
                                }),
                        autoLoad: false
                    });
ds_residentes.load();


//Vivienda
var ds_vivienda = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['codviv', 'desviv'],
                                        root    : 'vivienda',
                                        id      : 'codviv'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/checkdomicilio.php?n=3'
                                }),
                        autoLoad: false
                    });
ds_vivienda.load();

//Tipo Vivienda
var ds_tipovivienda = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['codtipviv', 'destipviv'],
                                        root    : 'tipovivienda',
                                        id      : 'codtipviv'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/checkdomicilio.php?n=13'
                                }),
                        autoLoad: false
                    });
ds_tipovivienda.load();

//Materia Vivienda
var ds_material = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['codtipmat', 'destipmat'],
                                        root    : 'material',
                                        id      : 'codtipmat'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/checkdomicilio.php?n=4'
                                }),
                        autoLoad: false
                    });
ds_material.load();

//Estado construccion
var ds_estconstruc = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['codestcon', 'desestcon'],
                                        root    : 'construccion',
                                        id      : 'codestcon'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/checkdomicilio.php?n=5'
                                }),
                        autoLoad: false
                    });
ds_estconstruc.load();

//zonificacion
var ds_zonifi = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['codzonif', 'deszonif'],
                                        root    : 'zonificacion',
                                        id      : 'codzonif'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/checkdomicilio.php?n=6'
                                }),
                        autoLoad: false
                    });
ds_zonifi.load();

//zona riesgo
var ds_zonariesgo = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['codzonrie', 'deszonrie'],
                                        root    : 'zonariesgo',
                                        id      : 'codzonrie'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/checkdomicilio.php?n=7'
                                }),
                        autoLoad: false
                    });
ds_zonariesgo.load();

//conclusion
var ds_conclusion = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['codcon', 'descon'],
                                        root    : 'conclusion',
                                        id      : 'codcon'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/checkdomicilio.php?n=8'
                                }),
                        autoLoad: false
                    });
ds_conclusion.load();

//vias
var ds_vias = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['codtipvia', 'destipvia'],
                                        root    : 'vias',
                                        id      : 'codtipvia'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/checkdomicilio.php?n=9'
                                }),
                        autoLoad: false
                    });
ds_vias.load();

//Departamentos
var ds_departamento = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['coddpto', 'desdpto'],
                                        root    : 'departamentos',
                                        id      : 'coddpto'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/checkdomicilio.php?n=10',
                                        method : 'GET'
                                }),
                        autoLoad: true,
                        pruneModifiedRecords: true
                    });
//ds_departamento.load();

//Provincias
var ds_provincia = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['codpro', 'despro'],
                                        root    : 'provincias',
                                        id      : 'codpro'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/checkdomicilio.php?n=11',
                                        method : 'GET'
                                }),
                        autoLoad: true,
                        pruneModifiedRecords: true
                    });
//ds_provincia.load();

var ds_distrito = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['coddist', 'desdist'],
                                        root    : 'distritos',
                                        id      : 'coddist'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/checkdomicilio.php?n=12',
                                        method : 'GET'
                                }),
                        autoLoad: true,
                        pruneModifiedRecords: true
                    });

//Tipo Imagen
var ds_tipoimagen = new Ext.data.Store({
                        reader  : new Ext.data.JsonReader({
                                        fields  : ['codtipimg', 'destipimg'],
                                        root    : 'tipoimagen',
                                        id      : 'codtipimg'
                                }),
                        proxy: new Ext.data.HttpProxy({
                                        url: 'DB/checkdomicilio.php?n=14'
                                }),
                        autoLoad: false
                    });
ds_tipoimagen.load();

///*Controles Texto*///

//Nombre de la persona
var txt_nomvia = new Ext.form.TextField({
    id          : 'txt_nomvia',
    fieldLabel	: 'Nom. Vía',
    readOnly	: false,
    disabled    : false,
    allowBlank      : false,
    name	: 'nomviadom',
    anchor	: '98%'
});

//Numero de via
var txt_numvia = new Ext.form.TextField({
    id          : 'txt_numvia',
    fieldLabel	: 'Num. Vía',
    readOnly	: false,
    disabled    : false,
    allowBlank  : false,
    name	: 'numdom',
    anchor	: '98%'
});

//Urbanizacion
var txt_urb = new Ext.form.TextField({
    id          : 'txt_urb',
    fieldLabel	: 'Urb.',
    readOnly	: false,
    disabled    : false,
    allowBlank  : false,
    name	: 'urbdom',
    anchor	: '100%'
});

//Nombre de la persona para Check domiciliario
var txt_chkdomnomper = new Ext.form.TextField({
    id          : 'txt_chkdomnomper',
    fieldLabel	: 'Check Identidad',
    readOnly	: false,
    disabled    : false,
    width       : 300,
    name	: 'nombrechkdom',
    anchor	: '98%'
});


//Nombre de persona entrevistada
var txt_persentre = new Ext.form.TextField({
    id          : 'txt_persentre',
    fieldLabel	: 'Entrevistado',
    readOnly	: false,
    disabled    : false,
   // width       : 300,
    name	: 'perent',
    anchor	: '-5'
});

//Tiempo en años
var txt_tiemanio = new Ext.form.NumberField({
    id          : 'txt_tiemanio',
    fieldLabel	: 'Años',
    readOnly	: false,
    disabled    : false,
    allowDecimals : false,
    allowNegative : false,
    maxValue    :   99,
    name	: 'anoresdom',
    anchor	: '-10'
});

//Tiempo en meses
var txt_tiemmeso = new Ext.form.NumberField({
    id          : 'txt_tiemmeso',
    fieldLabel	: 'Meses',
    readOnly	: false,
    disabled    : false,
    allowDecimals : false,
    allowNegative : false,
    maxValue    : 12,
    name	: 'mesresdom',
    anchor	: '-10'
});

var txt_otropar = new Ext.form.TextField({
    id          : 'txt_otropar',
    //fieldLabel	: 'Otro',
    readOnly	: false,
    disabled    : true,
    name	: 'otroparent',
    anchor	: '-5'
});

//Otro tipo de vivienda
var txt_otrotipviv = new Ext.form.TextField({
    id          : 'txt_otrotipviv',
    //fieldLabel	: 'Otro',
    readOnly	: false,
    disabled    : true,
    name	: 'otrtipviv',
    anchor	: '-5'
});

//Pisos
var txt_numpis = new Ext.form.NumberField({
    id          : 'txt_numpis',
    fieldLabel	: 'N° Pisos',
    readOnly	: false,
    disabled    : false,
    allowDecimals : false,
    allowNegative : false,
    name	: 'numpis',
    anchor	: '-5'
});

//Piso en que reside
var txt_pisres = new Ext.form.NumberField({
    id          : 'txt_pisres',
    fieldLabel	: 'Piso en que reside',
    readOnly	: false,
    disabled    : false,
    allowDecimals : false,
    allowNegative : false,
    name	: 'numpis',
    anchor	: '-5'
});

//Otro tipo de vivienda
var txt_otrmatcon = new Ext.form.TextField({
    id          : 'txt_otrmatcon',
    //fieldLabel	: 'Otro',
    readOnly	: false,
    disabled    : true,
    name	: 'otrmatcon',
    anchor	: '-5'
});

//Color de fachada
var txt_colfac = new Ext.form.TextField({
    id          : 'txt_colfac',
    fieldLabel	: 'Color de Fachada',
    readOnly	: false,
    disabled    : false,
    name	: 'colfac',
    anchor	: '-5'
});

//Tipo Material
var txt_tipmatpue = new Ext.form.TextField({
    id          : 'txt_tipmatpue',
    fieldLabel	: 'Tipo de Material',
    readOnly	: false,
    disabled    : false,
    name	: 'tipmat',
    anchor	: '-5'
});

//Puertas
var txt_puertas = new Ext.form.NumberField({
    id          : 'txt_puertas',
    fieldLabel	: 'N° Puertas de Ingreso',
    readOnly	: false,
    disabled    : false,
    allowDecimals : false,
    allowNegative : false,
    name	: 'numpue',
    anchor	: '-5'
});

//Ventanas
var txt_ventanas = new Ext.form.NumberField({
    id          : 'txt_ventanas',
    fieldLabel	: 'N° Ventanas',
    readOnly	: false,
    disabled    : false,
    allowDecimals : false,
    allowNegative : false,
    name	: 'numven',
    anchor	: '-5'
});

//Tipo Material
var txt_otrzonif = new Ext.form.TextField({
    id          : 'txt_otrzonif',
    //fieldLabel	: 'Observación',
    readOnly	: false,
    disabled    : true,
    name	: 'otrzonif',
    anchor	: '-10'
});

//Otra Zonificación
var txt_obsinmu = new Ext.form.TextField({
    id          : 'txt_obsinmu',
    fieldLabel	: 'Observación',
    readOnly	: false,
    disabled    : false,
    name	: 'obsinmu',
    anchor	: '-10'
});

//Observacion de Check Domiciliario
var txt_obsCheckDom = new Ext.form.TextArea({
    id          : 'txt_obsCheckDom',
    fieldLabel	: 'Recomendación',
    readOnly	: false,
    disabled    : false,
    name	: 'obscon',
    anchor	: '100%',
    height      : 80
});

var hid_checkDom = new Ext.form.Hidden({
    id          : 'hid_checkDom',
    readOnly	: false,
    name	: 'codchkdom',
    hidemode    : 'display',
    hidelabel   : true
});

///*Controle UploadField*//
var upf_imgdom1 = new Ext.ux.form.FileUploadField({
    id : 'upf_imgdom1',
    emptyText: 'Imagen Domicilio',
    fieldLabel: 'Imagen 1',
    name : 'imgdom1',
    anchor: '-10',
    allowBlank : true,
    buttonText: '',
    buttonCfg: {
        iconCls: 'upload-icon'
    }
});

var btnImgDom1 = new Ext.Button({
        text        : 'Ver Imagen Cargada',
        tooltip     : 'Muestra la imagen cargada del domicilio',
        width : 125,
        handler     : function(){
                            var win_imddom1 = Ext.getCmp('frm_imgdom1');
                            var PreviewDom1 = new Ext.Component({
                                autoEl: {
                                    tag: 'img', src: 'files/images_dom/'+hid_imgdom1act.getValue(), id: 'Imagendom1'
                                }
                            });

                            var frmpnlDom1 = new Ext.FormPanel({
                                frame: true,
                                border: false,
                                autoScroll: true,
                                items:[PreviewDom1]
                            });
                            if (!win_imddom1){
                                new Ext.Window({
                                    title	: 'Imagen 1 Domicilio',
                                    id          : 'frm_imgdom1',
                                    iconCls     : 'regper',
                                    layout	: 'fit',
                                    width	: 300,
                                    height	: 300,
                                    resizable   : false,
                                    closable    : true,
                                    modal       : true,
                                    items       : [frmpnlDom1]
                                }).show();
                            }else{
                                  win_imddom1.show();
                            }
        }
    });

//Imagen Actual Dom1
var hid_imgdom1act = new Ext.form.Hidden({
    id          : 'hid_imgdom1act',
    readOnly	: false,
    name	: 'imgdom1act',
    hidemode    : 'display',
    hidelabel   : true
});

//Conclusiones
var cbo_tipimg1 = new Ext.form.ComboBox({
        id              : 'cbo_tipimg1',
        name            : 'codtipimg1',
        fieldLabel      : 'Obs. Imagen',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        //width           : 50,
        store           : ds_tipoimagen,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'destipimg',
        valueField      : 'codtipimg',
        hiddenName      : 'vcodtipimg1',
        anchor          : '100%'
});

var upf_imgdom2 = new Ext.ux.form.FileUploadField({
    id : 'upf_imgdom2',
    emptyText: 'Imagen Domicilio',
    fieldLabel: 'Imagen 2',
    name : 'imgdom2',
    anchor: '-10',
    allowBlank : true,
    buttonText: '',
    buttonCfg: {
        iconCls: 'upload-icon'
    }
});

var btnImgDom2 = new Ext.Button({
        text        : 'Ver Imagen Cargada',
        tooltip     : 'Muestra la imagen cargada del domicilio',
        width : 125,
        handler     : function(){
                            var win_imddom2 = Ext.getCmp('frm_imgdom2');
                            var PreviewDom2 = new Ext.Component({
                                autoEl: {
                                    tag: 'img', src: 'files/images_dom/'+hid_imgdom2act.getValue(), id: 'Imagendom2'
                                }
                            });

                            var frmpnlDom2 = new Ext.FormPanel({
                                frame: true,
                                border: false,
                                autoScroll: true,
                                items:[PreviewDom2]
                            });
                            if (!win_imddom2){
                                new Ext.Window({
                                    title	: 'Imagen 2 Domicilio',
                                    id          : 'frm_imgdom2',
                                    iconCls     : 'regper',
                                    layout	: 'fit',
                                    width	: 300,
                                    height	: 300,
                                    resizable   : false,
                                    closable    : true,
                                    modal       : true,
                                    items       : [frmpnlDom2]
                                }).show();
                            }else{
                                  win_imddom2.show();
                            }
        }
    });

//Imagen Actual Dom2
var hid_imgdom2act = new Ext.form.Hidden({
    id          : 'hid_imgdom2act',
    readOnly	: false,
    name	: 'imgdom2act',
    hidemode    : 'display',
    hidelabel   : true
});

//Conclusiones
var cbo_tipimg2 = new Ext.form.ComboBox({
        id              : 'cbo_tipimg2',
        name            : 'codtipimg2',
        fieldLabel      : 'Obs. Imagen',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        width           : 50,
        store           : ds_tipoimagen,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'destipimg',
        valueField      : 'codtipimg',
        hiddenName      : 'vcodtipimg2',
        anchor          : '100%'
});

var upf_imgmapa = new Ext.ux.form.FileUploadField({
    id : 'upf_imgmapa',
    emptyText: 'Imagen Mapa',
    fieldLabel: 'Mapa Dom.',
    name : 'imgmap',
    anchor: '-10',
    allowBlank : true,
    buttonText: '',
    buttonCfg: {
        iconCls: 'upload-icon'
    }
});

var btnImgMap = new Ext.Button({
        text        : 'Ver Imagen Cargada',
        tooltip     : 'Muestra la imagen del mapa cargado',
        width : 125,
        handler     : function(){
                            var win_imdmap = Ext.getCmp('frm_imgmap');
                            var Previewmap = new Ext.Component({
                                autoEl: {
                                    tag: 'img', src: 'files/images_dom/'+hid_imgmapact.getValue(), id: 'Imagenmap'
                                }
                            });

                            var frmpnlmap = new Ext.FormPanel({
                                frame: true,
                                border: false,
                                autoScroll: true,
                                items:[Previewmap]
                            });
                            if (!win_imdmap){
                                new Ext.Window({
                                    title	: 'Imagen 1 Domicilio',
                                    id          : 'frm_imgmap',
                                    iconCls     : 'regper',
                                    layout	: 'fit',
                                    width	: 300,
                                    height	: 300,
                                    resizable   : false,
                                    closable    : true,
                                    modal       : true,
                                    items       : [frmpnlmap]
                                }).show();
                            }else{
                                  win_imdmap.show();
                            }
        }
    });

//Imagen Actual Dom2
var hid_imgmapact = new Ext.form.Hidden({
    id          : 'hid_imgmapact',
    readOnly	: false,
    name	: 'imgmapact',
    hidemode    : 'display',
    hidelabel   : true
});

//Conclusiones
var cbo_imgpama = new Ext.form.ComboBox({
        id              : 'cbo_imgpama',
        name            : 'codtipimg3',
        fieldLabel      : 'Obs. Imagen',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        width           : 50,
        store           : ds_tipoimagen,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'destipimg',
        valueField      : 'codtipimg',
        hiddenName      : 'vcodtipimg3',
        anchor          : '100%'
});

///*Controles ComboBox*///

//Puestos
var cboCheckPuestosDom = new Ext.form.ComboBox({
    fieldLabel  : 'Puesto al que postula',
    id          : 'cboCheckPuestosDom',
    store       : ds_chksrvpuestos,
    displayField: 'despue',
    valueField  : 'codpue',
    typeAhead   : true,
    mode        : 'local',
    triggerAction: 'all',
    anchor      :'100%',
    disabled    : false,
    forceSelection : true,
    hideTrigger : false,
    lazyRender : true,
    selectOnFocus:true
});

//Indicador de Domiciliado
var cbo_domiciliado = new Ext.form.ComboBox({
        id              : 'cbo_domiciliado',
        name            : 'domici',
        fieldLabel      : 'Domiciliado',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        width           : 50,
        store           : ds_domicilia,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'desinddom',
        valueField      : 'codinddom',
        hiddenName      : 'vdomici',
        anchor          : '-10',
        value           : '1',
        listeners       :   {
            'select' : function(cmb, rec, idx){
                            var seleccionado=rec.data.codinddom;
                            //alert(seleccionado);
                            if(seleccionado=='1'){
                                txt_tiemanio.enable();
                                txt_tiemmeso.enable();
                                cbo_residentes.enable();
                                cbo_vivienda.enable();
                                grd_residentes.enable();
                            }
                            else {
                                txt_tiemanio.disable();
                                txt_tiemmeso.disable();
                                cbo_residentes.clearValue();
                                cbo_residentes.disable();
                                cbo_vivienda.clearValue();
                                cbo_vivienda.disable();
                                ds_residtem.removeAll();
                                grd_residentes.disable();

                            }
                        }
        }
});

//Tipo de via
var cbo_tipvia = new Ext.form.ComboBox({
        id              : 'cbo_tipvia',
        name            : 'codtipvia',
        fieldLabel      : 'Via',
        mode            : 'local',
        disabled        : false,
        editable        : false,
        allowBlank      : false,
        store           : ds_vias,
        width           : 50,
        triggerAction   : 'all',
        displayField    : 'destipvia',
        valueField      : 'codtipvia',
        hiddenName      : 'vcodtipvia',
        anchor          : '-10'
        //border : true
});

//Parentesco
var cbo_parent = new Ext.form.ComboBox({
        id              : 'cbo_parent',
        name            : 'codpar',
        fieldLabel      : 'Parentesco',
        mode            : 'local',
        disabled        : false,
        editable        : false,
        allowBlank      : false,
        width           : 100,
        store           : ds_parentescos,
        triggerAction   : 'all',
        displayField    : 'despar',
        valueField      : 'codpar',
        hiddenName      : 'vcodpar',
        anchor          : '-10',
        listeners   : {
            'select'    : function(cmb, rec, idx){
                var otro=rec.data.codpar;
                if (otro=='6'){
                    txt_otropar.enable();
                    //cbo_parent.setValue(rec.data.despar);
                    txt_otropar.focus();
                }else{
                    txt_otropar.disable();
                    //cbo_parent.setValue(rec.data.despar);
                }
            }
        }
});

//Departamento
var cbo_depto = new Ext.form.ComboBox({
        id              : 'cbo_depto',
        hiddenName      : 'coddpto',
        fieldLabel      : 'Departamento',
        mode            : 'local',
        width           : 100,
        disabled        : false,
        editable        : false,
        allowBlank      : false,
        store           : ds_departamento,
        triggerAction   : 'all',
        displayField    : 'desdpto',
        valueField      : 'coddpto',
        //hiddenName      : 'vcoddpto',
        anchor          : '-10',
        listeners   : {
            'select'    : function(cmb, rec, idx){
                cbo_prov.clearValue();
                cbo_prov.store.load({
                    params : {
                        depa : cbo_depto.getValue()
                    }
                });
                cbo_prov.enable();
                cbo_dist.clearValue();
                cbo_dist.store.removeAll();
                cbo_dist.disable();
                //alert(cbo_depto.getValue());
            }
        }
});

//Provincia
var cbo_prov = new Ext.form.ComboBox({
        id              : 'cbo_prov',
        hiddenName      : 'codpro',
        fieldLabel      : 'Provincia',
        mode            : 'local',
        width           : 100,
        disabled        : true,
        editable        : false,
        allowBlank      : false,
        store           : ds_provincia,
        triggerAction   : 'all',
        displayField    : 'despro',
        valueField      : 'codpro',
        //hiddenName      : 'vcodpro',
        anchor          : '-10',
        listeners   : {
            'select'    : function(cmb, rec, idx){
                //cons_dept=cmb.getValue();
                //alert(cons_dept);
                cbo_dist.clearValue();
                cbo_dist.store.removeAll();
                cbo_dist.store.load({
                    params : {
                        depa : cbo_depto.getValue(),
                        prov : cbo_prov.getValue()
                    }
                });
                cbo_dist.enable();
                //alert(cbo_prov.getValue());
            }
        }
});

//Distrito
var cbo_dist = new Ext.form.ComboBox({
        id              : 'cbo_dist',
        hiddenName      : 'coddist',
        fieldLabel      : 'Distrito',
        mode            : 'local',
        //width           : 150,
        disabled        : true,
        editable        : false,
        allowBlank      : false,
        store           : ds_distrito,
        triggerAction   : 'all',
        displayField    : 'desdist',
        valueField      : 'coddist',
        //hiddenName      : 'vcoddist',
        anchor          : '100%'
});

//Vivienda
var cbo_vivienda = new Ext.form.ComboBox({
        id              : 'cbo_vivienda',
        name            : 'codviv',
        fieldLabel      : 'Vivienda',
        mode            : 'local',
        disabled        : false,
        editable        : false,
        allowBlank      : false,
        store           : ds_vivienda,
        triggerAction   : 'all',
        displayField    : 'desviv',
        valueField      : 'codviv',
        hiddenName      : 'vcodviv',
        anchor          : '-10'
});

//Tipo Vivienda
var cbo_tipvivienda = new Ext.form.ComboBox({
        id              : 'cbo_tipvivienda',
        name            : 'codtipviv',
        fieldLabel      : 'Tipo',
        mode            : 'local',
        disabled        : false,
        editable        : false,
        allowBlank      : false,
        store           : ds_tipovivienda,
        triggerAction   : 'all',
        displayField    : 'destipviv',
        valueField      : 'codtipviv',
        hiddenName      : 'vcodtipviv',
        anchor          : '-10',
        listeners   : {
            'select'    : function(cmb, rec, idx){
                var otro=rec.data.codtipviv;
                if (otro=='3'){
                    txt_otrotipviv.enable();
                    //cbo_parent.setValue(rec.data.despar);
                    txt_otrotipviv.focus();
                }else{
                    txt_otrotipviv.disable();
                    //cbo_parent.setValue(rec.data.despar);
                }
            }
        }
});

//Residentes
var cbo_residentes = new Ext.form.ComboBox({
        id              : 'cbo_residentes',
        name            : 'codres',
        fieldLabel      : 'Residentes',
        mode            : 'local',
        disabled        : false,
        allowBlank      : true,
        width           : 90,
        store           : ds_residentes,
        triggerAction   : 'all',
        displayField    : 'desres',
        valueField      : 'codres',
        hiddenName      : 'vcodres',
        anchor          : '99%',
        listeners       :{
            'select' : function(cmb, rec, idx){
                            selResidente=true;
                            vcodres=rec.data.codres;
                            vdesres=rec.data.desres;
                        }
        }
});

//Material Construccion
var cbo_tipmatcon = new Ext.form.ComboBox({
        id              : 'cbo_tipmatcon',
        name            : 'codtipmat',
        fieldLabel      : 'Material',
        mode            : 'local',
        disabled        : false,
        editable        : false,
        allowBlank      : false,
        store           : ds_material,
        width           : 50,
        triggerAction   : 'all',
        displayField    : 'destipmat',
        valueField      : 'codtipmat',
        hiddenName      : 'vcodtipmat',
        anchor          : '-10',
        listeners   : {
            'select'    : function(cmb, rec, idx){
                var otro=rec.data.codtipmat;
                if (otro=='4'){
                    txt_otrmatcon.enable();
                    //cbo_parent.setValue(rec.data.despar);
                    txt_otrmatcon.focus();
                }else{
                    txt_otrmatcon.disable();
                    //cbo_parent.setValue(rec.data.despar);
                }
            }
        }
});

//Estado Construccion
var cbo_estconst = new Ext.form.ComboBox({
        id              : 'cbo_estconst',
        name            : 'codestcon',
        fieldLabel      : 'Estado',
        mode            : 'local',
        disabled        : false,
        editable        : false,
        allowBlank      : false,
        store           : ds_estconstruc,
        width           : 50,
        triggerAction   : 'all',
        displayField    : 'desestcon',
        valueField      : 'codestcon',
        hiddenName      : 'vcodestcon',
        anchor          : '-10'
        //border : true
});

//Indicador de Domiciliado
var cbo_areaverde = new Ext.form.ComboBox({
        id              : 'cbo_areaverde',
        name            : 'arever',
        fieldLabel      : 'Areas Verdes',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        width           : 50,
        store           : ds_domicilia,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'desinddom',
        valueField      : 'codinddom',
        hiddenName      : 'varever',
        anchor          : '-10',
        value           : '1'
});

//Indicador de Domiciliado
var cbo_rejprot = new Ext.form.ComboBox({
        id              : 'cbo_rejprot',
        name            : 'rejpro',
        fieldLabel      : 'Rejas de protección',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        width           : 50,
        store           : ds_domicilia,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'desinddom',
        valueField      : 'codinddom',
        hiddenName      : 'vrejpro',
        anchor          : '-10',
        value           : '0'
});

//Indicador de Domiciliado
var cbo_pueaccveh = new Ext.form.ComboBox({
        id              : 'cbo_pueaccveh',
        name            : 'pueaccveh',
        fieldLabel      : 'P. de Acc. Vehicular',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        width           : 50,
        store           : ds_domicilia,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'desinddom',
        valueField      : 'codinddom',
        hiddenName      : 'vpueaccveh',
        anchor          : '-10',
        value           : '0'
});

//Indicador de Domiciliado
var cbo_zonificacion = new Ext.form.ComboBox({
        id              : 'cbo_zonificacion',
        name            : 'codzonif',
        fieldLabel      : 'Zonificación',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        width           : 50,
        store           : ds_zonifi,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'deszonif',
        valueField      : 'codzonif',
        hiddenName      : 'vcodzonif',
        anchor          : '-10'
});

//Zona de riesgo
var cbo_zonariesgo = new Ext.form.ComboBox({
        id              : 'cbo_zonariesgo',
        name            : 'codzonrie',
        fieldLabel      : 'Riesgo',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        width           : 50,
        store           : ds_zonariesgo,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'deszonrie',
        valueField      : 'codzonrie',
        hiddenName      : 'vcodzonrie',
        anchor          : '100%'
});

//Conclusiones
var cbo_conclusion = new Ext.form.ComboBox({
        id              : 'cbo_conclusion',
        name            : 'codcon',
        fieldLabel      : 'Conclusión',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        width           : 50,
        store           : ds_conclusion,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'descon',
        valueField      : 'codcon',
        hiddenName      : 'vcodcon',
        anchor          : '-10'
});

//Estados Check Domiciliario
var cboEstadoCheckDomicilio = new Ext.form.ComboBox({
        id              : 'cboEstadoCheckDomicilio',
        name            : 'codestchkdom',
        fieldLabel      : 'Guardar con Estado',
        mode            : 'local',
        disabled        : false,
        allowBlank      : false,
        store           : ds_estadoscheck,
        editable        : false,
        triggerAction   : 'all',
        displayField    : 'desestchk',
        valueField      : 'codestchk',
        hiddenName      : 'vcodestchkdom',
        anchor          : '100%'
});

///*Column Models*///
var cm_residentes = new Ext.grid.ColumnModel(
        [{
            id : 'codres',
            header: 'codres',
            readonly: true,
            dataIndex: 'codres',
            hidden: true,
            width: 10
        },{
            header: 'Residentes',
            readonly: true,
            dataIndex: 'desres',
            hidden: false,
            width: 125
        }]
    );

//////////para grid de residentes//////////

///*Records*///
var newResidente = Ext.data.Record.create([
        {name: 'codres', type: 'int'},
        {name: 'desres', type: 'string'}
    ]);

//Store fictivio para residentes
var ds_residtem = new Ext.data.Store({
            reader	:   new Ext.data.JsonReader(newResidente),
            proxy	:   new Ext.data.HttpProxy({url: "DB/checkdomicilio.php?n=100"}),
            sortInfo	:   {field:'codres', direction:'ASC'},
            autoLoad    :   false
    });

var grd_residentes = new Ext.grid.EditorGridPanel({
        id      : 'grd_personas',
        store   : ds_residtem,
        title   : 'Residentes',
        cm      : cm_residentes,
        anchor  : '100%',
        height  : 160,
        frame   : false,
        clicksToEdit :1,
	//layout    : 'fit',
	autoScroll: true,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
        tbar    :[cbo_residentes,
                {
                    xtype   : 'tbbutton',
                    cls     : 'x-btn-icon',
                    icon    : 'files/images_app/plus.png',
                    handler : function(){
                            var duplicado=false;
                            var cant_registros = ds_residtem.getCount();
                            for (var i = 0; i < cant_registros; i++) {
                                var record = grd_residentes.getStore().getAt(i);
                                var codres = record.data.codres;
                                //console.log(codpersona);
                                if (vcodres == codres) {
                                    duplicado=true;
                                    break;
                                }
                            }
                            if(duplicado==false){
                                if(selResidente==true){
                                    var r = new newResidente({
                                       codres       : vcodres,
                                       desres       : vdesres
                                    });
                                    //alert(p.get('item'));
                                    ds_residtem.insert(ds_residtem.getCount(), r);
                                    grd_residentes.getView().refresh();
                                    ds_residtem.reload();
                                    //restablece campos para agregar mas residentes
                                    selResidente=false;
                                    cbo_residentes.clearValue();
                                }else{
                                    Ext.Msg.show({title: 'Error de Ingreso',
                                                    msg: 'Debe seleccionar Un Tipo de residente a agregar',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.ERROR});
                                }
                            }else{
                                Ext.Msg.show({title: 'Error de Ingreso',
                                                    msg: 'Tipo de residente que intenta agregar ya esta en la lista',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.INFO});
                            }
                         }
                },
                {
                    xtype   : 'tbbutton',
                    cls     : 'x-btn-icon',
                    icon    : 'files/images_app/minus.png',
                    handler : function handleDelete() {
                                    var selectedKeys = grd_residentes.selModel.selections.keys;
                                    if(selectedKeys.length > 0) {
                                        Ext.Msg.confirm('ALERTA!','¿desea eliminar el registro?', function borraResidente(btn){
                                        if (btn == 'yes') {
                                            //alert(btn);
                                            var selectedRow = grd_residentes.getSelectionModel().getSelected();
                                            if (selectedRow) ds_residtem.remove(selectedRow);
                                            var cant_registros = ds_residtem.getCount();
                                                //alert(cant_registros);
                                                for (var i = 0; i < cant_registros; i++) {
                                                    var record = grd_residentes.getStore().getAt(i);
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
    //ds_residtem.load();

///*Paneles*///

//Panel de Dirección
var SubPnlDirecc = new Ext.Panel({
    frame : true,
    //collapsible : true,
    title : 'Dirección',
    items : [{
                layout	: 'column',
                border	: false,
                style	: 'padding:0px 0px 0px 0px',
                items   :[hid_checkDom,{
                        columnWidth	: .15,
                        layout	: 'form',
                        border	: false,
                        labelAlign	: 'left',
                        labelWidth 	: 25,
                        defaultType	: 'textfield',
                        items	: [cbo_tipvia]
                        },{
                        columnWidth	: .48,
                        layout	: 'form',
                        border	: false,
                        labelAlign	: 'left',
                        labelWidth 	: 60,
                        defaultType	: 'textfield',
                        items	: [txt_nomvia]
                        },{
                        columnWidth	: .17,
                        layout	: 'form',
                        border	: false,
                        labelAlign	: 'left',
                        labelWidth 	: 60,
                        defaultType	: 'textfield',
                        items	: [txt_numvia]
                        },{
                        columnWidth	: .20,
                        layout	: 'form',
                        border	: false,
                        labelAlign	: 'left',
                        labelWidth  : 30,
                        defaultType	: 'textfield',
                        items	: [txt_urb]
                        }]
             },
             {
                layout	: 'column',
                border      : false,
                style	: 'padding:0px 0px 0px 0px',
                items   :[{
                        columnWidth	: .3,
                        layout      : 'form',
                        border	: false,
                        labelAlign	: 'left',
                        labelWidth  : 90,
                        defaultType	: 'textfield',
                        items	: [cbo_depto]
                        },{
                        columnWidth	: .3,
                        layout	: 'form',
                        border	: false,
                        labelAlign	: 'left',
                        labelWidth  : 60,
                        defaultType	: 'textfield',
                        items	: [cbo_prov]
                        },{
                        columnWidth	: .4,
                        layout	: 'form',
                        border	: false,
                        labelAlign	: 'left',
                        labelWidth  : 55,
                        defaultType	: 'textfield',
                        items	: [cbo_dist]
                        }]
                }]
});

var pnl_Entrevistado = new Ext.Panel({
    frame : false,
    //collapsible : false,
    items : [{
                layout	: 'column',
                border	: false,
                style	: 'padding:5px 0px 0px 0px',
                items   :[{
                        columnWidth : .20,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 65,
                        defaultType : 'textfield',
                        items       : [cbo_domiciliado]
                        },{
                        columnWidth : .35,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 70,
                        defaultType : 'textfield',
                        items       : [txt_persentre]
                        },{
                        columnWidth : .25,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 65,
                        defaultType : 'textfield',
                        items       : [cbo_parent]
                        },{
                        columnWidth : .20,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 1,
                        defaultType : 'textfield',
                        items       : [txt_otropar]
                        }]
             }]
});

//Panel Informacion de Entrevistado
var pnl_EntrDer = new Ext.Panel({
    frame : false,
    collapsible : false,
    items : [{
                layout	: 'column',
                border      : false,
                style	: 'padding:0px 0px 0px 0px',
                items   :[{
                        columnWidth : .15,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 32,
                        defaultType : 'textfield',
                        items       : [txt_tiemanio]
                        },{
                        columnWidth : .17,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 40,
                        defaultType : 'textfield',
                        items       : [txt_tiemmeso]
                        },{
                        columnWidth : .25,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 40,
                        defaultType : 'textfield',
                        items       : [cbo_vivienda]
                        },{
                        columnWidth : .25,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 30,
                        defaultType : 'textfield',
                        items       : [cbo_tipvivienda]
                        },{
                        columnWidth : .18,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 1,
                        defaultType : 'textfield',
                        items       : [txt_otrotipviv]
                        }]
                },{
                layout	: 'column',
                border      : false,
                style	: 'padding:0px 0px 0px 0px',
                items   :[{
                        columnWidth : .17,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 55,
                        defaultType : 'textfield',
                        items       : [txt_numpis]
                        },{
                        columnWidth : .28,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 110,
                        defaultType : 'textfield',
                        items       : [txt_pisres]
                        },{
                        columnWidth : .30,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 45,
                        defaultType : 'textfield',
                        items       : [cbo_tipmatcon]
                        },{
                        columnWidth : .25,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 1,
                        defaultType : 'textfield',
                        items       : [txt_otrmatcon]
                        }]
                },{
                layout	: 'column',
                border      : false,
                style	: 'padding:0px 0px 0px 0px',
                items   :[{
                        columnWidth : .30,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 45,
                        defaultType : 'textfield',
                        items       : [cbo_estconst]
                        },{
                        columnWidth : .25,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 80,
                        defaultType : 'textfield',
                        items       : [cbo_areaverde]
                        },{
                        columnWidth : .45,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 100,
                        defaultType : 'textfield',
                        items       : [txt_colfac]
                        }]
                },{
                layout	: 'column',
                border      : false,
                style	: 'padding:0px 0px 0px 0px',
                items   :[{
                        columnWidth : .33,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 135,
                        defaultType : 'textfield',
                        items       : [txt_puertas]
                        },{
                        columnWidth : .22,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 80,
                        defaultType : 'textfield',
                        items       : [txt_ventanas]
                        },{
                        columnWidth : .45,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 100,
                        defaultType : 'textfield',
                        items       : [txt_tipmatpue]
                        }]
                },{
                layout	: 'column',
                border      : false,
                style	: 'padding:0px 0px 0px 0px',
                items   :[{
                        columnWidth : .33,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 120,
                        defaultType : 'textfield',
                        items       : [cbo_rejprot]
                        },{
                        columnWidth : .35,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 120,
                        defaultType : 'textfield',
                        items       : [cbo_pueaccveh]
                        }]
                },{
                layout	: 'column',
                border      : false,
                style	: 'padding:0px 0px 0px 0px',
                items   :[{
                        columnWidth : 1.0,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 75,
                        defaultType : 'textfield',
                        items       : [txt_obsinmu]
                        }]
                }]
});

var SubPnlEntrev = new Ext.Panel({
    frame : true,
    //collapsible : true,
    title : 'Información del Check Domiciliario',
    items : [{layout	: 'column',
                border	: false,
                style	: 'padding: 0px 0px 0px 0px',
                items   :[{
                        columnWidth : .80,
                        items       : [pnl_EntrDer]
                        },{
                        columnWidth : .20,
                        items       : [grd_residentes]
                        }]
             }]
});

//Panel Descripcion Zona
var pnl_DescZona = new Ext.Panel({
    frame : true,
    //collapsible : true,
    title : 'Descripción de la Zona',
    items : [{
                layout	: 'column',
                border      : false,
                style	: 'padding:0px 0px 0px 0px',
                items   :[{
                        columnWidth : .30,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 70,
                        defaultType : 'textfield',
                        items       : [cbo_zonificacion]
                        },{
                        columnWidth : .45,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 1,
                        defaultType : 'textfield',
                        items       : [txt_otrzonif]
                        },{
                        columnWidth : .25,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 40,
                        defaultType : 'textfield',
                        items       : [cbo_zonariesgo]
                        }]
                }]
});

//Panel Descripcion Zona
var pnl_ConcluDomi = new Ext.Panel({
    frame : true,
    items : [{
                layout	: 'column',
                border      : false,
                style	: 'padding:0px 0px 0px 0px',
                items   :[{
                        columnWidth : .5,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 50,
                        defaultType : 'textfield',
                        items       : [cbo_conclusion]
                        },{
                        columnWidth : .5,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 130,
                        defaultType : 'textfield',
                        items       : [cboEstadoCheckDomicilio]
                        }]
                },{
                layout	: 'column',
                border      : false,
                style	: 'padding:0px 0px 0px 0px',
                items   :[{
                        columnWidth : 1.0,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 95,
                        //defaultType : 'textfield',
                        items       : [txt_obsCheckDom]
                        }]
                }]
});

//Panel Imagenes
var pnl_imagenes = new Ext.FormPanel({
    frame : true,
    width : 740,
    title : 'Imagenes Domicilio',
    tbar : [{
                xtype: 'tbfill'
            },
            {
                text : 'Grabar Imagenes',
                cls  : 'x-btn-text-icon',
                icon : 'files/images_app/disk.png',
                handler : function(){
                    var chkdom = hid_checkDom.getValue();
                        if(pnl_imagenes.getForm().isValid()){
                            pnl_imagenes.getForm().submit({
                                url : 'DB/checkdomicilio.php',
                                params: {n:17, codsol:cod_sol, codper:cod_per, codchk:chkdom},
                                waitTitle : 'Imagenes Check Domiciliario',
                                waitMsg: 'Guardando imagenes...',
                                success:function(form, action){
                                    var obj = Ext.util.JSON.decode(action.response.responseText);
                                    var mensaje = obj.respuesta.mensaje;
                                    var img1 = obj.respuesta.imagen1;
                                    var img2 = obj.respuesta.imagen2;
                                    var mapa = obj.respuesta.mapa;
                                    hid_imgdom1act.setValue(img1);
                                    hid_imgdom2act.setValue(img2);
                                    hid_imgmapact.setValue(mapa);
                                    Ext.Msg.show({
                                        title: 'Check Domiciliario',
                                        msg: mensaje,
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.INFO
                                    });
                                },
                                failure:function(form, action){
                                    if(action.failureType == 'server'){
                                        var obj = Ext.util.JSON.decode(action.response.responseText);
                                        Ext.Msg.alert('Check Domiciliario', obj.confirma.mensaje);
                                    }
                                    else{
                                        Ext.Msg.alert('Atenci&oacute;n!', 'El servidor no ha podido ser contactado : ' + action.response.responseText + " ");
                                    }
                                }
                            });
                        }else{
                            Ext.Msg.show({
                                title: 'Error',
                                msg: 'Debe ingresar todos los campos obligatorios',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        }
                        }
            }
    ],
    items : [{
                layout	: 'column',
                border      : false,
                style	: 'padding:5px 0px 0px 0px',
                items   :[hid_imgdom1act,{
                        columnWidth : .40,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 70,
                        defaultType : 'textfield',
                        items       : [upf_imgdom1]
                        },{
                        columnWidth : .20,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 1,
                        defaultType : 'textfield',
                        items       : [btnImgDom1]
                        },{
                        columnWidth : .40,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 80,
                        defaultType : 'textfield',
                        items       : [cbo_tipimg1]
                        }]
                },{
                layout	: 'column',
                border      : false,
                style	: 'padding:0px 0px 0px 0px',
                items   :[hid_imgdom2act,{
                        columnWidth : .40,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 70,
                        defaultType : 'textfield',
                        items       : [upf_imgdom2]
                        },{
                        columnWidth : .20,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 1,
                        defaultType : 'textfield',
                        items       : [btnImgDom2]
                        },{
                        columnWidth : .40,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 80,
                        defaultType : 'textfield',
                        items       : [cbo_tipimg2]
                        }]
                },{
                layout	: 'column',
                border      : false,
                style	: 'padding:0px 0px 0px 0px',
                items   :[hid_imgmapact,{
                        columnWidth : .40,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 70,
                        defaultType : 'textfield',
                        items       : [upf_imgmapa]
                        },{
                        columnWidth : .20,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 1,
                        defaultType : 'textfield',
                        items       : [btnImgMap]
                        },{
                        columnWidth : .40,
                        layout      : 'form',
                        border      : false,
                        labelAlign  : 'left',
                        labelWidth  : 80,
                        defaultType : 'textfield',
                        items       : [cbo_imgpama]
                        }]
                }]
});

//Panel principal para el CheckService
var frmCheckDomiciliario = new Ext.FormPanel({
    url         : 'DB/checkdomicilio.php',
    frame       : false,
    border      : false,
    fileUpload  : true,
    //autoScroll : true,
    width : 740,
    style       : 'padding:1px 1px 1px 1px',
    items       : [SubPnlDirecc,pnl_Entrevistado,SubPnlEntrev,pnl_DescZona,pnl_ConcluDomi]
});

//Botones de los Checks

//TabPanel que contiene los diferentes Checks
var tabPanelCheck = new Ext.TabPanel({
    activeTab: 0,
    border:false,
    items   :   [{
            title   : 'Check Service',
            id      : 'tbp_checkservice',
            disabled    : true,
            frame   : true,
            border  : false,
            items   : [frmCheckService],
            tbar    : ['Nombre : ',txt_chksrvnomper,'Puesto : ',cboCheckPuestos,{
                        xtype: 'tbfill'
                        },
                        {
                            text : 'Grabar',
                            cls  : 'x-btn-text-icon',
                            id  : 'btn_GrabarCheckSrevice',
                            icon : 'files/images_app/disk.png',
                            handler : function(){
                                var imagen = upf_imagendni.getValue().trim();
                                var imagenant = hid_imgactreniec.getValue();
                                if(imagenant!='default.jpg' || imagen!=''){
                                    if(frmCheckService.getForm().isValid()){
                                        frmCheckService.getForm().submit({
                                            url : 'DB/checkservice.php',
                                            params: {n:4,codsol:cod_sol,codper:cod_per},
                                            waitTitle : 'Check Service',
                                            waitMsg: 'Guardando datos...',
                                            success:function(form, action){
                                                        var obj = Ext.util.JSON.decode(action.response.responseText);
                                                        var est = obj.respuesta.estado;
                                                        var img = obj.img.imagen;
                                                        if(est!='3'){
                                                            Ext.Msg.show({
                                                                title: 'Check Service',
                                                                msg: obj.confirma.mensaje,
                                                                buttons: Ext.MessageBox.OK,
                                                                icon: Ext.MessageBox.INFO
                                                            });
                                                            hid_imgactreniec.setValue(img);
                                                        }
                                                        else{
                                                            upf_imagendni.disable();
                                                            txt_obsdni.setReadOnly(true);
                                                            cbo_refpol.setReadOnly(true);
                                                            cbo_antpol.setReadOnly(true);
                                                            cbo_reqjud.setReadOnly(true);
                                                            cbo_refter.setReadOnly(true);
                                                            cbo_refdro.setReadOnly(true);
                                                            cbo_impsal.setReadOnly(true);
                                                            cbo_invpen.setReadOnly(true);
                                                            cboDelitos.setReadOnly(true);
                                                            cboEstadoCheckService.setReadOnly(true);
                                                            txt_invpol.setReadOnly(true);
                                                            txt_invpen.setReadOnly(true);
                                                            txt_defdel.setReadOnly(true);
                                                            txt_recome.setReadOnly(true);
                                                            hid_imgactreniec.setValue(img);
                                                            Ext.getCmp('btn_GrabarCheckSrevice').disable();
                                                            Ext.Msg.show({
                                                                title: 'Check Service',
                                                                msg: 'Se grabó como Finalizado, Check Service ahora es solo de lectura',
                                                                buttons: Ext.MessageBox.OK,
                                                                icon: Ext.MessageBox.INFO
                                                            });
                                                        }

                                            },
                                            failure:function(form, action){
                                                        if(action.failureType == 'server'){
                                                            var obj = Ext.util.JSON.decode(action.response.responseText);
                                                            Ext.Msg.alert('Check Service', obj.confirma.mensaje);
                                                        }
                                                        else{
                                                            Ext.Msg.alert('Atenci&oacute;n!', 'El servidor no ha podido ser contactado : ' + action.response.responseText + " ");
                                                        }
                                            }
                                        });
                                    }
                                    else{
                                        Ext.Msg.show({
                                            title: 'Error',
                                            msg: 'Debe ingresar todos los campos obligatorios',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.ERROR
                                        });
                                    }
                                }
                                else{
                                    Ext.Msg.show({
                                        title: 'Error',
                                        msg: 'Debe ingresar la ruta de la imagen del DNI',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.ERROR
                                    });
                                }
                            }
                        }
                    ]
    },{
            title   : 'Check Domiciliario',
            id      : 'tbp_checkdomicilio',
            disabled    : true,
            frame : true,
            border : false,
            autoScroll : true,
            items : [frmCheckDomiciliario,pnl_imagenes],
            tbar    : ['Nombre : ',txt_chkdomnomper,'Puesto : ',cboCheckPuestosDom,{
                        xtype: 'tbfill'
                        },
                        {
                            text : 'Grabar',
                            cls  : 'x-btn-text-icon',
                            id  : 'btn_GrabarCheckDomicilio',
                            icon : 'files/images_app/disk.png',
                            handler : function(){
                                var cant_registros = ds_residtem.getCount();
                                var array_detalle = [];
                                if(cant_registros>0){
                                    if(frmCheckDomiciliario.getForm().isValid()){
                                        Ext.Msg.confirm('Confirmación','¿Confirma que desea grabar el Check Domiciliario?', function GrabaSolicitud(btn){
                                            if (btn == 'yes') {
                                                //arma información del detalle de residentes
                                                for (var i = 0; i < cant_registros; i++) {
                                                    var record = grd_residentes.getStore().getAt(i);
                                                    var xcodsol = cod_sol;
                                                    var xcodper = cod_per;
                                                    var xcodchk = hid_checkDom.getValue();//record.data.codpue;
                                                    var xcodres = record.data.codres;
                                                    var item = xcodsol + '$$' + xcodper + '$$' + xcodchk + '$$' + xcodres;
                                                    array_detalle.push(item);
                                                }
                                                //arma datos con informacion del check domiciliario
                                                var chkdom = hid_checkDom.getValue();
                                                var codper = cod_per;
                                                var codsol = cod_sol;
                                                //Direccion
                                                var codvia = cbo_tipvia.getValue();
                                                var nomvia = Ext.util.Format.trim(txt_nomvia.getValue());
                                                var numvia = Ext.util.Format.trim(txt_numvia.getValue());
                                                var urb = Ext.util.Format.trim(txt_urb.getValue());
                                                var gdpto = cbo_depto.getValue();
                                                var gprov = cbo_prov.getValue();
                                                var gdist = cbo_dist.getValue();
                                                //Domiciliado
                                                var inddom = cbo_domiciliado.getValue();
                                                var entrev = Ext.util.Format.trim(txt_persentre.getValue());
                                                var parent = cbo_parent.getValue();
                                                var otrpar = Ext.util.Format.trim(txt_otropar.getValue());
                                                //Informacion Check
                                                var anores = Ext.util.Format.trim(txt_tiemanio.getValue());
                                                var mesres = Ext.util.Format.trim(txt_tiemmeso.getValue());
                                                var condviv = cbo_vivienda.getValue();
                                                var tipviv = cbo_tipvivienda.getValue();
                                                var otrtipviv = Ext.util.Format.trim(txt_otrotipviv.getValue());
                                                var numpis = txt_numpis.getValue();
                                                var pisres = txt_pisres.getValue();
                                                var tipmat = cbo_tipmatcon.getValue();
                                                var otrtipmat = Ext.util.Format.trim(txt_otrmatcon.getValue());
                                                var estcon = cbo_estconst.getValue();
                                                var arever = cbo_areaverde.getValue();
                                                var colfac = Ext.util.Format.trim(txt_colfac.getValue());
                                                var pueing = txt_puertas.getValue();
                                                var vent = txt_ventanas.getValue();
                                                var tipmatpue = Ext.util.Format.trim(txt_tipmatpue.getValue());
                                                var rejpro = cbo_rejprot.getValue();
                                                var accveh = cbo_pueaccveh.getValue();
                                                var obsdom = Ext.util.Format.trim(txt_obsinmu.getValue());
                                                //Zona
                                                var tipzon = cbo_zonificacion.getValue();
                                                var otrzon = Ext.util.Format.trim(txt_otrzonif.getValue());
                                                var zonrie = cbo_zonariesgo.getValue();
                                                //Conclusion
                                                var conclu = cbo_conclusion.getValue();
                                                var estchkdom = cboEstadoCheckDomicilio.getValue();
                                                var obschkdom = Ext.util.Format.trim(txt_obsCheckDom.getValue());
                                                //Residentes
                                                var detalleres = array_detalle.join('|,|');
                                                Ext.Ajax.request({
                                                    url : 'DB/checkdomicilio.php',
                                                    params : {
                                                        n   : 16,
                                                        codchkdom : chkdom,
                                                        codper : codper,
                                                        codsol : codsol,
                                                        coddpto : gdpto,
                                                        codpro : gprov,
                                                        coddist : gdist,
                                                        codtipvia : codvia,
                                                        nomviadom : nomvia,
                                                        numdom : numvia,
                                                        urbdom : urb,
                                                        domici : inddom,
                                                        perent : entrev,
                                                        codpar : parent,
                                                        otroparent : otrpar,
                                                        anoresdom : anores ,
                                                        mesresdom : mesres,
                                                        codviv : condviv,
                                                        codtipviv : tipviv,
                                                        otrtipviv : otrtipviv,
                                                        numpis : numpis,
                                                        pisres : pisres,
                                                        codtipmat : tipmat,
                                                        otrmatcon : otrtipmat,
                                                        codestcon : estcon,
                                                        arever : arever,
                                                        colfac : colfac,
                                                        numpue : pueing,
                                                        numven : vent,
                                                        tipmat : tipmatpue,
                                                        rejpro : rejpro,
                                                        pueaccveh : accveh,
                                                        obsinmu : obsdom,
                                                        codzonif : tipzon,
                                                        otrzonif : otrzon,
                                                        codzonrie : zonrie,
                                                        codcon : conclu,
                                                        obscon : obschkdom,
                                                        codestchk : estchkdom,
                                                        detalle : detalleres
                                                    },
                                                    callback : function(opt,success,response){
                                                        if (success) {
                                                            var responseData = Ext.util.JSON.decode(response.responseText);
                                                            var error = responseData.respuesta.error;
                                                            var mensaje = responseData.respuesta.mensaje;
                                                            var est = responseData.respuesta.estado;
                                                            if (error==0){
                                                                if(est!='3'){
                                                                    Ext.Msg.show({
                                                                        title: 'Check Domiciliario',
                                                                        msg: mensaje,
                                                                        buttons: Ext.MessageBox.OK,
                                                                        icon: Ext.MessageBox.INFO
                                                                    });
                                                                }
                                                            else {
                                                                cbo_tipvia.setReadOnly(true);
                                                                txt_nomvia.setReadOnly(true);
                                                                txt_numvia.setReadOnly(true);
                                                                txt_urb.setReadOnly(true);
                                                                cbo_prov.setReadOnly(true);
                                                                cbo_depto.setReadOnly(true);
                                                                cbo_dist.setReadOnly(true);
                                                                cbo_domiciliado.setReadOnly(true);
                                                                txt_persentre.setReadOnly(true);
                                                                cbo_parent.setReadOnly(true);
                                                                txt_otropar.setReadOnly(true);
                                                                txt_tiemanio.setReadOnly(true);
                                                                txt_tiemmeso.setReadOnly(true);
                                                                cbo_vivienda.setReadOnly(true);
                                                                cbo_tipvivienda.setReadOnly(true);
                                                                txt_otrotipviv.setReadOnly(true);
                                                                txt_numpis.setReadOnly(true);
                                                                txt_pisres.setReadOnly(true);
                                                                cbo_tipmatcon.setReadOnly(true);
                                                                txt_otrmatcon.setReadOnly(true);
                                                                cbo_estconst.setReadOnly(true);
                                                                cbo_areaverde.setReadOnly(true);
                                                                txt_colfac.setReadOnly(true);
                                                                txt_puertas.setReadOnly(true);
                                                                txt_ventanas.setReadOnly(true);
                                                                txt_tipmatpue.setReadOnly(true);
                                                                cbo_rejprot.setReadOnly(true);
                                                                cbo_pueaccveh.setReadOnly(true);
                                                                txt_obsinmu.setReadOnly(true);
                                                                cbo_residentes.setReadOnly(true);
                                                                cbo_zonificacion.setReadOnly(true);
                                                                cbo_zonariesgo.setReadOnly(true);
                                                                cbo_conclusion.setReadOnly(true);
                                                                cboEstadoCheckDomicilio.setReadOnly(true);
                                                                txt_obsCheckDom.setReadOnly(true);
                                                                //imagenes
                                                                upf_imgdom1.disable();
                                                                upf_imgdom2.disable();
                                                                upf_imgmapa.disable();
                                                                cbo_tipimg1.setReadOnly(true);
                                                                cbo_tipimg2.setReadOnly(true);
                                                                cbo_imgpama.setReadOnly(true);
                                                                Ext.getCmp('btn_GrabarCheckDomicilio').disable();
                                                                Ext.Msg.show({
                                                                    title: 'Check Domiciliario',
                                                                    msg: 'Se grabó como Finalizado, Check Domiciliario ahora es solo de lectura',
                                                                    buttons: Ext.MessageBox.OK,
                                                                    icon: Ext.MessageBox.INFO
                                                                });
                                                            }
                                                            }
                                                            else {
                                                                Ext.Msg.show({
                                                                        title: 'Check Domiciliario',
                                                                        msg: mensaje,
                                                                        buttons: Ext.MessageBox.OK,
                                                                        icon: Ext.MessageBox.ERROR
                                                                    });
                                                            }
                                                        }
                                                        else {
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
                                    Ext.Msg.alert('Advertencia!','No se han agregado residentes');
                                }
                            }
                        }]
    },{
            title   : 'Check Laboral',
            id      : 'tbp_checklaboral',
            disabled    : true
    }]
});


//DataStore para obtener datos grabados del CheckService
var ds_obtieneCheckService = new Ext.data.Store({
                    reader: new Ext.data.JsonReader({
                        root            : 'chechservicepersona',
                        totalProperty	: 'total',
                        id              : 'codchkser'
                        },
                        [{name: 'codchkser', mapping: 'codchkser'},
                        {name: 'imgreniec', mapping: 'imgreniec'},
                        {name: 'obsimgreniec', mapping: 'obsimgreniec'},
                        {name: 'indrefpol', mapping: 'indrefpol'},
                        {name: 'refpolchk', mapping: 'refpolchk'},
                        {name: 'indantpol', mapping: 'indantpol'},
                        {name: 'indreqjud', mapping: 'indreqjud'},
                        {name: 'indrefter', mapping: 'indrefter'},
                        {name: 'indrefdro', mapping: 'indrefdro'},
                        {name: 'indimpsalpai', mapping: 'indimpsalpai'},
                        {name: 'indinvpen', mapping: 'indinvpen'},
                        {name: 'invpenchk', mapping: 'invpenchk'},
                        {name: 'recchk', mapping: 'recchk'},
                        {name: 'coddel', mapping: 'coddel'},
                        {name: 'codestchk', mapping: 'codestchk'}
                        ]),
                    proxy: new Ext.data.HttpProxy({
                        url: 'DB/checkservice.php',
                        method : 'POST'
                    }),
                    baseParams:{n:3, codsol:cod_sol, codper:cod_per},
                    autoLoad: false,
                    listeners:{
                        load : function(store){
                                var numchecks=store.getCount();
                                for (var i = 0; i < numchecks; i++){
                                    var imgren=store.getAt(i).data.imgreniec;
                                    hid_imgactreniec.setValue(imgren);
                                    var obsdni=store.getAt(i).data.obsimgreniec;
                                    txt_obsdni.setValue(obsdni);

                                    var refpol=store.getAt(i).data.indrefpol;
                                    cbo_refpol.setValue(refpol);
                                    var antpol=store.getAt(i).data.indantpol;
                                    cbo_antpol.setValue(antpol);
                                    var reqjud=store.getAt(i).data.indreqjud;
                                    cbo_reqjud.setValue(reqjud);
                                    var refter=store.getAt(i).data.indrefter;
                                    cbo_refter.setValue(refter);
                                    var refdro=store.getAt(i).data.indrefdro;
                                    cbo_refdro.setValue(refdro);
                                    var impsal=store.getAt(i).data.indimpsalpai;
                                    cbo_impsal.setValue(impsal);
                                    var invpen=store.getAt(i).data.indinvpen;
                                    cbo_invpen.setValue(invpen);
                                    if(refpol=='1' || antpol=='1' || reqjud=='1' || refter=='1' || refdro=='1' || impsal=='1'){
                                        var txtinvpol=store.getAt(i).data.refpolchk;
                                        txt_invpol.setValue(txtinvpol);
                                        txt_invpol.enable();
                                        cboDelitos.enable();
                                    }
                                    if(invpen=='1'){
                                        var txtinvpen=store.getAt(i).data.invpenchk;
                                        txt_invpen.setValue(txtinvpen);
                                        txt_invpen.enable();
                                        cboDelitos.enable();
                                    }
                                    var delito=store.getAt(i).data.coddel;
                                    cboDelitos.setValue(delito);
                                    if(delito!=null){
                                        var desdel = ds_delitos.getById(delito);
                                        txt_defdel.setValue(desdel.data.desdel);                                       
                                    }
                                    var recome=store.getAt(i).data.recchk;
                                    txt_recome.setValue(recome);
                                    var estado =store.getAt(i).data.codestchk;
                                    cboEstadoCheckService.setValue(estado);
                                    if(estado=='3'){
                                        upf_imagendni.disable();
                                        txt_obsdni.setReadOnly(true);
                                        cbo_refpol.setReadOnly(true);
                                        cbo_antpol.setReadOnly(true);
                                        cbo_reqjud.setReadOnly(true);
                                        cbo_refter.setReadOnly(true);
                                        cbo_refdro.setReadOnly(true);
                                        cbo_impsal.setReadOnly(true);
                                        cbo_invpen.setReadOnly(true);
                                        cboDelitos.setReadOnly(true);
                                        cboEstadoCheckService.setReadOnly(true);
                                        txt_invpol.setReadOnly(true);
                                        txt_invpen.setReadOnly(true);
                                        txt_defdel.setReadOnly(true);
                                        txt_recome.setReadOnly(true);
                                        Ext.getCmp('btn_GrabarCheckSrevice').disable();
                                    }
                                }
                        }
                    }
});



//DataStore para obtener datos grabados del CheckService
var ds_obtieneCheckDomici = new Ext.data.Store({
                    reader: new Ext.data.JsonReader({
                        root            : 'checkdomiciliopersona',
                        totalProperty	: 'total',
                        id              : 'codchkdom'
                        },
                        [{name: 'codchkdom', mapping: 'codchkdom'},
                        {name: 'coddpto', mapping: 'coddpto'},
                        {name: 'codpro', mapping: 'codpro'},
                        {name: 'coddist', mapping: 'coddist'},
                        {name: 'codtipvia', mapping: 'codtipvia'},
                        {name: 'nomviadom', mapping: 'nomviadom'},
                        {name: 'numdom', mapping: 'numdom'},
                        {name: 'urbdom', mapping: 'urbdom'},
                        {name: 'domici', mapping: 'domici'},
                        {name: 'perent', mapping: 'perent'},
                        {name: 'codpar', mapping: 'codpar'},
                        {name: 'otroparent', mapping: 'otroparent'},
                        {name: 'anoresdom', mapping: 'anoresdom'},
                        {name: 'mesresdom', mapping: 'mesresdom'},
                        {name: 'codviv', mapping: 'codviv'},
                        {name: 'codtipviv', mapping: 'codtipviv'},
                        {name: 'otrtipviv', mapping: 'otrtipviv'},
                        {name: 'numpis', mapping: 'numpis'},
                        {name: 'pisres', mapping: 'pisres'},
                        {name: 'codtipmat', mapping: 'codtipmat'},
                        {name: 'otrmatcon', mapping: 'otrmatcon'},
                        {name: 'codestcon', mapping: 'codestcon'},
                        {name: 'arever', mapping: 'arever'},
                        {name: 'colfac', mapping: 'colfac'},
                        {name: 'numpue', mapping: 'numpue'},
                        {name: 'numven', mapping: 'numven'},
                        {name: 'tipmat', mapping: 'tipmat'},
                        {name: 'rejpro', mapping: 'rejpro'},
                        {name: 'pueaccveh', mapping: 'pueaccveh'},
                        {name: 'obsinmu', mapping: 'obsinmu'},
                        {name: 'codzonif', mapping: 'codzonif'},
                        {name: 'otrzonif', mapping: 'otrzonif'},
                        {name: 'codzonrie', mapping: 'codzonrie'},
                        {name: 'codcon', mapping: 'codcon'},
                        {name: 'obscon', mapping: 'obscon'},
                        {name: 'codestchk', mapping: 'codestchk'}
                        ]),
                    proxy: new Ext.data.HttpProxy({
                        url: 'DB/checkdomicilio.php',
                        method : 'POST'
                    }),
                    baseParams:{n:15, codsol:cod_sol, codper:cod_per},
                    autoLoad: false,
                    listeners:{
                        load : function(store){
                                var numchecks=store.getCount();
                                for (var i = 0; i < numchecks; i++){
                                    var lchkdom = store.getAt(i).data.codchkdom;
                                    hid_checkDom.setValue(lchkdom);
                                    //alert(lchkdom);
                                    var lvia = store.getAt(i).data.codtipvia;
                                    cbo_tipvia.setValue(lvia);
                                    var lnomvia = store.getAt(i).data.nomviadom;
                                    txt_nomvia.setValue(lnomvia);
                                    var lnumvia = store.getAt(i).data.numdom;
                                    txt_numvia.setValue(lnumvia);
                                    var lurb = store.getAt(i).data.urbdom;
                                    txt_urb.setValue(lurb);
                                    var ldept = store.getAt(i).data.coddpto;
                                    cbo_depto.setValue(ldept);
                                    //cbo_prov.clearValue();
                                    cbo_prov.store.load({
                                        params : {
                                            depa : cbo_depto.getValue()
                                        }
                                    });
                                    cbo_prov.enable();
                                    var lprov = store.getAt(i).data.codpro;
                                    cbo_prov.setValue(lprov);
                                    //cbo_dist.clearValue();
                                    cbo_dist.store.load({
                                        params : {
                                            depa : cbo_depto.getValue(),
                                            prov : cbo_prov.getValue()
                                        }
                                    });
                                    cbo_dist.enable();
                                    var ldist = store.getAt(i).data.coddist;
                                    cbo_dist.setValue(ldist);
                                    var ldomic = store.getAt(i).data.domici;
                                    cbo_domiciliado.setValue(ldomic);
                                    var lentre = store.getAt(i).data.perent;
                                    txt_persentre.setValue(lentre);
                                    var lcodpar = store.getAt(i).data.codpar;
                                    cbo_parent.setValue(lcodpar);
                                    var lotrpar = store.getAt(i).data.otroparent;
                                    txt_otropar.setValue(lotrpar);
                                    var lanores = store.getAt(i).data.anoresdom;
                                    txt_tiemanio.setValue(lanores);
                                    var lmesres = store.getAt(i).data.mesresdom;
                                    txt_tiemmeso.setValue(lmesres);
                                    var lcodviv = store.getAt(i).data.codviv;
                                    cbo_vivienda.setValue(lcodviv);
                                    var ltipviv = store.getAt(i).data.codtipviv;
                                    cbo_tipvivienda.setValue(ltipviv);
                                    var lotipviv = store.getAt(i).data.otrtipviv
                                    txt_otrotipviv.setValue(lotipviv);
                                    var lnumpi = store.getAt(i).data.numpis;
                                    txt_numpis.setValue(lnumpi);
                                    var lpisres = store.getAt(i).data.pisres;
                                    txt_pisres.setValue(lpisres)
                                    var ltipmat = store.getAt(i).data.codtipmat;
                                    cbo_tipmatcon.setValue(ltipmat);
                                    var lotipmat = store.getAt(i).data.otrmatcon;
                                    txt_otrmatcon.setValue(lotipmat);
                                    var lestcon = store.getAt(i).data.codestcon;
                                    cbo_estconst.setValue(lestcon);
                                    var larever = store.getAt(i).data.arever;
                                    cbo_areaverde.setValue(larever);
                                    var lcolfac = store.getAt(i).data.colfac;
                                    txt_colfac.setValue(lcolfac);
                                    var lnumpue = store.getAt(i).data.numpue;
                                    txt_puertas.setValue(lnumpue);
                                    var lnumven = store.getAt(i).data.numven;
                                    txt_ventanas.setValue(lnumven);
                                    var ltipmatpue = store.getAt(i).data.tipmat;
                                    txt_tipmatpue.setValue(ltipmatpue);
                                    var lrejpro = store.getAt(i).data.rejpro;
                                    cbo_rejprot.setValue(lrejpro);
                                    var laccveh = store.getAt(i).data.pueaccveh;
                                    cbo_pueaccveh.setValue(laccveh);
                                    var lobsinm = store.getAt(i).data.obsinmu;
                                    txt_obsinmu.setValue(lobsinm);
                                    var lcodzonif = store.getAt(i).data.codzonif;
                                    cbo_zonificacion.setValue(lcodzonif);
                                    var lozonif = store.getAt(i).data.otrzonif;
                                    txt_otrzonif.setValue(lozonif);
                                    var lzonrie = store.getAt(i).data.codzonrie;
                                    cbo_zonariesgo.setValue(lzonrie);
                                    var lcodcon = store.getAt(i).data.codcon;
                                    cbo_conclusion.setValue(lcodcon);
                                    var lobscon = store.getAt(i).data.obscon;
                                    txt_obsCheckDom.setValue(lobscon);
                                    var lestchk = store.getAt(i).data.codestchk;
                                    cboEstadoCheckDomicilio.setValue(lestchk);
                                    //ResidentesGrabados
                                    
                                    var ds_residentesgrabados = new Ext.data.Store({
                                        reader  : new Ext.data.JsonReader({
                                                        fields  : ['codres', 'desres'],
                                                        root    : 'residentesdom',
                                                        id      : 'codres'
                                                }),
                                        proxy: new Ext.data.HttpProxy({
                                                        url: 'DB/checkdomicilio.php'
                                                }),
                                        baseParams:{n:0, codchkdom:lchkdom},
                                        autoLoad: false,
                                        listeners : {
                                            load : function(store){
                                                        var resiregist=store.getCount();
                                                        //alert('en el store vale'+resiregist);
                                                        for (var j = 0; j < resiregist; j++) {
                                                            var r = new newResidente({
                                                               codres       : ds_residentesgrabados.getAt(j).data.codres,
                                                               desres       : ds_residentesgrabados.getAt(j).data.desres
                                                            });
                                                            //alert(p.get('item'));
                                                            ds_residtem.insert(ds_residtem.getCount(), r);
                                                        }
                                                    }
                                        }
                                    });
                                    ds_residentesgrabados.load();

                                    var ds_imagenesdomicilio = new Ext.data.Store({
                                        reader : new Ext.data.JsonReader({
                                            fields : ['codimgdom','codtipimg','nomimgdom','numimgdom'],
                                            root    : 'imagenesdomicilio',
                                            id              : 'codimgdom'
                                        }),
                                        proxy: new Ext.data.HttpProxy({
                                                            url: 'DB/checkdomicilio.php'
                                                        }),
                                        baseParams:{n:18, codsol:cod_sol, codper:cod_per},
                                        autoLoad: false,
                                        listeners:{
                                            load : function(store){
                                                var numimages=store.getCount();
                                                alert(numimages);
                                            }
                                        }
                                    });
                                    ds_imagenesdomicilio.load();

                                    if(lestchk=='3'){
                                        cbo_tipvia.setReadOnly(true);
                                        txt_nomvia.setReadOnly(true);
                                        txt_numvia.setReadOnly(true);
                                        txt_urb.setReadOnly(true);
                                        cbo_prov.setReadOnly(true);
                                        cbo_depto.setReadOnly(true);
                                        cbo_dist.setReadOnly(true);
                                        cbo_domiciliado.setReadOnly(true);
                                        txt_persentre.setReadOnly(true);
                                        cbo_parent.setReadOnly(true);
                                        txt_otropar.setReadOnly(true);
                                        txt_tiemanio.setReadOnly(true);
                                        txt_tiemmeso.setReadOnly(true);
                                        cbo_vivienda.setReadOnly(true);
                                        cbo_tipvivienda.setReadOnly(true);
                                        txt_otrotipviv.setReadOnly(true);
                                        txt_numpis.setReadOnly(true);
                                        txt_pisres.setReadOnly(true);
                                        cbo_tipmatcon.setReadOnly(true);
                                        txt_otrmatcon.setReadOnly(true);
                                        cbo_estconst.setReadOnly(true);
                                        cbo_areaverde.setReadOnly(true);
                                        txt_colfac.setReadOnly(true);
                                        txt_puertas.setReadOnly(true);
                                        txt_ventanas.setReadOnly(true);
                                        txt_tipmatpue.setReadOnly(true);
                                        cbo_rejprot.setReadOnly(true);
                                        cbo_pueaccveh.setReadOnly(true);
                                        txt_obsinmu.setReadOnly(true);
                                        cbo_residentes.setReadOnly(true);
                                        cbo_zonificacion.setReadOnly(true);
                                        cbo_zonariesgo.setReadOnly(true);
                                        cbo_conclusion.setReadOnly(true);
                                        cboEstadoCheckDomicilio.setReadOnly(true);
                                        txt_obsCheckDom.setReadOnly(true);
                                        //imagenes
                                        upf_imgdom1.disable();
                                        upf_imgdom2.disable();
                                        upf_imgmapa.disable();
                                        cbo_tipimg1.setReadOnly(true);
                                        cbo_tipimg2.setReadOnly(true);
                                        cbo_imgpama.setReadOnly(true);
                                        Ext.getCmp('btn_GrabarCheckDomicilio').disable();
                                    }
                                }
                        }
                    }
});

//DataStore que Construye las pestañas de Checks
var ds_cabchecksrv = new Ext.data.Store({
                reader: new Ext.data.JsonReader({
                    root            : 'checkspersona',
                    totalProperty	: 'total',
                    id              : 'nomobj'
                    },
                    [{name: 'codsol', mapping: 'codsol'},
                    {name: 'codper', mapping: 'codper'},
                    {name: 'codpacchk', mapping: 'codpacchk'},
                    {name: 'codpue', mapping: 'codpue'},
                    {name: 'nomobj', mapping: 'nomobj'},
                    {name: 'nombre', mapping: 'nombre'}
                    ]),
                proxy: new Ext.data.HttpProxy({
                    url: 'DB/solicitud.php',
                    method : 'POST'
                }),
                baseParams:{n:9, codsol:cod_sol, codper:cod_per},
                autoLoad: false,
                listeners : {
                    load : function(store){
                        var numchecks=store.getCount();
                        for (var i = 0; i < numchecks; i++) {
                            var objeto=store.getAt(i).data.nomobj
                            Ext.getCmp(objeto).enable();
                            switch (objeto){
                                case 'tbp_checkservice' :
                                    var nombre = ds_cabchecksrv.getAt(0).data.nombre;
                                    var puesto = ds_cabchecksrv.getAt(0).data.codpue;
                                    txt_chksrvnomper.setValue(nombre);
                                    cboCheckPuestos.setValue(puesto);
                                    cboCheckPuestos.setReadOnly(true);
                                    ds_obtieneCheckService.load();
                                    break;
                                case 'tbp_checkdomicilio' :
                                    txt_chkdomnomper.setValue(nombre);
                                    cboCheckPuestosDom.setValue(puesto);
                                    cboCheckPuestosDom.setReadOnly(true);
                                    ds_obtieneCheckDomici.load();
                                    
                                    //alert(hid_checkDom.getValue());
                                    break;
                                case 'tbp_checklaboral' :
                                    break;
                                default :
                                    alert('es otro check q no manyo')
                            }
                        }
                    }
                }
            });
ds_cabchecksrv.load();

//Declaracion de la ventana

    var win_checks_persona = Ext.getCmp('frm_checks_persona');
    if (!win_checks_persona){
        new Ext.Window({
            title	: 'Registro de Checks',
            id          : 'frm_checks_persona',
            iconCls     : 'regsol',
            layout	: 'fit',
            width	: 785,
            height	: 580,
            resizable   : false,
            closable    : true,
            modal       : true,
            items       : [tabPanelCheck]
        }).show();

    }else{
          win_checks_persona.show();
    }
}

/********************************************
 *   Fin de formulario frm_checks_persona   *
 *******************************************/

/****************************************
 * Inicio de formulario frm_logout *
 ****************************************/

function frm_logout(){
    //Ext.Msg.alert("Salir!!!");
    Ext.Msg.confirm('Salir', 'Confirme que desea salir del sistema', function(btn, text){
    if (btn == 'yes'){
        var redirect = 'seguridad/logout.php';
        window.location = redirect;
    } else {
      // abort, abort!
    }
});
}

/****************************************
 *      Fin de formulario frm_logout    *
 ****************************************/

Ext.onReady(main_menu);