var messageId = 0;
var registered = false;


// Sets up an event listener for send error.
//chrome.gcm.onSendError.addListener(sendError);
function setRegistered(correo){
  $("#botonReg").attr("disabled",true);
  registered = true;
}
// Returns a new ID to identify the message.
function getMessageId() {
  messageId++;
  chrome.storage.local.set({messageId: messageId});
  return messageId.toString();
}
function sendRegisterMessage(data,correo,pass){
        $.ajax({
            type: "POST",
            url: SERVER_DIR+":8080/PTC/register",
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(registrado) {
                console.log("Ha llegado el mensaje");
                console.log("Me ha llegado un: "+registrado);
                if(registrado=="true"){
                    setRegistered(correo);
                    chrome.runtime.sendMessage({type:GCE_REGISTERED,password:pass,mail:correo});
                }else{
                    console.log("No me ha dejado registrarme");
                }
                
            }
        });
}


function regInServer(){
    console.log("Me voy a registrar en el servidor.");
    var correo = $("#correo").val();
    var pass = $("#pass").val();
    console.log("El correo es: "+correo);
    var data = {
        data: {
          "action": "REGISTER",
          "role": "requester",
          "mail": correo,
          "reg_id": "ordenador",
          "serverKey":"1234"
        }

    };
    sendRegisterMessage(data,correo,"1234");
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
        var email = $("#correo").val();
        regInServer();
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

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.type == GCE_REGISTERED){
        console.log("Me ha llegado al popup un mensaje del background");
    }
});
});