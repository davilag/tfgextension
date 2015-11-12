var serverIp = "localhost";

/*
Script que se ejecuta en background en la extensión y que se encarga de registrar
a la extensión en GCM y de escuchar los posibles mensajes entrantes de GCM
*/

/*
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
*/

/*
Funcion que se ejecuta cuando se ha obtenido una respuesta a la peticion de registro
en GCM
*/
function registerCallback(registrationId){
    if(chrome.runtime.lastError){
        //Ha sucedido un error, probar mas tarde.
        return;
    }
    console.log("Ya tengo en RegId");
    chrome.storage.local.set({'regId':registrationId});
    
}

/*
Listener que se ejecutará cuando llegue un mensaje de GCM.
*/
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

function sendRequestMessage(correo,dominio){
    chrome.storage.local.get("regId",function(value){
        var data = {
            data:{
                "action": "request",
                "mail": correo,
                "dominio": dominio,
                "reg_id": value.regId
            }
        };
        console.log("correo: "  +correo);
        console.log("dominio"+dominio);
        console.log("regID:"+value.regId);
        $.ajax({
            type: "POST",
            url: "http://"+serverIp+":8080/PTC/askforpass",
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(pass) {
                console.log("Ha enviado el mensaje de peticion.");
                alert(pass);
            }
        });
    });
}

chrome.runtime.onMessage.addListener(function(request,sender,senderResponse){
	if(request.type="askforpass"){
		console.log("Voy a enviar una peticion con correo: "+request.correo+" y dominio "+request.dominio);
		sendRequestMessage(request.correo,request.dominio);
	}
});

chrome.runtime.onInstalled.addListener(function(){
	//Proceso de registro en GCM
	var senderIds =["877721156858"];
	chrome.storage.local.set({"serverId":senderIds[0]});
	serverId = senderIds[0];
	chrome.gcm.register(senderIds,registerCallback);
});
