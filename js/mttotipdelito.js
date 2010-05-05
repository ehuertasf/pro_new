/*
* Funcion para mostrar el formulario de mantenimiento tipos de delito
* Ricardo De la Torre
* 22-04-2010
* v1.0
*/
function mttotipdelito(){

    var accion=0;
    var dstipdelito;
    var rdo_activo_delito,rdo_inactivo_delito,idfiDelito_;

    dstipdelito = new Ext.data.Store({
        reader : new Ext.data.JsonReader({
                fields : ['coddel', 'nomdel','estdel','est','desdel'],
                root : 'tipdelito',
                id : 'codtipdelito'
        }),
        proxy: new Ext.data.HttpProxy({
                url: 'DB/datamttos.php?x=14'
        }),
        autoLoad: true
    });

    var cmtipdelito = new Ext.grid.ColumnModel(
        [{
            header: 'idtipdelito',
            readonly: true,
            dataIndex: 'coddel',
            hidden: true
        },{
            header: 'Tipo',
            readonly: true,
            dataIndex: 'nomdel',
            hidden: false
        },{
            header: 'Descripci\u00F3n',
            align:'center',
            readonly: true,
			width:230,
            dataIndex: 'desdel',
            hidden: false
        },{
            header: 'Estado',
            align:'center',
            readonly: true,
			width:60,
            dataIndex: 'estdel',
            hidden: false
		},{
            header: 'Est',
            align:'center',
            readonly: true,
            dataIndex: 'est',
            hidden: true
		}]
    );

    var grdtipdelito = new Ext.grid.EditorGridPanel({
        id : 'idgrdtipdelito',
        store : dstipdelito,
        width : 415,
        height : 230,
        cm : cmtipdelito,
        loadMask:true,
        enableColLock:false,
        clicksToEdit:1,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
        frame : true,
        tbar : [{
            text: 'Nuevo',
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/plus.png',
            id : 'btn_nuevodelito',
            handler:addtipdelito,
            tooltip: 'Registrar nuevo tipo de delito'
        },'-',{
            text: 'Editar',
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/add16.gif',
            id : 'btn_editadelito',
            tooltip: 'Editar tipo de delito',
            handler:function(){
                accion=2;
                var selectedKeysDelito = grdtipdelito.selModel.selections.keys;

                if(selectedKeysDelito.length > 0) {
                    Ext.getCmp('descdelito').enable();
					Ext.getCmp('idmensaje').enable();
                    Ext.getCmp('btn_grabadelito').enable();
                    Ext.getCmp('btn_canceladelito').enable();
                    rdo_tdelito.enable();
                    Ext.getCmp('btn_nuevodelito').disable();
                    Ext.getCmp('btn_editadelito').disable();

                    var selectedRowDelito =grdtipdelito.getSelectionModel().getSelected();
                    var campo0 =grdtipdelito.getColumnModel().getDataIndex(0);
                    var campo1 =grdtipdelito.getColumnModel().getDataIndex(1);
					var campo2 =grdtipdelito.getColumnModel().getDataIndex(2);
                    var campo3 =grdtipdelito.getColumnModel().getDataIndex(3);


                    idfiDelito_ =selectedRowDelito.get(campo0);
                    var descDelito_ =selectedRowDelito.get(campo1);
					var MensDelito_ =selectedRowDelito.get(campo2);
                    var estaDelito_ =selectedRowDelito.get(campo3);

                    Ext.getCmp('descdelito').setValue(descDelito_);
					Ext.getCmp('idmensaje').setValue(MensDelito_);

                    if(estaDelito_==1){
                        rdo_tdelito.setValue(1);
                    }else{
                        rdo_tdelito.setValue(2);
                    }


                }else{
                    Ext.Msg.show({
                        title: 'Aviso',
                        msg: 'Debe seleccionar una fila',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }


            }
        },'-',{
            text: 'Grabar',
            cls: 'x-btn-text-icon',
            disabled:true,
            icon: 'files/images_app/disk.png',
            id : 'btn_grabadelito',
            tooltip: 'Grabar cambios',
            handler:grabartipodelito
        },'-',{
            text: 'Cancelar',
            disabled:true,
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/delete.gif',
            id : 'btn_canceladelito',
            handler:cancelardelito,
            tooltip: 'Cancelar cambios'
        }]
    });

    rdo_activo_delito=new Ext.form.Radio({
        boxLabel :'Activo',
        name :'rb-tdelito',
        inputValue :1
    });

    rdo_inactivo_delito=new Ext.form.Radio({
        boxLabel :'Inactivo',
        name :'rb-tdelito',
        inputValue :2
    });

    var rdo_tdelito=new Ext.form.RadioGroup({
        fieldLabel :'Estado',
        id :'rdoestdelito',
        itemCls :'sinpadding',
        disabled :true,
        allowBlank :false,
        items: [rdo_activo_delito,rdo_inactivo_delito]
    });


    var frm_mtto_tipodelito = new Ext.FormPanel({
        labelWidth:70,
        id:'frmtipdelito',
        frame:true,
        width:445,
        autoHeight:true,
        padding:5,
        defaultType:'textfield',
        items:[{
                fieldLabel:'Tipo',
                name:'descdelito',
                id:'descdelito',
                maxLength:45,
                disabled:true,
                minLength:2,
                maxLengthText:'El texto es muy extenso',
                minLengthText:'El texto es muy corto',
                width:160
            },{
				xtype: 'textarea',
				fieldLabel:'Descripci\u00F3n',
				disabled:true,
				name: 'idmensaje',
				id:'idmensaje',
				width:340
			},rdo_tdelito,grdtipdelito]
    });



    function addtipdelito(){
        Ext.getCmp('descdelito').enable();
        Ext.getCmp('btn_grabadelito').enable();
        Ext.getCmp('btn_canceladelito').enable();
		Ext.getCmp('idmensaje').enable();
        rdo_tdelito.enable();
        Ext.getCmp('btn_nuevodelito').disable();
        Ext.getCmp('btn_editadelito').disable();
        rdo_activo_delito.setValue(1);
        accion=1;
    }

    function grabartipodelito(){
        Ext.getCmp('btn_grabadelito').disable();
        Ext.getCmp('btn_canceladelito').disable();

        Ext.getCmp('btn_nuevodelito').enable();
        Ext.getCmp('btn_editadelito').enable();

        Ext.Ajax.request({
            url : 'DB/datamttos.php',
            params : {
                x:15,
                accion:accion,
                desc:Ext.getCmp('descdelito').getValue(),
                activo:rdo_activo_delito.getValue(),
				mensaje:Ext.getCmp('idmensaje').getValue(),
                inactivo:rdo_inactivo_delito.getValue(),
                id:idfiDelito_
            },
            success:function(response,options){
                var val=response.responseText;
                if(val==1){
                    Ext.Msg.show({
                        title: 'Mensaje',
                        msg: 'Se agrego un nuevo Tipo de Delito',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                    dstipdelito.proxy= new Ext.data.HttpProxy({
                        url: 'DB/datamttos.php',
                        method : 'POST'
                    });
                    dstipdelito.baseParams={
                            x:14
                    };
                    dstipdelito.load();

                }else if(val==3){
                    Ext.Msg.show({
                        title: 'Mensaje',
                        msg: 'Se actualiz\u00F3 el Tipo de Delito',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                    dstipdelito.proxy= new Ext.data.HttpProxy({
                        url: 'DB/datamttos.php',
                        method : 'POST'
                    });
                    dstipdelito.baseParams={
                            x:14
                    };
                    dstipdelito.load();

                }else{
                        Ext.Msg.alert('CUIDADO!','El Tipo de Delito que intenta ingresar ya existe');
                }
                cancelardelito();
            }
        });


    }

    function cancelardelito(){
        Ext.getCmp('frmtipdelito').getForm().reset();
        Ext.getCmp('descdelito').setValue('');
        Ext.getCmp('descdelito').disable();
		Ext.getCmp('idmensaje').disable();

        Ext.getCmp('btn_grabadelito').disable();
        Ext.getCmp('btn_canceladelito').disable();

        Ext.getCmp('btn_nuevodelito').enable();
        Ext.getCmp('btn_editadelito').enable();
        rdo_tdelito.disable();
        rdo_activo_delito.setValue(0);
        rdo_inactivo_delito.setValue(0);
    }

    var view_window_tdelito = new Ext.Window({
        frame:true,
        title:'Tipos de Delito',
        width:450,
        iconCls : 'delito',
        modal       :true,
        height:400,
        closable: true,
        items: frm_mtto_tipodelito,
        resizable:false
    });

    view_window_tdelito.show();


}