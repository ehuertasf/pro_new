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
                                    text: 'Tipos de Documento',
                                    cls:'x-btn-text-icon',
                                    icon:'files/images_app/document-search-result.png',
                                    handler:mttotipodoc
                                },{
                                    text: 'Tipos de Cliente',
                                    cls:'x-btn-text-icon',
                                    icon:'files/images_app/document-search-result.png',
                                    handler:mttotipocli
                                },{
                                    text: 'Usuarios',
                                    cls:'x-btn-text-icon',
                                    icon:'files/images_app/document-search-result.png',
                                    handler:mttousers
								},{
                                    text: 'Cargos'
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

