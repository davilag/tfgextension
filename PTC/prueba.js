var messageId = 0;
var serverIp = "localhost";
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
            url: "http://"+serverIp+":8080/PTC/register",
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(registrado) {
                console.log("Ha llegado el mensaje");
                console.log("Me ha llegado un: "+registrado);
                if(registrado){
                    setRegistered(correo);
                }else{
                    console.log("No me ha dejado registrarme");
                }
                
            }
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

    /*
    Funcion que se ejecuta cuando pulso el boton para enviar una peticion
    */
    $("#botonDom").click(function(){
        dominio = $("#dominio").val();
        chrome.storage.local.get("mail",function(value){
            correo = value.mail;
            console.log("El correo es: "+correo);
            
            chrome.runtime.sendMessage({type:"askforpass",correo:correo,dominio:dominio});
        });
    });
});