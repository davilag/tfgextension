function registerCallback(registrationId){
	if(chrome.runtime.lastError){
		//Ha sucedido un error, probar mas tarde.
		return;
	}
	alert("RegId: "+registrationId);
	chrome.storage.local.set({'registered':true});
	chrome.storage.local.set({'regId':registrationId});
	console.log("Guardado.")
	sendRegistrationId(function(succeed){
		console.log("succeed: "+succeed);
		if(succeed){
			

			chrome.storage.local.get("regId",function(value){
        		console.log(value);
    		});
		}
			
	});
}
function sendRegistrationId(callback){

}

function registerCallback(registrationId){
    if(chrome.runtime.lastError){
        //Ha sucedido un error, probar mas tarde.
        return;
    }
    console.log("Ya tengo en RegId");
    chrome.storage.local.set({'regId':registrationId});
    
}
chrome.gcm.onMessage.addListener(function(message){
		var d = new Date();
		console.log("Ha llegado un mensaje de GCM: "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
		console.log(message.data);
		action = message.data.action;
		if(action=="response"){
            console.log("Peticion contestada para el dominio: "+message.data.dominio);
            alert("Contraseña para "+message.data.dominio+": "+message.data.password);
        }
	});
chrome.runtime.onInstalled.addListener(function(){
	var senderIds =["877721156858"];
    chrome.storage.local.set({"serverId":senderIds[0]});
    serverId = senderIds[0];
	chrome.gcm.register(senderIds,registerCallback);
})
