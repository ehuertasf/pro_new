/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function main_menu(){
    Ext.QuickTips.init();
    var cperf,dperf;

    Ext.Ajax.request({
        url : 'DB/datamttos.php',
        params : {
            x:18
        },
        success:function(response,options){
            var stringData	=response.responseText;
            var jsonData 	= Ext.util.JSON.decode(stringData);
            cperf=jsonData.cperf;
            dperf=jsonData.dperf;

            var mnu1=false;
            var mnu2=false;
            var mnu3=false;
            var mnu4=false;            

            //administrador
            if(cperf==1){
                opt1=false
            }

            //usuario
            if(cperf==2){
                mnu4=true;
            }
            //consulta
            if(cperf==3){
                mnu1=true;
                mnu4=true;
            }

            new Ext.Toolbar({
                renderTo: document.body,
                items: [{
                        xtype: 'tbbutton',
                        text: 'Nuevo',
                        hidden:mnu1,
                        menu: [{
                                text: 'Persona',
                                cls: 'x-btn-text-icon',
                                icon: 'files/images_app/users.png',
                                handler: frm_reg_persona
                            }, {
                                text: 'Cliente',
                                cls: 'x-btn-text-icon',
                                icon: 'files/images_app/user-detective.png',
                                handler: frm_reg_cliente
                            },{
                                text: 'Solicitud',
                                cls: 'x-btn-text-icon',
                                icon: 'files/images_app/document-share.png',
                                handler: frm_reg_solicitud
                            },'-',{
                                text: 'Salir',
                                cls: 'x-btn-text-icon',
                                icon: 'files/images_app/control-power.png',
                                handler: frm_logout
                            }]
                    },{
                        xtype: 'tbseparator'
                    },{
                        xtype: 'tbbutton',
                        text: 'Consultas',
                        hidden:mnu2,
                        menu: [{
                            text: 'Solicitudes',
                            cls: 'x-btn-text-icon',
                            icon: 'files/images_app/document-search-result.png',
                            handler: frm_con_solicitud
                        }]
                    },{
                        xtype: 'tbseparator'
                    },{
                        xtype: 'tbbutton',
                        text: 'Reportes',
                        hidden:mnu3,
                        menu: [{
                            text: 'Reporte por Cliente',
                            cls: 'x-btn-text-icon',
                            icon: 'files/images_app/application_view_columns.png',
                            handler: frm_rpt_cliente
                        },{
                            text: 'Reporte por Persona',
                            cls: 'x-btn-text-icon',
                            icon: 'files/images_app/table-join.png',
                            handler: frm_rpt_persona
                        }]
                    },{
                        xtype: 'tbseparator'
                    },{
                        xtype: 'tbbutton',
                        text: 'Mantenimientos',
                        hidden:mnu4,
                        menu: [{
                            text: 'Personas',
                            menu:[{
                                text: 'Tipos de Cliente',
                                cls:'x-btn-text-icon',
                                icon:'files/images_app/User_3_Idea.png',
                                handler:mttotipocli
                            },{
                                text: 'Usuarios',
                                cls:'x-btn-text-icon',
                                icon:'files/images_app/users.png',
                                handler:mttousers
                            }/*,{
                                text: 'Cargos'
                            },{
                                text: 'Estados'
                            }*/]
                        },{
                            text:'Varios',
                            menu:[{
                                text: 'Tipos de Documento',
                                cls:'x-btn-text-icon',
                                icon:'files/images_app/books-stack.png',
                                handler:mttotipodoc
                            },{
                                text: 'Zonificaciones',
                                cls:'x-btn-text-icon',
                                icon:'files/images_app/plugin.gif',
                                handler:mttotipzona
                                                            },{
                                text: 'Zonas de Riesgo',
                                cls:'x-btn-text-icon',
                                icon:'files/images_app/error.png',
                                handler:mttoriesgo
                                                            },{
                                text: 'Tipos de Delito',
                                cls:'x-btn-text-icon',
                                icon:'files/images_app/information.png',
                                handler:mttotipdelito
                                                            },{
                                text: 'Puestos',
                                cls:'x-btn-text-icon',
                                icon:'files/images_app/user_suit.png',
                                handler:mttopuesto
                                                            }]
                        }]
                    },{
                        xtype: 'tbfill'
                    },{
                        xtype: 'tbbutton',
                        text: 'Salir',
                        cls: 'x-btn-text-icon',
                        icon: 'files/images_app/control-power.png',
                        handler: frm_logout
                    }]
            });


        }
    });




}

