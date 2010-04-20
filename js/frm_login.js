//validation vtype
Ext.apply(Ext.form.VTypes, { 
    password : function(val, field) {
                if (field.initialPassField) {
                    var login = Ext.getCmp(field.initialPassField);
                    return (val == login.getValue());
                }
            return true;
            },
    passwordText : 'Passwords do not match' //alert if you enter a password that is not the same
});

Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.BLANK_IMAGE_URL = 'files/images_app/s.gif';
    var login = new Ext.FormPanel({
        labelWidth:90,
        url:'valida.php',
        frame:true,
        width:320,
        autoHeight:true,
        padding:5,
        defaultType:'textfield',
        items:[{
            fieldLabel:'Usuario',
            name:'username',
            width:190,
            allowBlank:false
            },{
            fieldLabel:'Password',
            name:'password',
            width:190,
            inputType:'password',
            id: 'pass',
            allowBlank:false
            }],
        buttons:[{
                text:'Ingresar',
                handler:function(){
                            login.getForm().submit({
                            method:'POST',
                            waitTitle:'Espere.....',
                            waitMsg:'Validando datos...',
                            success:function(){
                                        Ext.Msg.alert('Estado', 'Ingreso correcto..!', function(btn, text)
                                        {
                                        if (btn == 'ok'){
                                            var redirect = '../index.php';
                                            window.location = redirect;
                                        }
                                        });
                            },
                            failure:function(form, action){
                                        if(action.failureType == 'server'){
                                            obj = Ext.util.JSON.decode(action.response.responseText);
                                            Ext.Msg.alert('Login Incorrecto!', obj.errors.reason);
                                        }
                                        else{
                                            Ext.Msg.alert('Atenci&oacute;n!', 'El servidor no ha podido ser contactado : ' + action.response.responseText + " ");
                                        }
                                        login.getForm().reset();
                            }
                            });
                }
                },{
                text: 'Borrar',
                handler: function(){
                            login.getForm().reset();
                }
                }]
    });

    var createwindow = new Ext.Window({
        frame:true,
        title:'Ingreso a PRO',
        width:330,
        height:148,
        closable: false,
        items: login,
        resizable:false
    });

    createwindow.show();

});

