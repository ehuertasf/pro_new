/*
* Funcion para mostrar el formulario de mantenimiento tipo de zonificacion
* Ricardo De la Torre
* 22-04-2010
* v1.0
*/
function mttotipzona(){

    var accion=0;
    var dstipzona;
    var rdo_activo_zona,rdo_inactivo_zona,idfiZona_;

    dstipzona = new Ext.data.Store({
        reader : new Ext.data.JsonReader({
                fields : ['codzonif', 'deszonif','estzonif','est'],
                root : 'tipzona',
                id : 'codtipzona'
        }),
        proxy: new Ext.data.HttpProxy({
                url: 'DB/datamttos.php?x=10'
        }),
        autoLoad: true
    });

    var cmtipzona = new Ext.grid.ColumnModel(
        [{
            header: 'idtipzona',
            readonly: true,
            dataIndex: 'codzonif',
            hidden: true
        },
        {
            header: 'Drescripción',
            readonly: true,
            dataIndex: 'deszonif',
            hidden: false
        },
        {
            header: 'Estado',
            align:'center',
            readonly: true,
            dataIndex: 'estzonif',
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

    var grdtipzona = new Ext.grid.EditorGridPanel({
        id : 'idgrdtipzona',
        store : dstipzona,
        width : 315,
        height : 300,
        cm : cmtipzona,
        loadMask:true,
        enableColLock:false,
        clicksToEdit:1,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
        frame : true,
        tbar : [{
            text: 'Nuevo',
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/plus.png',
            id : 'btn_nuevazona',
            handler:addtipzona,
            tooltip: 'Registrar nueva zonificacion'
        },'-',{
            text: 'Editar',
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/add16.gif',
            id : 'btn_editazona',
            tooltip: 'Editar zonificacion',
            handler:function(){
                accion=2;
                var selectedKeysZona = grdtipzona.selModel.selections.keys;

                if(selectedKeysZona.length > 0) {
                    Ext.getCmp('desczona').enable();
                    Ext.getCmp('btn_grabazona').enable();
                    Ext.getCmp('btn_cancelazona').enable();
                    rdo_tzona.enable();
                    Ext.getCmp('btn_nuevazona').disable();
                    Ext.getCmp('btn_editazona').disable();

                    var selectedRowZona =grdtipzona.getSelectionModel().getSelected();
                    var campo0 =grdtipzona.getColumnModel().getDataIndex(0);
                    var campo1 =grdtipzona.getColumnModel().getDataIndex(1);
                    var campo3 =grdtipzona.getColumnModel().getDataIndex(3);
                    idfiZona_ =selectedRowZona.get(campo0);
                    var descZona_ =selectedRowZona.get(campo1);
                    var estaZona_ =selectedRowZona.get(campo3);

                    Ext.getCmp('desczona').setValue(descZona_);

                    if(estaZona_==1){
                        rdo_tzona.setValue(1);
                    }else{
                        rdo_tzona.setValue(2);
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
            id : 'btn_grabazona',
            tooltip: 'Grabar cambios',
            handler:grabartipozona
        },'-',{
            text: 'Cancelar',
            disabled:true,
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/delete.gif',
            id : 'btn_cancelazona',
            handler:cancelarzona,
            tooltip: 'Cancelar cambios'
        }]
    });

    rdo_activo_zona=new Ext.form.Radio({
        boxLabel :'Activo',
        name :'rb-tzona',
        inputValue :1
    });

    rdo_inactivo_zona=new Ext.form.Radio({
        boxLabel :'Inactivo',
        name :'rb-tzona',
        inputValue :2
    });

    var rdo_tzona=new Ext.form.RadioGroup({
        fieldLabel :'Estado',
        id :'rdoestzona',
        itemCls :'sinpadding',
        disabled :true,
        allowBlank :false,
        items: [rdo_activo_zona,rdo_inactivo_zona]
    });


    var frm_mtto_tipozona = new Ext.FormPanel({
        labelWidth:70,
        id:'frmtipzona',
        frame:true,
        width:345,
        autoHeight:true,
        padding:5,
        defaultType:'textfield',
        items:[{
                fieldLabel:'Descripci\u00F3n',
                name:'desczona',
                id:'desczona',
                maxLength:45,
                disabled:true,
                minLength:2,
                maxLengthText:'El texto es muy extenso',
                minLengthText:'El texto es muy corto',
                width:160
            },rdo_tzona,grdtipzona]
    });



    function addtipzona(){
        Ext.getCmp('desczona').enable();
        Ext.getCmp('btn_grabazona').enable();
        Ext.getCmp('btn_cancelazona').enable();
        rdo_tzona.enable();
        Ext.getCmp('btn_nuevazona').disable();
        Ext.getCmp('btn_editazona').disable();
        rdo_activo_zona.setValue(1);
        accion=1;
    }

    function grabartipozona(){
        Ext.getCmp('btn_grabazona').disable();
        Ext.getCmp('btn_cancelazona').disable();

        Ext.getCmp('btn_nuevazona').enable();
        Ext.getCmp('btn_editazona').enable();

        Ext.Ajax.request({
            url : 'DB/datamttos.php',
            params : {
                x:11,
                accion:accion,
                desc:Ext.getCmp('desczona').getValue(),
                activo:rdo_activo_zona.getValue(),
                inactivo:rdo_inactivo_zona.getValue(),
                id:idfiZona_
            },
            success:function(response,options){
                var val=response.responseText;
                if(val==1){
                    Ext.Msg.show({
                        title: 'Mensaje',
                        msg: 'Se agrego un nuevo Tipo de Zonificaci\u00F3n',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                    dstipzona.proxy= new Ext.data.HttpProxy({
                        url: 'DB/datamttos.php',
                        method : 'POST'
                    });
                    dstipzona.baseParams={
                            x:10
                    };
                    dstipzona.load();

                }else if(val==3){
                    Ext.Msg.show({
                        title: 'Mensaje',
                        msg: 'Se actualiz\u00F3 el Tipo de Zonificaci\u00F3n',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                    dstipzona.proxy= new Ext.data.HttpProxy({
                        url: 'DB/datamttos.php',
                        method : 'POST'
                    });
                    dstipzona.baseParams={
                            x:10
                    };
                    dstipzona.load();

                }else{
                        Ext.Msg.alert('CUIDADO!','El Tipo de Zonificaci\u00F3n que intenta ingresar ya existe');
                }
                cancelarzona();
            }
        });


    }

    function cancelarzona(){
        Ext.getCmp('frmtipzona').getForm().reset();
        Ext.getCmp('desczona').setValue('');
        Ext.getCmp('desczona').disable();

        Ext.getCmp('btn_grabazona').disable();
        Ext.getCmp('btn_cancelazona').disable();

        Ext.getCmp('btn_nuevazona').enable();
        Ext.getCmp('btn_editazona').enable();
        rdo_tzona.disable();
        rdo_activo_zona.setValue(0);
        rdo_inactivo_zona.setValue(0);
    }

    var view_window_tzona = new Ext.Window({
        frame:true,
        title:'Tipos de Zonificaci\u00F3n',
        width:350,
        iconCls : 'zona',
        height:400,
        closable: true,
        items: frm_mtto_tipozona,
        resizable:false
    });

    view_window_tzona.show();


}