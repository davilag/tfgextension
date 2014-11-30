 var cacheIds = [];
var cache = {
  registered : false,
  serverKey : "",
  passKey: "",
  mail: ""
};

//Función para obetener el dominio a partir de una url.
function getDominio(url){
  var urlDom = url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
  var urlDomSplit= urlDom.split(".");
  var dominio = urlDomSplit[urlDomSplit.length-2]+"."+urlDomSplit[urlDomSplit.length-1];
  return dominio;
}

function sendMessageFill(dominio,tabId){
  $.getJSON( "http://localhost:8080/"+dominio+".json?nocache=" + (new Date()).getTime(), function( data ) { //Evitamos que la petición se haga a la cache.
    var log =data.login;
    var password = data.pass;
    chrome.tabs.sendMessage(tabId, {type: "fill_form",login:log,pass: password});
  }).fail(function(){
                console.log("Problema al intentar acceder al servidor");
  });

}
//Listener que salta cuando se cambia el estado de una pestaña
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0].id === tabId) {
            if (changeInfo && changeInfo.status === 'complete') {
                //TODO: BUSCO FORMULARIO
                console.log("Envio un mensaje a: "+tabId);
                chrome.tabs.sendMessage(tabId, {type: GCE_LOOKFORFORM});
            }
        }
        else {
            return false;
        }
    });
});

//Funcion para mandar un mensaje de peticion a los containers.
function sendRequestMessage(correo,dominio,tabId){
    console.log(cache);
    var data = {
        data:{
            "mail": correo,
            "dominio": dominio,
            "serverKey":cache.serverKey
        }
    };
    console.log("correo: "  +correo);
    console.log("dominio"+dominio);
    console.log("serverKey: "+$("#serverKey").val());
    $.ajax({
        type: "POST",
        url: SERVER_DIR+":8080/PTC/askforpass",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            var responseObject = JSON.parse(response);
            console.log(responseObject)
            var user = responseObject.username;
            var password = responseObject.passwd;
            if(validUser(user,password)){
              removeTabFromCache(tabId);
            }
            chrome.tabs.sendMessage(tabId,{type:GCE_FILLFORM,login:user,pass:password,dominio: dominio});
            console.log("Ha enviado el mensaje de peticion.");
        } 
    }).fail(function(){
      alert("Fallo al acceder al servidor");
    });
}

function validUser(user,password){
  if(user==""){
    return false;
  }
  return true;
}

function getUsuarioPass(dominio,tabId){
  //TO-DO:pedir contraseñas a el movil.
  if(cache.registered){
      sendRequestMessage(cache.mail,dominio,tabId);
  }
}

function removeTabFromCache(tabId){
  var index = cacheIds.indexOf();
  if(index>-1){
    array.splice(index,1);
  }
}

function analyzeHasForm(request,sender,sendResponse){
        console.log("Mensaje de HASFORM");
      //El id correspondiente a tabId del listener de tabs es sender.tab.id
      console.log(sender);
      console.log(request.bool);
      if(request.bool){
        var tabId = sender.tab.id;
        if($.inArray(tabId,cacheIds)==-1){
          cacheIds.push(sender.tab.id);
          var dominio = getDominio(sender.tab.url);
          console.log("Me ha llegado un true de "+dominio);
          userpass = getUsuarioPass(dominio,tabId);
          
        }
      }
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.type == GCE_HASFORM){
      console.log(cacheIds);
        analyzeHasForm(request,sender,sendResponse);
    }else if(request.type == GCE_REGISTERED){
        console.log("Me ha llegado un registered");
        cache.registered = true;
        cache.serverKey = request.password;
        cache.passKey = request.password;
        cache.mail = request.mail;
        console.log(cache);
    }
});
