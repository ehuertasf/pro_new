/*
* Funcion para mostrar el formulario de mantenimiento tipo de zona de riesgo
* Ricardo De la Torre
* 22-04-2010
* v1.0
*/
function mttoriesgo(){

    var accion=0;
    var dstipriesgo;
    var rdo_activo_riesgo,rdo_inactivo_riesgo,idfiRiesgo_;

    dstipriesgo = new Ext.data.Store({
        reader : new Ext.data.JsonReader({
                fields : ['codzonrie', 'deszonrie','estzonrie','est'],
                root : 'tipriesgo',
                id : 'codtipriesgo'
        }),
        proxy: new Ext.data.HttpProxy({
                url: 'DB/datamttos.php?x=12'
        }),
        autoLoad: true
    });

    var cmtipriesgo = new Ext.grid.ColumnModel(
        [{
            header: 'idtipriesgo',
            readonly: true,
            dataIndex: 'codzonrie',
            hidden: true
        },
        {
            header: 'Drescripción',
            readonly: true,
            dataIndex: 'deszonrie',
            hidden: false
        },
        {
            header: 'Estado',
            align:'center',
            readonly: true,
            dataIndex: 'estzonrie',
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

    var grdtipriesgo = new Ext.grid.EditorGridPanel({
        id : 'idgrdtipriesgo',
        store : dstipriesgo,
        width : 315,
        height : 300,
        cm : cmtipriesgo,
        loadMask:true,
        enableColLock:false,
        clicksToEdit:1,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
        frame : true,
        tbar : [{
            text: 'Nuevo',
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/plus.png',
            id : 'btn_nuevoriesgo',
            handler:addtipriesgo,
            tooltip: 'Registrar nueva zona de riesgo'
        },'-',{
            text: 'Editar',
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/add16.gif',
            id : 'btn_editariesgo',
            tooltip: 'Editar zona de riesgo',
            handler:function(){
                accion=2;
                var selectedKeysRiesgo = grdtipriesgo.selModel.selections.keys;

                if(selectedKeysRiesgo.length > 0) {
                    Ext.getCmp('descriesgo').enable();
                    Ext.getCmp('btn_grabariesgo').enable();
                    Ext.getCmp('btn_cancelariesgo').enable();
                    rdo_triesgo.enable();
                    Ext.getCmp('btn_nuevoriesgo').disable();
                    Ext.getCmp('btn_editariesgo').disable();

                    var selectedRowRiesgo =grdtipriesgo.getSelectionModel().getSelected();
                    var campo0 =grdtipriesgo.getColumnModel().getDataIndex(0);
                    var campo1 =grdtipriesgo.getColumnModel().getDataIndex(1);
                    var campo3 =grdtipriesgo.getColumnModel().getDataIndex(3);
                    idfiRiesgo_ =selectedRowRiesgo.get(campo0);
                    var descRiesgo_ =selectedRowRiesgo.get(campo1);
                    var estaRiesgo_ =selectedRowRiesgo.get(campo3);

                    Ext.getCmp('descriesgo').setValue(descRiesgo_);

                    if(estaRiesgo_==1){
                        rdo_triesgo.setValue(1);
                    }else{
                        rdo_triesgo.setValue(2);
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
            id : 'btn_grabariesgo',
            tooltip: 'Grabar cambios',
            handler:grabartiporiesgo
        },'-',{
            text: 'Cancelar',
            disabled:true,
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/delete.gif',
            id : 'btn_cancelariesgo',
            handler:cancelarriesgo,
            tooltip: 'Cancelar cambios'
        }]
    });

    rdo_activo_riesgo=new Ext.form.Radio({
        boxLabel :'Activo',
        name :'rb-triesgo',
        inputValue :1
    });

    rdo_inactivo_riesgo=new Ext.form.Radio({
        boxLabel :'Inactivo',
        name :'rb-triesgo',
        inputValue :2
    });

    var rdo_triesgo=new Ext.form.RadioGroup({
        fieldLabel :'Estado',
        id :'rdoestzona',
        itemCls :'sinpadding',
        disabled :true,
        allowBlank :false,
        items: [rdo_activo_riesgo,rdo_inactivo_riesgo]
    });


    var frm_mtto_tiporiesgo = new Ext.FormPanel({
        labelWidth:70,
        id:'frmtipriesgo',
        frame:true,
        width:345,
        autoHeight:true,
        padding:5,
        defaultType:'textfield',
        items:[{
                fieldLabel:'Descripci\u00F3n',
                name:'descriesgo',
                id:'descriesgo',
                maxLength:45,
                disabled:true,
                minLength:2,
                maxLengthText:'El texto es muy extenso',
                minLengthText:'El texto es muy corto',
                width:160
            },rdo_triesgo,grdtipriesgo]
    });



    function addtipriesgo(){
        Ext.getCmp('descriesgo').enable();
        Ext.getCmp('btn_grabariesgo').enable();
        Ext.getCmp('btn_cancelariesgo').enable();
        rdo_triesgo.enable();
        Ext.getCmp('btn_nuevoriesgo').disable();
        Ext.getCmp('btn_editariesgo').disable();
        rdo_activo_riesgo.setValue(1);
        accion=1;
    }

    function grabartiporiesgo(){
        Ext.getCmp('btn_grabariesgo').disable();
        Ext.getCmp('btn_cancelariesgo').disable();

        Ext.getCmp('btn_nuevoriesgo').enable();
        Ext.getCmp('btn_editariesgo').enable();

        Ext.Ajax.request({
            url : 'DB/datamttos.php',
            params : {
                x:13,
                accion:accion,
                desc:Ext.getCmp('descriesgo').getValue(),
                activo:rdo_activo_riesgo.getValue(),
                inactivo:rdo_inactivo_riesgo.getValue(),
                id:idfiRiesgo_
            },
            success:function(response,options){
                var val=response.responseText;
                if(val==1){
                    Ext.Msg.show({
                        title: 'Mensaje',
                        msg: 'Se agrego un nuevo Tipo de Riesgo',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                    dstipriesgo.proxy= new Ext.data.HttpProxy({
                        url: 'DB/datamttos.php',
                        method : 'POST'
                    });
                    dstipriesgo.baseParams={
                            x:12
                    };
                    dstipriesgo.load();

                }else if(val==3){
                    Ext.Msg.show({
                        title: 'Mensaje',
                        msg: 'Se actualiz\u00F3 el Tipo de Riesgo',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                    dstipriesgo.proxy= new Ext.data.HttpProxy({
                        url: 'DB/datamttos.php',
                        method : 'POST'
                    });
                    dstipriesgo.baseParams={
                            x:12
                    };
                    dstipriesgo.load();

                }else{
                        Ext.Msg.alert('CUIDADO!','El Tipo de Zona de Riesgo que intenta ingresar ya existe');
                }
                cancelarriesgo();
            }
        });


    }

    function cancelarriesgo(){
        Ext.getCmp('frmtipriesgo').getForm().reset();
        Ext.getCmp('descriesgo').setValue('');
        Ext.getCmp('descriesgo').disable();

        Ext.getCmp('btn_grabariesgo').disable();
        Ext.getCmp('btn_cancelariesgo').disable();

        Ext.getCmp('btn_nuevoriesgo').enable();
        Ext.getCmp('btn_editariesgo').enable();
        rdo_triesgo.disable();
        rdo_activo_riesgo.setValue(0);
        rdo_inactivo_riesgo.setValue(0);
    }

    var view_window_tzona = new Ext.Window({
        frame:true,
        title:'Tipos Zona de Riesgo',
        width:350,
        iconCls : 'riesgo',
        height:400,
        closable: true,
        items: frm_mtto_tiporiesgo,
        resizable:false
    });

    view_window_tzona.show();


}