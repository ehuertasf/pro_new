/*
* Funcion para mostrar el formulario del reporte por personas
* Ricardo De la Torre
* 25-04-2010
* v1.0
*/
function frm_rpt_persona(){
    var view_window_rpt_persona;
    var rpt_persona;
    var dsResultado;

    dsResultado = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
                root: 'lista',
                id: 'idlista'
                },[{	name: 'apenom',     mapping: 'apenom'
                }, {	name: 'numdocper',  mapping: 'numdocper'
                }, {	name: 'fecsol',     mapping: 'fecsol'
                }, {	name: 'nomcli',     mapping: 'nomcli'
                }, {	name: 'despacchk',  mapping: 'despacchk'
                }, {	name: 'desestsol',  mapping: 'desestsol'}
        ]),
        proxy: new Ext.data.HttpProxy({
                url: 'DB/datamttos.php?x=20'
        }),
        autoLoad: false
    });

    var dsPersona = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
                url: 'DB/datamttos.php?x=19'
        }),
        reader: new Ext.data.JsonReader({
                root: 'lstpersona',
                id: 'idlst'
                },[{	name: 'codper',     mapping: 'codper'
                }, {	name: 'apenom',     mapping: 'apenom'
                }, {	name: 'numdocper',  mapping: 'numdocper'}
        ])
    });

    var resultTpl = new Ext.XTemplate(
        '<tpl for="."><div class="search-item">',
                '<b>{apenom}</b><br/>',
                '<b>Nro. Doc. :</b>{numdocper}<br/>',
        '</div></tpl>'
    );

    var cmbPersona = new Ext.form.ComboBox({
        store: dsPersona,
        id:'idpersona',
        displayField: 'apenom',
        typeAhead: false,
        loadingText: 'Buscando...',
        width: 285,
        pageSize: 10,
        hideTrigger: true,
        tpl: resultTpl,
        itemSelector: 'div.search-item',
        onSelect: function(record){
            dsResultado.proxy= new Ext.data.HttpProxy({
                url: 'DB/datamttos.php',
                method : 'POST'
            });
            dsResultado.baseParams={
                    x:20,
                    valor:record.data.codper
            };
            dsResultado.load();
        }
    });



    var cm_personas = new Ext.grid.ColumnModel(
        [{
            header: 'Apellidos y Nombres',
            readonly: true,
            dataIndex: 'apenom',
            width:220,
            hidden: false
        },{
            header: 'Nro. Documento',
            readonly: true,
            dataIndex: 'numdocper',
            width:100,
            hidden: false
        },{
            header: 'Fecha de Solicitud',
            readonly: true,
            dataIndex: 'fecsol',
            align:'center',
            width:110,
            hidden: false
        },{
            header: 'Cliente',
            readonly: true,
            width:150,
            align:'center',
            dataIndex: 'nomcli',
            hidden: false
        },{
            header: 'Pack',
            readonly: true,
            dataIndex: 'despacchk',
            hidden: false
        },{
            header: 'Estado Solicitud',
            readonly: true,
            dataIndex: 'desestsol',
            hidden: false
        }
    ]);

    var grdPersona = new Ext.grid.EditorGridPanel({
        id      : 'grd_personas',
        store   : dsResultado,
        cm      : cm_personas,
        width   : 700,
        anchor  : '100%',
        height  : 300,
        frame   : true,
        clicksToEdit:1,
	layout    : 'fit',
	autoScroll: true,
        selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
        tbar:[cmbPersona]
    });

    rpt_persona = new Ext.FormPanel({
        frame		:true,
        labelAlign	:'right',
        labelWidth	:90,
        autoWidth	:true,
        waitMsgTarget   :true,
        items		:[{
                layout	:'column',
                border	:false,
                items	:[{
                    columnWidth:.99,
                    layout: 'form',
                    border:false,
                    items: grdPersona
                }]
        }]
    });


    view_window_rpt_persona = new Ext.Window({
        title       :'Reporte por Persona',
        width       :850,
        height      :500,
        modal       :true,
        frame       :true,
        autoHeight  :550,
        closable    :true,
        minWidth    :600,
        minHeight   :500,
        plain       :true,
        iconCls     :'rpt_persona',
        y           :130,
        id          :'LoginWin5',
        bodyStyle   :'padding:5px',
        items       :rpt_persona,
        resizable   :false
    });

    view_window_rpt_persona.show();
}


