/*
* Funcion para mostrar el formulario de mantenimiento de tipo de documentos
* Ricardo De la Torre
* 17-04-2010
* v1.0
*/
function mttotipodoc(){

    var accion=0;
    var dstipdoc;
    var rdo_activo,rdo_inactivo,idfi_;

    dstipdoc = new Ext.data.Store({
        reader : new Ext.data.JsonReader({
                fields : ['codtipdoc', 'destipdoc','esttipdoc','est'],
                root : 'tipdoc',
                id : 'codtipdoc'
        }),
        proxy: new Ext.data.HttpProxy({
                url: 'DB/datamttos.php?x=1'
        }),
        autoLoad: true
    });

    var cmtipdoc = new Ext.grid.ColumnModel(
        [{
            header: 'idtipdoc',
            readonly: true,
            dataIndex: 'codtipdoc',
            hidden: true
        },
        {
            header: 'Drescripción',
            readonly: true,
            dataIndex: 'destipdoc',
            hidden: false
        },
        {
            header: 'Estado',
            align:'center',
            readonly: true,
            dataIndex: 'esttipdoc',
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

    var grdtipdoc = new Ext.grid.EditorGridPanel({
        id : 'idgrdtipdoc',
        store : dstipdoc,
        width : 315,
        height : 210,
        cm : cmtipdoc,
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
            handler:addtipdoc,
            tooltip: 'Registrar nuevo documento'
        },'-',{
            text: 'Editar',
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/add16.gif',
            id : 'btn_editadoc',
            tooltip: 'Editar documento',
            handler:function(){
                accion=2;
                var selectedKeys = grdtipdoc.selModel.selections.keys;

                if(selectedKeys.length > 0) {
                    Ext.getCmp('desc').enable();
                    Ext.getCmp('btn_grabadoc').enable();
                    Ext.getCmp('btn_canceladoc').enable();
                    rdo_tdocumento.enable();
                    Ext.getCmp('btn_nuevodoc').disable();
                    Ext.getCmp('btn_editadoc').disable();

                    var selectedRow =grdtipdoc.getSelectionModel().getSelected();
                    var campo0 =grdtipdoc.getColumnModel().getDataIndex(0);
                    var campo1 =grdtipdoc.getColumnModel().getDataIndex(1);
                    var campo3 =grdtipdoc.getColumnModel().getDataIndex(3);
                    idfi_ =selectedRow.get(campo0);
                    var desc_ =selectedRow.get(campo1);
                    var esta_ =selectedRow.get(campo3);

                    Ext.getCmp('desc').setValue(desc_);

                    if(esta_==1){
                        rdo_tdocumento.setValue(1);
                    }else{
                        rdo_tdocumento.setValue(2);
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
            handler:grabartipodoc
        },'-',{
            text: 'Cancelar',
            disabled:true,
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/delete.gif',
            id : 'btn_canceladoc',
            handler:cancelar,
            tooltip: 'Cancelar cambios'
        }]
    });

    rdo_activo=new Ext.form.Radio({
        boxLabel :'Activo',
        name :'rb-tdoc',
        inputValue :1
    });

    rdo_inactivo=new Ext.form.Radio({
        boxLabel :'Inactivo',
        name :'rb-tdoc',
        inputValue :2
    });

    var rdo_tdocumento=new Ext.form.RadioGroup({
        fieldLabel :'Estado',
        id:'rdoestdoc',
        itemCls :'sinpadding',
        disabled :true,
        allowBlank :false,
        items: [rdo_activo,rdo_inactivo]
    });


    var frm_mtto_tipodoc = new Ext.FormPanel({
        labelWidth:70,
        id:'frmtipdoc',
        frame:true,
        width:345,
        autoHeight:true,
        padding:5,
        defaultType:'textfield',
        items:[{
                fieldLabel:'Descripci\u00F3n',
                name:'desc',
                id:'desc',
                maxLength:45,
                disabled:true,
                minLength:2,
                maxLengthText:'El texto es muy extenso',
                minLengthText:'El texto es muy corto',
                width:160
            },rdo_tdocumento,grdtipdoc]
    });



    function addtipdoc(){
        Ext.getCmp('desc').enable();
        Ext.getCmp('btn_grabadoc').enable();
        Ext.getCmp('btn_canceladoc').enable();
        rdo_tdocumento.enable();
        Ext.getCmp('btn_nuevodoc').disable();
        Ext.getCmp('btn_editadoc').disable();
        rdo_activo.setValue(1);
        accion=1;
    }

    function grabartipodoc(){
        Ext.getCmp('btn_grabadoc').disable();
        Ext.getCmp('btn_canceladoc').disable();

        Ext.getCmp('btn_nuevodoc').enable();
        Ext.getCmp('btn_editadoc').enable();

        Ext.Ajax.request({
            url : 'DB/datamttos.php',
            params : {
                x:2,
                accion:accion,
                desc:Ext.getCmp('desc').getValue(),
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

                    dstipdoc.proxy= new Ext.data.HttpProxy({
                        url: 'DB/datamttos.php',
                        method : 'POST'
                    });
                    dstipdoc.baseParams={
                            x:1
                    };
                    dstipdoc.load();

                }else if(val==3){
                    Ext.Msg.show({
                        title: 'Mensaje',
                        msg: 'Se actualiz\u00F3 el Tipo de Documento',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                    dstipdoc.proxy= new Ext.data.HttpProxy({
                        url: 'DB/datamttos.php',
                        method : 'POST'
                    });
                    dstipdoc.baseParams={
                            x:1
                    };
                    dstipdoc.load();

                }else{
                        Ext.Msg.alert('CUIDADO!','El Tipo de Documento que intenta ingresar ya existe');
                }
                cancelar();
            }
        });


    }

    function cancelar(){
        Ext.getCmp('frmtipdoc').getForm().reset();
        Ext.getCmp('desc').setValue('');
        Ext.getCmp('desc').disable();

        Ext.getCmp('btn_grabadoc').disable();
        Ext.getCmp('btn_canceladoc').disable();

        Ext.getCmp('btn_nuevodoc').enable();
        Ext.getCmp('btn_editadoc').enable();
        rdo_tdocumento.disable();
        rdo_activo.setValue(0);
        rdo_inactivo.setValue(0);
    }

    var view_window_tdoc = new Ext.Window({
        frame:true,
        title:'Tipos de Documento',
        width:350,
        iconCls : 'regper',
        height:316,
        closable: true,
        items: frm_mtto_tipodoc,
        resizable:false
    });

    view_window_tdoc.show();


}