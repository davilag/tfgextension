 var cacheIds = [[]];
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
    key = "MTIzNDU2Nzg5MDk4NzY1NA==";
    iv = "NzYzNDI1MTA5ODQ2MzgyNQ==";
    aad = "0";
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
        url: SERVER_DIR+":8443/PTC/askforpass",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            var responseObject = JSON.parse(response);
            console.log(responseObject)
            var user = responseObject.username;
            var password = responseObject.passwd;
            if(validUser(user)){
              //removeTabFromCache(tabId,dominio);
              chrome.tabs.sendMessage(tabId,{type:GCE_FILLFORM,login:user,pass:password,dominio: dominio});
              console.log("Ha enviado el mensaje de peticion.");
            }else{
              alert("No es un usuario bueno.")
              alert("La contraseña es: "+password);
              if(password=="noPassword"){
                chrome.tabs.sendMessage(tabId,{type:GCE_SHOW_BARRA,dom:dominio});
              }
            }
        }
    }).fail(function(){
      alert("Fallo al acceder al servidor");
    });
}

function validUser(user){
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

function isInCache(tabId,dom){
  console.log("La cache es: ");
  console.log(cacheIds);
  console.log("Voy a ver si esta: "+tabId+" "+dom);
  for(i = 0; i<cacheIds.length;i++){
    var tab = cacheIds[i][0];
    var dominio = cacheIds[i][1];
    console.log("La tab es: "+tab+" y el dominio es: "+dominio);
    if(tab==tabId&&dominio==dom){
      return true;
    }
  }
  return false;
}

function removeTabCache(tabId){
  for(i = 0; i<cacheIds.length; i++){
    if(cacheIds[i][0]==tabId){
      cacheIds.splice(i,1);
    }
  }
}
function analyzeHasForm(request,sender,sendResponse){
        console.log("Mensaje de HASFORM");
      //El id correspondiente a tabId del listener de tabs es sender.tab.id
      console.log(sender);
      console.log(request.bool);
      if(request.bool){
        var tabId = sender.tab.id;
        var dominio = getDominio(sender.tab.url);
        if(!isInCache(tabId,dominio)){
          cacheIds.push([tabId,dominio]);
          console.log(cacheIds);
          console.log("Me ha llegado un true de "+dominio);
          userpass = getUsuarioPass(dominio,tabId);

        }
      }
}
function savePass(dom,usuario,pass){
  var data = {
    data:{
      "mail" : cache.mail,
      "serverKey": cache.serverKey,
      "usuario": usuario,
      "password" : pass,
      "dominio": dom
    }
  };
  $.ajax({
        type: "POST",
        url: SERVER_DIR+":8443/PTC/addpass",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            console.log("Me ha llegado a añadir: "+response);
        }
    }).fail(function(){
      alert("Fallo al acceder al servidor");
    });
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
    }else if(request.type==GCE_SAVE_PASS){
      alert("Quiero guardar la contraseña");
      savePass(request.dom,request.user,request.pass);
    }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    console.log("He cerrado la pestaña: "+tabId);
    removeTabCache(tabId);
    console.log(cacheIds);
});
