chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    	if (request.type == "fill_form"){
    	    var login = request.login;
    	    var pass = request.pass;
    	    /*
    	    Quitar el fondo amarillo del autofill.
    	    */
      	  $('input:-webkit-autofill').each(function(){
              var text = $(this).val();
              var name = $(this).attr('name');
              $(this).after(this.outerHTML).remove();
              $('input[name=' + name + ']').val(text);
          });
          
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
});	
