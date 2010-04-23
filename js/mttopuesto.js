/*
* Funcion para mostrar el formulario de mantenimiento de puestos
* Ricardo De la Torre
* 17-04-2010
* v1.0
*/
function mttopuesto(){

    var accion=0;
    var dstippuesto;
    var rdo_activo_puesto,rdo_inactivo_puesto,idfiPuesto_;

    dstippuesto = new Ext.data.Store({
        reader : new Ext.data.JsonReader({
                fields : ['codpue', 'despue','estpue','est'],
                root : 'tippuesto',
                id : 'codtippuesto'
        }),
        proxy: new Ext.data.HttpProxy({
                url: 'DB/datamttos.php?x=16'
        }),
        autoLoad: true
    });

    var cmtippuesto = new Ext.grid.ColumnModel(
        [{
            header: 'idtippuesto',
            readonly: true,
            dataIndex: 'codpue',
            hidden: true
        },
        {
            header: 'Drescripción',
            readonly: true,
            dataIndex: 'despue',
            hidden: false
        },
        {
            header: 'Estado',
            align:'center',
            readonly: true,
            dataIndex: 'estpue',
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

    var grdtippuesto = new Ext.grid.EditorGridPanel({
        id : 'idgrdtippuesto',
        store : dstippuesto,
        width : 315,
        height : 210,
        cm : cmtippuesto,
        loadMask:true,
        enableColLock:false,
        clicksToEdit:1,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
        frame : true,
        tbar : [{
            text: 'Nuevo',
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/plus.png',
            id : 'btn_nuevopuesto',
            handler:addtippuesto,
            tooltip: 'Registrar nuevo puesto'
        },'-',{
            text: 'Editar',
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/add16.gif',
            id : 'btn_editapuesto',
            tooltip: 'Editar puesto',
            handler:function(){
                accion=2;
                var selectedKeysPuesto = grdtippuesto.selModel.selections.keys;

                if(selectedKeysPuesto.length > 0) {
                    Ext.getCmp('descpuesto').enable();
                    Ext.getCmp('btn_grabapuesto').enable();
                    Ext.getCmp('btn_cancelapuesto').enable();
                    rdo_tpuesto.enable();
                    Ext.getCmp('btn_nuevopuesto').disable();
                    Ext.getCmp('btn_editapuesto').disable();

                    var selectedRowPuesto =grdtippuesto.getSelectionModel().getSelected();
                    var campo0 =grdtippuesto.getColumnModel().getDataIndex(0);
                    var campo1 =grdtippuesto.getColumnModel().getDataIndex(1);
                    var campo3 =grdtippuesto.getColumnModel().getDataIndex(3);
                    idfiPuesto_ =selectedRowPuesto.get(campo0);
                    var descpuesto_ =selectedRowPuesto.get(campo1);
                    var estapuesto_ =selectedRowPuesto.get(campo3);

                    Ext.getCmp('descpuesto').setValue(descpuesto_);

                    if(estapuesto_==1){
                        rdo_tpuesto.setValue(1);
                    }else{
                        rdo_tpuesto.setValue(2);
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
            id : 'btn_grabapuesto',
            tooltip: 'Grabar cambios',
            handler:grabartipopuesto
        },'-',{
            text: 'Cancelar',
            disabled:true,
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/delete.gif',
            id : 'btn_cancelapuesto',
            handler:cancelarpuesto,
            tooltip: 'Cancelar cambios'
        }]
    });

    rdo_activo_puesto=new Ext.form.Radio({
        boxLabel :'Activo',
        name :'rb-tpuesto',
        inputValue :1
    });

    rdo_inactivo_puesto=new Ext.form.Radio({
        boxLabel :'Inactivo',
        name :'rb-tpuesto',
        inputValue :2
    });

    var rdo_tpuesto=new Ext.form.RadioGroup({
        fieldLabel :'Estado',
        id :'rdoestpuesto',
        itemCls :'sinpadding',
        disabled :true,
        allowBlank :false,
        items: [rdo_activo_puesto,rdo_inactivo_puesto]
    });


    var frm_mtto_tipopuesto = new Ext.FormPanel({
        labelWidth:70,
        id:'frmtippuesto',
        frame:true,
        width:345,
        autoHeight:true,
        padding:5,
        defaultType:'textfield',
        items:[{
                fieldLabel:'Descripci\u00F3n',
                name:'descpuesto',
                id:'descpuesto',
                maxLength:45,
                disabled:true,
                minLength:2,
                maxLengthText:'El texto es muy extenso',
                minLengthText:'El texto es muy corto',
                width:160
            },rdo_tpuesto,grdtippuesto]
    });



    function addtippuesto(){
        Ext.getCmp('descpuesto').enable();
        Ext.getCmp('btn_grabapuesto').enable();
        Ext.getCmp('btn_cancelapuesto').enable();
        rdo_tpuesto.enable();
        Ext.getCmp('btn_nuevopuesto').disable();
        Ext.getCmp('btn_editapuesto').disable();
        rdo_activo_puesto.setValue(1);
        accion=1;
    }

    function grabartipopuesto(){
        Ext.getCmp('btn_grabapuesto').disable();
        Ext.getCmp('btn_cancelapuesto').disable();

        Ext.getCmp('btn_nuevopuesto').enable();
        Ext.getCmp('btn_editapuesto').enable();

        Ext.Ajax.request({
            url : 'DB/datamttos.php',
            params : {
                x:17,
                accion:accion,
                desc:Ext.getCmp('descpuesto').getValue(),
                activo:rdo_activo_puesto.getValue(),
                inactivo:rdo_inactivo_puesto.getValue(),
                id:idfiPuesto_
            },
            success:function(response,options){
                var val=response.responseText;
                if(val==1){
                    Ext.Msg.show({
                        title: 'Mensaje',
                        msg: 'Se agrego un nuevo Tipo de Puesto',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                    dstippuesto.proxy= new Ext.data.HttpProxy({
                        url: 'DB/datamttos.php',
                        method : 'POST'
                    });
                    dstippuesto.baseParams={
                            x:16
                    };
                    dstippuesto.load();

                }else if(val==3){
                    Ext.Msg.show({
                        title: 'Mensaje',
                        msg: 'Se actualiz\u00F3 el Tipo de Puesto',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                    dstippuesto.proxy= new Ext.data.HttpProxy({
                        url: 'DB/datamttos.php',
                        method : 'POST'
                    });
                    dstippuesto.baseParams={
                            x:16
                    };
                    dstippuesto.load();

                }else{
                        Ext.Msg.alert('CUIDADO!','El Tipo de Puesto que intenta ingresar ya existe');
                }
                cancelarpuesto();
            }
        });


    }

    function cancelarpuesto(){
        Ext.getCmp('frmtippuesto').getForm().reset();
        Ext.getCmp('descpuesto').setValue('');
        Ext.getCmp('descpuesto').disable();

        Ext.getCmp('btn_grabapuesto').disable();
        Ext.getCmp('btn_cancelapuesto').disable();

        Ext.getCmp('btn_nuevopuesto').enable();
        Ext.getCmp('btn_editapuesto').enable();
        rdo_tpuesto.disable();
        rdo_activo_puesto.setValue(0);
        rdo_inactivo_puesto.setValue(0);
    }

    var view_window_tpuesto = new Ext.Window({
        frame:true,
        title:'Puestos',
        width:350,
        iconCls : 'puesto',
        height:316,
        closable: true,
        items: frm_mtto_tipopuesto,
        resizable:false
    });

    view_window_tpuesto.show();


}