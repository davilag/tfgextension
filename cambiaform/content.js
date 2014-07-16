chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log("Ejecutando content");
	console.log(request);
    	if (request.greeting == "find_form"){
      		$(document).ready(function(){
        		console.log("Entra");    
		        var inputs = $("input").get().reverse();
		        var indice = undefined;
		        var passfound = false;
        		$(inputs).each(function(index){
	            		if($(this).attr("type")=="password"){
	                		$(this).val("hola");
					$(this).css("background-color","#A2D6E4");
	                		console.log("Tiene un campo pass");
	                		passfound = true;
	            		}else if($(this).attr("type")=="text" || $(this).attr("type")=="email" || $(this).attr("type")==undefined){
	        			if(passfound){
	                    			passfound = false;
						$(this).css("background-color","#A2D6E4");
	                    			$(this).val("login");
	                		}
            			}
        		});
		});
     	}  	
});	
