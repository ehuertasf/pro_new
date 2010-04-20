/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function main_menu(){
    Ext.QuickTips.init();
    new Ext.Toolbar({
                    renderTo: document.body,
                    items: [{
                            xtype: 'tbbutton',
                            text: 'Nuevo',
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
                            text: 'Mantenimientos',
                            menu: [{
                                text: 'Personas',
                                menu:[{
                                    text: 'Estados'
                                },{
                                    text: 'Tipos de Documento'
                                },{
                                    text: 'Cargos'
                                }]
                            },{
                                text: 'Accesos',
                                cls: 'x-btn-text-icon',
                                icon: 'files/images_app/lock.png',
                                menu: [{
                                    text: 'Usuarios'
                                },{
                                    text: 'Perfiles'
                                },{
                                    text: 'Opciones'
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

