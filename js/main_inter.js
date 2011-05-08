Ext.apply(Ext.form.VTypes, {
    daterange : function(val, field) {
        var date = field.parseDate(val);

        if(!date){
            return;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    },

    password : function(val, field) {
        if (field.initialPassField) {
            var pwd = Ext.getCmp(field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },

    passwordText : 'Las contraseñas no coinciden'
});

Ext.ux.Uppercase = Ext.extend(Ext.util.Observable, {
	init:  function(field) {
		field.on('render',this.onRender,this);
	},
	onRender: function(field) {
		field.el.applyStyles({textTransform: "uppercase"});
		field.mon(field.el,'keyup',function() {
			this.setValue(this.getValue().toUpperCase());
		},field);
	}
});

/****************************************
 * Inicio de formulario frm_reg_persona *
 ****************************************/

var codper='',nomper='',apepatper='',apematper='',codtipdoc='',numdocper='',estper='';
var regPersona;
var ds_detsol;
var stcondetsolper,vcodcli;
var codestsol,desde,hasta;
var cboEstadosol;
var rval;

var codigos_personas = [];
function array_codigos_personas(valor,accion){
	var newArray=[];
		switch (accion){
			case 'in'	:codigos_personas.push(valor);break;
			case 'out'	:newArray = codigos_personas.splice(codigos_personas.indexOf(valor),1);break;
		}	
	//return cadena_agendamiento.toString()
};


function ftnactestsol(codsol){
    Ext.Ajax.request({
        url : 'DB/datamttos.php',
        params : {
            x:18
        },
        success:function(response,options){
            var stringData	=response.responseText;
            var jsonData 	=Ext.util.JSON.decode(stringData);


            Ext.Ajax.request({
                url	: 'DB/verestsol.php',
                params	: {
                    codsol: codsol,
                    logus :jsonData.loguser
                },
                success:function(response,options){
                    var val=response.responseText;
                    if(val==1){
                            //actualizo

                        stcondetsolper.proxy= new Ext.data.HttpProxy({
                                url: 'DB/solicitud.php',
                                method : 'POST'
                        });

                        stcondetsolper.baseParams={
                                n:5

                        };
                        stcondetsolper.load();
                    }else{
                            //No hago nada
                    }
                }
            });
        }
    });

}


/****************************************
 * Inicio de formulario frm_logout *
 ****************************************/

function frm_logout(){
    //Ext.Msg.alert("Salir!!!");
    Ext.Msg.confirm('Salir', 'Confirme que desea salir del sistema', function(btn, text){
    if (btn == 'yes'){
        var redirect = 'seguridad/logout.php';
        window.location = redirect;
    } else {
      // abort, abort!
    }
});
}

/****************************************
 *      Fin de formulario frm_logout    *
 ****************************************/

Ext.onReady(main_menu);