/********************************************
 *  Inicio de formulario frm_checks_persona *
 *******************************************/

function frm_checks_persona(cod_sol, cod_per){
    var cperf;
    var dperf;
    var logus;

    Ext.Ajax.request({
        url : 'DB/datamttos.php',
        params : {
            x:18
        },
        success:function(response,options){
            var stringData	=response.responseText;
            var jsonData 	=Ext.util.JSON.decode(stringData);
            cperf=jsonData.cperf;
            dperf=jsonData.dperf;
            logus=jsonData.loguser;

            var refpol=false,antpol=false,reqjud=false,refter=false,refdro=false,impsal=false,invpen=false;
            var selResidente=false,selDelito=false,selDelitoFam=false, vcodres="", vdesres="", vcoddel="", vdesdel="", vnomdel="";
            var NewChkFam='no';
            var NewChkLab='no';
            var Cuestionario=0;

            ///////////////////////////////Elementos Compartidos/////////////////////////////////////

            //Puestos
            var ds_chksrvpuestos = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['codpue', 'despue'],
                                                    root    : 'puestos',
                                                    id      : 'codpue'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/solicitud.php?n=1'
                                            }),
                                    autoLoad: false
                                });
            ds_chksrvpuestos.load();

            //EstadosCheck
            var ds_estadoscheck = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['codestchk', 'desestchk'],
                                                    root    : 'estadoscheck',
                                                    id      : 'codestchk'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/checkservice.php?n=2'
                                            }),
                                    autoLoad: false
                                });
            ds_estadoscheck.load();

            //Delitos
            var ds_delitos = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['coddel', 'nomdel', 'desdel'],
                                                    root    : 'delitos',
                                                    id      : 'coddel'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/checkservice.php?n=1'
                                            }),
                                    autoLoad: false
                                });
            ds_delitos.load();

            //Registra o No registra antecedentes
            var ds_registra = new Ext.data.SimpleStore({
                                    fields: ['codreg', 'desreg'],
                                    data : [['1','Registra'],['0','No Registra']]
                                });

///////////////////////////////Controles de Check Service/////////////////////////////////////

            /*Controles Ocultos*/

            //Imagen Actual Reniec
            var hid_imgactreniec = new Ext.form.Hidden({
                id          : 'hid_imgactreniec',
                readOnly	: false,
                name	: 'imgreniecact',
                hidemode    : 'display',
                hidelabel   : true
            });

            var hid_codchkser = new Ext.form.Hidden({
                id          : 'hid_codchkser',
                readOnly    : false,
                name        : 'codchkser',
                hidemode    : 'display',
                hidelabel   : true
            });

            ///*Controles Texto*///

            //Nombre de la persona
            var txt_chksrvnomper = new Ext.form.TextField({
                id          : 'txt_chksrvnomper',
                fieldLabel	: 'Check Identidad',
                width : 250,
                readOnly	: true,
                disabled    : false,
                name	: 'nombrechksrvc',
                anchor	: '98%'
            });

            //Investigación Policial
            var txt_invpol = new Ext.form.TextArea({
                id          : 'txt_invpol',
                fieldLabel	: 'Investigación Policial',
                readOnly	: false,
                disabled    : true,
                name	: 'refpolchk',
                anchor	: '100%',
                height      : 87
            });

            //Investigación penal
            var txt_invpen = new Ext.form.TextArea({
                id          : 'txt_invpen',
                fieldLabel	: 'Investigación Penal',
                readOnly	: false,
                disabled    : true,
                name	: 'invpenchk',
                anchor	: '100%',
                height      : 89
            });

            //Definición del delito
            var txt_defdel = new Ext.form.TextArea({
                id          : 'txt_defdel',
                fieldLabel	: 'Def. Delito',
                height      : 53,
                readOnly	: true,
                disabled    : false,
                name	: 'defdel',
                anchor	: '100%'
            });

            //Recomendación
            var txt_recome = new Ext.form.TextArea({
                id          : 'txt_recome',
                fieldLabel	: 'Recomendación',
                height      : 38,
                readOnly	: false,
                disabled    : false,
                allowBlank  : false,
                name	: 'recchk',
                anchor	: '98%'
            });

            //Observación DNI
            var txt_obsdni = new Ext.form.TextField({
                id          : 'txt_obsdni',
                fieldLabel	: 'Observación DNI',
                readOnly	: false,
                disabled    : false,
                name	: 'obsimgreniec',
                anchor	: '100%'
            });

            ///*Controles UploadFile*///

            //Imagen DNI
            var upf_imagendni = new Ext.ux.form.FileUploadField({
                id : 'upf_imagendni',
                emptyText: 'Seleccione la imagen del DNI',
                fieldLabel: 'Imagen DNI',
                name : 'imgreniec',
                anchor: '-10',
                allowBlank : true,
                buttonText: '',
                buttonCfg: {
                    iconCls: 'upload-icon'
                }
            });

            ///*Controles Botones*///

            //Boton para ver imagen cargada
            var btnImgCargada = new Ext.Button({
                    text        : 'Imagen Cargada',
                    tooltip     : 'Muestra la imagen cargada en el Check',
                    width : 144,
                    handler     : function(){
                                        var win_imdDni = Ext.getCmp('frm_imgDni');
                                        var PreviewDNI = new Ext.Component({
                                            autoEl: {
                                                tag: 'img', src: 'files/images_dni/'+hid_imgactreniec.getValue(), id: 'photoPreview'
                                            }
                                        });

                                        var frmpnlImagen = new Ext.FormPanel({
                                            frame: true,
                                            border: false,
                                            autoScroll: true,
                                            items:[PreviewDNI]
                                        });
                                        if (!win_imdDni){
                                            new Ext.Window({
                                                title	: 'Imagen DNI',
                                                id          : 'frm_imgDni',
                                                iconCls     : 'regper',
                                                layout	: 'fit',
                                                width	: 600,
                                                height	: 400,
                                                resizable   : false,
                                                closable    : true,
                                                modal       : true,
                                                closeAction : 'destroy',
                                                items       : [frmpnlImagen]
                                            }).show();
                                        }else{
                                              win_imdDni.show();
                                        }
                    }
                });

            ///*Controles ComboBox*///

            //Puestos
            var cboCheckPuestos = new Ext.form.ComboBox({
                fieldLabel  : 'Puesto al que postula',
                id          : 'cboCheckPuestos',
                store       : ds_chksrvpuestos,
                displayField: 'despue',
                valueField  : 'codpue',
                typeAhead   : true,
                mode        : 'local',
                triggerAction: 'all',
                anchor      :'100%',
                disabled    : false,
                forceSelection : true,
                hideTrigger : false,
                lazyRender : true,
                selectOnFocus:true
            });

            //Delitos
            var cboDelitos = new Ext.form.ComboBox({
                fieldLabel  : 'Delito',
                id          : 'cboDelitos',
                name        : 'coddel',
                store       : ds_delitos,
                displayField: 'nomdel',
                valueField  : 'coddel',
                hiddenName  : 'vcoddel',
                triggerAction: 'all',
                anchor      : '100%',
                disabled    : false,
                //editable : false,
                lazyRender : true,
                //readOnly : true,
                onSelect    : function(record){
                                var id=record.data.coddel.toString();
                                var registro = ds_delitos.getById(id);
                                txt_defdel.setValue(registro.data.desdel);
                                cboDelitos.setValue(record.data.coddel);
                                selDelito=true;
                                vcoddel=record.data.coddel;
                                vdesdel=record.data.desdel;
                                vnomdel=record.data.nomdel;
                                cboDelitos.collapse();
                                txt_recome.focus();
                            }
                });

            //Estado CheckService
            var cboEstadoCheckService = new Ext.form.ComboBox({
                    id              : 'cboEstadoCheckService',
                    name            : 'codestchk',
                    fieldLabel      : 'Estado Check',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_estadoscheck,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'desestchk',
                    valueField      : 'codestchk',
                    hiddenName      : 'vcodestchk',
                    anchor          : '100%'
            });

            //Referencia Policial
            var cbo_refpol = new Ext.form.ComboBox({
                    id              : 'cbo_refpol',
                    name            : 'indrefpol',
                    fieldLabel      : 'Referencia Policial',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_registra,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'desreg',
                    valueField      : 'codreg',
                    hiddenName      : 'vindrefpol',
                    anchor          : '100%',
                    value           : '0',
                    onSelect    : function(record){
                                        var seleccionado=record.data.codreg;
                                        //alert(seleccionado);
                                        if(seleccionado=='1'){
                                            refpol=true;
                                        }
                                        else {
                                            refpol=false;
                                        }
                                        if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                            txt_invpol.enable();
                                            //cboDelitos.enable();
                                            cboDelitos.setReadOnly(false);
                                        }
                                        else{
                                            txt_invpol.setValue('');
                                            txt_invpol.disable();
                                            //cboDelitos.setValue('1');
                                            //cboDelitos.setReadOnly(true);
                                            //txt_defdel.setValue('');
                                        }
                                        cbo_refpol.setValue(record.data.codreg);
                                        cbo_refpol.collapse();
                                    }
            });

            //Antecedente Policial
            var cbo_antpol = new Ext.form.ComboBox({
                    id              : 'cbo_antpol',
                    name            : 'indantpol',
                    fieldLabel      : 'Antecedente Policial',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_registra,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'desreg',
                    valueField      : 'codreg',
                    hiddenName      : 'vindantpol',
                    anchor          : '100%',
                    value           : '0',
                    onSelect    : function(record){
                                        var seleccionado=record.data.codreg;
                                        //alert(seleccionado);
                                        if(seleccionado=='1'){
                                            antpol=true;
                                        }
                                        else {
                                            antpol=false;
                                        }
                                        if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                            txt_invpol.enable();
                                            //cboDelitos.enable();
                                            cboDelitos.setReadOnly(false);
                                        }
                                        else{
                                            txt_invpol.setValue('');
                                            txt_invpol.disable();
                                            //cboDelitos.setValue('1');
                                            //cboDelitos.setReadOnly(true);
                                            //txt_defdel.setValue('');
                                        }
                                        cbo_antpol.setValue(record.data.codreg);
                                        cbo_antpol.collapse();
                                    }
            });

            //Requisitoria Judicial
            var cbo_reqjud = new Ext.form.ComboBox({
                    id              : 'cbo_reqjud',
                    name            : 'indreqjud',
                    fieldLabel      : 'Requisitoria Judicial',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_registra,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'desreg',
                    valueField      : 'codreg',
                    hiddenName      : 'vindreqjud',
                    anchor          : '100%',
                    value           : '0',
                    onSelect    : function(record){
                                        var seleccionado=record.data.codreg;
                                        //alert(seleccionado);
                                        if(seleccionado=='1'){
                                            reqjud=true;
                                        }
                                        else {
                                            reqjud=false;
                                        }
                                        if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                            txt_invpol.enable();
                                            //cboDelitos.enable();
                                            cboDelitos.setReadOnly(false);
                                        }
                                        else{
                                            txt_invpol.setValue('');
                                            txt_invpol.disable();
                                            //cboDelitos.setValue('1');
                                            //cboDelitos.setReadOnly(true);
                                            //txt_defdel.setValue('');
                                        }
                                        cbo_reqjud.setValue(record.data.codreg);
                                        cbo_reqjud.collapse();
                                    }
            });

            //Referencia por Terrorismo
            var cbo_refter = new Ext.form.ComboBox({
                    id              : 'cbo_refter',
                    name            : 'indrefter',
                    fieldLabel      : 'Referencia Terrorismo',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_registra,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'desreg',
                    valueField      : 'codreg',
                    hiddenName      : 'vindrefter',
                    anchor          : '100%',
                    value           : '0',
                    onSelect    : function(record){
                                        var seleccionado=record.data.codreg;
                                        //alert(seleccionado);
                                        if(seleccionado=='1'){
                                            refter=true;
                                        }
                                        else {
                                            refter=false;
                                        }
                                        if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                            txt_invpol.enable();
                                            //cboDelitos.enable();
                                            cboDelitos.setReadOnly(false);
                                        }
                                        else{
                                            txt_invpol.setValue('');
                                            txt_invpol.disable();
                                            //cboDelitos.setValue('1');
                                            //cboDelitos.setReadOnly(true);
                                            //txt_defdel.setValue('');
                                        }
                                        cbo_refter.setValue(record.data.codreg);
                                        cbo_refter.collapse();
                                    }
            });

            //Referencia por Drogas
            var cbo_refdro = new Ext.form.ComboBox({
                    id              : 'cbo_refdro',
                    name            : 'indrefdro',
                    fieldLabel      : 'Referencia Drogas',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_registra,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'desreg',
                    valueField      : 'codreg',
                    hiddenName      : 'vindrefdro',
                    anchor          : '100%',
                    value           : '0',
                    onSelect    : function(record){
                                        var seleccionado=record.data.codreg;
                                        //alert(seleccionado);
                                        if(seleccionado=='1'){
                                            refdro=true;
                                        }
                                        else {
                                            refdro=false;
                                        }
                                        if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                            txt_invpol.enable();
                                            //cboDelitos.enable();
                                            cboDelitos.setReadOnly(false);
                                        }
                                        else{
                                            txt_invpol.setValue('');
                                            txt_invpol.disable();
                                            //cboDelitos.setValue('1');
                                            //cboDelitos.setReadOnly(true);
                                            //txt_defdel.setValue('');
                                        }
                                        cbo_refdro.setValue(record.data.codreg);
                                        cbo_refdro.collapse();
                                    }
            });

            //Impedimento de salida
            var cbo_impsal = new Ext.form.ComboBox({
                    id              : 'cbo_impsal',
                    name            : 'indimpsalpai',
                    fieldLabel      : 'Imp. de salida del País',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_registra,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'desreg',
                    valueField      : 'codreg',
                    hiddenName      : 'vindimpsalpai',
                    anchor          : '100%',
                    value           : '0',
                    onSelect    : function(record){
                                        var seleccionado=record.data.codreg;
                                        //alert(seleccionado);
                                        if(seleccionado=='1'){
                                            impsal=true;
                                        }
                                        else {
                                            impsal=false;
                                        }
                                        if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                            txt_invpol.enable();
                                            //cboDelitos.enable();
                                            cboDelitos.setReadOnly(false);
                                        }
                                        else{
                                            txt_invpol.setValue('');
                                            txt_invpol.disable();
                                            //cboDelitos.setValue('1');
                                            //cboDelitos.setReadOnly(true);
                                            //txt_defdel.setValue('');
                                        }
                                        cbo_impsal.setValue(record.data.codreg);
                                        cbo_impsal.collapse();
                                    }
            });

            //Investigación penal
            var cbo_invpen = new Ext.form.ComboBox({
                    id              : 'cbo_invpen',
                    name            : 'indinvpen',
                    fieldLabel      : 'Investigación Penal',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_registra,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'desreg',
                    valueField      : 'codreg',
                    hiddenName      : 'vindinvpen',
                    anchor          : '100%',
                    value           : '0',
                    onSelect    : function(record){
                                        var seleccionado=record.data.codreg;
                                        if(seleccionado=='1'){
                                                    invpen=true;
                                                }
                                        else {
                                            invpen=false;
                                        }
                                        if(invpen==true){
                                            txt_invpen.enable();
                                            //cboDelitos.enable();
                                            cboDelitos.setReadOnly(false);
                                        }
                                        else{
                                            txt_invpen.setValue('');
                                            txt_invpen.disable();
                                            //cboDelitos.setValue('1');
                                            //cboDelitos.setReadOnly(true);
                                            //txt_defdel.setValue('');
                                        }
                                        cbo_invpen.setValue(record.data.codreg);
                                        cbo_invpen.collapse();
                    }
            });

            ///*FieldSets*///
            var fldstCombosAntecedentes = new Ext.form.FieldSet({
                    columnWidth: 0.4,
                    collapsible: false,
                    border : false,
                    autoHeight:true,
                    labelWidth  : 140,
                    defaults: {
                        anchor: '-10'
                    },
                    defaultType: 'textfield',
                    items :[
                        cbo_refpol,
                        cbo_antpol,
                        cbo_reqjud,
                        cbo_refter,
                        cbo_refdro,
                        cbo_impsal,
                        cbo_invpen
                    ]
            });

            //Textos de referencias Policiales y Penales
            var fldstDescAntecedentes = new Ext.form.FieldSet({
                    columnWidth: 0.6,
                    //title: 'Fieldset 1',
                    collapsible: false,
                    border : false,
                    autoHeight:true,
                    labelWidth  : 80,
                    defaultType: 'textfield',
                    items :[
                        txt_invpol,
                        txt_invpen
                    ]
            });

            /*Agregando para varios delitos*/

            var cm_delitos = new Ext.grid.ColumnModel(
                    [{
                        id : 'coddel',
                        header: 'coddel',
                        readonly: true,
                        dataIndex: 'coddel',
                        hidden: true,
                        width: 10
                    },{
                        header: 'Delito',
                        readonly: true,
                        dataIndex: 'nomdel',
                        hidden: false,
                        width: 160
                    },{
                        header: 'Descripción',
                        readonly: true,
                        dataIndex: 'desdel',
                        hidden: false,
                        width: 600
                    },{
                        header: 'grabado',
                        readonly: true,
                        dataIndex: 'grabado',
                        hidden: true,
                        width: 50
                    }]
                );


            //Record para nuevos delitos
            var newDelito = Ext.data.Record.create([
                    {name: 'coddel', type: 'int'},
                    {name: 'nomdel', type: 'string'},
                    {name: 'desdel', type: 'string'},
                    {name: 'grabado', type: 'int'}
                ]);

            //Store ficticio para residentes
            var ds_delitostemp = new Ext.data.Store({
                        reader	:   new Ext.data.JsonReader(newDelito),
                        proxy	:   new Ext.data.HttpProxy({url: "DB/checkservice.php?n=100"}),
                        sortInfo	:   {field:'coddel', direction:'ASC'},
                        autoLoad    :   false
                });

            //Grid para mostrar delitos de la persona
            var grd_delitos = new Ext.grid.EditorGridPanel({
                    id      : 'grd_delitos',
                    store   : ds_delitostemp,
                    //title   : 'Delitos',
                    cm      : cm_delitos,
                    //anchor  : '99%',
                    height  : 140,
                    width   : 754,
                    frame   : true,
                    clicksToEdit :1,
                    //layout    : 'fit',
                    autoScroll: true,
                    selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
                    tbar    :['Delitos :',cboDelitos,
                            {
                                xtype   : 'tbbutton',
                                cls     : 'x-btn-icon',
                                icon    : 'files/images_app/plus.png',
                                handler : function(){
                                        var duplicado=false;
                                        var cant_registros = ds_delitostemp.getCount();
                                        for (var i = 0; i < cant_registros; i++) {
                                            var record = grd_delitos.getStore().getAt(i);
                                            var coddel = record.data.coddel;
                                            //console.log(codpersona);
                                            if (vcoddel == coddel) {
                                                duplicado=true;
                                                break;
                                            }
                                        }
                                        if(duplicado==false){
                                            if(selDelito==true){
                                                var r = new newDelito({
                                                   coddel       : vcoddel,
                                                   nomdel       : vnomdel,
                                                   desdel       : vdesdel,
                                                   grabado      : 0
                                                });
                                                //alert(p.get('item'));
                                                ds_delitostemp.insert(ds_delitostemp.getCount(), r);
                                                grd_delitos.getView().refresh();
                                                ds_delitostemp.reload();
                                                //restablece campos para agregar mas residentes
                                                selDelito=false;
                                                cboDelitos.clearValue();
                                            }else{
                                                Ext.Msg.show({title: 'Error de Ingreso',
                                                                msg: 'Debe seleccionar un delito a agregar',
                                                                buttons: Ext.MessageBox.OK,
                                                                icon: Ext.MessageBox.ERROR});
                                            }
                                        }else{
                                            Ext.Msg.show({title: 'Error de Ingreso',
                                                                msg: 'Tipo de delito que intenta agregar ya esta en la lista',
                                                                buttons: Ext.MessageBox.OK,
                                                                icon: Ext.MessageBox.INFO});
                                        }
                                     }
                            },
                            {
                                xtype   : 'tbbutton',
                                cls     : 'x-btn-icon',
                                icon    : 'files/images_app/minus.png',
                                handler : function handleDelete() {
                                                var selectedKeys = grd_delitos.selModel.selections.keys;
                                                if(selectedKeys.length > 0) {
                                                    Ext.Msg.confirm('ALERTA!','¿desea eliminar el registro?', function borraResidente(btn){
                                                    if (btn == 'yes') {
                                                        //alert(btn);
                                                        var selectedRow = grd_delitos.getSelectionModel().getSelected();
                                                        var colgrabado = grd_delitos.getColumnModel().getDataIndex(3);
                                                        var grabado = selectedRow.get(colgrabado);

                                                        if(grabado==1){
                                                            //alert("es grabado");
                                                            var chkser = hid_codchkser.getValue();
                                                            var campodel =grd_delitos.getColumnModel().getDataIndex(0);
                                                            var delitodel =selectedRow.get(campodel);
                                                            //alert(chkser);
                                                            //alert(delitodel);
                                                            Ext.Ajax.request({
                                                                url : 'DB/checkservice.php',
                                                                params : {
                                                                    n   : 11,
                                                                    codchkser : chkser,
                                                                    coddel : delitodel
                                                                },
                                                                callback : function(opt,success,response){
                                                                    if (success) {
                                                                            var responseData = Ext.util.JSON.decode(response.responseText);
                                                                            var error = responseData.respuesta.error;
                                                                            if (error==0){
                                                                                //var selectedRow = grd_delitos.getSelectionModel().getSelected();
                                                                                if (selectedRow) ds_delitostemp.remove(selectedRow);
                                                                                var cant_registros = ds_delitostemp.getCount();
                                                                                for (var i = 0; i < cant_registros; i++) {
                                                                                    var record = grd_delitos.getStore().getAt(i);
                                                                                    record.beginEdit();
                                                                                    record.data.item = i+1;
                                                                                    record.endEdit();
                                                                                    record.commit();
                                                                                }
                                                                            }
                                                                            else{
                                                                                Ext.Msg.show({title: 'Error',
                                                                                     msg: responseData.respuesta.mensaje,
                                                                                     buttons: Ext.MessageBox.OK,
                                                                                     icon: Ext.MessageBox.ERROR
                                                                                 });
                                                                            }
                                                                        } else {
                                                                           Ext.Msg.show({title: 'Error',
                                                                                     msg: 'Sin respuesta del servidor, comuniquese con Sistemas',
                                                                                     buttons: Ext.MessageBox.OK,
                                                                                     icon: Ext.MessageBox.ERROR
                                                                                 });
                                                                        }
                                                                }
                                                            });
                                                        }
                                                        else{
                                                            //alert("no es grabado");
                                                            //var selectedRow = grd_delitos.getSelectionModel().getSelected();
                                                            if (selectedRow) ds_delitostemp.remove(selectedRow);
                                                            var cant_registros = ds_delitostemp.getCount();
                                                            for (var i = 0; i < cant_registros; i++) {
                                                                var record = grd_delitos.getStore().getAt(i);
                                                                record.beginEdit();
                                                                record.data.item = i+1;
                                                                record.endEdit();
                                                                record.commit();
                                                            }
                                                        }
                                                    }
                                                });
                                                }else{
                                                    Ext.Msg.alert('Recuerde!','Seleccione un registro para eliminar');
                                                }
                                            }
                            }
                    ]

                });

            /*Fin de varios delitos*/

            //Panel principal para el CheckService

            var frmCheckService = new Ext.FormPanel({
                frame       : false,
                border      : false,
                fileUpload  : true,
                style       : 'padding:1px 1px 1px 1px',
                items       : [hid_imgactreniec,hid_codchkser,
                    {
                        layout  : 'column',
                        border  : false,
                        frame   : true,
                        style   : 'padding: 5px 0px 5px 0px',
                        items   : [
                            {
                                columnWidth	: 0.8,
                                layout : 'form',
                                labelWidth : 75,
                                border : false,
                                items  : [upf_imagendni]
                            },
                            {
                                columnWidth	: 0.2,
                                border : false,
                                items  : [btnImgCargada]
                            },
                            {
                                columnWidth	: 1.0,
                                layout : 'form',
                                labelWidth : 100,
                                border : false,
                                items  : [txt_obsdni]
                            }
                        ]
                    },{
                        layout : 'column',
                        frame : true,
                        border : false,
                        height : 200,
                        items : [fldstCombosAntecedentes,fldstDescAntecedentes]
                    },
                    {
                        layout : 'column',
                        border : true,
                        frame  : false,
                        style  : 'padding: 5px 0px 1px 1px',
                        items : [grd_delitos]
                    },
                    {
                        layout : 'column',
                        border : false,
                        frame  : true,
                        style  : 'padding: 5px 0px 1px 1px',
                        items : [
                            {
                                columnWidth	: 0.7,
                                layout : 'form',
                                labelWidth : 100,
                                border : false,
                                items  : [txt_recome]
                            },{
                                columnWidth	: 0.3,
                                layout : 'form',
                                labelWidth : 80,
                                border : false,
                                items  : [cboEstadoCheckService]
                            }
                        ]
                    }]
            });

///////////////////////////////Controles de Check Domiciliario/////////////////////////////////////

            ///*Data Stores*///

            //Indicador si domicilia o no
            var ds_domicilia = new Ext.data.SimpleStore({
                                    fields: ['codinddom', 'desinddom'],
                                    data : [['1','Si'],['0','No']]
                                });

            // Parentescos
            var ds_parentescos = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['codpar', 'despar'],
                                                    root    : 'parentescos',
                                                    id      : 'codpar'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/checkdomicilio.php?n=1'
                                            }),
                                    autoLoad: false
                                });
            ds_parentescos.load();

            //Residentes
            var ds_residentes = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['codres', 'desres'],
                                                    root    : 'residentes',
                                                    id      : 'codres'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/checkdomicilio.php?n=2'
                                            }),
                                    autoLoad: false
                                });
            ds_residentes.load();

            //Vivienda
            var ds_vivienda = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['codviv', 'desviv'],
                                                    root    : 'vivienda',
                                                    id      : 'codviv'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/checkdomicilio.php?n=3'
                                            }),
                                    autoLoad: false
                                });
            ds_vivienda.load();

            //Tipo Vivienda
            var ds_tipovivienda = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['codtipviv', 'destipviv'],
                                                    root    : 'tipovivienda',
                                                    id      : 'codtipviv'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/checkdomicilio.php?n=13'
                                            }),
                                    autoLoad: false
                                });
            ds_tipovivienda.load();

            //Materia Vivienda
            var ds_material = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['codtipmat', 'destipmat'],
                                                    root    : 'material',
                                                    id      : 'codtipmat'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/checkdomicilio.php?n=4'
                                            }),
                                    autoLoad: false
                                });
            ds_material.load();

            //Estado construccion
            var ds_estconstruc = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['codestcon', 'desestcon'],
                                                    root    : 'construccion',
                                                    id      : 'codestcon'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/checkdomicilio.php?n=5'
                                            }),
                                    autoLoad: false
                                });
            ds_estconstruc.load();

            //zonificacion
            var ds_zonifi = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['codzonif', 'deszonif'],
                                                    root    : 'zonificacion',
                                                    id      : 'codzonif'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/checkdomicilio.php?n=6'
                                            }),
                                    autoLoad: false
                                });
            ds_zonifi.load();

            //zona riesgo
            var ds_zonariesgo = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['codzonrie', 'deszonrie'],
                                                    root    : 'zonariesgo',
                                                    id      : 'codzonrie'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/checkdomicilio.php?n=7'
                                            }),
                                    autoLoad: false
                                });
            ds_zonariesgo.load();

            //conclusion
            var ds_conclusion = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['codcon', 'descon'],
                                                    root    : 'conclusion',
                                                    id      : 'codcon'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/checkdomicilio.php?n=8'
                                            }),
                                    autoLoad: false
                                });
            ds_conclusion.load();

            //vias
            var ds_vias = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['codtipvia', 'destipvia'],
                                                    root    : 'vias',
                                                    id      : 'codtipvia'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/checkdomicilio.php?n=9'
                                            }),
                                    autoLoad: false
                                });
            ds_vias.load();

            //Departamentos
            var ds_departamento = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['coddpto', 'desdpto'],
                                                    root    : 'departamentos',
                                                    id      : 'coddpto'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/checkdomicilio.php?n=10',
                                                    method : 'GET'
                                            }),
                                    autoLoad: true,
                                    pruneModifiedRecords: true
                                });

            //Provincias
            var ds_provincia = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['codpro', 'despro'],
                                                    root    : 'provincias',
                                                    id      : 'codpro'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/checkdomicilio.php?n=11',
                                                    method : 'GET'
                                            }),
                                    autoLoad: true,
                                    pruneModifiedRecords: true
                                });

            //Distritos
            var ds_distrito = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['coddist', 'desdist'],
                                                    root    : 'distritos',
                                                    id      : 'coddist'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/checkdomicilio.php?n=12',
                                                    method : 'GET'
                                            }),
                                    autoLoad: true,
                                    pruneModifiedRecords: true
                                });

            //Tipo Imagen
            var ds_tipoimagen = new Ext.data.Store({
                                    reader  : new Ext.data.JsonReader({
                                                    fields  : ['codtipimg', 'destipimg'],
                                                    root    : 'tipoimagen',
                                                    id      : 'codtipimg'
                                            }),
                                    proxy: new Ext.data.HttpProxy({
                                                    url: 'DB/checkdomicilio.php?n=14'
                                            }),
                                    autoLoad: false
                                });
            ds_tipoimagen.load();

            ///*Controles Texto*///

            //Nombre de la persona
            var txt_nomvia = new Ext.form.TextField({
                id          : 'txt_nomvia',
                fieldLabel	: 'Nom. Vía',
                readOnly	: false,
                disabled    : false,
                allowBlank      : false,
                name	: 'nomviadom',
                anchor	: '98%'
            });

            //Numero de via
            var txt_numvia = new Ext.form.TextField({
                id          : 'txt_numvia',
                fieldLabel	: 'Num. Vía',
                readOnly	: false,
                disabled    : false,
                allowBlank  : false,
                name	: 'numdom',
                anchor	: '98%'
            });

            //Urbanizacion
            var txt_urb = new Ext.form.TextField({
                id          : 'txt_urb',
                fieldLabel	: 'Urb.',
                readOnly	: false,
                disabled    : false,
                allowBlank  : false,
                name	: 'urbdom',
                anchor	: '100%'
            });

            //Nombre de la persona para Check domiciliario
            var txt_chkdomnomper = new Ext.form.TextField({
                id          : 'txt_chkdomnomper',
                fieldLabel	: 'Check Identidad',
                readOnly	: false,
                disabled    : false,
                width       : 250,
                name	: 'nombrechkdom',
                anchor	: '98%'
            });

            //Nombre de persona entrevistada
            var txt_persentre = new Ext.form.TextField({
                id          : 'txt_persentre',
                fieldLabel	: 'Entrevistado',
                readOnly	: false,
                disabled    : false,
                name	: 'perent',
                anchor	: '-10'
            });

            //Tiempo en años
            var txt_tiemanio = new Ext.form.NumberField({
                id          : 'txt_tiemanio',
                fieldLabel	: 'Años',
                readOnly	: false,
                disabled    : false,
                allowDecimals : false,
                allowNegative : false,
                maxValue    :   99,
                name	: 'anoresdom',
                anchor	: '-10'
            });

            //Tiempo en meses
            var txt_tiemmeso = new Ext.form.NumberField({
                id          : 'txt_tiemmeso',
                fieldLabel	: 'Meses',
                readOnly	: false,
                disabled    : false,
                allowDecimals : false,
                allowNegative : false,
                maxValue    : 12,
                name	: 'mesresdom',
                anchor	: '-10'
            });

            //Otro parentesco
            var txt_otropar = new Ext.form.TextField({
                id          : 'txt_otropar',
                //fieldLabel	: 'Otro',
                readOnly	: false,
                disabled    : true,
                name	: 'otroparent',
                anchor	: '-5'
            });

            //Otro tipo de vivienda
            var txt_otrotipviv = new Ext.form.TextField({
                id          : 'txt_otrotipviv',
                //fieldLabel	: 'Otro',
                readOnly	: false,
                disabled    : true,
                name	: 'otrtipviv',
                anchor	: '-5'
            });

            //Pisos
            var txt_numpis = new Ext.form.NumberField({
                id          : 'txt_numpis',
                fieldLabel	: 'N° Pisos',
                readOnly	: false,
                disabled    : false,
                allowDecimals : false,
                allowNegative : false,
                name	: 'numpis',
                anchor	: '-5'
            });

            //Piso en que reside
            var txt_pisres = new Ext.form.NumberField({
                id          : 'txt_pisres',
                fieldLabel	: 'Piso en que reside',
                readOnly	: false,
                disabled    : false,
                allowDecimals : false,
                allowNegative : false,
                name	: 'numpis',
                anchor	: '-5'
            });

            //Otro tipo de vivienda
            var txt_otrmatcon = new Ext.form.TextField({
                id          : 'txt_otrmatcon',
                //fieldLabel	: 'Otro',
                readOnly	: false,
                disabled    : true,
                name	: 'otrmatcon',
                anchor	: '-5'
            });

            //Color de fachada
            var txt_colfac = new Ext.form.TextField({
                id          : 'txt_colfac',
                fieldLabel	: 'Color de Fachada',
                readOnly	: false,
                disabled    : false,
                name	: 'colfac',
                anchor	: '-5'
            });

            //Tipo Material
            var txt_tipmatpue = new Ext.form.TextField({
                id          : 'txt_tipmatpue',
                fieldLabel	: 'Tipo de Material',
                readOnly	: false,
                disabled    : false,
                name	: 'tipmat',
                anchor	: '-5'
            });

            //Puertas
            var txt_puertas = new Ext.form.NumberField({
                id          : 'txt_puertas',
                fieldLabel	: 'N° Puertas de Ingreso',
                readOnly	: false,
                disabled    : false,
                allowDecimals : false,
                allowNegative : false,
                name	: 'numpue',
                anchor	: '-5'
            });

            //Ventanas
            var txt_ventanas = new Ext.form.NumberField({
                id          : 'txt_ventanas',
                fieldLabel	: 'N° Ventanas',
                readOnly	: false,
                disabled    : false,
                allowDecimals : false,
                allowNegative : false,
                name	: 'numven',
                anchor	: '-5'
            });

            //Otra zonificacion
            var txt_otrzonif = new Ext.form.TextField({
                id          : 'txt_otrzonif',
                //fieldLabel	: 'Observación',
                readOnly	: false,
                disabled    : true,
                name	: 'otrzonif',
                anchor	: '-10'
            });

            //Observación inmueble
            var txt_obsinmu = new Ext.form.TextField({
                id          : 'txt_obsinmu',
                fieldLabel	: 'Observación',
                readOnly	: false,
                disabled    : false,
                name	: 'obsinmu',
                anchor	: '-10'
            });

            //Observacion de Check Domiciliario
            var txt_obsCheckDom = new Ext.form.TextArea({
                id          : 'txt_obsCheckDom',
                fieldLabel	: 'Recomendación',
                readOnly	: false,
                disabled    : false,
                name	: 'obscon',
                anchor	: '100%',
                height      : 80
            });

            //Código de Check Domiciliario (oculto)
            var hid_checkDom = new Ext.form.Hidden({
                id          : 'hid_checkDom',
                readOnly	: false,
                name	: 'codchkdom',
                hidemode    : 'display',
                hidelabel   : true
            });

            ///*Controle UploadField*//

            //Imagen 1 de domicilio
            var upf_imgdom1 = new Ext.ux.form.FileUploadField({
                id : 'upf_imgdom1',
                emptyText: 'Imagen Domicilio',
                fieldLabel: 'Imagen 1',
                name : 'imgdom1',
                anchor: '-10',
                allowBlank : true,
                buttonText: '',
                buttonCfg: {
                    iconCls: 'upload-icon'
                }
            });

            //Ver imagen 1 de domicilio
            var btnImgDom1 = new Ext.Button({
                    text        : 'Ver Imagen Cargada',
                    tooltip     : 'Muestra la imagen cargada del domicilio',
                    width : 125,
                    handler     : function(){
                                        var win_imddom1 = Ext.getCmp('frm_imgdom1');
                                        var PreviewDom1 = new Ext.Component({
                                            autoEl: {
                                                tag: 'img', src: 'files/images_dom/'+hid_imgdom1act.getValue(), id: 'Imagendom1'
                                            }
                                        });

                                        var frmpnlDom1 = new Ext.FormPanel({
                                            frame: true,
                                            border: false,
                                            autoScroll: true,
                                            items:[PreviewDom1]
                                        });
                                        if (!win_imddom1){
                                            new Ext.Window({
                                                title	: 'Imagen 1 Domicilio',
                                                id          : 'frm_imgdom1',
                                                iconCls     : 'regper',
                                                layout	: 'fit',
                                                width	: 600,
                                                height	: 400,
                                                resizable   : false,
                                                closable    : true,
                                                modal       : true,
                                                items       : [frmpnlDom1]
                                            }).show();
                                        }else{
                                              win_imddom1.show();
                                        }
                    }
                });

            //Imagen 1 Actual Domicilio
            var hid_imgdom1act = new Ext.form.Hidden({
                id          : 'hid_imgdom1act',
                readOnly	: false,
                name	: 'imgdom1act',
                hidemode    : 'display',
                hidelabel   : true
            });

            //Combo de Imagen 1 Domicilio
            var cbo_tipimg1 = new Ext.form.ComboBox({
                    id              : 'cbo_tipimg1',
                    name            : 'codtipimg1',
                    fieldLabel      : 'Obs. Imagen',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    //width           : 50,
                    store           : ds_tipoimagen,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'destipimg',
                    valueField      : 'codtipimg',
                    hiddenName      : 'vcodtipimg1',
                    anchor          : '100%'
            });

            //Imagen 2 de domicilio
            var upf_imgdom2 = new Ext.ux.form.FileUploadField({
                id : 'upf_imgdom2',
                emptyText: 'Imagen Domicilio',
                fieldLabel: 'Imagen 2',
                name : 'imgdom2',
                anchor: '-10',
                allowBlank : true,
                buttonText: '',
                buttonCfg: {
                    iconCls: 'upload-icon'
                }
            });

            //Ver imagen 2 de domicilio
            var btnImgDom2 = new Ext.Button({
                    text        : 'Ver Imagen Cargada',
                    tooltip     : 'Muestra la imagen cargada del domicilio',
                    width : 125,
                    handler     : function(){
                                        var win_imddom2 = Ext.getCmp('frm_imgdom2');
                                        var PreviewDom2 = new Ext.Component({
                                            autoEl: {
                                                tag: 'img', src: 'files/images_dom/'+hid_imgdom2act.getValue(), id: 'Imagendom2'
                                            }
                                        });

                                        var frmpnlDom2 = new Ext.FormPanel({
                                            frame: true,
                                            border: false,
                                            autoScroll: true,
                                            items:[PreviewDom2]
                                        });
                                        if (!win_imddom2){
                                            new Ext.Window({
                                                title	: 'Imagen 2 Domicilio',
                                                id          : 'frm_imgdom2',
                                                iconCls     : 'regper',
                                                layout	: 'fit',
                                                width	: 600,
                                                height	: 400,
                                                resizable   : false,
                                                closable    : true,
                                                modal       : true,
                                                items       : [frmpnlDom2]
                                            }).show();
                                        }else{
                                              win_imddom2.show();
                                        }
                    }
                });

            //Imagen 1 Actual Domicilio
            var hid_imgdom2act = new Ext.form.Hidden({
                id          : 'hid_imgdom2act',
                readOnly	: false,
                name	: 'imgdom2act',
                hidemode    : 'display',
                hidelabel   : true
            });

             //Combo de Imagen 1 Domicilio
            var cbo_tipimg2 = new Ext.form.ComboBox({
                    id              : 'cbo_tipimg2',
                    name            : 'codtipimg2',
                    fieldLabel      : 'Obs. Imagen',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    width           : 50,
                    store           : ds_tipoimagen,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'destipimg',
                    valueField      : 'codtipimg',
                    hiddenName      : 'vcodtipimg2',
                    anchor          : '100%'
            });

            //Imagen mapa de domicilio
            var upf_imgmapa = new Ext.ux.form.FileUploadField({
                id : 'upf_imgmapa',
                emptyText: 'Imagen Mapa',
                fieldLabel: 'Mapa Dom.',
                name : 'imgmap',
                anchor: '-10',
                allowBlank : true,
                buttonText: '',
                buttonCfg: {
                    iconCls: 'upload-icon'
                }
            });

            //Ver imagen mapa de domicilio
            var btnImgMap = new Ext.Button({
                    text        : 'Ver Imagen Cargada',
                    tooltip     : 'Muestra la imagen del mapa cargado',
                    width : 125,
                    handler     : function(){
                                        var win_imdmap = Ext.getCmp('frm_imgmap');
                                        var Previewmap = new Ext.Component({
                                            autoEl: {
                                                tag: 'img', src: 'files/images_dom/'+hid_imgmapact.getValue(), id: 'Imagenmap'
                                            }
                                        });

                                        var frmpnlmap = new Ext.FormPanel({
                                            frame: true,
                                            border: false,
                                            autoScroll: true,
                                            items:[Previewmap]
                                        });
                                        if (!win_imdmap){
                                            new Ext.Window({
                                                title	: 'Mapa Domicilio',
                                                id          : 'frm_imgmap',
                                                iconCls     : 'regper',
                                                layout	: 'fit',
                                                width	: 600,
                                                height	: 400,
                                                resizable   : false,
                                                closable    : true,
                                                modal       : true,
                                                items       : [frmpnlmap]
                                            }).show();
                                        }else{
                                              win_imdmap.show();
                                        }
                    }
                });

           //Imagen mapa Actual Domicilio
            var hid_imgmapact = new Ext.form.Hidden({
                id          : 'hid_imgmapact',
                readOnly	: false,
                name	: 'imgmapact',
                hidemode    : 'display',
                hidelabel   : true
            });

            //Combo de Imagen mapa Domicilio
            var cbo_imgpama = new Ext.form.ComboBox({
                    id              : 'cbo_imgpama',
                    name            : 'codtipimg3',
                    fieldLabel      : 'Obs. Imagen',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    width           : 50,
                    store           : ds_tipoimagen,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'destipimg',
                    valueField      : 'codtipimg',
                    hiddenName      : 'vcodtipimg3',
                    anchor          : '100%'
            });

            ///*Controles ComboBox*///

            //Puestos
            var cboCheckPuestosDom = new Ext.form.ComboBox({
                fieldLabel  : 'Puesto al que postula',
                id          : 'cboCheckPuestosDom',
                store       : ds_chksrvpuestos,
                displayField: 'despue',
                valueField  : 'codpue',
                typeAhead   : true,
                mode        : 'local',
                triggerAction: 'all',
                anchor      :'100%',
                disabled    : false,
                forceSelection : true,
                hideTrigger : false,
                lazyRender : true,
                selectOnFocus:true
            });

            //Indicador de Domiciliado
            var cbo_domiciliado = new Ext.form.ComboBox({
                    id              : 'cbo_domiciliado',
                    name            : 'domici',
                    fieldLabel      : 'Domiciliado',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    width           : 50,
                    store           : ds_domicilia,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'desinddom',
                    valueField      : 'codinddom',
                    hiddenName      : 'vdomici',
                    anchor          : '-10',
                    value           : '1',
                    listeners       :   {
                        'select' : function(cmb, rec, idx){
                                        var seleccionado=rec.data.codinddom;
                                        //alert(seleccionado);
                                        if(seleccionado=='1'){
                                            txt_tiemanio.enable();
                                            txt_tiemmeso.enable();
                                            cbo_residentes.enable();
                                            cbo_vivienda.enable();
                                            grd_residentes.enable();
                                        }
                                        else {
                                            txt_tiemanio.disable();
                                            txt_tiemmeso.disable();
                                            cbo_residentes.clearValue();
                                            cbo_residentes.disable();
                                            cbo_vivienda.clearValue();
                                            cbo_vivienda.disable();
                                            ds_residtem.removeAll();
                                            grd_residentes.disable();

                                        }
                                    }
                    }
            });

            //Tipo de via
            var cbo_tipvia = new Ext.form.ComboBox({
                    id              : 'cbo_tipvia',
                    name            : 'codtipvia',
                    fieldLabel      : 'Via',
                    mode            : 'local',
                    disabled        : false,
                    editable        : false,
                    allowBlank      : false,
                    store           : ds_vias,
                    width           : 50,
                    triggerAction   : 'all',
                    displayField    : 'destipvia',
                    valueField      : 'codtipvia',
                    hiddenName      : 'vcodtipvia',
                    anchor          : '-10'
                    //border : true
            });

            //Parentesco
            var cbo_parent = new Ext.form.ComboBox({
                    id              : 'cbo_parent',
                    name            : 'codpar',
                    fieldLabel      : 'Parentesco',
                    mode            : 'local',
                    disabled        : false,
                    editable        : false,
                    allowBlank      : false,
                    width           : 100,
                    store           : ds_parentescos,
                    triggerAction   : 'all',
                    displayField    : 'despar',
                    valueField      : 'codpar',
                    hiddenName      : 'vcodpar',
                    anchor          : '-10',
                    listeners   : {
                        'select'    : function(cmb, rec, idx){
                            var otro=rec.data.codpar;
                            if (otro=='6'){
                                txt_otropar.enable();
                                //cbo_parent.setValue(rec.data.despar);
                                txt_otropar.focus();
                            }else{
                                txt_otropar.disable();
                                //cbo_parent.setValue(rec.data.despar);
                            }
                        }
                    }
            });

            //Departamento
            var cbo_depto = new Ext.form.ComboBox({
                    id              : 'cbo_depto',
                    hiddenName      : 'coddpto',
                    fieldLabel      : 'Departamento',
                    mode            : 'local',
                    width           : 100,
                    disabled        : false,
                    editable        : false,
                    allowBlank      : false,
                    store           : ds_departamento,
                    triggerAction   : 'all',
                    displayField    : 'desdpto',
                    valueField      : 'coddpto',
                    //hiddenName      : 'vcoddpto',
                    anchor          : '-10',
                    listeners   : {
                        'select'    : function(cmb, rec, idx){
                            cbo_prov.clearValue();
                            cbo_prov.store.load({
                                params : {
                                    depa : cbo_depto.getValue()
                                }
                            });
                            cbo_prov.enable();
                            cbo_dist.clearValue();
                            cbo_dist.store.removeAll();
                            cbo_dist.disable();
                            //alert(cbo_depto.getValue());
                        }
                    }
            });

            //Provincia
            var cbo_prov = new Ext.form.ComboBox({
                    id              : 'cbo_prov',
                    hiddenName      : 'codpro',
                    fieldLabel      : 'Provincia',
                    mode            : 'local',
                    width           : 100,
                    disabled        : true,
                    editable        : false,
                    allowBlank      : false,
                    store           : ds_provincia,
                    triggerAction   : 'all',
                    displayField    : 'despro',
                    valueField      : 'codpro',
                    //hiddenName      : 'vcodpro',
                    anchor          : '-10',
                    listeners   : {
                        'select'    : function(cmb, rec, idx){
                            //cons_dept=cmb.getValue();
                            //alert(cons_dept);
                            cbo_dist.clearValue();
                            cbo_dist.store.removeAll();
                            cbo_dist.store.load({
                                params : {
                                    depa : cbo_depto.getValue(),
                                    prov : cbo_prov.getValue()
                                }
                            });
                            cbo_dist.enable();
                            //alert(cbo_prov.getValue());
                        }
                    }
            });

            //Distrito
            var cbo_dist = new Ext.form.ComboBox({
                    id              : 'cbo_dist',
                    hiddenName      : 'coddist',
                    fieldLabel      : 'Distrito',
                    mode            : 'local',
                    //width           : 150,
                    disabled        : true,
                    editable        : false,
                    allowBlank      : false,
                    store           : ds_distrito,
                    triggerAction   : 'all',
                    displayField    : 'desdist',
                    valueField      : 'coddist',
                    //hiddenName      : 'vcoddist',
                    anchor          : '100%'
            });

            //Vivienda
            var cbo_vivienda = new Ext.form.ComboBox({
                    id              : 'cbo_vivienda',
                    name            : 'codviv',
                    fieldLabel      : 'Vivienda',
                    mode            : 'local',
                    disabled        : false,
                    editable        : false,
                    allowBlank      : false,
                    store           : ds_vivienda,
                    triggerAction   : 'all',
                    displayField    : 'desviv',
                    valueField      : 'codviv',
                    hiddenName      : 'vcodviv',
                    anchor          : '-10'
            });

            //Tipo Vivienda
            var cbo_tipvivienda = new Ext.form.ComboBox({
                    id              : 'cbo_tipvivienda',
                    name            : 'codtipviv',
                    fieldLabel      : 'Tipo',
                    mode            : 'local',
                    disabled        : false,
                    editable        : false,
                    allowBlank      : false,
                    store           : ds_tipovivienda,
                    triggerAction   : 'all',
                    displayField    : 'destipviv',
                    valueField      : 'codtipviv',
                    hiddenName      : 'vcodtipviv',
                    anchor          : '-10',
                    listeners   : {
                        'select'    : function(cmb, rec, idx){
                            var otro=rec.data.codtipviv;
                            if (otro=='3'){
                                txt_otrotipviv.enable();
                                //cbo_parent.setValue(rec.data.despar);
                                txt_otrotipviv.focus();
                            }else{
                                txt_otrotipviv.disable();
                                //cbo_parent.setValue(rec.data.despar);
                            }
                        }
                    }
            });

            //Residentes
            var cbo_residentes = new Ext.form.ComboBox({
                    id              : 'cbo_residentes',
                    name            : 'codres',
                    fieldLabel      : 'Residentes',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : true,
                    width           : 90,
                    store           : ds_residentes,
                    triggerAction   : 'all',
                    displayField    : 'desres',
                    valueField      : 'codres',
                    hiddenName      : 'vcodres',
                    anchor          : '99%',
                    listeners       :{
                        'select' : function(cmb, rec, idx){
                                        selResidente=true;
                                        vcodres=rec.data.codres;
                                        vdesres=rec.data.desres;
                                    }
                    }
            });

            //Material Construccion
            var cbo_tipmatcon = new Ext.form.ComboBox({
                    id              : 'cbo_tipmatcon',
                    name            : 'codtipmat',
                    fieldLabel      : 'Material',
                    mode            : 'local',
                    disabled        : false,
                    editable        : false,
                    allowBlank      : false,
                    store           : ds_material,
                    width           : 50,
                    triggerAction   : 'all',
                    displayField    : 'destipmat',
                    valueField      : 'codtipmat',
                    hiddenName      : 'vcodtipmat',
                    anchor          : '-10',
                    listeners   : {
                        'select'    : function(cmb, rec, idx){
                            var otro=rec.data.codtipmat;
                            if (otro=='4'){
                                txt_otrmatcon.enable();
                                //cbo_parent.setValue(rec.data.despar);
                                txt_otrmatcon.focus();
                            }else{
                                txt_otrmatcon.disable();
                                //cbo_parent.setValue(rec.data.despar);
                            }
                        }
                    }
            });

            //Estado Construccion
            var cbo_estconst = new Ext.form.ComboBox({
                    id              : 'cbo_estconst',
                    name            : 'codestcon',
                    fieldLabel      : 'Estado',
                    mode            : 'local',
                    disabled        : false,
                    editable        : false,
                    allowBlank      : false,
                    store           : ds_estconstruc,
                    width           : 50,
                    triggerAction   : 'all',
                    displayField    : 'desestcon',
                    valueField      : 'codestcon',
                    hiddenName      : 'vcodestcon',
                    anchor          : '-10'
                    //border : true
            });

            //Indicador de Area verde
            var cbo_areaverde = new Ext.form.ComboBox({
                    id              : 'cbo_areaverde',
                    name            : 'arever',
                    fieldLabel      : 'Areas Verdes',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    width           : 50,
                    store           : ds_domicilia,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'desinddom',
                    valueField      : 'codinddom',
                    hiddenName      : 'varever',
                    anchor          : '-10',
                    value           : '1'
            });

            //Indicador de Rejas de proteccion
            var cbo_rejprot = new Ext.form.ComboBox({
                    id              : 'cbo_rejprot',
                    name            : 'rejpro',
                    fieldLabel      : 'Rejas de protección',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    width           : 50,
                    store           : ds_domicilia,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'desinddom',
                    valueField      : 'codinddom',
                    hiddenName      : 'vrejpro',
                    anchor          : '-10',
                    value           : '0'
            });

            //Indicador de Puerta acceso vehicular
            var cbo_pueaccveh = new Ext.form.ComboBox({
                    id              : 'cbo_pueaccveh',
                    name            : 'pueaccveh',
                    fieldLabel      : 'P. de Acc. Vehicular',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    width           : 50,
                    store           : ds_domicilia,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'desinddom',
                    valueField      : 'codinddom',
                    hiddenName      : 'vpueaccveh',
                    anchor          : '-10',
                    value           : '0'
            });

            //Indicador de Zonificación
            var cbo_zonificacion = new Ext.form.ComboBox({
                    id              : 'cbo_zonificacion',
                    name            : 'codzonif',
                    fieldLabel      : 'Zonificación',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    width           : 50,
                    store           : ds_zonifi,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'deszonif',
                    valueField      : 'codzonif',
                    hiddenName      : 'vcodzonif',
                    anchor          : '-10'
            });

            //Zona de riesgo
            var cbo_zonariesgo = new Ext.form.ComboBox({
                    id              : 'cbo_zonariesgo',
                    name            : 'codzonrie',
                    fieldLabel      : 'Riesgo',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    width           : 50,
                    store           : ds_zonariesgo,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'deszonrie',
                    valueField      : 'codzonrie',
                    hiddenName      : 'vcodzonrie',
                    anchor          : '100%'
            });

            //Conclusiones
            var cbo_conclusion = new Ext.form.ComboBox({
                    id              : 'cbo_conclusion',
                    name            : 'codcon',
                    fieldLabel      : 'Conclusión',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    width           : 50,
                    store           : ds_conclusion,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'descon',
                    valueField      : 'codcon',
                    hiddenName      : 'vcodcon',
                    anchor          : '-10'
            });

            //Estados Check Domiciliario
            var cboEstadoCheckDomicilio = new Ext.form.ComboBox({
                    id              : 'cboEstadoCheckDomicilio',
                    name            : 'codestchkdom',
                    fieldLabel      : 'Guardar con Estado',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_estadoscheck,
                    editable        : false,
                    triggerAction   : 'all',
                    displayField    : 'desestchk',
                    valueField      : 'codestchk',
                    hiddenName      : 'vcodestchkdom',
                    anchor          : '100%'
            });

            ///*Column Models*///

            //Residentes
            var cm_residentes = new Ext.grid.ColumnModel(
                    [{
                        id : 'codres',
                        header: 'codres',
                        readonly: true,
                        dataIndex: 'codres',
                        hidden: true,
                        width: 10
                    },{
                        header: 'Residentes',
                        readonly: true,
                        dataIndex: 'desres',
                        hidden: false,
                        width: 125
                    }]
                );

            //////////para grid de residentes//////////

            //Recor de residentes
            var newResidente = Ext.data.Record.create([
                    {name: 'codres', type: 'int'},
                    {name: 'desres', type: 'string'}
                ]);

            //Store ficticio para residentes
            var ds_residtem = new Ext.data.Store({
                        reader	:   new Ext.data.JsonReader(newResidente),
                        proxy	:   new Ext.data.HttpProxy({url: "DB/checkdomicilio.php?n=100"}),
                        sortInfo	:   {field:'codres', direction:'ASC'},
                        autoLoad    :   false
                });

            //Grid de residentes
            var grd_residentes = new Ext.grid.EditorGridPanel({
                    id      : 'grd_personas',
                    store   : ds_residtem,
                    title   : 'Residentes',
                    cm      : cm_residentes,
                    anchor  : '100%',
                    height  : 160,
                    frame   : false,
                    clicksToEdit :1,
                    //layout    : 'fit',
                    autoScroll: true,
                    selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
                    tbar    :[cbo_residentes,
                            {
                                xtype   : 'tbbutton',
                                cls     : 'x-btn-icon',
                                icon    : 'files/images_app/plus.png',
                                handler : function(){
                                        var duplicado=false;
                                        var cant_registros = ds_residtem.getCount();
                                        for (var i = 0; i < cant_registros; i++) {
                                            var record = grd_residentes.getStore().getAt(i);
                                            var codres = record.data.codres;
                                            //console.log(codpersona);
                                            if (vcodres == codres) {
                                                duplicado=true;
                                                break;
                                            }
                                        }
                                        if(duplicado==false){
                                            if(selResidente==true){
                                                var r = new newResidente({
                                                   codres       : vcodres,
                                                   desres       : vdesres
                                                });
                                                //alert(p.get('item'));
                                                ds_residtem.insert(ds_residtem.getCount(), r);
                                                grd_residentes.getView().refresh();
                                                ds_residtem.reload();
                                                //restablece campos para agregar mas residentes
                                                selResidente=false;
                                                cbo_residentes.clearValue();
                                            }else{
                                                Ext.Msg.show({title: 'Error de Ingreso',
                                                                msg: 'Debe seleccionar Un Tipo de residente a agregar',
                                                                buttons: Ext.MessageBox.OK,
                                                                icon: Ext.MessageBox.ERROR});
                                            }
                                        }else{
                                            Ext.Msg.show({title: 'Error de Ingreso',
                                                                msg: 'Tipo de residente que intenta agregar ya esta en la lista',
                                                                buttons: Ext.MessageBox.OK,
                                                                icon: Ext.MessageBox.INFO});
                                        }
                                     }
                            },
                            {
                                xtype   : 'tbbutton',
                                cls     : 'x-btn-icon',
                                icon    : 'files/images_app/minus.png',
                                handler : function handleDelete() {
                                                var selectedKeys = grd_residentes.selModel.selections.keys;
                                                if(selectedKeys.length > 0) {
                                                    Ext.Msg.confirm('ALERTA!','¿desea eliminar el registro?', function borraResidente(btn){
                                                    if (btn == 'yes') {
                                                        //alert(btn);
                                                        var selectedRow = grd_residentes.getSelectionModel().getSelected();
                                                        if (selectedRow) ds_residtem.remove(selectedRow);
                                                        var cant_registros = ds_residtem.getCount();
                                                            //alert(cant_registros);
                                                            for (var i = 0; i < cant_registros; i++) {
                                                                var record = grd_residentes.getStore().getAt(i);
                                                                record.beginEdit();
                                                                record.data.item = i+1;
                                                                record.endEdit();
                                                                record.commit();
                                                            }
                                                    }
                                                });
                                                }else{
                                                    Ext.Msg.alert('Recuerde!','Seleccione un registro para eliminar');
                                                }
                                            }
                            }
                    ]

                });
                //ds_residtem.load();

            ///*Paneles*///

            //Panel de Dirección
            var SubPnlDirecc = new Ext.Panel({
                frame : true,
                //collapsible : true,
                title : 'Dirección',
                items : [{
                            layout	: 'column',
                            border	: false,
                            style	: 'padding:0px 0px 0px 0px',
                            items   :[hid_checkDom,{
                                    columnWidth	: .15,
                                    layout	: 'form',
                                    border	: false,
                                    labelAlign	: 'left',
                                    labelWidth 	: 25,
                                    defaultType	: 'textfield',
                                    items	: [cbo_tipvia]
                                    },{
                                    columnWidth	: .48,
                                    layout	: 'form',
                                    border	: false,
                                    labelAlign	: 'left',
                                    labelWidth 	: 60,
                                    defaultType	: 'textfield',
                                    items	: [txt_nomvia]
                                    },{
                                    columnWidth	: .17,
                                    layout	: 'form',
                                    border	: false,
                                    labelAlign	: 'left',
                                    labelWidth 	: 60,
                                    defaultType	: 'textfield',
                                    items	: [txt_numvia]
                                    },{
                                    columnWidth	: .20,
                                    layout	: 'form',
                                    border	: false,
                                    labelAlign	: 'left',
                                    labelWidth  : 30,
                                    defaultType	: 'textfield',
                                    items	: [txt_urb]
                                    }]
                         },
                         {
                            layout	: 'column',
                            border      : false,
                            style	: 'padding:0px 0px 0px 0px',
                            items   :[{
                                    columnWidth	: .3,
                                    layout      : 'form',
                                    border	: false,
                                    labelAlign	: 'left',
                                    labelWidth  : 90,
                                    defaultType	: 'textfield',
                                    items	: [cbo_depto]
                                    },{
                                    columnWidth	: .3,
                                    layout	: 'form',
                                    border	: false,
                                    labelAlign	: 'left',
                                    labelWidth  : 60,
                                    defaultType	: 'textfield',
                                    items	: [cbo_prov]
                                    },{
                                    columnWidth	: .4,
                                    layout	: 'form',
                                    border	: false,
                                    labelAlign	: 'left',
                                    labelWidth  : 55,
                                    defaultType	: 'textfield',
                                    items	: [cbo_dist]
                                    }]
                            }]
            });

            var pnl_Entrevistado = new Ext.Panel({
                frame : false,
                //collapsible : false,
                items : [{
                            layout	: 'column',
                            border	: false,
                            style	: 'padding:5px 0px 0px 0px',
                            items   :[{
                                    columnWidth : .20,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 65,
                                    defaultType : 'textfield',
                                    items       : [cbo_domiciliado]
                                    },{
                                    columnWidth : .35,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 70,
                                    defaultType : 'textfield',
                                    items       : [txt_persentre]
                                    },{
                                    columnWidth : .25,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 65,
                                    defaultType : 'textfield',
                                    items       : [cbo_parent]
                                    },{
                                    columnWidth : .20,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 1,
                                    defaultType : 'textfield',
                                    items       : [txt_otropar]
                                    }]
                         }]
            });

            //Panel Informacion de Entrevistado
            var pnl_EntrDer = new Ext.Panel({
                frame : false,
                collapsible : false,
                items : [{
                            layout	: 'column',
                            border      : false,
                            style	: 'padding:0px 0px 0px 0px',
                            items   :[{
                                    columnWidth : .15,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 32,
                                    defaultType : 'textfield',
                                    items       : [txt_tiemanio]
                                    },{
                                    columnWidth : .17,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 40,
                                    defaultType : 'textfield',
                                    items       : [txt_tiemmeso]
                                    },{
                                    columnWidth : .25,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 40,
                                    defaultType : 'textfield',
                                    items       : [cbo_vivienda]
                                    },{
                                    columnWidth : .25,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 30,
                                    defaultType : 'textfield',
                                    items       : [cbo_tipvivienda]
                                    },{
                                    columnWidth : .18,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 1,
                                    defaultType : 'textfield',
                                    items       : [txt_otrotipviv]
                                    }]
                            },{
                            layout	: 'column',
                            border      : false,
                            style	: 'padding:0px 0px 0px 0px',
                            items   :[{
                                    columnWidth : .17,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 55,
                                    defaultType : 'textfield',
                                    items       : [txt_numpis]
                                    },{
                                    columnWidth : .28,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 110,
                                    defaultType : 'textfield',
                                    items       : [txt_pisres]
                                    },{
                                    columnWidth : .30,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 45,
                                    defaultType : 'textfield',
                                    items       : [cbo_tipmatcon]
                                    },{
                                    columnWidth : .25,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 1,
                                    defaultType : 'textfield',
                                    items       : [txt_otrmatcon]
                                    }]
                            },{
                            layout	: 'column',
                            border      : false,
                            style	: 'padding:0px 0px 0px 0px',
                            items   :[{
                                    columnWidth : .30,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 45,
                                    defaultType : 'textfield',
                                    items       : [cbo_estconst]
                                    },{
                                    columnWidth : .25,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 80,
                                    defaultType : 'textfield',
                                    items       : [cbo_areaverde]
                                    },{
                                    columnWidth : .45,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 100,
                                    defaultType : 'textfield',
                                    items       : [txt_colfac]
                                    }]
                            },{
                            layout	: 'column',
                            border      : false,
                            style	: 'padding:0px 0px 0px 0px',
                            items   :[{
                                    columnWidth : .33,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 135,
                                    defaultType : 'textfield',
                                    items       : [txt_puertas]
                                    },{
                                    columnWidth : .22,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 80,
                                    defaultType : 'textfield',
                                    items       : [txt_ventanas]
                                    },{
                                    columnWidth : .45,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 100,
                                    defaultType : 'textfield',
                                    items       : [txt_tipmatpue]
                                    }]
                            },{
                            layout	: 'column',
                            border      : false,
                            style	: 'padding:0px 0px 0px 0px',
                            items   :[{
                                    columnWidth : .33,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 120,
                                    defaultType : 'textfield',
                                    items       : [cbo_rejprot]
                                    },{
                                    columnWidth : .35,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 120,
                                    defaultType : 'textfield',
                                    items       : [cbo_pueaccveh]
                                    }]
                            },{
                            layout	: 'column',
                            border      : false,
                            style	: 'padding:0px 0px 0px 0px',
                            items   :[{
                                    columnWidth : 1.0,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 75,
                                    defaultType : 'textfield',
                                    items       : [txt_obsinmu]
                                    }]
                            }]
            });

            var SubPnlEntrev = new Ext.Panel({
                frame : true,
                //collapsible : true,
                title : 'Información del Check Domiciliario',
                items : [{layout	: 'column',
                            border	: false,
                            style	: 'padding: 0px 0px 0px 0px',
                            items   :[{
                                    columnWidth : .80,
                                    items       : [pnl_EntrDer]
                                    },{
                                    columnWidth : .20,
                                    items       : [grd_residentes]
                                    }]
                         }]
            });

            //Panel Descripcion Zona
            var pnl_DescZona = new Ext.Panel({
                frame : true,
                //collapsible : true,
                title : 'Descripción de la Zona',
                items : [{
                            layout	: 'column',
                            border      : false,
                            style	: 'padding:0px 0px 0px 0px',
                            items   :[{
                                    columnWidth : .30,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 70,
                                    defaultType : 'textfield',
                                    items       : [cbo_zonificacion]
                                    },{
                                    columnWidth : .45,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 1,
                                    defaultType : 'textfield',
                                    items       : [txt_otrzonif]
                                    },{
                                    columnWidth : .25,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 40,
                                    defaultType : 'textfield',
                                    items       : [cbo_zonariesgo]
                                    }]
                            }]
            });

            //Panel Conclusiones
            var pnl_ConcluDomi = new Ext.Panel({
                frame : true,
                items : [{
                            layout	: 'column',
                            border      : false,
                            style	: 'padding:0px 0px 0px 0px',
                            items   :[{
                                    columnWidth : .5,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 50,
                                    defaultType : 'textfield',
                                    items       : [cbo_conclusion]
                                    },{
                                    columnWidth : .5,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 130,
                                    defaultType : 'textfield',
                                    items       : [cboEstadoCheckDomicilio]
                                    }]
                            },{
                            layout	: 'column',
                            border      : false,
                            style	: 'padding:0px 0px 0px 0px',
                            items   :[{
                                    columnWidth : 1.0,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 95,
                                    //defaultType : 'textfield',
                                    items       : [txt_obsCheckDom]
                                    }]
                            }]
            });

            //Panel Imagenes de Domicilio
            var pnl_imagenes = new Ext.FormPanel({
                frame : true,
                fileUpload  : true,
                width : 750,
                title : 'Imagenes Domicilio',
                tbar : [{
                            xtype: 'tbfill'
                        },
                        {
                            text : 'Grabar Imagenes',
                            id : 'btnGrabaImagenesChkDom',
                            cls  : 'x-btn-text-icon',
                            icon : 'files/images_app/disk.png',
                            handler : function(){
                                var chkdom = hid_checkDom.getValue();
                                    if(pnl_imagenes.getForm().isValid()){
                                        pnl_imagenes.getForm().submit({
                                            url : 'DB/checkdomicilio.php',
                                            params: {n:17, codsol:cod_sol, codper:cod_per, codchk:chkdom},
                                            waitTitle : 'Imagenes Check Domiciliario',
                                            waitMsg: 'Guardando imagenes...',
                                            success:function(form, action){
                                                var obj = Ext.util.JSON.decode(action.response.responseText);
                                                var mensaje = obj.respuesta.mensaje;
                                                var img1 = obj.respuesta.imagen1;
                                                var img2 = obj.respuesta.imagen2;
                                                var mapa = obj.respuesta.mapa;
                                                hid_imgdom1act.setValue(img1);
                                                hid_imgdom2act.setValue(img2);
                                                hid_imgmapact.setValue(mapa);
                                                Ext.Msg.show({
                                                    title: 'Check Domiciliario',
                                                    msg: mensaje,
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.INFO
                                                });
                                            },
                                            failure:function(form, action){
                                                if(action.failureType == 'server'){
                                                    var obj = Ext.util.JSON.decode(action.response.responseText);
                                                    Ext.Msg.alert('Check Domiciliario', obj.respuesta.mensaje);
                                                }
                                                else{
                                                    Ext.Msg.alert('Atenci&oacute;n!', 'El servidor no ha podido ser contactado : ' + action.response.responseText + " ");
                                                }
                                            }
                                        });
                                    }else{
                                        Ext.Msg.show({
                                            title: 'Error',
                                            msg: 'Debe ingresar todos los campos obligatorios',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.ERROR
                                        });
                                    }
                                    }
                        }
                ],
                items : [{
                            layout	: 'column',
                            border      : false,
                            style	: 'padding:5px 0px 0px 0px',
                            items   :[hid_imgdom1act,{
                                    columnWidth : .40,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 70,
                                    defaultType : 'textfield',
                                    items       : [upf_imgdom1]
                                    },{
                                    columnWidth : .20,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 1,
                                    defaultType : 'textfield',
                                    items       : [btnImgDom1]
                                    },{
                                    columnWidth : .40,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 80,
                                    defaultType : 'textfield',
                                    items       : [cbo_tipimg1]
                                    }]
                            },{
                            layout	: 'column',
                            border      : false,
                            style	: 'padding:0px 0px 0px 0px',
                            items   :[hid_imgdom2act,{
                                    columnWidth : .40,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 70,
                                    defaultType : 'textfield',
                                    items       : [upf_imgdom2]
                                    },{
                                    columnWidth : .20,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 1,
                                    defaultType : 'textfield',
                                    items       : [btnImgDom2]
                                    },{
                                    columnWidth : .40,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 80,
                                    defaultType : 'textfield',
                                    items       : [cbo_tipimg2]
                                    }]
                            },{
                            layout	: 'column',
                            border      : false,
                            style	: 'padding:0px 0px 0px 0px',
                            items   :[hid_imgmapact,{
                                    columnWidth : .40,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 70,
                                    defaultType : 'textfield',
                                    items       : [upf_imgmapa]
                                    },{
                                    columnWidth : .20,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 1,
                                    defaultType : 'textfield',
                                    items       : [btnImgMap]
                                    },{
                                    columnWidth : .40,
                                    layout      : 'form',
                                    border      : false,
                                    labelAlign  : 'left',
                                    labelWidth  : 80,
                                    defaultType : 'textfield',
                                    items       : [cbo_imgpama]
                                    }]
                            }]
            });

            //Panel principal para el CheckService
            var frmCheckDomiciliario = new Ext.FormPanel({
                url         : 'DB/checkdomicilio.php',
                frame       : false,
                border      : false,
                fileUpload  : true,
                //autoScroll : true,
                width : 750,
                style       : 'padding:1px 1px 1px 1px',
                items       : [SubPnlDirecc,pnl_Entrevistado,SubPnlEntrev,pnl_DescZona,pnl_ConcluDomi]
            });

            // botones pdf
            var btn_pdf_checkservice = new Ext.Button({
                text	:'Pdf',
                id		:'xls279',
                width       :60,
                tooltip     :'Imprimir el documento en Pdf',
                handler	:pdf_checkservice,
                cls         :'x-btn-text-icon',
                icon        :'files/images_app/document-pdf-text.png'
            });

            var btn_pdf_checkdomiciliario = new Ext.Button({
                text	:'Pdf',
                id		:'xls280',
                width       :60,
                tooltip     :'Imprimir el documento en Pdf',
                handler	:pdf_checkdomiciliario,
                cls         :'x-btn-text-icon',
                icon        :'files/images_app/document-pdf-text.png'
            });

            var btn_pdf_checklaboral = new Ext.Button({
                text	:'Pdf',
                id		:'xls281',
                width       :60,
                tooltip     :'Imprimir el documento en Pdf',
                handler	:pdf_checklaboral,
                cls         :'x-btn-text-icon',
                icon        :'files/images_app/document-pdf-text.png'
            });

            var btn_pdf_checkfamiliar = new Ext.Button({
                text	:'Pdf',
                id		:'xls282',
                width       :60,
                tooltip     :'Imprimir el documento en Pdf',
                handler	:pdf_checkfamiliar,
                cls         :'x-btn-text-icon',
                icon        :'files/images_app/document-pdf-text.png'
            });

            function pdf_checkservice(){
                window.open("reportes/rptCheckService.php?codper="+cod_per+"&codsol="+cod_sol,"ventana1" , "width=500,height=650,scrollbars=YES,resizable=YES");
            }

            function pdf_checkfamiliar(){
                window.open("reportes/rptCheckFamiliar.php?codper="+cod_per+"&codsol="+cod_sol,"ventana1" , "width=500,height=650,scrollbars=YES,resizable=YES");
            }

            function pdf_checkdomiciliario(){
                 window.open("reportes/rptCheckDomiciliario.php?codper="+cod_per+"&codsol="+cod_sol,"ventana1" , "width=500,height=650,scrollbars=YES,resizable=YES");
            }

            function pdf_checklaboral(){
                 window.open("reportes/rptCheckLaboral.php?codper="+cod_per+"&codsol="+cod_sol,"ventana1" , "width=500,height=650,scrollbars=YES,resizable=YES");
            }

///////////////////////////////Controles de Check Familiar/////////////////////////////////////

            //Imagen Actual Reniec
            var hid_imgactreniecfam = new Ext.form.Hidden({
                id          : 'hid_imgactreniecfam',
                readOnly	: false,
                name	: 'imgreniecactfam',
                hidemode    : 'display',
                hidelabel   : true
            });

            //Código de Check familiar
            var hid_codchkfam = new Ext.form.Hidden({
                id          : 'hid_codchkfam',
                readOnly    : false,
                name        : 'codchkfam',
                hidemode    : 'display',
                hidelabel   : true
            });

            ///*Controles Texto*///

            //Nombre de la persona
            var txt_chkfamnomper = new Ext.form.TextField({
                id          : 'txt_chkfamnomper',
                fieldLabel	: 'Check Identidad',
                width : 250,
                readOnly	: true,
                disabled    : false,
                name	: 'nombrechkfam',
                anchor	: '98%'
            });

            //Nombre del familiar
            var txt_nomfamper = new Ext.form.TextField({
                id          : 'txt_nomfamper',
                fieldLabel	: 'Nombre',
                readOnly	: true,
                disabled    : false,
                name	: 'nombre',
                anchor	: '98%'
            });

            //Investigación Policial
            var txt_invpolfam = new Ext.form.TextArea({
                id          : 'txt_invpolfam',
                fieldLabel	: 'Investigación Policial',
                readOnly	: true,
                disabled    : true,
                name	: 'refpolchkfam',
                anchor	: '100%',
                height      : 87
            });

            //Investigación penal
            var txt_invpenfam = new Ext.form.TextArea({
                id          : 'txt_invpenfam',
                fieldLabel	: 'Investigación Penal',
                readOnly	: true,
                disabled    : true,
                name	: 'invpenchkfam',
                anchor	: '100%',
                height      : 89
            });

            //Definición del delito
            var txt_defdelfam = new Ext.form.TextArea({
                id          : 'txt_defdelfam',
                fieldLabel	: 'Def. Delito',
                height      : 53,
                readOnly	: true,
                disabled    : false,
                name	: 'defdelfam',
                anchor	: '100%'
            });

            //Recomendación
            var txt_recomefam = new Ext.form.TextArea({
                id          : 'txt_recomefam',
                fieldLabel	: 'Recomendación',
                height      : 38,
                readOnly	: true,
                disabled    : false,
                allowBlank  : false,
                name	: 'recchkfam',
                anchor	: '98%'
            });

            //Observación DNI
            var txt_obsdnifam = new Ext.form.TextField({
                id          : 'txt_obsdnifam',
                fieldLabel	: 'Observación DNI',
                readOnly	: true,
                disabled    : false,
                name	: 'obsimgreniecfam',
                anchor	: '100%'
            });

            ///*Controles UploadFile*///

            //Imagen DNI
            var upf_imagendnifam = new Ext.ux.form.FileUploadField({
                id : 'upf_imagendnifam',
                emptyText: 'Seleccione la imagen del DNI',
                fieldLabel: 'Imagen DNI',
                name : 'imgreniecfam',
                anchor: '-10',
                allowBlank : true,
                buttonText: '',
                buttonCfg: {
                    iconCls: 'upload-icon'
                }
            });

            ///*Controles Botones*///

            var btnImgCargadafam = new Ext.Button({
                    text        : 'Imagen Cargada',
                    tooltip     : 'Muestra la imagen cargada en el Check Familiar',
                    width       : 144,
                    disabled    : true,
                    handler     : function(){
                                        var win_imdDni = Ext.getCmp('frm_imgDni');
                                        var PreviewDNI = new Ext.Component({
                                            autoEl: {
                                                tag: 'img', src: 'files/images_dni/fam/'+hid_imgactreniecfam.getValue(), id: 'photoPreview'
                                            }
                                        });

                                        var frmpnlImagen = new Ext.FormPanel({
                                            frame: true,
                                            border: false,
                                            autoScroll: true,
                                            items:[PreviewDNI]
                                        });
                                        if (!win_imdDni){
                                            new Ext.Window({
                                                title	: 'Imagen DNI',
                                                id          : 'frm_imgDni',
                                                iconCls     : 'regper',
                                                layout	: 'fit',
                                                width	: 600,
                                                height	: 400,
                                                resizable   : false,
                                                closable    : true,
                                                modal       : true,
                                                closeAction : 'destroy',
                                                items       : [frmpnlImagen]
                                            }).show();
                                        }else{
                                              win_imdDni.show();
                                        }
                    }
                });

            ///*Controles ComboBox*///

            //Puestos
            var cboCheckPuestosFam = new Ext.form.ComboBox({
                fieldLabel  : 'Puesto al que postula',
                id          : 'cboCheckPuestosFam',
                store       : ds_chksrvpuestos,
                displayField: 'despue',
                valueField  : 'codpue',
                typeAhead   : true,
                mode        : 'local',
                triggerAction: 'all',
                anchor      :'100%',
                disabled    : false,
                forceSelection : true,
                hideTrigger : false,
                lazyRender : true,
                selectOnFocus:true
            });

            //Parentesco
            var cbo_parentfam = new Ext.form.ComboBox({
                    id              : 'cbo_parentfam',
                    name            : 'codpar',
                    fieldLabel      : 'Parentesco',
                    mode            : 'local',
                    disabled        : false,
                    editable        : false,
                    allowBlank      : false,
                    readOnly	: true,
                    store           : ds_parentescos,
                    triggerAction   : 'all',
                    displayField    : 'despar',
                    valueField      : 'codpar',
                    hiddenName      : 'vcodpar',
                    anchor          : '-10'
            });

            //Delitos
            var cboDelitosFam = new Ext.form.ComboBox({
                fieldLabel  : 'Delito',
                id          : 'cboDelitosFam',
                name        : 'coddel',
                store       : ds_delitos,
                displayField: 'nomdel',
                valueField  : 'coddel',
                hiddenName  : 'vcoddel',
                triggerAction: 'all',
                anchor      : '100%',
                disabled    : false,
                //editable : false,
                lazyRender : true,
                readOnly : false,
                onSelect    : function(record){
                                var id=record.data.coddel.toString();
                                //var registro = ds_delitos.getById(id);
                                //txt_defdel.setValue(registro.data.desdel);
                                cboDelitosFam.setValue(record.data.coddel);
                                selDelitoFam=true;
                                vcoddel=record.data.coddel;
                                vdesdel=record.data.desdel;
                                vnomdel=record.data.nomdel;
                                cboDelitosFam.collapse();
                                txt_recomefam.focus();
                            }/*,
                listeners       :{
                        'select' : function(cmb, rec, idx){
                                        selDelito=true;
                                        vcoddel=rec.data.coddel;
                                        vdesdel=rec.data.desdel;
                                        vnomdel=rec.data.nomdel;
                                    }
                    },
                value : '1'*/
                });

            //Estados Check
            var cboEstadoCheckFamiliar = new Ext.form.ComboBox({
                    id              : 'cboEstadoCheckFamiliar',
                    name            : 'codestchk',
                    fieldLabel      : 'Estado Check',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_estadoscheck,
                    editable        : false,
                    readOnly	: true,
                    triggerAction   : 'all',
                    displayField    : 'desestchk',
                    valueField      : 'codestchk',
                    hiddenName      : 'vcodestchk',
                    anchor          : '100%'
            });

            //Referencia Policial
            var cbo_refpolfam = new Ext.form.ComboBox({
                    id              : 'cbo_refpolfam',
                    name            : 'indrefpolfam',
                    fieldLabel      : 'Referencia Policial',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_registra,
                    editable        : false,
                    readOnly	: true,
                    triggerAction   : 'all',
                    displayField    : 'desreg',
                    valueField      : 'codreg',
                    hiddenName      : 'vindrefpol',
                    anchor          : '100%',
                    value           : '0',
                    onSelect    : function(record){
                                        var seleccionado=record.data.codreg;
                                        //alert(seleccionado);
                                        if(seleccionado=='1'){
                                            refpol=true;
                                        }
                                        else {
                                            refpol=false;
                                        }
                                        if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                            txt_invpolfam.enable();
                                            //cboDelitos.enable();
                                            cboDelitosFam.setReadOnly(false);
                                        }
                                        else{
                                            txt_invpolfam.setValue('');
                                            txt_invpolfam.disable();
                                            //cboDelitos.setValue('1');
                                            //cboDelitos.setReadOnly(true);
                                            //txt_defdel.setValue('');
                                        }
                                        cbo_refpolfam.setValue(record.data.codreg);
                                        cbo_refpolfam.collapse();
                                    }
            });

            //Antecedente Policial
            var cbo_antpolfam = new Ext.form.ComboBox({
                    id              : 'cbo_antpolfam',
                    name            : 'indantpolfam',
                    fieldLabel      : 'Antecedente Policial',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_registra,
                    editable        : false,
                    readOnly	: true,
                    triggerAction   : 'all',
                    displayField    : 'desreg',
                    valueField      : 'codreg',
                    hiddenName      : 'vindantpol',
                    anchor          : '100%',
                    value           : '0',
                    onSelect    : function(record){
                                        var seleccionado=record.data.codreg;
                                        //alert(seleccionado);
                                        if(seleccionado=='1'){
                                            antpol=true;
                                        }
                                        else {
                                            antpol=false;
                                        }
                                        if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                            txt_invpolfam.enable();
                                            //cboDelitos.enable();
                                            cboDelitosFam.setReadOnly(false);
                                        }
                                        else{
                                            txt_invpolfam.setValue('');
                                            txt_invpolfam.disable();
                                            //cboDelitos.setValue('1');
                                            //cboDelitos.setReadOnly(true);
                                            //txt_defdel.setValue('');
                                        }
                                        cbo_antpolfam.setValue(record.data.codreg);
                                        cbo_antpolfam.collapse();
                                    }
            });

            //Requisitoria Judicial
            var cbo_reqjudfam = new Ext.form.ComboBox({
                    id              : 'cbo_reqjudfam',
                    name            : 'indreqjudfam',
                    fieldLabel      : 'Requisitoria Judicial',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_registra,
                    editable        : false,
                    readOnly	: true,
                    triggerAction   : 'all',
                    displayField    : 'desreg',
                    valueField      : 'codreg',
                    hiddenName      : 'vindreqjud',
                    anchor          : '100%',
                    value           : '0',
                    onSelect    : function(record){
                                        var seleccionado=record.data.codreg;
                                        //alert(seleccionado);
                                        if(seleccionado=='1'){
                                            reqjud=true;
                                        }
                                        else {
                                            reqjud=false;
                                        }
                                        if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                            txt_invpolfam.enable();
                                            //cboDelitos.enable();
                                            cboDelitosFam.setReadOnly(false);
                                        }
                                        else{
                                            txt_invpolfam.setValue('');
                                            txt_invpolfam.disable();
                                            //cboDelitos.setValue('1');
                                            //cboDelitos.setReadOnly(true);
                                            //txt_defdel.setValue('');
                                        }
                                        cbo_reqjudfam.setValue(record.data.codreg);
                                        cbo_reqjudfam.collapse();
                                    }
            });

            //Referencia por Terrorismo
            var cbo_refterfam = new Ext.form.ComboBox({
                    id              : 'cbo_refterfam',
                    name            : 'indrefterfam',
                    fieldLabel      : 'Referencia Terrorismo',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_registra,
                    editable        : false,
                    readOnly	: true,
                    triggerAction   : 'all',
                    displayField    : 'desreg',
                    valueField      : 'codreg',
                    hiddenName      : 'vindrefter',
                    anchor          : '100%',
                    value           : '0',
                    onSelect    : function(record){
                                        var seleccionado=record.data.codreg;
                                        //alert(seleccionado);
                                        if(seleccionado=='1'){
                                            refter=true;
                                        }
                                        else {
                                            refter=false;
                                        }
                                        if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                            txt_invpolfam.enable();
                                            //cboDelitos.enable();
                                            cboDelitosFam.setReadOnly(false);
                                        }
                                        else{
                                            txt_invpolfam.setValue('');
                                            txt_invpolfam.disable();
                                            //cboDelitos.setValue('1');
                                            //cboDelitos.setReadOnly(true);
                                            //txt_defdel.setValue('');
                                        }
                                        cbo_refterfam.setValue(record.data.codreg);
                                        cbo_refterfam.collapse();
                                    }
            });

            //Referencia por Drogas
            var cbo_refdrofam = new Ext.form.ComboBox({
                    id              : 'cbo_refdrofam',
                    name            : 'indrefdrofam',
                    fieldLabel      : 'Referencia Drogas',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_registra,
                    editable        : false,
                    readOnly	: true,
                    triggerAction   : 'all',
                    displayField    : 'desreg',
                    valueField      : 'codreg',
                    hiddenName      : 'vindrefdro',
                    anchor          : '100%',
                    value           : '0',
                    onSelect    : function(record){
                                        var seleccionado=record.data.codreg;
                                        //alert(seleccionado);
                                        if(seleccionado=='1'){
                                            refdro=true;
                                        }
                                        else {
                                            refdro=false;
                                        }
                                        if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                            txt_invpolfam.enable();
                                            //cboDelitos.enable();
                                            cboDelitosFam.setReadOnly(false);
                                        }
                                        else{
                                            txt_invpolfam.setValue('');
                                            txt_invpolfam.disable();
                                            //cboDelitos.setValue('1');
                                            //cboDelitos.setReadOnly(true);
                                            //txt_defdel.setValue('');
                                        }
                                        cbo_refdrofam.setValue(record.data.codreg);
                                        cbo_refdrofam.collapse();
                                    }
            });

            //Impedimento de salida
            var cbo_impsalfam = new Ext.form.ComboBox({
                    id              : 'cbo_impsalfam',
                    name            : 'indimpsalfam',
                    fieldLabel      : 'Imp. de salida del País',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_registra,
                    editable        : false,
                    readOnly	: true,
                    triggerAction   : 'all',
                    displayField    : 'desreg',
                    valueField      : 'codreg',
                    hiddenName      : 'vindimpsalpai',
                    anchor          : '100%',
                    value           : '0',
                    onSelect    : function(record){
                                        var seleccionado=record.data.codreg;
                                        //alert(seleccionado);
                                        if(seleccionado=='1'){
                                            impsal=true;
                                        }
                                        else {
                                            impsal=false;
                                        }
                                        if(refpol==true || antpol==true || reqjud==true || refter==true || refdro==true || impsal==true || invpen==true){
                                            txt_invpolfam.enable();
                                            //cboDelitos.enable();
                                            cboDelitosFam.setReadOnly(false);
                                        }
                                        else{
                                            txt_invpolfam.setValue('');
                                            txt_invpolfam.disable();
                                            //cboDelitos.setValue('1');
                                            //cboDelitos.setReadOnly(true);
                                            //txt_defdel.setValue('');
                                        }
                                        cbo_impsalfam.setValue(record.data.codreg);
                                        cbo_impsalfam.collapse();
                                    }
            });

            //Investigación penal
            var cbo_invpenfam = new Ext.form.ComboBox({
                    id              : 'cbo_invpenfam',
                    name            : 'indinvpenfam',
                    fieldLabel      : 'Investigación Penal',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_registra,
                    editable        : false,
                    readOnly	: true,
                    triggerAction   : 'all',
                    displayField    : 'desreg',
                    valueField      : 'codreg',
                    hiddenName      : 'vindinvpen',
                    anchor          : '100%',
                    value           : '0',
                    onSelect    : function(record){
                                        var seleccionado=record.data.codreg;
                                        if(seleccionado=='1'){
                                                    invpen=true;
                                                }
                                        else {
                                            invpen=false;
                                        }
                                        if(invpen==true){
                                            txt_invpenfam.enable();
                                            //cboDelitos.enable();
                                            cboDelitosFam.setReadOnly(false);
                                        }
                                        else{
                                            txt_invpenfam.setValue('');
                                            txt_invpenfam.disable();
                                            //cboDelitos.setValue('1');
                                            //cboDelitos.setReadOnly(true);
                                            //txt_defdel.setValue('');
                                        }
                                        cbo_invpenfam.setValue(record.data.codreg);
                                        cbo_invpenfam.collapse();
                    }
            });

            ///*FieldSets*///

            var fldstCombosAntecedentesFam = new Ext.form.FieldSet({
                    columnWidth: 0.4,
                    collapsible: false,
                    border : false,
                    autoHeight:true,
                    labelWidth  : 140,
                    defaults: {
                        anchor: '-10'
                    },
                    defaultType: 'textfield',
                    items :[
                        cbo_refpolfam,
                        cbo_antpolfam,
                        cbo_reqjudfam,
                        cbo_refterfam,
                        cbo_refdrofam,
                        cbo_impsalfam,
                        cbo_invpenfam
                    ]
            });

            //texto de referencias Policiales y Penales
            var fldstDescAntecedentesFam = new Ext.form.FieldSet({
                    columnWidth: 0.6,
                    //title: 'Fieldset 1',
                    collapsible: false,
                    border : false,
                    autoHeight:true,
                    labelWidth  : 80,
                    defaultType: 'textfield',
                    items :[
                        txt_invpolfam,
                        txt_invpenfam
                    ]
            });

/*Agregando para varios delitos*/

            var cm_delitosfam = new Ext.grid.ColumnModel(
                    [{
                        id : 'coddel',
                        header: 'coddel',
                        readonly: true,
                        dataIndex: 'coddel',
                        hidden: true,
                        width: 10
                    },{
                        header: 'Delito',
                        readonly: true,
                        dataIndex: 'nomdel',
                        hidden: false,
                        width: 160
                    },{
                        header: 'Descripción',
                        readonly: true,
                        dataIndex: 'desdel',
                        hidden: false,
                        width: 600
                    },{
                        header: 'grabado',
                        readonly: true,
                        dataIndex: 'grabado',
                        hidden: true,
                        width: 50
                    }]
                );

            var newDelitoFam = Ext.data.Record.create([
                    {name: 'coddel', type: 'int'},
                    {name: 'nomdel', type: 'string'},
                    {name: 'desdel', type: 'string'},
                    {name: 'grabado', type: 'int'}
                ]);

            //Store fictivio para residentes
            var ds_delitostempFam = new Ext.data.Store({
                        reader	:   new Ext.data.JsonReader(newDelito),
                        proxy	:   new Ext.data.HttpProxy({url: "DB/checkfamiliar.php?n=100"}),
                        sortInfo	:   {field:'coddel', direction:'ASC'},
                        autoLoad    :   false
                });

            var grd_delitosFam = new Ext.grid.EditorGridPanel({
                    id      : 'grd_delitosFam',
                    store   : ds_delitostempFam,
                    //title   : 'Delitos',
                    cm      : cm_delitosfam,
                    //anchor  : '99%',
                    height  : 140,
                    width   : 754,
                    frame   : true,
                    clicksToEdit :1,
                    //layout    : 'fit',
                    autoScroll: true,
                    selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
                    tbar    :['Delitos :',cboDelitosFam,
                            {
                                xtype   : 'tbbutton',
                                cls     : 'x-btn-icon',
                                icon    : 'files/images_app/plus.png',
                                handler : function(){
                                        var duplicado=false;
                                        var cant_registros = ds_delitostempFam.getCount();
                                        for (var i = 0; i < cant_registros; i++) {
                                            var record = grd_delitosFam.getStore().getAt(i);
                                            var coddel = record.data.coddel;
                                            //console.log(codpersona);
                                            if (vcoddel == coddel) {
                                                duplicado=true;
                                                break;
                                            }
                                        }
                                        if(duplicado==false){
                                            if(selDelitoFam==true){
                                                var r = new newDelitoFam({
                                                   coddel       : vcoddel,
                                                   nomdel       : vnomdel,
                                                   desdel       : vdesdel,
                                                   grabado      : 0
                                                });
                                                //alert(p.get('item'));
                                                ds_delitostempFam.insert(ds_delitostempFam.getCount(), r);
                                                grd_delitosFam.getView().refresh();
                                                ds_delitostempFam.reload();
                                                //restablece campos para agregar mas residentes
                                                selDelitoFam=false;
                                                cboDelitosFam.clearValue();
                                            }else{
                                                Ext.Msg.show({title: 'Error de Ingreso',
                                                                msg: 'Debe seleccionar un delito a agregar',
                                                                buttons: Ext.MessageBox.OK,
                                                                icon: Ext.MessageBox.ERROR});
                                            }
                                        }else{
                                            Ext.Msg.show({title: 'Error de Ingreso',
                                                                msg: 'Tipo de delito que intenta agregar ya esta en la lista',
                                                                buttons: Ext.MessageBox.OK,
                                                                icon: Ext.MessageBox.INFO});
                                        }
                                     }
                            },
                            {
                                xtype   : 'tbbutton',
                                cls     : 'x-btn-icon',
                                icon    : 'files/images_app/minus.png',
                                handler : function handleDelete() {
                                                var selectedKeys = grd_delitosFam.selModel.selections.keys;
                                                if(selectedKeys.length > 0) {
                                                    Ext.Msg.confirm('ALERTA!','¿desea eliminar el registro?', function borraResidente(btn){
                                                    if (btn == 'yes') {
                                                        //alert(btn);
                                                        var selectedRow = grd_delitosFam.getSelectionModel().getSelected();
                                                        var colgrabado = grd_delitosFam.getColumnModel().getDataIndex(3);
                                                        var grabado = selectedRow.get(colgrabado);

                                                        if(grabado==1){
                                                            //alert("es grabado");
                                                            var chkser = hid_codchkfam.getValue();
                                                            var campodel =grd_delitosFam.getColumnModel().getDataIndex(0);
                                                            var delitodel =selectedRow.get(campodel);
                                                            //alert(chkser);
                                                            //alert(delitodel);
                                                            Ext.Ajax.request({
                                                                url : 'DB/checkfamiliar.php',
                                                                params : {
                                                                    n   : 11,
                                                                    codchkser : chkser,
                                                                    coddel : delitodel
                                                                },
                                                                callback : function(opt,success,response){
                                                                    if (success) {
                                                                            var responseData = Ext.util.JSON.decode(response.responseText);
                                                                            var error = responseData.respuesta.error;
                                                                            if (error==0){
                                                                                //var selectedRow = grd_delitos.getSelectionModel().getSelected();
                                                                                if (selectedRow) ds_delitostempFam.remove(selectedRow);
                                                                                var cant_registros = ds_delitostempFam.getCount();
                                                                                for (var i = 0; i < cant_registros; i++) {
                                                                                    var record = grd_delitosFam.getStore().getAt(i);
                                                                                    record.beginEdit();
                                                                                    record.data.item = i+1;
                                                                                    record.endEdit();
                                                                                    record.commit();
                                                                                }
                                                                            }
                                                                            else{
                                                                                Ext.Msg.show({title: 'Error',
                                                                                     msg: responseData.respuesta.mensaje,
                                                                                     buttons: Ext.MessageBox.OK,
                                                                                     icon: Ext.MessageBox.ERROR
                                                                                 });
                                                                            }
                                                                        } else {
                                                                           Ext.Msg.show({title: 'Error',
                                                                                     msg: 'Sin respuesta del servidor, comuniquese con Sistemas',
                                                                                     buttons: Ext.MessageBox.OK,
                                                                                     icon: Ext.MessageBox.ERROR
                                                                                 });
                                                                        }
                                                                }
                                                            });
                                                        }
                                                        else{
                                                            //alert("no es grabado");
                                                            //var selectedRow = grd_delitos.getSelectionModel().getSelected();
                                                            if (selectedRow) ds_delitostempFam.remove(selectedRow);
                                                            var cant_registros = ds_delitostempFam.getCount();
                                                            for (var i = 0; i < cant_registros; i++) {
                                                                var record = grd_delitosFam.getStore().getAt(i);
                                                                record.beginEdit();
                                                                record.data.item = i+1;
                                                                record.endEdit();
                                                                record.commit();
                                                            }
                                                        }
                                                    }
                                                });
                                                }else{
                                                    Ext.Msg.alert('Recuerde!','Seleccione un registro para eliminar');
                                                }
                                            }
                            }
                    ]

                });

/*Fin de varios delitos*/

            //Panel principal para el CheckService

            var frmCheckFamiliar = new Ext.FormPanel({
                frame       : false,
                border      : false,
                fileUpload  : true,
                style       : 'padding:1px 1px 1px 1px',
                items       : [hid_imgactreniecfam,hid_codchkfam,
                    {
                        layout  : 'column',
                        border  : false,
                        frame   : true,
                        style   : 'padding: 5px 0px 5px 0px',
                        items   : [
                            {
                                columnWidth	: 0.7,
                                layout : 'form',
                                labelWidth : 50,
                                border : false,
                                items  : [txt_nomfamper]
                            },
                            {
                                columnWidth	: 0.3,
                                layout : 'form',
                                labelWidth : 75,
                                border : false,
                                items  : [cbo_parentfam]
                            }
                        ]
                    },{
                        layout  : 'column',
                        border  : false,
                        frame   : true,
                        style   : 'padding: 5px 0px 5px 0px',
                        items   : [
                            {
                                columnWidth	: 0.8,
                                layout : 'form',
                                labelWidth : 75,
                                border : false,
                                items  : [upf_imagendnifam]
                            },
                            {
                                columnWidth	: 0.2,
                                //layout : 'form',
                                //labelWidth : 100,
                                border : false,
                                items  : [btnImgCargadafam]
                            },
                            {
                                columnWidth	: 1.0,
                                layout : 'form',
                                labelWidth : 100,
                                border : false,
                                items  : [txt_obsdnifam]
                            }
                        ]
                    },{
                        layout : 'column',
                        frame : true,
                        border : false,
                        height : 200,
                        items : [fldstCombosAntecedentesFam,fldstDescAntecedentesFam]
                    },
                    {
                        layout : 'column',
                        border : true,
                        frame  : false,
                        style  : 'padding: 5px 0px 1px 1px',
                        items : [grd_delitosFam]
                    },
                    {
                        layout : 'column',
                        border : false,
                        frame  : true,
                        style  : 'padding: 5px 0px 1px 1px',
                        items : [
                            {
                                columnWidth	: 0.7,
                                layout : 'form',
                                labelWidth : 100,
                                border : false,
                                items  : [txt_recomefam]
                            },{
                                columnWidth	: 0.3,
                                layout : 'form',
                                labelWidth : 80,
                                border : false,
                                items  : [cboEstadoCheckFamiliar]
                            }
                        ]
                    }]
            });


            //DataStore para obtener datos grabados del CheckService
            var ds_obtieneListaCheckFamiliar = new Ext.data.Store({
                    reader: new Ext.data.JsonReader({
                        root            : 'listacheckfam',
                        totalProperty	: 'total',
                        id              : 'codchkser'
                        },
                        [{name: 'codchkfam', mapping: 'codchkser'},
                        {name: 'nombre', mapping: 'nombre'},
                        {name: 'despar', mapping: 'despar'},
                        {name: 'desestchk', mapping: 'desestchk'}
                        ]),
                    proxy: new Ext.data.HttpProxy({
                        url: 'DB/checkfamiliar.php',
                        method : 'POST'
                    }),
                    baseParams:{n:1, codsol:cod_sol, codper:cod_per},
                    autoLoad: false
            });


            var cm_detchkFamiliar = new Ext.grid.ColumnModel(
                    [{
                        id : 'codchkfam',
                        header: 'codchkfam',
                        readonly: true,
                        dataIndex: 'codchkfam',
                        hidden: true
                    },{
                        header: 'Nombre',
                        readonly: true,
                        dataIndex: 'nombre',
                        hidden: false,
                        width:250
                    },{
                        header: 'Parentesco',
                        readonly: true,
                        dataIndex: 'despar',
                        hidden: false,
                        width:150
                    },{
                        header: 'Estado',
                        readonly: true,
                        dataIndex: 'desestchk',
                        hidden: false
                    }]
                );

                var grd_detListaChkFam = new Ext.grid.EditorGridPanel({
                    id      : 'grd_detListaChkFam',
                    store   : ds_obtieneListaCheckFamiliar,
                    title   : 'Checks familiares Registrados',
                    cm      : cm_detchkFamiliar,
                    width   : 350,
                    anchor  : '100%',
                    height  : 130,
                    frame   : true,
                    layout    : 'fit',
                    autoScroll: true,
                    selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
                    listeners:{
                        rowdblclick: function(grid, rowIndex, e){
                                            var chkfam = ds_obtieneListaCheckFamiliar.getAt(rowIndex).data.codchkfam;
                                            alert(chkfam);
                                            //var per = ds_obtieneListaCheckLaboral.getAt(rowIndex).data.codper;
                                            ds_obtieneCheckFamiliar.load({params: {n:4, codchkser:chkfam}});
                                            grd_detListaChkFam.disable();
                                            NewChkFam = 'no';
                                            //Cuestionario = ds_obtieneListaCheckLaboral.getAt(rowIndex).data.cueresp;
                                            //alert(Cuestionario);
                                            Ext.getCmp('btn_CancelarCheckFamiliar').enable();
                                            Ext.getCmp('btn_GrabarCheckFamiliar').enable();
                                            Ext.getCmp('btn_NuevoCheckFamiliar').disable();
                                            ///txt_nomperref.focus(true);
                                            //frm_checks_persona(sol, per);
                                    }
                            }
                });

            var frmListaCheckFamiliar = new Ext.FormPanel({
                frame       : false,
                border      : false,
                fileUpload  : true,
                //autoScroll : true,
                width       : 750,
                style       : 'padding:1px 1px 1px 1px',
                items       : [grd_detListaChkFam]
            });

///////////////////////////////Controles de Check Laboral/////////////////////////////////////

            //Nombre
            var txt_chklabnomper = new Ext.form.TextField({
                id          : 'txt_chklabnomper',
                fieldLabel	: 'Check Identidad',
                width       : 250,
                readOnly	: true,
                disabled    : false,
                name	: 'nombrechklab',
                anchor	: '98%'
            });

            //Puestos
            var cboCheckPuestosLab = new Ext.form.ComboBox({
                fieldLabel  : 'Puesto al que postula',
                id          : 'cboCheckPuestosLab',
                store       : ds_chksrvpuestos,
                displayField: 'despue',
                valueField  : 'codpue',
                typeAhead   : true,
                mode        : 'local',
                triggerAction: 'all',
                anchor      :'100%',
                disabled    : false,
                forceSelection : true,
                hideTrigger : false,
                lazyRender : true,
                selectOnFocus:true
            });

            //DataStore para obtener datos grabados del CheckService
            var ds_obtieneListaCheckLaboral = new Ext.data.Store({
                    reader: new Ext.data.JsonReader({
                        root            : 'listachecklab',
                        totalProperty	: 'total',
                        id              : 'codchklab'
                        },
                        [{name: 'codchklab', mapping: 'codchklab'},
                        {name: 'codpue', mapping: 'codpue'},
                        {name: 'despue', mapping: 'despue'},
                        {name: 'nomemp', mapping: 'nomemp'},
                        {name: 'codcue', mapping: 'codcue'},
                        {name: 'descue', mapping: 'descue'},
                        {name: 'telemp', mapping: 'telemp'},
                        {name: 'codestchk', mapping: 'codestchk'},
                        {name: 'desestchk', mapping: 'desestchk'},
                        {name: 'cueresp', mapping: 'cueresp'}
                        ]),
                    proxy: new Ext.data.HttpProxy({
                        url: 'DB/checklaboral.php',
                        method : 'POST'
                    }),
                    baseParams:{n:1, codsol:cod_sol, codper:cod_per},
                    autoLoad: false
            });


            var cm_detchkLaboral = new Ext.grid.ColumnModel(
                    [{
                        id : 'codchklab',
                        header: 'codchklab',
                        readonly: true,
                        dataIndex: 'codchklab',
                        hidden: true
                    },{
                        header: 'Empresa',
                        readonly: true,
                        dataIndex: 'nomemp',
                        hidden: false,
                        width:250
                    },{
                        header: 'codcue',
                        readonly: true,
                        dataIndex: 'codcue',
                        hidden: true
                    },{
                        header: 'Cuestionario',
                        readonly: true,
                        dataIndex: 'descue',
                        hidden: false,
                        width:200
                    },{
                        header: 'Telefono',
                        readonly: true,
                        dataIndex: 'telemp',
                        hidden: false
                    },{
                        header: 'codestchk',
                        readonly: true,
                        dataIndex: 'codestchk',
                        hidden: true
                    },{
                        header: 'Estado',
                        readonly: true,
                        dataIndex: 'desestchk',
                        hidden: false
                    },{
                        header: 'cueresp',
                        readonly: true,
                        dataIndex: 'cueresp',
                        hidden: true
                    }]
                );

                var grd_detListaChkLab = new Ext.grid.EditorGridPanel({
                    id      : 'grd_detListaChkLab',
                    store   : ds_obtieneListaCheckLaboral,
                    title   : 'Checks Laborales Registrados',
                    cm      : cm_detchkLaboral,
                    width   : 350,
                    anchor  : '100%',
                    height  : 130,
                    frame   : true,
                    layout    : 'fit',
                    autoScroll: true,
                    selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
                    listeners:{
                        rowdblclick: function(grid, rowIndex, e){
                                            var chklab = ds_obtieneListaCheckLaboral.getAt(rowIndex).data.codchklab;
                                            //var per = ds_obtieneListaCheckLaboral.getAt(rowIndex).data.codper;
                                            ds_obtieneCheckLaboral.load({params: {n:4, codchklab:chklab}});
                                            grd_detListaChkLab.disable();
                                            NewChkLab = 'no';
                                            Cuestionario = ds_obtieneListaCheckLaboral.getAt(rowIndex).data.cueresp;
                                            //alert(Cuestionario);
                                            Ext.getCmp('btn_CancelarCheckLaboral').enable();
                                            Ext.getCmp('btn_GrabarCheckLaboral').enable();
                                            Ext.getCmp('btn_NuevoCheckLaboral').disable();
                                            txt_nomperref.focus(true);
                                            //frm_checks_persona(sol, per);
                                    }
                            }
                });

            var ds_preguntas = new Ext.data.Store({
                                reader: new Ext.data.JsonReader({
                                    root            : 'cuestionario',
                                    totalProperty	: 'total',
                                    id              : 'codpre'
                                    },
                                    [{name: 'codsol', mapping: 'codsol'},
                                    {name: 'codper', mapping: 'codper'},
                                    {name: 'codchklab', mapping: 'codchklab'},
                                    {name: 'codcue', mapping: 'codcue'},
                                    {name: 'codpre', mapping: 'codpre'},
                                    {name: 'despre', mapping: 'despre'},
                                    {name: 'respre', mapping: 'respre'},
                                    ]),
                                proxy: new Ext.data.HttpProxy({
                                    url: 'DB/checklaboral.php',
                                    method : 'POST'
                                }),
                                autoLoad: false
            });

            var cm_preguntas = new Ext.grid.ColumnModel(
                    [{
                        header: 'codsol',
                        readonly: true,
                        dataIndex: 'codsol',
                        hidden: true
                    },{
                        header: 'codper',
                        readonly: true,
                        dataIndex: 'codper',
                        hidden: true
                    },{
                        header: 'codchklab',
                        readonly: true,
                        dataIndex: 'codchklab',
                        hidden: true
                    },{
                        header: 'codcue',
                        readonly: true,
                        dataIndex: 'codcue',
                        hidden: true

                    },{
                        id : 'codpre',
                        header: 'codpre',
                        readonly: true,
                        dataIndex: 'codpre',
                        hidden: true
                    },{
                        header: 'Pregunta',
                        readonly: true,
                        dataIndex: 'despre',
                        hidden: false,
                        width:355
                    },{
                        header: 'Respuesta',
                        readonly: false,
                        dataIndex: 'respre',
                        hidden: false,
                        width:355,
                        editor: new Ext.form.TextField({
                            anchor : '100%',
                            fieldLabel : 'Check Identidad'

                        })
                    }]
                );

            var grd_preguntas = new Ext.grid.EditorGridPanel({
                    id      : 'grd_preguntas',
                    store   : ds_preguntas,
                    title   : 'Preguntas del Cuestionario',
                    cm      : cm_preguntas,
                    width   : 350,
                    anchor  : '100%',
                    height  : 150,
                    frame   : true,
                    editable : true,
                    layout    : 'fit',
                    autoScroll: true,
                    clicksToEdit : 'auto',
                    selModel: new Ext.grid.RowSelectionModel({singleSelect:false})
                });

            var frmListaPreguntas = new Ext.FormPanel({
                frame       : false,
                border      : false,
                width       : 750,
                style       : 'padding:1px 1px 1px 1px',
                items       : [grd_preguntas]
            });

            var hid_codchklab = new Ext.form.Hidden({
                id          : 'hid_codchklab',
                readOnly	: false,
                name	: 'codchklab',
                hidemode    : 'display',
                hidelabel   : true
            });

            var txt_nomperref = new Ext.form.TextField({
                id          : 'txt_nomperref',
                fieldLabel	: 'Persona Referencia',
                readOnly	: true,
                disabled    : false,
                name	: 'nomperref',
                anchor	: '-10',
                allowBlank  :false
            });

            var txt_nomemp = new Ext.form.TextField({
                id          : 'txt_nomemp',
                fieldLabel	: 'Empresa',
                readOnly	: true,
                disabled    : false,
                name	: 'nomemp',
                anchor	: '100%',
                allowBlank  :false
            });

            var txt_telemp = new Ext.form.TextField({
                id          : 'txt_telemp',
                fieldLabel	: 'Teléfono',
                readOnly	: true,
                disabled    : false,
                name	: 'telemp',
                anchor	: '-10',
                allowBlank  :false
            });

            var txt_perlab = new Ext.form.TextField({
                id          : 'txt_perlab',
                fieldLabel	: 'Periodo Laboral',
                readOnly	: true,
                disabled    : false,
                name	: 'telemp',
                anchor	: '-10',
                allowBlank  :false
            });

            var txt_motces = new Ext.form.TextField({
                id          : 'txt_motces',
                fieldLabel	: 'Motivo Cese',
                readOnly	: true,
                disabled    : false,
                name	: 'motces',
                anchor	: '100%',
                allowBlank  :false
            });

            var dp_fecent=new Ext.form.DateField({
                    fieldLabel  :'Fecha',
                    id          :'dp_fecent',
                    name        :'fecent',
            //        width       :110,
                    format      :'d/m/Y',
                    anchor      :'98%',
                    readOnly    :true,
                    renderer    :function(value) {return value ? new Date(value).dateFormat('Y-m-d') : '';},
                    allowBlank  :false
            });

            var txt_percont = new Ext.form.TextField({
                id          : 'txt_percont',
                fieldLabel	: 'Persona de Contacto',
                readOnly	: true,
                disabled    : false,
                name	: 'percont',
                anchor	: '-10',
                allowBlank  :false
            });

            var txt_obsent = new Ext.form.TextArea({
                id          : 'txt_obsent',
                fieldLabel	: 'Observaciones',
                readOnly	: true,
                disabled    : false,
                name	: 'obsent',
                anchor	: '-10',
                height      : 38,
                allowBlank  :false
            });

            var txt_noment = new Ext.form.TextField({
                id          : 'txt_noment',
                fieldLabel	: 'Entrevistador',
                readOnly	: true,
                disabled    : false,
                name	: 'noment',
                anchor	: '-10',
                allowBlank  :false
            });

            var txt_carpercont = new Ext.form.TextField({
                id          : 'txt_carpercont',
                fieldLabel	: 'Cargo',
                readOnly	: true,
                disabled    : false,
                name	: 'carpercont',
                anchor	: '100%',
                allowBlank  :false
            });

            //Conclusiones
            var cbo_conclusionlab = new Ext.form.ComboBox({
                    id              : 'cbo_conclusionlab',
                    name            : 'codcon',
                    fieldLabel      : 'Conclusión',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
            //        width           : 50,
                    store           : ds_conclusion,
                    editable        : false,
                    readOnly	: true,
                    triggerAction   : 'all',
                    displayField    : 'descon',
                    valueField      : 'codcon',
                    hiddenName      : 'vcodcon',
                    anchor          : '100%'
            });

            var cboEstadoCheckLaboral = new Ext.form.ComboBox({
                    id              : 'cboEstadoCheckLaboral',
                    name            : 'codestchklab',
                    fieldLabel      : 'Estado',
                    mode            : 'local',
                    disabled        : false,
                    allowBlank      : false,
                    store           : ds_estadoscheck,
                    editable        : false,
                    readOnly	: true,
                    triggerAction   : 'all',
                    displayField    : 'desestchk',
                    valueField      : 'codestchk',
                    hiddenName      : 'vcodestchkdom',
                    anchor          : '100%'
            });

            var frmDatosCheckLaboral2 = new Ext.FormPanel({
                frame       : true,
                border      : false,
                style       : 'padding:1px 1px 1px 1px',
                width       : 750,
                items       : [{
                        layout  : 'column',
                        border  : false,
                        frame   : false,
                        style   : 'padding: 0px 0px 0px 0px',
                        items   : [
                            {
                                columnWidth	: 0.6,
                                layout : 'form',
                                labelWidth : 120,
                                border : false,
                                items  : [txt_percont]
                            },
                            {
                                columnWidth	: 0.4,
                                layout : 'form',
                                labelWidth : 50,
                                border : false,
                                items  : [txt_carpercont]
                            }
                        ]
                    },{
                        layout  : 'column',
                        border  : false,
                        frame   : false,
                        style   : 'padding: 0px 0px 0px 0px',
                        items   : [
                            {
                                columnWidth	: 0.2,
                                layout : 'form',
                                labelWidth : 40,
                                border : false,
                                defaultType	: 'datefield',
                                items  : [dp_fecent]
                            },
                            {
                                columnWidth	: 0.5,
                                layout : 'form',
                                labelWidth : 80,
                                border : false,
                                items  : [txt_noment]
                            },
                            {
                                columnWidth	: 0.3,
                                layout : 'form',
                                labelWidth : 60,
                                border : false,
                                items  : [cbo_conclusionlab]
                            }
                        ]
                    },{
                        layout  : 'column',
                        border  : false,
                        frame   : false,
                        style   : 'padding: 0px 0px 0px 0px',
                        items   : [
                            {
                                columnWidth	: 0.7,
                                layout : 'form',
                                labelWidth : 90,
                                border : false,
                                items  : [txt_obsent]
                            },{
                                columnWidth	: 0.3,
                                layout : 'form',
                                labelWidth : 50,
                                border : false,
                                items  : [cboEstadoCheckLaboral]
                            }
                        ]
                    }]
            });

            var frmDatosCheckLaboral = new Ext.FormPanel({
                frame       : true,
                border      : false,
                title       : 'Datos Check Laboral',
                style       : 'padding:1px 1px 1px 1px',
                width       : 750,
                items       : [{
                        layout  : 'column',
                        border  : false,
                        frame   : false,
                        style   : 'padding: 0px 0px 0px 0px',
                        items   : [hid_codchklab,
                            {
                                columnWidth	: 0.6,
                                layout : 'form',
                                labelWidth : 120,
                                border : false,
                                items  : [txt_nomperref]
                            },
                            {
                                columnWidth	: 0.4,
                                layout : 'form',
                                labelWidth : 65,
                                border : false,
                                items  : [txt_nomemp]
                            }
                        ]
                    },{
                        layout  : 'column',
                        border  : false,
                        frame   : false,
                        style   : 'padding: 0px 0px 0px 0px',
                        items   : [
                            {
                                columnWidth	: 0.2,
                                layout : 'form',
                                labelWidth : 60,
                                border : false,
                                items  : [txt_telemp]
                            },
                            {
                                columnWidth	: 0.4,
                                layout : 'form',
                                labelWidth : 95,
                                border : false,
                                items  : [txt_perlab]
                            },
                            {
                                columnWidth	: 0.4,
                                layout : 'form',
                                labelWidth : 80,
                                border : false,
                                items  : [txt_motces]
                            }
                        ]
                    }]
            });

            var frmListaCheckLaboral = new Ext.FormPanel({
                frame       : false,
                border      : false,
                fileUpload  : true,
                //autoScroll : true,
                width       : 750,
                style       : 'padding:1px 1px 1px 1px',
                items       : [grd_detListaChkLab]
            });



            //TabPanel que contiene los diferentes Checks
            var tabPanelCheck = new Ext.TabPanel({
                activeTab: 0,
                border:false,
                items   :   [{
                        title   : 'Check Service',
                        id      : 'tbp_checkservice',
                        disabled: true,
                        frame   : true,
                        border  : false,
                        autoScroll : true,
                        items   : [frmCheckService],

                        tbar    : ['Nombre : ',txt_chksrvnomper,'Puesto : ',cboCheckPuestos,'-',btn_pdf_checkservice,'-',{
                                    xtype: 'tbfill'
                                    },

                                    {
                                    xtype: 'tbfill'
                                    },{
                                        text : 'Grabar',
                                        cls  : 'x-btn-text-icon',
                                        id  : 'btn_GrabarCheckService',
                                        icon : 'files/images_app/disk.png',
                                        handler : function(){
                                            var imagen = upf_imagendni.getValue().trim();
                                            var imagenant = hid_imgactreniec.getValue();
                                            var cant_registros = ds_delitostemp.getCount();
                                            var array_detalle = [];
                                            if(imagenant!='default.jpg' || imagen!=''){
                                                if(frmCheckService.getForm().isValid() && cant_registros>0){

                                                    for (var i = 0; i < cant_registros; i++) {
                                                        var record = grd_delitos.getStore().getAt(i);
                                                        var xcoddel = record.data.coddel;
                                                        var xgrabado = record.data.grabado;
                                                        var item = xcoddel + '$$' + xgrabado;
                                                        array_detalle.push(item);
                                                    }
                                                    var detalle = array_detalle.join('|,|');

                                                    frmCheckService.getForm().submit({
                                                        url : 'DB/checkservice.php',
                                                        params: {n:4,codsol:cod_sol,codper:cod_per,delitos:detalle},
                                                        waitTitle : 'Check Service',
                                                        waitMsg: 'Guardando datos...',
                                                        success:function(form, action){
                                                                    var obj = Ext.util.JSON.decode(action.response.responseText);
                                                                    var est = obj.respuesta.estado;
                                                                    var img = obj.img.imagen;
                                                                    if(est!='3'){
                                                                        Ext.Msg.show({
                                                                            title: 'Check Service',
                                                                            msg: obj.confirma.mensaje,
                                                                            buttons: Ext.MessageBox.OK,
                                                                            icon: Ext.MessageBox.INFO
                                                                        });
                                                                        hid_imgactreniec.setValue(img);
                                                                    }
                                                                    else{
                                                                        if (cperf!='00001'){
                                                                            upf_imagendni.disable();
                                                                            txt_obsdni.setReadOnly(true);
                                                                            cbo_refpol.setReadOnly(true);
                                                                            cbo_antpol.setReadOnly(true);
                                                                            cbo_reqjud.setReadOnly(true);
                                                                            cbo_refter.setReadOnly(true);
                                                                            cbo_refdro.setReadOnly(true);
                                                                            cbo_impsal.setReadOnly(true);
                                                                            cbo_invpen.setReadOnly(true);
                                                                            cboDelitos.setReadOnly(true);
                                                                            cboEstadoCheckService.setReadOnly(true);
                                                                            txt_invpol.setReadOnly(true);
                                                                            txt_invpen.setReadOnly(true);
                                                                            txt_defdel.setReadOnly(true);
                                                                            txt_recome.setReadOnly(true);
                                                                            hid_imgactreniec.setValue(img);
                                                                            Ext.getCmp('btn_GrabarCheckSrevice').disable();
                                                                        }
                                                                        Ext.Msg.show({
                                                                            title: 'Check Service',
                                                                            msg: 'Se grabó como Finalizado, Check Service ahora es solo de lectura para usuarios que no son Administrador',
                                                                            buttons: Ext.MessageBox.OK,
                                                                            icon: Ext.MessageBox.INFO
                                                                        });

                                                                        ftnactestsol(cod_sol);
                                                                          //Ricardo 14-04-10
                                                                        ds_detsol.proxy= new Ext.data.HttpProxy({
                                                                                url: 'DB/solicitud.php',
                                                                                method : 'POST'
                                                                        });
                                                                        ds_detsol.baseParams={
                                                                                n:8,
                                                                                codsol:cod_sol
                                                                        };
                                                                        ds_detsol.load();

                                                                    }

                                                        },
                                                        failure:function(form, action){
                                                                    if(action.failureType == 'server'){
                                                                        var obj = Ext.util.JSON.decode(action.response.responseText);
                                                                        Ext.Msg.alert('Check Service', obj.confirma.mensaje);
                                                                    }
                                                                    else{
                                                                        Ext.Msg.alert('Atenci&oacute;n!', 'El servidor no ha podido ser contactado : ' + action.response.responseText + " ");
                                                                    }
                                                        }
                                                    });



                                                }
                                                else{
                                                    Ext.Msg.show({
                                                        title: 'Error',
                                                        msg: 'Debe ingresar todos los campos obligatorios, recuerde agregar por lo menos un delito o indicar si no los presenta',
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.ERROR
                                                    });
                                                }
                                            }
                                            else{
                                                Ext.Msg.show({
                                                    title: 'Error',
                                                    msg: 'Debe ingresar la ruta de la imagen del DNI',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.ERROR
                                                });
                                            }
                                        }
                                    }
                                ]
                },{
                        title   : 'Check Familiar',
                        id      : 'tbp_checkfam',
                        disabled: true,
                        frame   : true,
                        border  : false,
                        autoScroll : true,
                        items   : [frmListaCheckFamiliar,frmCheckFamiliar],

                        tbar    : ['Nombre : ',txt_chkfamnomper,'Puesto : ',cboCheckPuestosFam,'-',btn_pdf_checkfamiliar,'-',{
                                    xtype: 'tbfill'
                                    },{
                                        text : 'Nuevo',
                                        cls  : 'x-btn-text-icon',
                                        id  : 'btn_NuevoCheckFamiliar',
                                        icon : 'files/images_app/document-share.png',
                                        handler : function(){
                                                        NewChkFam = 'si';
                                                        upf_imagendnifam.enable();
                                                        txt_nomfamper.setReadOnly(false);
                                                        txt_nomfamper.setValue("");
                                                        cbo_parentfam.setReadOnly(false);
                                                        cbo_parentfam.setValue(2);
                                                        txt_obsdnifam.setReadOnly(false);
                                                        txt_obsdnifam.setValue("");
                                                        cbo_refpolfam.setReadOnly(false);
                                                        cbo_refpolfam.setValue(0);
                                                        cbo_antpolfam.setReadOnly(false);
                                                        cbo_antpolfam.setValue(0);
                                                        cbo_reqjudfam.setReadOnly(false);
                                                        cbo_reqjudfam.setValue(0);
                                                        cbo_refterfam.setReadOnly(false);
                                                        cbo_refterfam.setValue(0);
                                                        cbo_refdrofam.setReadOnly(false);
                                                        cbo_refdrofam.setValue(0);
                                                        cbo_impsalfam.setReadOnly(false);
                                                        cbo_impsalfam.setValue(0);
                                                        cbo_invpenfam.setReadOnly(false);
                                                        cbo_invpenfam.setValue(0);
                                                        txt_invpolfam.setReadOnly(false);
                                                        txt_invpolfam.setValue("");
                                                        txt_invpenfam.setReadOnly(false);
                                                        txt_invpenfam.setValue("");
                                                        txt_recomefam.setReadOnly(false);
                                                        txt_recomefam.setValue("");
                                                        btnImgCargadafam.enable();
                                                        cboEstadoCheckFamiliar.setReadOnly(false);
                                                        cboEstadoCheckFamiliar.setValue(1);
                                                        Ext.getCmp('btn_CancelarCheckFamiliar').enable();
                                                        Ext.getCmp('btn_GrabarCheckFamiliar').enable();
                                                        Ext.getCmp('btn_NuevoCheckFamiliar').disable();
                                                        grd_detListaChkFam.disable();
                                        }
                                    },
                                    {
                                        text : 'Cancelar',
                                        cls  : 'x-btn-text-icon',
                                        id  : 'btn_CancelarCheckFamiliar',
                                        disabled : true,
                                        icon : 'files/images_app/delete.gif',
                                        handler : function(){
                                                        upf_imagendnifam.disable();
                                                        txt_nomfamper.setReadOnly(true);
                                                        txt_nomfamper.setValue("");
                                                        cbo_parentfam.setReadOnly(true);
                                                        cbo_parentfam.setValue(2);
                                                        txt_obsdnifam.setReadOnly(true);
                                                        txt_obsdnifam.setValue("");
                                                        cbo_refpolfam.setReadOnly(true);
                                                        cbo_refpolfam.setValue(0);
                                                        cbo_antpolfam.setReadOnly(true);
                                                        cbo_antpolfam.setValue(0);
                                                        cbo_reqjudfam.setReadOnly(true);
                                                        cbo_reqjudfam.setValue(0);
                                                        cbo_refterfam.setReadOnly(true);
                                                        cbo_refterfam.setValue(0);
                                                        cbo_refdrofam.setReadOnly(true);
                                                        cbo_refdrofam.setValue(0);
                                                        cbo_impsalfam.setReadOnly(true);
                                                        cbo_impsalfam.setValue(0);
                                                        cbo_invpenfam.setReadOnly(true);
                                                        cbo_invpenfam.setValue(0);
                                                        txt_invpolfam.setReadOnly(true);
                                                        txt_invpolfam.setValue("");
                                                        txt_invpolfam.disable();
                                                        txt_invpenfam.setReadOnly(true);
                                                        txt_invpenfam.setValue("");
                                                        txt_invpenfam.disable();
                                                        txt_recomefam.setReadOnly(true);
                                                        txt_recomefam.setValue("");
                                                        btnImgCargadafam.disable();
                                                        cboEstadoCheckFamiliar.setReadOnly(true);
                                                        cboEstadoCheckFamiliar.setValue(1);
                                                        Ext.getCmp('btn_CancelarCheckFamiliar').disable();
                                                        Ext.getCmp('btn_GrabarCheckFamiliar').disable();
                                                        Ext.getCmp('btn_NuevoCheckFamiliar').enable();
                                                        grd_detListaChkFam.enable();
                                                        ds_delitostempFam.removeAll();
                                                        frmCheckFamiliar.getForm().reset();
                                        }
                                    },{
                                        text : 'Grabar',
                                        cls  : 'x-btn-text-icon',
                                        id  : 'btn_GrabarCheckFamiliar',
                                        icon : 'files/images_app/disk.png',
                                        handler : function(){
                                            var imagen = upf_imagendnifam.getValue().trim();
                                            var imagenant = hid_imgactreniecfam.getValue();
                                            var cant_registros = ds_delitostempFam.getCount();
                                            var array_detalle = [];
                                            if(imagenant!='default.jpg' || imagen!=''){
                                                if(frmCheckFamiliar.getForm().isValid() && cant_registros>0){

                                                    for (var i = 0; i < cant_registros; i++) {
                                                        var record = grd_delitosFam.getStore().getAt(i);
                                                        var xcoddel = record.data.coddel;
                                                        var xgrabado = record.data.grabado;
                                                        var item = xcoddel + '$$' + xgrabado;
                                                        array_detalle.push(item);
                                                    }
                                                    var detalle = array_detalle.join('|,|');

                                                    frmCheckFamiliar.getForm().submit({
                                                        url : 'DB/checkfamiliar.php',
                                                        params: {n:5,codsol:cod_sol,codper:cod_per,delitos:detalle,nuevo:NewChkFam},
                                                        waitTitle : 'Check Familiar',
                                                        waitMsg: 'Guardando datos...',
                                                        success:function(form, action){
                                                                    var obj = Ext.util.JSON.decode(action.response.responseText);
                                                                    var est = obj.respuesta.estado;
                                                                    var img = obj.img.imagen;
                                                                    if(est!='3'){
                                                                        Ext.Msg.show({
                                                                            title: 'Check Familiar',
                                                                            msg: obj.confirma.mensaje,
                                                                            buttons: Ext.MessageBox.OK,
                                                                            icon: Ext.MessageBox.INFO
                                                                        });
                                                                        hid_imgactreniecfam.setValue(img);
                                                                    }
                                                                    else{
                                                                        if (cperf!='00001'){
                                                                            upf_imagendnifam.disable();
                                                                            txt_nomfamper.setReadOnly(true);
                                                                            cbo_parentfam.setReadOnly(true);
                                                                            txt_obsdnifam.setReadOnly(true);
                                                                            cbo_refpolfam.setReadOnly(true);
                                                                            cbo_antpolfam.setReadOnly(true);
                                                                            cbo_reqjudfam.setReadOnly(true);
                                                                            cbo_refterfam.setReadOnly(true);
                                                                            cbo_refdrofam.setReadOnly(true);
                                                                            cbo_impsalfam.setReadOnly(true);
                                                                            cbo_invpenfam.setReadOnly(true);
                                                                            cboDelitosFam.setReadOnly(true);
                                                                            cboEstadoCheckFamiliar.setReadOnly(true);
                                                                            txt_invpolfam.setReadOnly(true);
                                                                            txt_invpenfam.setReadOnly(true);
                                                                            txt_defdelfam.setReadOnly(true);
                                                                            txt_recomefam.setReadOnly(true);
                                                                            hid_imgactreniecfam.setValue(img);
                                                                            Ext.getCmp('btn_GrabarCheckFamiliar').disable();
                                                                        }
                                                                        Ext.Msg.show({
                                                                            title: 'Check Familiar',
                                                                            msg: 'Se grabó como Finalizado, Check Familiar ahora es solo de lectura para usuarios que no son Administrador',
                                                                            buttons: Ext.MessageBox.OK,
                                                                            icon: Ext.MessageBox.INFO
                                                                        });

                                                                        ftnactestsol(cod_sol);
                                                                          //Ricardo 14-04-10
                                                                        ds_detsol.proxy= new Ext.data.HttpProxy({
                                                                                url: 'DB/solicitud.php',
                                                                                method : 'POST'
                                                                        });
                                                                        ds_detsol.baseParams={
                                                                                n:8,
                                                                                codsol:cod_sol
                                                                        };
                                                                        ds_detsol.load();

                                                                        
                                                                    }
                                                                        upf_imagendnifam.disable();
                                                                        txt_nomfamper.setReadOnly(true);
                                                                        txt_nomfamper.setValue("");
                                                                        cbo_parentfam.setReadOnly(true);
                                                                        cbo_parentfam.setValue(2);
                                                                        txt_obsdnifam.setReadOnly(true);
                                                                        txt_obsdnifam.setValue("");
                                                                        cbo_refpolfam.setReadOnly(true);
                                                                        cbo_refpolfam.setValue(0);
                                                                        cbo_antpolfam.setReadOnly(true);
                                                                        cbo_antpolfam.setValue(0);
                                                                        cbo_reqjudfam.setReadOnly(true);
                                                                        cbo_reqjudfam.setValue(0);
                                                                        cbo_refterfam.setReadOnly(true);
                                                                        cbo_refterfam.setValue(0);
                                                                        cbo_refdrofam.setReadOnly(true);
                                                                        cbo_refdrofam.setValue(0);
                                                                        cbo_impsalfam.setReadOnly(true);
                                                                        cbo_impsalfam.setValue(0);
                                                                        cbo_invpenfam.setReadOnly(true);
                                                                        cbo_invpenfam.setValue(0);
                                                                        txt_invpolfam.setReadOnly(true);
                                                                        txt_invpolfam.setValue("");
                                                                        txt_invpolfam.disable();
                                                                        txt_invpenfam.setReadOnly(true);
                                                                        txt_invpenfam.setValue("");
                                                                        txt_invpenfam.disable();
                                                                        txt_recomefam.setReadOnly(true);
                                                                        txt_recomefam.setValue("");
                                                                        btnImgCargadafam.disable();
                                                                        cboEstadoCheckFamiliar.setReadOnly(true);
                                                                        cboEstadoCheckFamiliar.setValue(1);
                                                                        Ext.getCmp('btn_CancelarCheckFamiliar').disable();
                                                                        Ext.getCmp('btn_GrabarCheckFamiliar').disable();
                                                                        Ext.getCmp('btn_NuevoCheckFamiliar').enable();
                                                                        grd_detListaChkFam.enable();
                                                                        ds_delitostempFam.removeAll();
                                                                        ds_obtieneListaCheckFamiliar.reload();
                                                                        frmListaCheckFamiliar.getForm().reset();

                                                        },
                                                        failure:function(form, action){
                                                                    if(action.failureType == 'server'){
                                                                        var obj = Ext.util.JSON.decode(action.response.responseText);
                                                                        Ext.Msg.alert('Check Familiar', obj.confirma.mensaje);
                                                                    }
                                                                    else{
                                                                        Ext.Msg.alert('Atenci&oacute;n!', 'El servidor no ha podido ser contactado : ' + action.response.responseText + " ");
                                                                    }
                                                        }
                                                    });



                                                }
                                                else{
                                                    Ext.Msg.show({
                                                        title: 'Error',
                                                        msg: 'Debe ingresar todos los campos obligatorios, recuerde agregar por lo menos un delito o indicar si no los presenta',
                                                        buttons: Ext.MessageBox.OK,
                                                        icon: Ext.MessageBox.ERROR
                                                    });
                                                }
                                            }
                                            else{
                                                Ext.Msg.show({
                                                    title: 'Error',
                                                    msg: 'Debe ingresar la ruta de la imagen del DNI',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.ERROR
                                                });
                                            }
                                        }
                                    }
                                ]
                },{
                        title   : 'Check Domiciliario',
                        id      : 'tbp_checkdomicilio',
                        disabled    : true,
                        frame : true,
                        border : false,
                        autoScroll : true,
                        items : [frmCheckDomiciliario,pnl_imagenes],
                        tbar    : ['Nombre : ',txt_chkdomnomper,'Puesto : ',cboCheckPuestosDom,'-',btn_pdf_checkdomiciliario,'-',{
                                    xtype: 'tbfill'
                                    },
                                    {
                                        text : 'Grabar',
                                        cls  : 'x-btn-text-icon',
                                        id  : 'btn_GrabarCheckDomicilio',
                                        icon : 'files/images_app/disk.png',
                                        handler : function(){
                                            var cant_registros = ds_residtem.getCount();
                                            var array_detalle = [];
                                            if(cant_registros>0){
                                                if(frmCheckDomiciliario.getForm().isValid()){
                                                    Ext.Msg.confirm('Confirmación','¿Confirma que desea grabar el Check Domiciliario?', function GrabaSolicitud(btn){
                                                        if (btn == 'yes') {
                                                            //arma información del detalle de residentes
                                                            for (var i = 0; i < cant_registros; i++) {
                                                                var record = grd_residentes.getStore().getAt(i);
                                                                var xcodsol = cod_sol;
                                                                var xcodper = cod_per;
                                                                var xcodchk = hid_checkDom.getValue();//record.data.codpue;
                                                                var xcodres = record.data.codres;
                                                                var item = xcodsol + '$$' + xcodper + '$$' + xcodchk + '$$' + xcodres;
                                                                array_detalle.push(item);
                                                            }
                                                            //arma datos con informacion del check domiciliario
                                                            var chkdom = hid_checkDom.getValue();
                                                            var codper = cod_per;
                                                            var codsol = cod_sol;
                                                            //Direccion
                                                            var codvia = cbo_tipvia.getValue();
                                                            var nomvia = Ext.util.Format.trim(txt_nomvia.getValue());
                                                            var numvia = Ext.util.Format.trim(txt_numvia.getValue());
                                                            var urb = Ext.util.Format.trim(txt_urb.getValue());
                                                            var gdpto = cbo_depto.getValue();
                                                            var gprov = cbo_prov.getValue();
                                                            var gdist = cbo_dist.getValue();
                                                            //Domiciliado
                                                            var inddom = cbo_domiciliado.getValue();
                                                            var entrev = Ext.util.Format.trim(txt_persentre.getValue());
                                                            var parent = cbo_parent.getValue();
                                                            var otrpar = Ext.util.Format.trim(txt_otropar.getValue());
                                                            //Informacion Check
                                                            var anores = Ext.util.Format.trim(txt_tiemanio.getValue());
                                                            var mesres = Ext.util.Format.trim(txt_tiemmeso.getValue());
                                                            var condviv = cbo_vivienda.getValue();
                                                            var tipviv = cbo_tipvivienda.getValue();
                                                            var otrtipviv = Ext.util.Format.trim(txt_otrotipviv.getValue());
                                                            var numpis = txt_numpis.getValue();
                                                            var pisres = txt_pisres.getValue();
                                                            var tipmat = cbo_tipmatcon.getValue();
                                                            var otrtipmat = Ext.util.Format.trim(txt_otrmatcon.getValue());
                                                            var estcon = cbo_estconst.getValue();
                                                            var arever = cbo_areaverde.getValue();
                                                            var colfac = Ext.util.Format.trim(txt_colfac.getValue());
                                                            var pueing = txt_puertas.getValue();
                                                            var vent = txt_ventanas.getValue();
                                                            var tipmatpue = Ext.util.Format.trim(txt_tipmatpue.getValue());
                                                            var rejpro = cbo_rejprot.getValue();
                                                            var accveh = cbo_pueaccveh.getValue();
                                                            var obsdom = Ext.util.Format.trim(txt_obsinmu.getValue());
                                                            //Zona
                                                            var tipzon = cbo_zonificacion.getValue();
                                                            var otrzon = Ext.util.Format.trim(txt_otrzonif.getValue());
                                                            var zonrie = cbo_zonariesgo.getValue();
                                                            //Conclusion
                                                            var conclu = cbo_conclusion.getValue();
                                                            var estchkdom = cboEstadoCheckDomicilio.getValue();
                                                            var obschkdom = Ext.util.Format.trim(txt_obsCheckDom.getValue());
                                                            //Residentes
                                                            var detalleres = array_detalle.join('|,|');
                                                            Ext.Ajax.request({
                                                                url : 'DB/checkdomicilio.php',
                                                                params : {
                                                                    n   : 16,
                                                                    codchkdom : chkdom,
                                                                    codper : codper,
                                                                    codsol : codsol,
                                                                    coddpto : gdpto,
                                                                    codpro : gprov,
                                                                    coddist : gdist,
                                                                    codtipvia : codvia,
                                                                    nomviadom : nomvia,
                                                                    numdom : numvia,
                                                                    urbdom : urb,
                                                                    domici : inddom,
                                                                    perent : entrev,
                                                                    codpar : parent,
                                                                    otroparent : otrpar,
                                                                    anoresdom : anores ,
                                                                    mesresdom : mesres,
                                                                    codviv : condviv,
                                                                    codtipviv : tipviv,
                                                                    otrtipviv : otrtipviv,
                                                                    numpis : numpis,
                                                                    pisres : pisres,
                                                                    codtipmat : tipmat,
                                                                    otrmatcon : otrtipmat,
                                                                    codestcon : estcon,
                                                                    arever : arever,
                                                                    colfac : colfac,
                                                                    numpue : pueing,
                                                                    numven : vent,
                                                                    tipmat : tipmatpue,
                                                                    rejpro : rejpro,
                                                                    pueaccveh : accveh,
                                                                    obsinmu : obsdom,
                                                                    codzonif : tipzon,
                                                                    otrzonif : otrzon,
                                                                    codzonrie : zonrie,
                                                                    codcon : conclu,
                                                                    obscon : obschkdom,
                                                                    codestchk : estchkdom,
                                                                    detalle : detalleres
                                                                },
                                                                callback : function(opt,success,response){
                                                                    if (success) {
                                                                        var responseData = Ext.util.JSON.decode(response.responseText);
                                                                        var error = responseData.respuesta.error;
                                                                        var mensaje = responseData.respuesta.mensaje;
                                                                        var est = responseData.respuesta.estado;
                                                                        if (error==0){
                                                                            if(est!='3'){
                                                                                Ext.Msg.show({
                                                                                    title: 'Check Domiciliario',
                                                                                    msg: mensaje,
                                                                                    buttons: Ext.MessageBox.OK,
                                                                                    icon: Ext.MessageBox.INFO
                                                                                });
                                                                            }
                                                                        else {
                                                                            if(cperf!='00001'){
                                                                                cbo_tipvia.setReadOnly(true);
                                                                                txt_nomvia.setReadOnly(true);
                                                                                txt_numvia.setReadOnly(true);
                                                                                txt_urb.setReadOnly(true);
                                                                                cbo_prov.setReadOnly(true);
                                                                                cbo_depto.setReadOnly(true);
                                                                                cbo_dist.setReadOnly(true);
                                                                                cbo_domiciliado.setReadOnly(true);
                                                                                txt_persentre.setReadOnly(true);
                                                                                cbo_parent.setReadOnly(true);
                                                                                txt_otropar.setReadOnly(true);
                                                                                txt_tiemanio.setReadOnly(true);
                                                                                txt_tiemmeso.setReadOnly(true);
                                                                                cbo_vivienda.setReadOnly(true);
                                                                                cbo_tipvivienda.setReadOnly(true);
                                                                                txt_otrotipviv.setReadOnly(true);
                                                                                txt_numpis.setReadOnly(true);
                                                                                txt_pisres.setReadOnly(true);
                                                                                cbo_tipmatcon.setReadOnly(true);
                                                                                txt_otrmatcon.setReadOnly(true);
                                                                                cbo_estconst.setReadOnly(true);
                                                                                cbo_areaverde.setReadOnly(true);
                                                                                txt_colfac.setReadOnly(true);
                                                                                txt_puertas.setReadOnly(true);
                                                                                txt_ventanas.setReadOnly(true);
                                                                                txt_tipmatpue.setReadOnly(true);
                                                                                cbo_rejprot.setReadOnly(true);
                                                                                cbo_pueaccveh.setReadOnly(true);
                                                                                txt_obsinmu.setReadOnly(true);
                                                                                cbo_residentes.setReadOnly(true);
                                                                                cbo_zonificacion.setReadOnly(true);
                                                                                cbo_zonariesgo.setReadOnly(true);
                                                                                cbo_conclusion.setReadOnly(true);
                                                                                cboEstadoCheckDomicilio.setReadOnly(true);
                                                                                txt_obsCheckDom.setReadOnly(true);
                                                                                //imagenes
                                                                                upf_imgdom1.disable();
                                                                                upf_imgdom2.disable();
                                                                                upf_imgmapa.disable();
                                                                                cbo_tipimg1.setReadOnly(true);
                                                                                cbo_tipimg2.setReadOnly(true);
                                                                                cbo_imgpama.setReadOnly(true);
                                                                                Ext.getCmp('btn_GrabarCheckDomicilio').disable();
                                                                            }
                                                                            Ext.Msg.show({
                                                                                title: 'Check Domiciliario',
                                                                                msg: 'Se grabó como Finalizado, Check Domiciliario ahora es solo de lectura para usuarios que no son Administrador',
                                                                                buttons: Ext.MessageBox.OK,
                                                                                icon: Ext.MessageBox.INFO
                                                                            });

                                                                        ftnactestsol(cod_sol);
                                                                        //Ricardo 14-04-10
                                                                        ds_detsol.proxy= new Ext.data.HttpProxy({
                                                                                url: 'DB/solicitud.php',
                                                                                method : 'POST'
                                                                        });
                                                                        ds_detsol.baseParams={
                                                                                n:8,
                                                                                codsol:cod_sol
                                                                        };
                                                                        ds_detsol.load();






                                                                        }
                                                                        }
                                                                        else {
                                                                            Ext.Msg.show({
                                                                                    title: 'Check Domiciliario',
                                                                                    msg: mensaje,
                                                                                    buttons: Ext.MessageBox.OK,
                                                                                    icon: Ext.MessageBox.ERROR
                                                                                });
                                                                        }
                                                                    }
                                                                    else {
                                                                       Ext.Msg.show({title: 'Error',
                                                                                 msg: 'Sin respuesta del servidor, comuniquese con Sistemas',
                                                                                 buttons: Ext.MessageBox.OK,
                                                                                 icon: Ext.MessageBox.ERROR
                                                                             });
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                                else{
                                                    Ext.Msg.alert('Advertencia!','Faltan Datos obligatorios de la solicitud');
                                                }
                                            }else{
                                                Ext.Msg.alert('Advertencia!','No se han agregado residentes');
                                            }
                                        }
                                    }]
                },{
                        title   : 'Check Laboral',
                        id      : 'tbp_checklaboral',
                        disabled    : true,
                        frame : true,
                        border : false,
                        autoScroll : true,
                        items : [frmListaCheckLaboral,frmDatosCheckLaboral,frmListaPreguntas,frmDatosCheckLaboral2],
                        tbar    : ['Nombre : ',txt_chklabnomper,'Puesto : ',cboCheckPuestosLab,'-',btn_pdf_checklaboral,'-',{
                                    xtype: 'tbfill'
                                    },
                                    {
                                        text : 'Nuevo',
                                        cls  : 'x-btn-text-icon',
                                        id  : 'btn_NuevoCheckLaboral',
                                        icon : 'files/images_app/document-share.png',
                                        handler : function(){
                                                        NewChkLab = 'si';
                                                        txt_nomperref.setReadOnly(false);
                                                        txt_nomperref.setValue("");
                                                        txt_nomemp.setReadOnly(false);
                                                        txt_nomemp.setValue("");
                                                        txt_telemp.setReadOnly(false);
                                                        txt_telemp.setValue("");
                                                        txt_perlab.setReadOnly(false);
                                                        txt_perlab.setValue("");
                                                        txt_motces.setReadOnly(false);
                                                        txt_motces.setValue("");
                                                        txt_percont.setReadOnly(false);
                                                        txt_percont.setValue("");
                                                        txt_carpercont.setReadOnly(false);
                                                        txt_carpercont.setValue("");
                                                        dp_fecent.setReadOnly(false);
                                                        dp_fecent.setValue("");
                                                        txt_noment.setReadOnly(false);
                                                        txt_noment.setValue("");
                                                        txt_obsent.setReadOnly(false);
                                                        txt_obsent.setValue("");
                                                        cboEstadoCheckLaboral.setReadOnly(false);
                                                        cboEstadoCheckLaboral.setValue(1);
                                                        cbo_conclusionlab.setReadOnly(false);
                                                        cbo_conclusionlab.setValue(1);
                                                        Ext.getCmp('btn_CancelarCheckLaboral').enable();
                                                        Ext.getCmp('btn_GrabarCheckLaboral').enable();
                                                        Ext.getCmp('btn_NuevoCheckLaboral').disable();
                                                        grd_detListaChkLab.disable();
                                                        ds_preguntas.load({params: {n:5, codcue:1, codsol:cod_sol, codper:cod_per}})
                                                        txt_nomperref.focus(true);
                                        }
                                    },
                                    {
                                        text : 'Cancelar',
                                        cls  : 'x-btn-text-icon',
                                        id  : 'btn_CancelarCheckLaboral',
                                        disabled : true,
                                        icon : 'files/images_app/delete.gif',
                                        handler : function(){
                                                        txt_nomperref.setReadOnly(true);
                                                        txt_nomperref.setValue("");
                                                        txt_nomemp.setReadOnly(true);
                                                        txt_nomemp.setValue("");
                                                        txt_telemp.setReadOnly(true);
                                                        txt_telemp.setValue("");
                                                        txt_perlab.setReadOnly(true);
                                                        txt_perlab.setValue("");
                                                        txt_motces.setReadOnly(true);
                                                        txt_motces.setValue("");
                                                        txt_percont.setReadOnly(true);
                                                        txt_percont.setValue("");
                                                        txt_carpercont.setReadOnly(true);
                                                        txt_carpercont.setValue("");
                                                        dp_fecent.setReadOnly(true);
                                                        dp_fecent.setValue("");
                                                        txt_noment.setReadOnly(true);
                                                        txt_noment.setValue("");
                                                        txt_obsent.setReadOnly(true);
                                                        txt_obsent.setValue("");
                                                        cboEstadoCheckLaboral.setReadOnly(true);
                                                        cboEstadoCheckLaboral.setValue(1);
                                                        cbo_conclusionlab.setReadOnly(true);
                                                        cbo_conclusionlab.setValue(1);
                                                        Ext.getCmp('btn_CancelarCheckLaboral').disable();
                                                        Ext.getCmp('btn_GrabarCheckLaboral').disable();
                                                        Ext.getCmp('btn_NuevoCheckLaboral').enable();
                                                        grd_detListaChkLab.enable();
                                                        ds_preguntas.removeAll();
                                        }
                                    },
                                    {
                                        text : 'Grabar',
                                        cls  : 'x-btn-text-icon',
                                        id  : 'btn_GrabarCheckLaboral',
                                        disabled : true,
                                        icon : 'files/images_app/disk.png',
                                        handler : function(){
                                            var cant_preguntas = ds_preguntas.getCount();
                                            var array_respuestas = [];
                                            if (frmDatosCheckLaboral.getForm().isValid() && frmDatosCheckLaboral2.getForm().isValid()){
                                                Ext.Msg.confirm('Confirmación','¿Confirma que desea grabar el Check Laboral?', function GrabaCheckLaboral(btn){
                                                    if (btn == 'yes') {
                                                    //arma información del detalle
                                                        for (var i = 0; i < cant_preguntas; i++) {
                                                            var record = grd_preguntas.getStore().getAt(i);
                                                            var xcodsol = record.data.codsol;
                                                            var xcodper = record.data.codper;
                                                            var xcodchklab = record.data.codchklab;
                                                            var xcodcue = record.data.codcue;
                                                            var xcodpre = record.data.codpre;
                                                            var xrespre = record.data.respre;
                                                            var item = xcodsol + '$$' + xcodper + '$$' + xcodchklab + '$$' + xcodcue + '$$' + xcodpre + '$$' + xrespre;
                                                            array_respuestas.push(item);
                                                        }
                                                        var codsol = cod_sol;
                                                        var codper = cod_per;
                                                        var codchklab = hid_codchklab.getValue();
                                                        var nuevo = NewChkLab;
                                                        var nomperref = txt_nomperref.getValue();
                                                        var nomemp = txt_nomemp.getValue();
                                                        var telemp = txt_telemp.getValue();
                                                        var perlab = txt_perlab.getValue();
                                                        var motces = txt_motces.getValue();
                                                        var percont = txt_percont.getValue();
                                                        var carpercont = txt_carpercont.getValue();
                                                        var fectem = dp_fecent.getValue()
                                                        var fecent = Ext.util.Format.trim(fectem.format('Y-m-d'))+' 00:00:00';
                                                        var noment = txt_noment.getValue();
                                                        var codcon = cbo_conclusionlab.getValue();
                                                        var obsent = txt_obsent.getValue();
                                                        var codestchk = cboEstadoCheckLaboral.getValue();
                                                        var detrespuestas = array_respuestas.join('|,|');
                                                        Ext.Ajax.request({
                                                            url : 'DB/checklaboral.php',
                                                            params : {
                                                                n   : 6,
                                                                nuevo : nuevo,
                                                                codchklab : codchklab,
                                                                codper : codper,
                                                                codsol : codsol,
                                                                nomperref : nomperref,
                                                                nomemp : nomemp,
                                                                telemp : telemp,
                                                                perlab : perlab,
                                                                motces : motces,
                                                                percont : percont,
                                                                carpercont : carpercont,
                                                                fecent : fecent,
                                                                noment : noment,
                                                                codcon : codcon,
                                                                obsent : obsent,
                                                                codestchk : codestchk,
                                                                cueresp : Cuestionario,
                                                                respuestas : detrespuestas
                                                            },
                                                            callback : function(opt,success,response){
                                                                if (success) {
                                                                        var responseData = Ext.util.JSON.decode(response.responseText);
                                                                        var error = responseData.respuesta.error;
                                                                        var mensaje = responseData.respuesta.mensaje;
                                                                        if (error==0){
                                                                            frmDatosCheckLaboral.getForm().reset();
                                                                            frmDatosCheckLaboral2.getForm().reset();
                                                                            txt_nomperref.setReadOnly(true);
                                                                            txt_nomperref.setValue("");
                                                                            txt_nomemp.setReadOnly(true);
                                                                            txt_nomemp.setValue("");
                                                                            txt_telemp.setReadOnly(true);
                                                                            txt_telemp.setValue("");
                                                                            txt_perlab.setReadOnly(true);
                                                                            txt_perlab.setValue("");
                                                                            txt_motces.setReadOnly(true);
                                                                            txt_motces.setValue("");
                                                                            txt_percont.setReadOnly(true);
                                                                            txt_percont.setValue("");
                                                                            txt_carpercont.setReadOnly(true);
                                                                            txt_carpercont.setValue("");
                                                                            dp_fecent.setReadOnly(true);
                                                                            dp_fecent.setValue("");
                                                                            txt_noment.setReadOnly(true);
                                                                            txt_noment.setValue("");
                                                                            txt_obsent.setReadOnly(true);
                                                                            txt_obsent.setValue("");
                                                                            cboEstadoCheckLaboral.setReadOnly(true);
                                                                            cboEstadoCheckLaboral.setValue(1);
                                                                            cbo_conclusionlab.setReadOnly(true);
                                                                            cbo_conclusionlab.setValue(1);
                                                                            Ext.getCmp('btn_CancelarCheckLaboral').disable();
                                                                            Ext.getCmp('btn_GrabarCheckLaboral').disable();
                                                                            Ext.getCmp('btn_NuevoCheckLaboral').enable();
                                                                            grd_detListaChkLab.enable();
                                                                            ds_obtieneListaCheckLaboral.load();
                                                                            ds_preguntas.removeAll();
                                                                            NewChkLab = 'si';
                                                                        }
                                                                        Ext.Msg.show({title: 'Aviso',
                                                                                 msg: mensaje,
                                                                                 buttons: Ext.MessageBox.OK,
                                                                                 icon: Ext.MessageBox.INFO
                                                                             });
                                                                        ftnactestsol(cod_sol);
                                                                        //Ricardo 14-04-10
                                                                        ds_detsol.proxy= new Ext.data.HttpProxy({
                                                                                url: 'DB/solicitud.php',
                                                                                method : 'POST'
                                                                        });
                                                                        ds_detsol.baseParams={
                                                                                n:8,
                                                                                codsol:cod_sol
                                                                        };
                                                                        ds_detsol.load();





                                                                    } else {
                                                                       Ext.Msg.show({title: 'Error',
                                                                                 msg: 'Sin respuesta del servidor, comuniquese con Sistemas',
                                                                                 buttons: Ext.MessageBox.OK,
                                                                                 icon: Ext.MessageBox.ERROR
                                                                             });
                                                                    }
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                            else{
                                                Ext.Msg.show({title: 'Advertencia',
                                                     msg: 'Faltan Datos obligatorios en el Check Laboral',
                                                     buttons: Ext.MessageBox.OK,
                                                     icon: Ext.MessageBox.INFO
                                                 });
                                            }
                                        }
                                    }]
                }]
            });


            //DataStore para obtener datos grabados del CheckService
            var ds_obtieneCheckService = new Ext.data.Store({
                                reader: new Ext.data.JsonReader({
                                    root            : 'chechservicepersona',
                                    totalProperty	: 'total',
                                    id              : 'codchkser'
                                    },
                                    [{name: 'codchkser', mapping: 'codchkser'},
                                    {name: 'imgreniec', mapping: 'imgreniec'},
                                    {name: 'obsimgreniec', mapping: 'obsimgreniec'},
                                    {name: 'indrefpol', mapping: 'indrefpol'},
                                    {name: 'refpolchk', mapping: 'refpolchk'},
                                    {name: 'indantpol', mapping: 'indantpol'},
                                    {name: 'indreqjud', mapping: 'indreqjud'},
                                    {name: 'indrefter', mapping: 'indrefter'},
                                    {name: 'indrefdro', mapping: 'indrefdro'},
                                    {name: 'indimpsalpai', mapping: 'indimpsalpai'},
                                    {name: 'indinvpen', mapping: 'indinvpen'},
                                    {name: 'invpenchk', mapping: 'invpenchk'},
                                    {name: 'recchk', mapping: 'recchk'},
                                    {name: 'coddel', mapping: 'coddel'},
                                    {name: 'codestchk', mapping: 'codestchk'}
                                    ]),
                                proxy: new Ext.data.HttpProxy({
                                    url: 'DB/checkservice.php',
                                    method : 'POST'
                                }),
                                baseParams:{n:3, codsol:cod_sol, codper:cod_per},
                                autoLoad: false,
                                listeners:{
                                    load : function(store){
                                            var numchecks=store.getCount();
                                            for (var i = 0; i < numchecks; i++){
                                                var lchkser = store.getAt(i).data.codchkser;
                                                hid_codchkser.setValue(lchkser);
                                                var imgren=store.getAt(i).data.imgreniec;
                                                hid_imgactreniec.setValue(imgren);
                                                var obsdni=store.getAt(i).data.obsimgreniec;
                                                txt_obsdni.setValue(obsdni);
                                                var refpol=store.getAt(i).data.indrefpol;
                                                cbo_refpol.setValue(refpol);
                                                var antpol=store.getAt(i).data.indantpol;
                                                cbo_antpol.setValue(antpol);
                                                var reqjud=store.getAt(i).data.indreqjud;
                                                cbo_reqjud.setValue(reqjud);
                                                var refter=store.getAt(i).data.indrefter;
                                                cbo_refter.setValue(refter);
                                                var refdro=store.getAt(i).data.indrefdro;
                                                cbo_refdro.setValue(refdro);
                                                var impsal=store.getAt(i).data.indimpsalpai;
                                                cbo_impsal.setValue(impsal);
                                                var invpen=store.getAt(i).data.indinvpen;
                                                cbo_invpen.setValue(invpen);
                                                if(refpol=='1' || antpol=='1' || reqjud=='1' || refter=='1' || refdro=='1' || impsal=='1'){
                                                    var txtinvpol=store.getAt(i).data.refpolchk;
                                                    txt_invpol.setValue(txtinvpol);
                                                    txt_invpol.enable();
                                                    cboDelitos.enable();
                                                }
                                                if(invpen=='1'){
                                                    var txtinvpen=store.getAt(i).data.invpenchk;
                                                    txt_invpen.setValue(txtinvpen);
                                                    txt_invpen.enable();
                                                    cboDelitos.enable();
                                                }

                                                var ds_delitosgrabados = new Ext.data.Store({
                                                    reader  : new Ext.data.JsonReader({
                                                                    fields  : ['coddel', 'nomdel','desdel','grabado'],
                                                                    root    : 'delitosgrab',
                                                                    id      : 'coddel'
                                                            }),
                                                    proxy: new Ext.data.HttpProxy({
                                                                    url: 'DB/checkservice.php'
                                                            }),
                                                    baseParams:{n:10, codchkser:lchkser},
                                                    autoLoad: false,
                                                    listeners : {
                                                        load : function(store){
                                                                    var deliregist=store.getCount();
                                                                    //alert('en el store vale'+resiregist);
                                                                    for (var j = 0; j < deliregist; j++) {
                                                                        var r = new newDelito({
                                                                           coddel       : ds_delitosgrabados.getAt(j).data.coddel,
                                                                           nomdel       : ds_delitosgrabados.getAt(j).data.nomdel,
                                                                           desdel       : ds_delitosgrabados.getAt(j).data.desdel,
                                                                           grabado       : ds_delitosgrabados.getAt(j).data.grabado
                                                                        });
                                                                        //alert("Un delito");
                                                                        //alert(p.get('item'));
                                                                        ds_delitostemp.insert(ds_delitostemp.getCount(), r);
                                                                    }

                                                                }
                                                    }
                                                });
                                                ds_delitosgrabados.load();

                                                //var delito=store.getAt(i).data.coddel;
                                                //cboDelitos.setValue(delito);
//                                                if(delito!=null){
//                                                    var desdel = ds_delitos.getById(delito);
//                                                    txt_defdel.setValue(desdel.data.desdel);
//                                                }
                                                var recome=store.getAt(i).data.recchk;
                                                txt_recome.setValue(recome);
                                                var estado =store.getAt(i).data.codestchk;
                                                cboEstadoCheckService.setValue(estado);
                                                if(estado=='3' || cperf=='3'){
                                                     if(cperf!='00001'){
                                                        upf_imagendni.disable();
                                                        txt_obsdni.setReadOnly(true);
                                                        cbo_refpol.setReadOnly(true);
                                                        cbo_antpol.setReadOnly(true);
                                                        cbo_reqjud.setReadOnly(true);
                                                        cbo_refter.setReadOnly(true);
                                                        cbo_refdro.setReadOnly(true);
                                                        cbo_impsal.setReadOnly(true);
                                                        cbo_invpen.setReadOnly(true);
                                                        cboDelitos.setReadOnly(true);
                                                        cboEstadoCheckService.setReadOnly(true);
                                                        txt_invpol.setReadOnly(true);
                                                        txt_invpen.setReadOnly(true);
                                                        txt_defdel.setReadOnly(true);
                                                        txt_recome.setReadOnly(true);
                                                        Ext.getCmp('btn_GrabarCheckService').disable();
                                                     }
                                                }
                                            }
                                    }
                                }
            });



            //DataStore para obtener datos grabados del CheckService
            var ds_obtieneCheckDomici = new Ext.data.Store({
                                reader: new Ext.data.JsonReader({
                                    root            : 'checkdomiciliopersona',
                                    totalProperty	: 'total',
                                    id              : 'codchkdom'
                                    },
                                    [{name: 'codchkdom', mapping: 'codchkdom'},
                                    {name: 'coddpto', mapping: 'coddpto'},
                                    {name: 'codpro', mapping: 'codpro'},
                                    {name: 'coddist', mapping: 'coddist'},
                                    {name: 'codtipvia', mapping: 'codtipvia'},
                                    {name: 'nomviadom', mapping: 'nomviadom'},
                                    {name: 'numdom', mapping: 'numdom'},
                                    {name: 'urbdom', mapping: 'urbdom'},
                                    {name: 'domici', mapping: 'domici'},
                                    {name: 'perent', mapping: 'perent'},
                                    {name: 'codpar', mapping: 'codpar'},
                                    {name: 'otroparent', mapping: 'otroparent'},
                                    {name: 'anoresdom', mapping: 'anoresdom'},
                                    {name: 'mesresdom', mapping: 'mesresdom'},
                                    {name: 'codviv', mapping: 'codviv'},
                                    {name: 'codtipviv', mapping: 'codtipviv'},
                                    {name: 'otrtipviv', mapping: 'otrtipviv'},
                                    {name: 'numpis', mapping: 'numpis'},
                                    {name: 'pisres', mapping: 'pisres'},
                                    {name: 'codtipmat', mapping: 'codtipmat'},
                                    {name: 'otrmatcon', mapping: 'otrmatcon'},
                                    {name: 'codestcon', mapping: 'codestcon'},
                                    {name: 'arever', mapping: 'arever'},
                                    {name: 'colfac', mapping: 'colfac'},
                                    {name: 'numpue', mapping: 'numpue'},
                                    {name: 'numven', mapping: 'numven'},
                                    {name: 'tipmat', mapping: 'tipmat'},
                                    {name: 'rejpro', mapping: 'rejpro'},
                                    {name: 'pueaccveh', mapping: 'pueaccveh'},
                                    {name: 'obsinmu', mapping: 'obsinmu'},
                                    {name: 'codzonif', mapping: 'codzonif'},
                                    {name: 'otrzonif', mapping: 'otrzonif'},
                                    {name: 'codzonrie', mapping: 'codzonrie'},
                                    {name: 'codcon', mapping: 'codcon'},
                                    {name: 'obscon', mapping: 'obscon'},
                                    {name: 'codestchk', mapping: 'codestchk'}
                                    ]),
                                proxy: new Ext.data.HttpProxy({
                                    url: 'DB/checkdomicilio.php',
                                    method : 'POST'
                                }),
                                baseParams:{n:15, codsol:cod_sol, codper:cod_per},
                                autoLoad: false,
                                listeners:{
                                    load : function(store){
                                            var numchecks=store.getCount();
                                            for (var i = 0; i < numchecks; i++){
                                                var lchkdom = store.getAt(i).data.codchkdom;
                                                hid_checkDom.setValue(lchkdom);
                                                //alert(lchkdom);
                                                var lvia = store.getAt(i).data.codtipvia;
                                                cbo_tipvia.setValue(lvia);
                                                var lnomvia = store.getAt(i).data.nomviadom;
                                                txt_nomvia.setValue(lnomvia);
                                                var lnumvia = store.getAt(i).data.numdom;
                                                txt_numvia.setValue(lnumvia);
                                                var lurb = store.getAt(i).data.urbdom;
                                                txt_urb.setValue(lurb);
                                                var ldept = store.getAt(i).data.coddpto;
                                                cbo_depto.setValue(ldept);
                                                //cbo_prov.clearValue();
                                                cbo_prov.store.load({
                                                    params : {
                                                        depa : cbo_depto.getValue()
                                                    }
                                                });
                                                cbo_prov.enable();
                                                var lprov = store.getAt(i).data.codpro;
                                                cbo_prov.setValue(lprov);
                                                //cbo_dist.clearValue();
                                                cbo_dist.store.load({
                                                    params : {
                                                        depa : cbo_depto.getValue(),
                                                        prov : cbo_prov.getValue()
                                                    }
                                                });
                                                cbo_dist.enable();
                                                var ldist = store.getAt(i).data.coddist;
                                                cbo_dist.setValue(ldist);
                                                var ldomic = store.getAt(i).data.domici;
                                                cbo_domiciliado.setValue(ldomic);
                                                var lentre = store.getAt(i).data.perent;
                                                txt_persentre.setValue(lentre);
                                                var lcodpar = store.getAt(i).data.codpar;
                                                cbo_parent.setValue(lcodpar);
                                                var lotrpar = store.getAt(i).data.otroparent;
                                                txt_otropar.setValue(lotrpar);
                                                var lanores = store.getAt(i).data.anoresdom;
                                                txt_tiemanio.setValue(lanores);
                                                var lmesres = store.getAt(i).data.mesresdom;
                                                txt_tiemmeso.setValue(lmesres);
                                                var lcodviv = store.getAt(i).data.codviv;
                                                cbo_vivienda.setValue(lcodviv);
                                                var ltipviv = store.getAt(i).data.codtipviv;
                                                cbo_tipvivienda.setValue(ltipviv);
                                                var lotipviv = store.getAt(i).data.otrtipviv
                                                txt_otrotipviv.setValue(lotipviv);
                                                var lnumpi = store.getAt(i).data.numpis;
                                                txt_numpis.setValue(lnumpi);
                                                var lpisres = store.getAt(i).data.pisres;
                                                txt_pisres.setValue(lpisres)
                                                var ltipmat = store.getAt(i).data.codtipmat;
                                                cbo_tipmatcon.setValue(ltipmat);
                                                var lotipmat = store.getAt(i).data.otrmatcon;
                                                txt_otrmatcon.setValue(lotipmat);
                                                var lestcon = store.getAt(i).data.codestcon;
                                                cbo_estconst.setValue(lestcon);
                                                var larever = store.getAt(i).data.arever;
                                                cbo_areaverde.setValue(larever);
                                                var lcolfac = store.getAt(i).data.colfac;
                                                txt_colfac.setValue(lcolfac);
                                                var lnumpue = store.getAt(i).data.numpue;
                                                txt_puertas.setValue(lnumpue);
                                                var lnumven = store.getAt(i).data.numven;
                                                txt_ventanas.setValue(lnumven);
                                                var ltipmatpue = store.getAt(i).data.tipmat;
                                                txt_tipmatpue.setValue(ltipmatpue);
                                                var lrejpro = store.getAt(i).data.rejpro;
                                                cbo_rejprot.setValue(lrejpro);
                                                var laccveh = store.getAt(i).data.pueaccveh;
                                                cbo_pueaccveh.setValue(laccveh);
                                                var lobsinm = store.getAt(i).data.obsinmu;
                                                txt_obsinmu.setValue(lobsinm);
                                                var lcodzonif = store.getAt(i).data.codzonif;
                                                cbo_zonificacion.setValue(lcodzonif);
                                                var lozonif = store.getAt(i).data.otrzonif;
                                                txt_otrzonif.setValue(lozonif);
                                                var lzonrie = store.getAt(i).data.codzonrie;
                                                cbo_zonariesgo.setValue(lzonrie);
                                                var lcodcon = store.getAt(i).data.codcon;
                                                cbo_conclusion.setValue(lcodcon);
                                                var lobscon = store.getAt(i).data.obscon;
                                                txt_obsCheckDom.setValue(lobscon);
                                                var lestchk = store.getAt(i).data.codestchk;
                                                cboEstadoCheckDomicilio.setValue(lestchk);
                                                //ResidentesGrabados

                                                var ds_residentesgrabados = new Ext.data.Store({
                                                    reader  : new Ext.data.JsonReader({
                                                                    fields  : ['codres', 'desres'],
                                                                    root    : 'residentesdom',
                                                                    id      : 'codres'
                                                            }),
                                                    proxy: new Ext.data.HttpProxy({
                                                                    url: 'DB/checkdomicilio.php'
                                                            }),
                                                    baseParams:{n:0, codchkdom:lchkdom},
                                                    autoLoad: false,
                                                    listeners : {
                                                        load : function(store){
                                                                    var resiregist=store.getCount();
                                                                    //alert('en el store vale'+resiregist);
                                                                    for (var j = 0; j < resiregist; j++) {
                                                                        var r = new newResidente({
                                                                           codres       : ds_residentesgrabados.getAt(j).data.codres,
                                                                           desres       : ds_residentesgrabados.getAt(j).data.desres
                                                                        });
                                                                        //alert(p.get('item'));
                                                                        ds_residtem.insert(ds_residtem.getCount(), r);
                                                                    }
                                                                }
                                                    }
                                                });
                                                ds_residentesgrabados.load();

                                                var ds_imagenesdomicilio = new Ext.data.Store({
                                                    reader : new Ext.data.JsonReader({
                                                        fields : ['codimgdom','codtipimg','nomimgdom','numimgdom'],
                                                        root    : 'imagenesdomicilio',
                                                        id              : 'codimgdom'
                                                    }),
                                                    proxy: new Ext.data.HttpProxy({
                                                                        url: 'DB/checkdomicilio.php'
                                                                    }),
                                                    baseParams:{n:18, codsol:cod_sol, codper:cod_per},
                                                    autoLoad: false,
                                                    listeners:{
                                                        load : function(store){
                                                            var numimages=store.getCount();

                                                            var img1 = ds_imagenesdomicilio.getAt(0).data.nomimgdom;
                                                            var tip1 = ds_imagenesdomicilio.getAt(0).data.codtipimg;
                                                            var img2 = ds_imagenesdomicilio.getAt(1).data.nomimgdom;
                                                            var tip2 = ds_imagenesdomicilio.getAt(1).data.codtipimg;
                                                            var img3 = ds_imagenesdomicilio.getAt(2).data.nomimgdom;
                                                            var tip3 = ds_imagenesdomicilio.getAt(2).data.codtipimg;
                                                            hid_imgdom1act.setValue(img1);
                                                            cbo_tipimg1.setValue(tip1);
                                                            hid_imgdom2act.setValue(img2);
                                                            cbo_tipimg2.setValue(tip2);
                                                            hid_imgmapact.setValue(img3);
                                                            cbo_imgpama.setValue(tip3);
                                                            //alert(ds_imagenesdomicilio.getAt(0).data.nomimgdom);

                                                        }
                                                    }
                                                });
                                                ds_imagenesdomicilio.load();

                                                if(lestchk=='3' || cperf=='3'){
                                                    if(cperf!='00001'){
                                                        cbo_tipvia.setReadOnly(true);
                                                        txt_nomvia.setReadOnly(true);
                                                        txt_numvia.setReadOnly(true);
                                                        txt_urb.setReadOnly(true);
                                                        cbo_prov.setReadOnly(true);
                                                        cbo_depto.setReadOnly(true);
                                                        cbo_dist.setReadOnly(true);
                                                        cbo_domiciliado.setReadOnly(true);
                                                        txt_persentre.setReadOnly(true);
                                                        cbo_parent.setReadOnly(true);
                                                        txt_otropar.setReadOnly(true);
                                                        txt_tiemanio.setReadOnly(true);
                                                        txt_tiemmeso.setReadOnly(true);
                                                        cbo_vivienda.setReadOnly(true);
                                                        cbo_tipvivienda.setReadOnly(true);
                                                        txt_otrotipviv.setReadOnly(true);
                                                        txt_numpis.setReadOnly(true);
                                                        txt_pisres.setReadOnly(true);
                                                        cbo_tipmatcon.setReadOnly(true);
                                                        txt_otrmatcon.setReadOnly(true);
                                                        cbo_estconst.setReadOnly(true);
                                                        cbo_areaverde.setReadOnly(true);
                                                        txt_colfac.setReadOnly(true);
                                                        txt_puertas.setReadOnly(true);
                                                        txt_ventanas.setReadOnly(true);
                                                        txt_tipmatpue.setReadOnly(true);
                                                        cbo_rejprot.setReadOnly(true);
                                                        cbo_pueaccveh.setReadOnly(true);
                                                        txt_obsinmu.setReadOnly(true);
                                                        cbo_residentes.setReadOnly(true);
                                                        cbo_zonificacion.setReadOnly(true);
                                                        cbo_zonariesgo.setReadOnly(true);
                                                        cbo_conclusion.setReadOnly(true);
                                                        cboEstadoCheckDomicilio.setReadOnly(true);
                                                        txt_obsCheckDom.setReadOnly(true);
                                                        //imagenes
                                                        upf_imgdom1.disable();
                                                        upf_imgdom2.disable();
                                                        upf_imgmapa.disable();
                                                        cbo_tipimg1.setReadOnly(true);
                                                        cbo_tipimg2.setReadOnly(true);
                                                        cbo_imgpama.setReadOnly(true);
                                                        Ext.getCmp('btn_GrabarCheckDomicilio').disable();
                                                        Ext.getCmp('btnGrabaImagenesChkDom').disable();
                                                    }
                                                }
                                            }
                                    }
                                }
            });


            var ds_obtieneCheckFamiliar = new Ext.data.Store({
                                reader: new Ext.data.JsonReader({
                                    root            : 'checkfamiliarpersona',
                                    totalProperty	: 'total',
                                    id              : 'codchkser'
                                    },
                                    [{name: 'codchkser', mapping: 'codchkser'},
                                        {name: 'nombre', mapping: 'nombre'},
                                        {name: 'codpar', mapping: 'codpar'},
                                    {name: 'imgreniec', mapping: 'imgreniec'},
                                    {name: 'obsimgreniec', mapping: 'obsimgreniec'},
                                    {name: 'indrefpol', mapping: 'indrefpol'},
                                    {name: 'refpolchk', mapping: 'refpolchk'},
                                    {name: 'indantpol', mapping: 'indantpol'},
                                    {name: 'indreqjud', mapping: 'indreqjud'},
                                    {name: 'indrefter', mapping: 'indrefter'},
                                    {name: 'indrefdro', mapping: 'indrefdro'},
                                    {name: 'indimpsalpai', mapping: 'indimpsalpai'},
                                    {name: 'indinvpen', mapping: 'indinvpen'},
                                    {name: 'invpenchk', mapping: 'invpenchk'},
                                    {name: 'recchk', mapping: 'recchk'},
                                    //{name: 'coddel', mapping: 'coddel'},
                                    {name: 'codestchk', mapping: 'codestchk'}
                                    ]),
                                proxy: new Ext.data.HttpProxy({
                                    url: 'DB/checkfamiliar.php',
                                    method : 'POST'
                                }),
                                //baseParams:{n:4, codsol:cod_sol, codper:cod_per},
                                baseParams:{n:4},
                                autoLoad: false,
                                listeners:{
                                    load : function(store){
                                            var numchecks=store.getCount();
                                            for (var i = 0; i < numchecks; i++){
                                                var lchkser = store.getAt(i).data.codchkser;
                                                hid_codchkfam.setValue(lchkser);
                                                var nom=store.getAt(i).data.nombre;
                                                txt_nomfamper.setValue(nom);
                                                var par=store.getAt(i).data.codpar;
                                                cbo_parentfam.setValue(par);
                                                var imgren=store.getAt(i).data.imgreniec;
                                                hid_imgactreniecfam.setValue(imgren);
                                                var obsdni=store.getAt(i).data.obsimgreniec;
                                                txt_obsdnifam.setValue(obsdni);
                                                var refpol=store.getAt(i).data.indrefpol;
                                                cbo_refpolfam.setValue(refpol);
                                                var antpol=store.getAt(i).data.indantpol;
                                                cbo_antpolfam.setValue(antpol);
                                                var reqjud=store.getAt(i).data.indreqjud;
                                                cbo_reqjudfam.setValue(reqjud);
                                                var refter=store.getAt(i).data.indrefter;
                                                cbo_refterfam.setValue(refter);
                                                var refdro=store.getAt(i).data.indrefdro;
                                                cbo_refdrofam.setValue(refdro);
                                                var impsal=store.getAt(i).data.indimpsalpai;
                                                cbo_impsalfam.setValue(impsal);
                                                var invpen=store.getAt(i).data.indinvpen;
                                                cbo_invpenfam.setValue(invpen);
                                                btnImgCargadafam.enable();
                                                if(refpol=='1' || antpol=='1' || reqjud=='1' || refter=='1' || refdro=='1' || impsal=='1'){
                                                    var txtinvpol=store.getAt(i).data.refpolchk;
                                                    txt_invpolfam.setValue(txtinvpol);
                                                    txt_invpolfam.enable();
                                                    cboDelitosFam.enable();
                                                }
                                                if(invpen=='1'){
                                                    var txtinvpen=store.getAt(i).data.invpenchk;
                                                    txt_invpenfam.setValue(txtinvpen);
                                                    txt_invpenfam.enable();
                                                    cboDelitosFam.enable();
                                                }

                                                var ds_delitosgrabados = new Ext.data.Store({
                                                    reader  : new Ext.data.JsonReader({
                                                                    fields  : ['coddel', 'nomdel','desdel','grabado'],
                                                                    root    : 'delitosgrab',
                                                                    id      : 'coddel'
                                                            }),
                                                    proxy: new Ext.data.HttpProxy({
                                                                    url: 'DB/checkfamiliar.php'
                                                            }),
                                                    baseParams:{n:10, codchkser:lchkser},
                                                    autoLoad: false,
                                                    listeners : {
                                                        load : function(store){
                                                                    var deliregist=store.getCount();
                                                                    //alert('en el store vale'+resiregist);
                                                                    for (var j = 0; j < deliregist; j++) {
                                                                        var r = new newDelitoFam({
                                                                           coddel       : ds_delitosgrabados.getAt(j).data.coddel,
                                                                           nomdel       : ds_delitosgrabados.getAt(j).data.nomdel,
                                                                           desdel       : ds_delitosgrabados.getAt(j).data.desdel,
                                                                           grabado       : ds_delitosgrabados.getAt(j).data.grabado
                                                                        });
                                                                        //alert("Un delito");
                                                                        //alert(p.get('item'));
                                                                        ds_delitostempFam.insert(ds_delitostempFam.getCount(), r);
                                                                    }

                                                                }
                                                    }
                                                });
                                                ds_delitosgrabados.load();
                                                var recome=store.getAt(i).data.recchk;
                                                txt_recomefam.setValue(recome);
                                                var estado =store.getAt(i).data.codestchk;
                                                cboEstadoCheckFamiliar.setValue(estado);
                                                if(estado=='3' || cperf=='3'){
                                                     if(cperf!='00001'){
                                                        upf_imagendnifam.disable();
                                                        txt_nomfamper.setReadOnly(true);
                                                        cbo_parentfam.setReadOnly(true);
                                                        txt_obsdnifam.setReadOnly(true);
                                                        cbo_refpolfam.setReadOnly(true);
                                                        cbo_antpolfam.setReadOnly(true);
                                                        cbo_reqjudfam.setReadOnly(true);
                                                        cbo_refterfam.setReadOnly(true);
                                                        cbo_refdrofam.setReadOnly(true);
                                                        cbo_impsalfam.setReadOnly(true);
                                                        cbo_invpenfam.setReadOnly(true);
                                                        cboDelitosFam.setReadOnly(true);
                                                        cboEstadoCheckFamiliar.setReadOnly(true);
                                                        txt_invpolfam.setReadOnly(true);
                                                        txt_invpenfam.setReadOnly(true);
                                                        txt_defdelfam.setReadOnly(true);
                                                        txt_recomefam.setReadOnly(true);
                                                        Ext.getCmp('btn_GrabarCheckFamiliar').disable();
                                                        Ext.getCmp('btn_CancelarCheckFamiliar').disable();
                                                        Ext.getCmp('btn_NuevoCheckFamiliar').disable();
                                                     }
                                                     else{
                                                        upf_imagendnifam.enable();
                                                        txt_nomfamper.setReadOnly(false);
                                                        cbo_parentfam.setReadOnly(false);
                                                        txt_obsdnifam.setReadOnly(false);
                                                        cbo_refpolfam.setReadOnly(false);
                                                        cbo_antpolfam.setReadOnly(false);
                                                        cbo_reqjudfam.setReadOnly(false);
                                                        cbo_refterfam.setReadOnly(false);
                                                        cbo_refdrofam.setReadOnly(false);
                                                        cbo_impsalfam.setReadOnly(false);
                                                        cbo_invpenfam.setReadOnly(false);
                                                        cboDelitosFam.setReadOnly(false);
                                                        cboEstadoCheckFamiliar.setReadOnly(false);
                                                        txt_invpolfam.setReadOnly(false);
                                                        txt_invpenfam.setReadOnly(false);
                                                        txt_defdelfam.setReadOnly(false);
                                                        txt_recomefam.setReadOnly(false);
                                                        Ext.getCmp('btn_GrabarCheckFamiliar').enable();
                                                        Ext.getCmp('btn_CancelarCheckFamiliar').enable();
                                                        Ext.getCmp('btn_NuevoCheckFamiliar').disable();
                                                     }
                                                }
                                                else{
                                                        upf_imagendnifam.enable();
                                                        txt_nomfamper.setReadOnly(false);
                                                        cbo_parentfam.setReadOnly(false);
                                                        txt_obsdnifam.setReadOnly(false);
                                                        cbo_refpolfam.setReadOnly(false);
                                                        cbo_antpolfam.setReadOnly(false);
                                                        cbo_reqjudfam.setReadOnly(false);
                                                        cbo_refterfam.setReadOnly(false);
                                                        cbo_refdrofam.setReadOnly(false);
                                                        cbo_impsalfam.setReadOnly(false);
                                                        cbo_invpenfam.setReadOnly(false);
                                                        cboDelitosFam.setReadOnly(false);
                                                        cboEstadoCheckFamiliar.setReadOnly(false);
                                                        txt_invpolfam.setReadOnly(false);
                                                        txt_invpenfam.setReadOnly(false);
                                                        txt_defdelfam.setReadOnly(false);
                                                        txt_recomefam.setReadOnly(false);
                                                        Ext.getCmp('btn_GrabarCheckFamiliar').enable();
                                                        Ext.getCmp('btn_CancelarCheckFamiliar').enable();
                                                        Ext.getCmp('btn_NuevoCheckFamiliar').disable();
                                                }
                                            }
                                    }
                                }
            });



            //DataStore para obtener datos grabados del CheckService
            var ds_obtieneCheckLaboral = new Ext.data.Store({
                                reader: new Ext.data.JsonReader({
                                    root            : 'checklaboralpersona',
                                    totalProperty	: 'total',
                                    id              : 'codchklab'
                                    },
                                    [{name: 'codchklab', mapping: 'codchklab'},
                                    {name: 'codper', mapping: 'codper'},
                                    {name: 'codsol', mapping: 'codsol'},
                                    {name: 'nomperref', mapping: 'nomperref'},
                                    {name: 'nomemp', mapping: 'nomemp'},
                                    {name: 'telemp', mapping: 'telemp'},
                                    {name: 'perlab', mapping: 'perlab'},
                                    {name: 'motces', mapping: 'motces'},
                                    {name: 'percont', mapping: 'percont'},
                                    {name: 'carpercont', mapping: 'carpercont'},
                                    {name: 'fecent', mapping: 'fecent'},
                                    {name: 'obsent', mapping: 'obsent'},
                                    {name: 'noment', mapping: 'noment'},
                                    {name: 'codestchk', mapping: 'codestchk'},
                                    {name: 'codcue', mapping: 'codcue'},
                                    {name: 'cueresp', mapping: 'cueresp'},
                                    {name: 'codcon', mapping: 'codcon'}
                                    ]),
                                proxy: new Ext.data.HttpProxy({
                                    url: 'DB/checklaboral.php',
                                    method : 'POST'
                                }),
                                autoLoad: false,
                                listeners:{
                                    load : function(store){
                                            var numchecks=store.getCount();
                                            //alert(numchecks);
                                            for (var i = 0; i < numchecks; i++){
                                                var codchklab=store.getAt(i).data.codchklab;
                                                hid_codchklab.setValue(codchklab);
                                                var nomperref=store.getAt(i).data.nomperref;
                                                txt_nomperref.setValue(nomperref);
                                                var nomemp=store.getAt(i).data.nomemp;
                                                txt_nomemp.setValue(nomemp);
                                                var telemp=store.getAt(i).data.telemp;
                                                txt_telemp.setValue(telemp);
                                                var perlab=store.getAt(i).data.perlab;
                                                txt_perlab.setValue(perlab);
                                                var motces=store.getAt(i).data.motces;
                                                txt_motces.setValue(motces);
                                                var cueresp = store.getAt(i).data.cueresp;
                                                var codcue = store.getAt(i).data.codcue;
                                                var codsol = store.getAt(i).data.codsol;
                                                var codper = store.getAt(i).data.codper;
                                                if (cueresp==0){
                                                    ds_preguntas.load({params: {n:3, codper:codper, codsol:codsol, codchklab:codchklab, codcue:codcue}})
                                                }
                                                else{
                                                    ds_preguntas.load({params: {n:2, codchklab:codchklab}})
                                                }
                                                var percont = store.getAt(i).data.percont;
                                                txt_percont.setValue(percont);
                                                var carpercont = store.getAt(i).data.carpercont;
                                                txt_carpercont.setValue(carpercont);
                                                var fecent = store.getAt(i).data.fecent;
                                                dp_fecent.setValue(Ext.util.Format.substr(fecent,8,2)+'/'+Ext.util.Format.substr(fecent,5,2)+'/'+Ext.util.Format.substr(fecent,0,4));
                                                var noment = store.getAt(i).data.noment;
                                                txt_noment.setValue(noment);
                                                var obsent = store.getAt(i).data.obsent;
                                                txt_obsent.setValue(obsent);
                                                var codestchk = store.getAt(i).data.codestchk;
                                                cboEstadoCheckLaboral.setValue(codestchk);
                                                var codcon = store.getAt(i).data.codcon;
                                                cbo_conclusionlab.setValue(codcon);
                                                if (codestchk=='3' || cperf=='00003'){
                                                    if(cperf!='00001'){
                                                        txt_nomperref.setReadOnly(true);
                                                        txt_nomemp.setReadOnly(true);
                                                        txt_telemp.setReadOnly(true);
                                                        txt_perlab.setReadOnly(true);
                                                        txt_motces.setReadOnly(true);
                                                        txt_percont.setReadOnly(true);
                                                        txt_carpercont.setReadOnly(true);
                                                        dp_fecent.setReadOnly(true);
                                                        txt_noment.setReadOnly(true);
                                                        txt_obsent.setReadOnly(true);
                                                        cboEstadoCheckLaboral.setReadOnly(true);
                                                        cbo_conclusionlab.setReadOnly(true);
                                                        Ext.getCmp('btn_GrabarCheckLaboral').disable();
                                                        Ext.getCmp('btn_NuevoCheckLaboral').disable();
                                                    }else{
                                                        txt_nomperref.setReadOnly(false);
                                                        txt_nomemp.setReadOnly(false);
                                                        txt_telemp.setReadOnly(false);
                                                        txt_perlab.setReadOnly(false);
                                                        txt_motces.setReadOnly(false);
                                                        txt_percont.setReadOnly(false);
                                                        txt_carpercont.setReadOnly(false);
                                                        dp_fecent.setReadOnly(false);
                                                        txt_noment.setReadOnly(false);
                                                        txt_obsent.setReadOnly(false);
                                                        cboEstadoCheckLaboral.setReadOnly(false);
                                                        cbo_conclusionlab.setReadOnly(false);
                                                        Ext.getCmp('btn_CancelarCheckLaboral').enable();
                                                        Ext.getCmp('btn_GrabarCheckLaboral').enable();
                                                        Ext.getCmp('btn_NuevoCheckLaboral').disable();
                                                    }
                                                }else{
                                                        txt_nomperref.setReadOnly(false);
                                                        txt_nomemp.setReadOnly(false);
                                                        txt_telemp.setReadOnly(false);
                                                        txt_perlab.setReadOnly(false);
                                                        txt_motces.setReadOnly(false);
                                                        txt_percont.setReadOnly(false);
                                                        txt_carpercont.setReadOnly(false);
                                                        dp_fecent.setReadOnly(false);
                                                        txt_noment.setReadOnly(false);
                                                        txt_obsent.setReadOnly(false);
                                                        cboEstadoCheckLaboral.setReadOnly(false);
                                                        cbo_conclusionlab.setReadOnly(false);
                                                        Ext.getCmp('btn_CancelarCheckLaboral').enable();
                                                        Ext.getCmp('btn_GrabarCheckLaboral').enable();
                                                        Ext.getCmp('btn_NuevoCheckLaboral').disable();
                                                }
                                            }
                                    }
                                }
            });

            //DataStore que Construye las pestañas de Checks
            var ds_cabchecksrv = new Ext.data.Store({
                            reader: new Ext.data.JsonReader({
                                root            : 'checkspersona',
                                totalProperty	: 'total',
                                id              : 'nomobj'
                                },
                                [{name: 'codsol', mapping: 'codsol'},
                                {name: 'codper', mapping: 'codper'},
                                {name: 'codpacchk', mapping: 'codpacchk'},
                                {name: 'codpue', mapping: 'codpue'},
                                {name: 'nomobj', mapping: 'nomobj'},
                                {name: 'nombre', mapping: 'nombre'}
                                ]),
                            proxy: new Ext.data.HttpProxy({
                                url: 'DB/solicitud.php',
                                method : 'POST'
                            }),
                            baseParams:{n:9, codsol:cod_sol, codper:cod_per},
                            autoLoad: false,
                            listeners : {
                                load : function(store){
                                    var numchecks=store.getCount();
                                    for (var i = 0; i < numchecks; i++) {
                                        var objeto=store.getAt(i).data.nomobj
                                        Ext.getCmp(objeto).enable();
                                        var nombre = ds_cabchecksrv.getAt(0).data.nombre;
                                        var puesto = ds_cabchecksrv.getAt(0).data.codpue;
                                        switch (objeto){
                                            case 'tbp_checkservice' :
                                                txt_chksrvnomper.setValue(nombre);
                                                cboCheckPuestos.setValue(puesto);
                                                cboCheckPuestos.setReadOnly(true);
                                                ds_obtieneCheckService.load();
                                                break;
                                            case 'tbp_checkdomicilio' :
                                                txt_chkdomnomper.setValue(nombre);
                                                cboCheckPuestosDom.setValue(puesto);
                                                cboCheckPuestosDom.setReadOnly(true);
                                                ds_obtieneCheckDomici.load();
                                                //alert(hid_checkDom.getValue());
                                                break;
                                            case 'tbp_checklaboral' :
                                                txt_chklabnomper.setValue(nombre);
                                                cboCheckPuestosLab.setValue(puesto);
                                                cboCheckPuestosLab.setReadOnly(true);
                                                ds_obtieneListaCheckLaboral.load();
                                                if(cperf=='3' || estsolper=='Finalizado'){
                                                        Ext.getCmp('btn_NuevoCheckLaboral').disable();
                                                    }
                                                break;
                                            case 'tbp_checkfam' :
                                                txt_chkfamnomper.setValue(nombre);
                                                cboCheckPuestosFam.setValue(puesto);
                                                cboCheckPuestosFam.setReadOnly(true);
                                                ds_obtieneListaCheckFamiliar.load();
                                                break;
                                            default :
                                                alert('es otro check q no manyo')
                                        }
                                    }
                                }
                            }
                        });
            ds_cabchecksrv.load();

            //Declaracion de la ventana

                var win_checks_persona = Ext.getCmp('frm_checks_persona');
                if (!win_checks_persona){
                    new Ext.Window({
                        title	: 'Registro de Checks',
                        id          : 'frm_checks_persona',
                        iconCls     : 'regsol',
                        layout	: 'fit',
                        width	: 800,
                        height	: 582,
                        resizable   : false,
                        closable    : true,
                        modal       : true,
                        items       : [tabPanelCheck]
                    }).show();

                }else{
                      win_checks_persona.show();
                }


        }
    });
}

/********************************************
 *   Fin de formulario frm_checks_persona   *
 *******************************************/