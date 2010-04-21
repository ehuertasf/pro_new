/*
* Funcion para mostrar el formulario de mantenimiento de usuarios
* Ricardo De la Torre
* 20-04-2010
* v1.0
*/
function mttousers(){

    var accion_users=0;
    var dsusers;
    var rdo_activo_user,rdo_inactivo_user,idfi_;
    var j_perfil,dsClientes,dsPerfiles;
    var cboperf;

    

     dsPerfiles = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'DB/datamttos.php?x=7',
            waitMsg: 'Buscando...'
        }),
        reader: new Ext.data.JsonReader({
            root: 'perfiles'
        },['codperf','desperf'])
    });

    dsClientes = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'DB/clientes.php?n=7',
            waitMsg: 'Buscando...'
        }),
        reader: new Ext.data.JsonReader({
            root: 'listadocli'
        },['codcli','nomcli'])
    });

    dsusers = new Ext.data.Store({
            reader : new Ext.data.JsonReader({
            fields : ['coduser', 'nomuser','apeuser','loguser','pasuser','estuser','est','nomcli','desperf'],
            root : 'users',
            id : 'coduser'
        }),
        proxy: new Ext.data.HttpProxy({
            url: 'DB/datamttos.php?x=5'
        }),
        autoLoad: true
    });

    var cmusers = new Ext.grid.ColumnModel(
        [{
            header: 'Login',
            align:'center',
            readonly: true,
            dataIndex: 'loguser',
            width:100,
            hidden: false
	},{
            header: 'coduser',
            readonly: true,
            dataIndex: 'coduser',
            hidden: true
        },
        {
            header: 'Nombres',
            align:'left',
            readonly: true,
            dataIndex: 'nomuser',
            width:170,
            hidden: false
        },
        {
            header: 'Apellidos',
            align:'left',
            readonly: true,
            width:170,
            dataIndex: 'apeuser',
            hidden: false
        },{
            header: 'Empresa',
            readonly: true,
            width:120,
            align:'center',
            dataIndex: 'nomcli',
            hidden: false            
        },{
            header: 'Perfil',
            readonly: true,
            width:90,
            align:'center',
            dataIndex: 'desperf',
            hidden: false
        },{
            header: 'Estado',
            align:'center',
            width:70,
            readonly: true,
            dataIndex: 'estuser',
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

    var grdusers = new Ext.grid.EditorGridPanel({
        id : 'idgrdusers',
        store : dsusers,
	autoWidth:true,
        height : 265,
        cm : cmusers,
        loadMask:true,
        enableColLock:false,
        clicksToEdit:1,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
        frame : true,
        tbar : [{
            text: 'Nuevo',
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/plus.png',
            id : 'btn_nuevouser',
            handler:adduser,
            tooltip: 'Registrar nuevo usuario'
        },'-',{
            text: 'Editar',
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/add16.gif',
            id : 'btn_editauser',
            tooltip: 'Editar usuario',
            handler:function(){
                accion_users=2;
                var selectedKeys = grdusers.selModel.selections.keys;

                if(selectedKeys.length > 0) {
                    Ext.getCmp('nombre').enable();
                    Ext.getCmp('apellido').enable();
                    Ext.getCmp('pass').enable();
                    Ext.getCmp('cpass').enable();
                    Ext.getCmp('idcbo').enable();
                    Ext.getCmp('idcboperfil').enable();

                    Ext.getCmp('btn_grabauser').enable();
                    Ext.getCmp('btn_cancelauser').enable();
                    rdo_tuser.enable();
                    Ext.getCmp('btn_nuevouser').disable();
                    Ext.getCmp('btn_editauser').disable();


                    var selectedRow =grdusers.getSelectionModel().getSelected();
                    var campo1 =grdusers.getColumnModel().getDataIndex(1);

                    idfi_ =selectedRow.get(campo1);

                    Ext.Ajax.request({
                        url : 'DB/datamttos.php',
                        params : {
                            x:8,
                            id:idfi_
                        },
                        success:function(response,options){
                            var stringData	=response.responseText;
                            var jsonData 	= Ext.util.JSON.decode(stringData);
                            Ext.getCmp('nombre').setValue(jsonData.nombre);
                            Ext.getCmp('apellido').setValue(jsonData.apeuser);
                            Ext.getCmp('login').setValue(jsonData.login);
                            rdo_tuser.setValue(jsonData.estado);

                            cboperf=Ext.getCmp('idcboperfil');


                            dsPerfiles.on('load', function(a, recs, index){
                                if (a.totalLength != 0){
                                    cboperf.setValue(recs[2].get('descperf'));
                                }
                            });

                            //falta terminar la funcion de editar

                        }
                    });


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
            id : 'btn_grabauser',
            tooltip: 'Grabar cambios',
            handler:grabartipodoc
        },'-',{
            text: 'Cancelar',
            disabled:true,
            cls: 'x-btn-text-icon',
            icon: 'files/images_app/delete.gif',
            id : 'btn_cancelauser',
            handler:cancelar_user,
            tooltip: 'Cancelar Cambios'
        }]
    });


    rdo_activo_user=new Ext.form.Radio({
        boxLabel :'Activo',
        name :'rb-tuser',
        inputValue :1
    });

    rdo_inactivo_user=new Ext.form.Radio({
        boxLabel :'Inactivo',
        name :'rb-tuser',
        inputValue :0
    });

    var rdo_tuser=new Ext.form.RadioGroup({
        fieldLabel :'Estado',
        id:'rdoestuser',
        itemCls :'sinpadding',
        disabled :true,
        allowBlank :false,
        items: [rdo_activo_user,rdo_inactivo_user]
    });


    var frm_user = new Ext.FormPanel({
        labelWidth:90,
        id:'frmtipuser',
        frame:true,
        width:765,
        autoHeight:true,
        padding:5,
        items:[{
                layout	:'column',
                border	:false,
                items	:[{
                     columnWidth:.5,
                     layout: 'form',
                     border:false,
                     items: [{
                        xtype:'textfield',
                        fieldLabel:'Nombres',
                        name:'nombre',
                        id:'nombre',
                        maxLength:50,
                        disabled:true,
                        minLength:2,
                        allowBlank	:false,
                        maxLengthText:'El texto es muy extenso',
                        minLengthText:'El texto es muy corto',
                        width:180
                     }]
                },{
                     columnWidth:.5,
                     layout: 'form',
                     border:false,
                     items: [{
                        xtype:'textfield',
                        fieldLabel:'Apellidos',
                        name:'apellido',
                        id:'apellido',
                        maxLength:50,
                        disabled:true,
                        minLength:2,
                        allowBlank	:false,
                        maxLengthText:'El texto es muy extenso',
                        minLengthText:'El texto es muy corto',
                        width:180
                     }]
                }]
            },{
                layout	:'column',
                border	:false,
                items	:[{
                     columnWidth:.5,
                     layout: 'form',
                     border:false,
                     items: [{
                        xtype       :'combo',
                        id          :'idcboperfil',
                        fieldLabel  :'Perfil',
                        store       :dsPerfiles,
                        displayField:'desperf',
                        valueField  :'codperf',
                        hiddenName  :'codperf',
                        disabled    :true,
                        mode        :'remote',
                        editable	:false,
                        allowBlank	:false,
                        triggerAction   :'all',
                        forceSelection  :true,
                        anchor	:'90%',
                        name	:'idcboperfil',
                        listeners: {
                            'select': function (){

                                j_perfil=Ext.getCmp("idcboperfil").getValue();

                                dsClientes.reset;
                                Ext.getCmp('idcbo').setValue('');

                                dsClientes.proxy=new Ext.data.HttpProxy({
                                        url: 'DB/clientes.php?n=7&i='+j_perfil
                                });
                                dsClientes.load();

                            }
                        }
                 }]
            },{
                     columnWidth:.5,
                     layout: 'form',
                     border:false,
                     items: [{
                        xtype       :'combo',
                        id          :'idcbo',
                        fieldLabel  :'Empresa',
                        store       :dsClientes,
                        displayField:'nomcli',
                        valueField  :'codcli',
                        disabled    :true,
                        mode        :'remote',
                        editable    :false,
                        allowBlank  :false,
                        triggerAction:  'all',
                        forceSelection  :true,
                        anchor      :'90%',
                        name        :'idcbo'
                     }]
                }]
            },{
                    layout	:'column',
                    border	:false,
                    items	:[{
                         columnWidth:.5,
                         layout: 'form',
                         border:false,
                         items: [{
                            xtype:'textfield',
                            fieldLabel:'Usuario',
                            name:'login',
                            id:'login',
                            maxLength:20,
                            disabled:true,
                            allowBlank	:false,
                            minLength:5,
                            maxLengthText:'El texto es muy extenso',
                            minLengthText:'El texto es muy corto',
                            width:100,
                            listeners:{
                                'change':function(){
                                    
                                    Ext.Ajax.request({
                                        url : 'DB/datamttos.php',
                                        params : {
                                            x:9,
                                            v:Ext.getCmp('login').getValue()
                                        },
                                        success:function(response,options){
                                            if(response.responseText==2){
                                                Ext.MessageBox.alert('Mensaje','Este usuario ya existe');
                                                Ext.getCmp('login').setValue('');
                                                Ext.getCmp('login').focus();
                                            }
                                        }
                                    });
                                }
                            }
                         }]
                    }]
            },{
                    layout	:'column',
                    border	:false,
                    items	:[{
                         columnWidth:.5,
                         layout: 'form',
                         border:false,
                         items: [{
                            xtype:'textfield',
                            fieldLabel:'Clave',
                            inputType:'password',
                            name:'pass',
                            id:'pass',
                            maxLength:20,
                            disabled:true,
                            allowBlank	:false,
                            minLength:6,
                            maxLengthText:'El texto es muy extenso',
                            minLengthText:'El texto es muy corto',
                            width:100

                         }]
                    },{
                         columnWidth:.5,
                         layout: 'form',
                         border:false,
                         items: [{
                            xtype:'textfield',
                            fieldLabel:'Confirme Clave',
                            name:'cpass',
                            inputType:'password',
                            id:'cpass',
                            maxLength:20,
                            allowBlank	:false,
                            disabled:true,
                            minLength:6,
                            maxLengthText:'El texto es muy extenso',
                            minLengthText:'El texto es muy corto',
                            width:100
                         }]
                    }]
            },rdo_tuser,grdusers]
    });



    function adduser(){
        Ext.getCmp('nombre').enable();
		Ext.getCmp('apellido').enable();
		Ext.getCmp('pass').enable();
		Ext.getCmp('cpass').enable();
		Ext.getCmp('idcbo').enable();
		Ext.getCmp('login').enable();
		Ext.getCmp('idcboperfil').enable();
		
        Ext.getCmp('btn_grabauser').enable();
        Ext.getCmp('btn_cancelauser').enable();
        rdo_tuser.enable();
        Ext.getCmp('btn_nuevouser').disable();
        Ext.getCmp('btn_editauser').disable();
        rdo_activo_user.setValue(1);
        accion_users=1;
    }

    function grabartipodoc(){
		
		var xPass=Ext.getCmp('pass').getValue();
		var cPass=Ext.getCmp('cpass').getValue();

		if(xPass!=cPass){
                    Ext.Msg.show({
                        title   :'CUIDADO',
                        msg     :'Las claves no coinciden',
                        buttons :Ext.Msg.OK,
                        icon    :Ext.MessageBox.INFO
                    });
                    Ext.getCmp('pass').setValue('');
                    Ext.getCmp('cpass').setValue('');
                    return;
		}


		if(frm_user.getForm().isValid()){
			Ext.Msg.wait('','Actualizando...');

			Ext.Msg.show({
				tittle:'Confirmaci\u00F3n',
				msg:'Realmente desea grabar los datos?',
				buttons:Ext.Msg.YESNO,
				fn:function(btn,text){
                                    if(btn=='yes'){

                                        Ext.getCmp('btn_grabauser').disable();
                                        Ext.getCmp('btn_cancelauser').disable();

                                        Ext.getCmp('btn_nuevouser').enable();
                                        Ext.getCmp('btn_editauser').enable();

                                        frm_user.form.submit({
                                            url:'DB/datamttos.php',
                                            method:'POST',
                                            params:{
                                                x:6,
                                                accion:accion_users,
                                                empresa:Ext.getCmp('idcbo').getValue(),
                                                perfil:Ext.getCmp('idcboperfil').getValue(),
                                                id:idfi_
                                            },
                                            waitTitle:'Enviando',
                                            waitMsg:'Guardando datos ...',
                                            success:function(form,action){
                                                Ext.MessageBox.alert('Mensaje','Los datos han sido grabados'),
                                                frm_user.getForm().reset();
                                                cancelar_user();

                                                dsusers.proxy= new Ext.data.HttpProxy({
                                                    url: 'DB/datamttos.php',
                                                    method : 'POST'
                                                });
                                                dsusers.baseParams={
                                                    x:5
                                                };
                                                dsusers.load();
                                            },
                                            failure:function(form,action){
                                                Ext.Msg.alert('Cuidado','Ocurrio un error inesperado')
                                            }

                                        });

                                    }else if(btn=='no'){
                                            //no hago nada
                                    }
				},
				animEl:'elId',
				icon:Ext.MessageBox.QUESTION
			});



		}
    }

    function cancelar_user(){
        Ext.getCmp('frmtipuser').getForm().reset();
        Ext.getCmp('nombre').disable();
		Ext.getCmp('apellido').disable();
		Ext.getCmp('pass').disable();
		Ext.getCmp('cpass').disable();
		Ext.getCmp('idcbo').disable();
		Ext.getCmp('login').disable();
		Ext.getCmp('idcboperfil').disable();


        Ext.getCmp('btn_grabauser').disable();
        Ext.getCmp('btn_cancelauser').disable();

        Ext.getCmp('btn_nuevouser').enable();
        Ext.getCmp('btn_editauser').enable();
        rdo_tuser.disable();
        rdo_activo_user.setValue(0);
        rdo_inactivo_user.setValue(0);
    }

    var view_window_users = new Ext.Window({
        frame:true,
        title:'Usuarios',
        width:770,
        iconCls : 'regper',
        height:450,
        closable: true,
        items: frm_user,
        resizable:false
    });

    view_window_users.show();


}