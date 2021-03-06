var messageId = 0;
var registered = false;

chrome.browserAction.setBadgeText({text: ""});
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
  setRegistered(correo);
  chrome.runtime.sendMessage({type:GCE_REGISTERED,password:pass,mail:correo});
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
          "serverKey":pass
        }

    };
    sendRegisterMessage(data,correo,pass);
}
function mostrarError(mensajeError){
  $("#error").html(mensajeError);
  $(".alert").show();
}
$(document).ready(function(){
    $(".alert").hide();

    chrome.storage.local.get('error', function(data) {
          // Notify that we saved.
          if(data.error!=undefined){
            mostrarError(data.error);
            chrome.storage.local.clear();
          }
          console.log(data);

    });
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