/*
* Funcion para mostrar el formulario de mantenimiento de tipos de cliente
* Ricardo De la Torre
* 17-04-2010
* v1.0
*/
function mttotipocli(){

    var accion=0;
    var dstipcli;
    var rdo_activo,rdo_inactivo,idfi_;

    dstipcli = new Ext.data.Store({
        reader : new Ext.data.JsonReader({
                fields : ['codtipcli', 'destipcli','esttipcli','est'],
                root : 'tipcli',
                id : 'codtipcli'
        }),
        proxy: new Ext.data.HttpProxy({
                url: 'DB/datamttos.php?x=3'
        }),
        autoLoad: true
    });

    var cmtipcli = new Ext.grid.ColumnModel(
        [{
            header: 'idtipcli',
            readonly: true,
            dataIndex: 'codtipcli',
            hidden: true
        },
        {
            header: 'Drescripción',
            readonly: true,
            dataIndex: 'destipcli',
            hidden: false
        },
        {
            header: 'Estado',
            align:'center',
            readonly: true,
            dataIndex: 'esttipcli',
            hidden: false
        },{
            header: 'Est',
            align:'center',
            readonly: true,
            dataIndex: 'est',
            hidden: true
        }
        ]
    );

    var grdtipcli = new Ext.grid.EditorGridPanel({
        id : 'idgrdtipcli',
        store : dstipcli,
        width : 315,
        height : 210,
        cm : cmtipcli,
        loadMask:true,
        enableColLock:false,
        clicksToEdit:1,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
        frame : true,
        tbar : [{
            text: 'Nuevo',
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/plus.png',
            id : 'btn_nuevodoc',
            handler:addtipcli,
            tooltip: 'Registrar nuevo documento'
        },'-',{
            text: 'Editar',
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/add16.gif',
            id : 'btn_editadoc',
            tooltip: 'Editar documento',
            handler:function(){
                accion=2;
                var selectedKeys = grdtipcli.selModel.selections.keys;

                if(selectedKeys.length > 0) {
                    Ext.getCmp('desccli').enable();
                    Ext.getCmp('btn_grabadoc').enable();
                    Ext.getCmp('btn_canceladoc').enable();
                    rdo_tcliente.enable();
                    Ext.getCmp('btn_nuevodoc').disable();
                    Ext.getCmp('btn_editadoc').disable();

                    var selectedRow =grdtipcli.getSelectionModel().getSelected();
                    var campo0 =grdtipcli.getColumnModel().getDataIndex(0);
                    var campo1 =grdtipcli.getColumnModel().getDataIndex(1);
                    var campo3 =grdtipcli.getColumnModel().getDataIndex(3);
                    idfi_ =selectedRow.get(campo0);
                    var desc_ =selectedRow.get(campo1);
                    var esta_ =selectedRow.get(campo3);

                    Ext.getCmp('desccli').setValue(desc_);

                    if(esta_=='1'){
                        rdo_tcliente.setValue(1);
                    }else{
                        rdo_tcliente.setValue(2);
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
            id : 'btn_grabadoc',
            tooltip: 'Grabar cambios',
            handler:grabartipocli
        },'-',{
            text: 'Cancelar',
            disabled:true,
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/delete.gif',
            id : 'btn_canceladoc',
            handler:cancelarcli,
            tooltip: 'Cancelar cambios'
        }]
    });

    rdo_activo=new Ext.form.Radio({
        boxLabel :'Activo',
        name :'rb-tcli',
        inputValue :1
    });

    rdo_inactivo=new Ext.form.Radio({
        boxLabel :'Inactivo',
        name :'rb-tcli',
        inputValue :2
    });

    var rdo_tcliente=new Ext.form.RadioGroup({
        fieldLabel :'Estado',
        id :'rdoestcli',
        itemCls :'sinpadding',
        disabled :true,
        allowBlank :false,
        items: [rdo_activo,rdo_inactivo]
    });


    var frm_mtto_tipocli = new Ext.FormPanel({
        labelWidth:70,
        id:'frmtipcli',
        frame:true,
        width:345,
        autoHeight:true,
        padding:5,
        defaultType:'textfield',
        items:[{
                fieldLabel:'Descripci\u00F3n',
                name:'desccli',
                id:'desccli',
                maxLength:45,
                disabled:true,
                minLength:2,
                maxLengthText:'El texto es muy extenso',
                minLengthText:'El texto es muy corto',
                width:160,
                plugins     : new Ext.ux.Uppercase()
            },rdo_tcliente,grdtipcli]
    });



    function addtipcli(){
        Ext.getCmp('desccli').enable();
        Ext.getCmp('btn_grabadoc').enable();
        Ext.getCmp('btn_canceladoc').enable();
        rdo_tcliente.enable();
        Ext.getCmp('btn_nuevodoc').disable();
        Ext.getCmp('btn_editadoc').disable();
        rdo_activo.setValue(1);
        accion=1;
    }

    function grabartipocli(){
        Ext.getCmp('btn_grabadoc').disable();
        Ext.getCmp('btn_canceladoc').disable();

        Ext.getCmp('btn_nuevodoc').enable();
        Ext.getCmp('btn_editadoc').enable();

        Ext.Ajax.request({
            url : 'DB/datamttos.php',
            params : {
                x:4,
                accion:accion,
                desc:Ext.getCmp('desccli').getValue(),
                activo:rdo_activo.getValue(),
                inactivo:rdo_inactivo.getValue(),
                id:idfi_
            },
            success:function(response,options){
                var val=response.responseText;
                if(val==1){
                    Ext.Msg.show({
                        title: 'Mensaje',
                        msg: 'Se agrego un nuevo Tipo de Documento',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                    dstipcli.proxy= new Ext.data.HttpProxy({
                        url: 'DB/datamttos.php',
                        method : 'POST'
                    });
                    dstipcli.baseParams={
                            x:3
                    };
                    dstipcli.load();

                }else if(val==3){
                    Ext.Msg.show({
                        title: 'Mensaje',
                        msg: 'Se actualiz\u00F3 el Tipo de Documento',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                    dstipcli.proxy= new Ext.data.HttpProxy({
                        url: 'DB/datamttos.php',
                        method : 'POST'
                    });
                    dstipcli.baseParams={
                            x:3
                    };
                    dstipcli.load();

                }else{
                        Ext.Msg.alert('CUIDADO!','El Tipo de Documento que intenta ingresar ya existe');
                }
                cancelarcli();
            }
        });


    }

    function cancelarcli(){
        Ext.getCmp('frmtipcli').getForm().reset();
        Ext.getCmp('desccli').setValue('');
        Ext.getCmp('desccli').disable();

        Ext.getCmp('btn_grabadoc').disable();
        Ext.getCmp('btn_canceladoc').disable();

        Ext.getCmp('btn_nuevodoc').enable();
        Ext.getCmp('btn_editadoc').enable();
        rdo_tcliente.disable();
        rdo_activo.setValue(0);
        rdo_inactivo.setValue(0);
    }

    var view_window_tcli = new Ext.Window({
        frame:true,
        title:'Tipos de Cliente',
        width:350,
        iconCls : 'regper',
        height:316,
        closable: true,
        items: frm_mtto_tipocli,
        modal       :true,
        resizable:false
    });

    view_window_tcli.show();


}