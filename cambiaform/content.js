chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log("Llega algo");
	console.log(request);
    if (request.greeting == "find_form"){
    	console.log("Entra");    
        var inputs = $("input").get().reverse();
        var indice = undefined;
        var passfound = false;
        $(inputs).each(function(index){
            if($(this).attr("type")=="password"){
                $(this).val("hola");
                passfound = true;
            }else if($(this).attr("type")=="text" || $(this).attr("type")=="email" || $(this).attr("type")==undefined){
                if(passfound){
                    passfound = false;
                    $(this).val("login");
                }
            }
        });
     }  	
});