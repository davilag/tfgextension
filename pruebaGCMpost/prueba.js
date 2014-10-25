var messageId = 0;
chrome.storage.local.get("messageId", function(result) {
  if (chrome.runtime.lastError)
    return;
  messageId = parseInt(result["messageId"]);
  if (isNaN(messageId))
    messageId = 0;
});

// Sets up an event listener for send error.
//chrome.gcm.onSendError.addListener(sendError);
function setRegistered(correo){
    chrome.storage.local.get("regId",function(value){
        $("#id").html(value.regId);
        chrome.storage.local.set({'registered':true});
        chrome.storage.local.set({'mail':correo});
        $("#botonReg").attr("disabled",true);
    });
}
// Returns a new ID to identify the message.
function getMessageId() {
  messageId++;
  chrome.storage.local.set({messageId: messageId});
  return messageId.toString();
}
function sendRegisterMessage(data,correo){
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/register",
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(registrado) {
                console.log("Ha llegado el mensaje");
                console.log("Me ha llegado un: "+registrado);
                if(registrado){
                    setRegistered(correo);
                }
            }
        });
}

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
            url: "http://localhost:8080/askforpass",
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(registrado) {
                console.log("Ha enviado el mensaje de peticion.");
            }
        });
    });
}
function regInServer(serverId){
    console.log("Me voy a registrar en el servidor.");
    var correo = $("#correo").val();
    console.log("El correo es: "+correo);
    chrome.storage.local.get("regId",function(value){
        var data = {
            data: {
              "action": "REGISTER",
              "role": "requester",
              "mail": correo,
              "reg_id": value.regId
            }

        };
        sendRegisterMessage(data,correo);
    });
    /*
    chrome.gcm.onMessage.addListener(function(message){
        console.log("Ha llegado un mensaje de GCM en prueba");
        console.log(message.data);
        action = message.data.action;
        console.log(action);
        if(action=="registered"){
            console.log("Registrado con exito");
            chrome.storage.local.get("regId",function(value){
                $("#id").html(value.regId);
                chrome.storage.local.set({'registered':true});
                chrome.storage.local.set({'mail':correo});
                $("#botonReg").attr("disabled",true);
            });
        }
    });
    */
}

$(document).ready(function(){
    var registrado = false;
    var server = "";
    chrome.storage.local.get("regId",function(value){
        $("#id").html(value.regId);
    });

    chrome.storage.local.get("registered",function(value){
        console.log(value);
        if(value.registered){
            registrado = true;
            $("#botonReg").attr("disabled",true);
        }
    });

    chrome.storage.local.get("serverId",function(value){
        console.log(value);
        server = value.serverId 
    });
    
    /*
    Funcion que se ejecuta cuando pulso el boton de registrar
    */
    $("#botonReg").click(function(){
        chrome.storage.local.get("serverId",function(value){
            console.log(value);
            server = value.serverId;
            regInServer(server);
    });
        
    });

    $("#botonDom").click(function(){
        dominio = $("#dominio").val();
        chrome.storage.local.get("mail",function(value){
            correo = value.mail;
            console.log("El correo es: "+correo);
            
            sendRequestMessage(correo,dominio);
        });
    });
});