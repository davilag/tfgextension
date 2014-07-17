
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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    	if (request.type == "fill_form"){
    	    var login = request.login;
    	    var pass = request.pass;

          quitarFondoAutofill();
          rellenarForm(login,pass);
     	}else if(request.type=="look_for_form"){
     	  if(buscarForm()){
     	    var barra = $("<div>",{
     	      id:"barraGuardar",
     	      class: "ui-state-highlight ui-corner-all"
     	    });
     	    var botonSi = $("<button>");
     	    botonSi.html("Si");
     	    botonSi.button();
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
     	    $("body").prepend(barra);
     	    barra.slideToggle("slow");
     	    console.log("Ha salido");
     	  }
     	}  	
});	
