/*
* Funcion para mostrar el formulario del reporte de clientes
* Ricardo De la Torre
* 23-04-2010
* v1.0
*/
function frm_rpt_cliente(){
    var view_window_rpt_cliente;
    var xf_ini, xf_fin, rpt_cliente;

    xf_ini=new Ext.form.DateField({
        fieldLabel	:'Fecha Ini.',
        id		:'fecha1',
        name		:'fecha1',
        width		:110,
        format		:'d-m-Y',
        renderer	:function(value) {return value ? new Date(value).dateFormat('d.m.Y') : '';},
        allowBlank	:false
    });

    xf_fin=new Ext.form.DateField({
        fieldLabel	:'Fecha Fin.',
        id		:'fecha2',
        name		:'fecha2',
        width		:110,
        format		:'d-m-Y',
        renderer	:function(value) {return value ? new Date(value).dateFormat('d.m.Y') : '';},
        allowBlank	:false
    });


    rpt_cliente = new Ext.FormPanel({
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
                    items: xf_ini
                }]
        },{
            layout:'column',
            border:false,
            items:[{
                    columnWidth:.99,
                    layout: 'form',
                    border:false,
                    items: xf_fin
                }]
        }],
        buttons: [{
             text   :'Generar',
             cls: 'x-btn-text-icon',
             icon: 'files/images_app/excel.gif',
             handler: function(){

                var f_ini	=document.getElementById('fecha1').value;
                var f_fin	=document.getElementById('fecha2').value;

                if(f_ini.length==0){
                    Ext.Msg.show({
                        title   :'CUIDADO',
                        msg     :'Debe seleccionar un fecha inicial',
                        buttons :Ext.Msg.OK,
                        icon    :Ext.MessageBox.INFO
                    });
                    return;
                }

                if(f_fin.length==0){
                    Ext.Msg.show({
                        title   :'CUIDADO',
                        msg     :'Debe seleccionar un fecha final',
                        buttons :Ext.Msg.OK,
                        icon    :Ext.MessageBox.INFO
                    });
                    return;
                }


                if(f_ini != '' && f_fin != ''){

                    generar_rpt_cliente();
                }else{
                     Ext.Msg.alert('Error','Debe completar todos los campos');
                }
             }
        }]

    });


    view_window_rpt_cliente = new Ext.Window({
        title       :'Reporte por cliente',
        width       :300,
        modal       :true,
        frame       :true,
        autoHeight  :550,
        closable    :true,
        minWidth    :400,
        minHeight   :150,
        plain       :true,
        y           :230,
        id          :'LoginWin4',
        bodyStyle   :'padding:5px',
        items: rpt_cliente,
        resizable:false
    });

    view_window_rpt_cliente.show();
}


function generar_rpt_cliente(){

    var nfecha1	=document.getElementById('fecha1').value;
    var nfecha2	=document.getElementById('fecha2').value;

    document.location = 'reportes/rpt_cliente.php?fini='+nfecha1+'&ffin='+nfecha2;

}