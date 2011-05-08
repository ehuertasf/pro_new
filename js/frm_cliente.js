
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
                        vcodcli= Ext.util.Format.trim(Ext.getCmp('txt_codcli').getValue());
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
                                            anchor		: '100%',
                                            plugins     : new Ext.ux.Uppercase()
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
                                            value   : '1',
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
                                            anchor      : '99%',
                                            plugins     : new Ext.ux.Uppercase()
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


