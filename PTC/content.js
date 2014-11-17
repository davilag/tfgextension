
//Funcion para quitar el fondo amarillo de la funcion autofill de Google Chrome.
function quitarFondoAutofill(){
   $('input:-webkit-autofill').each(function(){
      var text = $(this).val();
      var name = $(this).attr('name');
      $(this).after(this.outerHTML).remove();
      $('input[name=' + name + ']').val(text);
  });
}

//Funcion para rellenar el formulario de login con el usuario y la contraseña.
function rellenarForm (login, pass){
    var inputs = $("input").get().reverse();
    var indice = undefined;
    var passfound = false;
		$(inputs).each(function(index){
      		if($(this).attr("type")=="password"){
          		$(this).val(pass);
	            $(this).css("background-color","#A2D6E4");
          		passfound = true;
      		}else if($(this).attr("type")=="text" || $(this).attr("type")=="email" || $(this).attr("type")==undefined){
  			      if(passfound){
              		passfound = false;
		              $(this).css("background-color","#A2D6E4");
              		$(this).val(login);
              }
    			}
    });
}

//Funcion para ver si la página tiene un formulario para hacer login.
function buscarForm(){
  var hasForm = false;
  $("input").each(function(index){
    if($(this).attr("type")=="password"){
      hasForm = true;
      return false;
    }
  });
  return hasForm;
}
function addUser(dominio){
  chrome.runtime.sendMessage({type:"save_user",login:$("#dialog-extension-user").val(),pass:$("#dialog-extension-pass").val(),
  dom:dominio});
}
function setEstilo(mensaje, campos,labelUser,inputUser,labelPass,
    inputPass){
      labelUser.css("display","block");
      labelPass.css("display","block");
      inputUser.css("display","block");
      inputPass.css("display","block");
      inputUser.css("margin-bottom","12px");
      inputUser.css("width","95%");
      inputUser.css("padding","0.4em");
      inputPass.css("margin-bottom","12px");
      inputPass.css("width","95%");
      inputPass.css("padding","0.4em");
      campos.css("padding","0");
      campos.css("border","0");
      campos.css("margin-top",".6em 0");
      mensaje.css("border","1px solid transparent");
      mensaje.css("padding","0.3em");
      
    }
//Funcion para mostrar el diálogo para guardar un usuario.
function showDialog(dominio){

  var caja = $("<div>",{
    id: "dialog",
    title:"Añadir página"
  });
  var mensaje = $("<p>",{
    class:"validateTips"
  });
  mensaje.html("Introduce el usuario y contraseña para guardar:");
  mensaje.appendTo(caja);
  
  var formulario = $("<form>");
  var campos = $("<fieldset>");
  var labelUser = $("<label>",{
    for:"name"
  });
  labelUser.html("Usuario");
  labelUser.appendTo(campos);
  var inputUser = $("<input>",{
    type:"text",
    name:"name",
    id :"dialog-extension-user",
    class :"text ui-widget-content ui-corner-all"
  });
  inputUser.appendTo(campos);
  $("<br/>").appendTo(campos);
  var labelPass = $("<label>",{
    for:"pass"
  });
  labelPass.html("Contraseña");
  labelPass.appendTo(campos);
  var inputPass = $("<input>",{
    type:"password",
    name:"password",
    id :"dialog-extension-pass",
    class :"text ui-widget-content ui-corner-all"
  });
  inputPass.appendTo(campos);
  campos.appendTo(formulario);
  formulario.appendTo(caja);
  var form = caja.find( "form" ).on( "submit", function( event ) {
      addUser();
  });
  caja.dialog({
      autoOpen: false,
      height: 350,
      width: 400,
      modal: true,
      buttons: {
        "Añadir usuario": function(){
          addUser(dominio);
          caja.dialog("close");
        },
        Cancel: function() {
          caja.dialog( "close" );
        }
      },
      close: function() {
        form[ 0 ].reset();
      }
    });
    setEstilo(mensaje,campos,labelUser,inputUser,labelPass,inputPass);
    caja.dialog("open");
}

//Funcion para añadir la barra en el caso que la extensión no tenga almacenada la pass de la pagina
function addBarra(dominio){
  var barra = $("<div>",{
   id:"barraGuardar",
   class: "ui-state-highlight ui-corner-all"
  });
  var botonSi = $("<button>");
  botonSi.html("Si");
  botonSi.button();
  botonSi.click(function(){
    showDialog(dominio);
    barra.slideToggle("slow");
  });
  var botonNo = $("<button>");
  botonNo.html("No");
  botonNo.button();
  botonNo.click(function(){
   barra.slideToggle("slow");
  });
  var pregunta = $("<span>");
  pregunta.html("¿Quieres guardar esta pagina?");
  pregunta.appendTo(barra);
  pregunta.css("margin-right","0.5em");
  botonSi.appendTo(barra);
  botonNo.appendTo(barra);
  barra.hide();
  barra.slideToggle("slow");
  barra.css("z-index","4000");
  barra.css("position","relative");
  $("body").prepend(barra);

  return barra;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    	if (request.type == "fill_form"){
    	    var login = request.login;
    	    var pass = request.pass;

          quitarFondoAutofill();
          rellenarForm(login,pass);
     	}else if(request.type=="look_for_form"){
     	  console.log("Ha llegado el mensaje para buscar formulario");
     	  if(buscarForm()){
          addBarra(request.dom);
     	    console.log("Ha salido");
     	  }
     	}  	
});	