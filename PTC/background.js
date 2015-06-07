var cacheIds = [[]];
var cache = {
  registered : false,
  serverKey : "",
  passKey: "",
  mail: ""
};
var tsCache = [];

//Función para obetener el dominio a partir de una url.
function getDominio(url){
  var urlDom = url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
  var urlDomSplit= urlDom.split(".");
  var dominio = urlDomSplit[urlDomSplit.length-2];
  return dominio;
}


function isInTsCache(ts){
  for(var i = 0; i< tsCache.length; i++){
    if(ts == tsCache[i]){
      return true;
    }
  }
  return false;
}
function sendMessageFill(dominio,tabId){
  $.getJSON( "http://localhost:8080/"+dominio+".json?nocache=" + (new Date()).getTime(), function( data ) { 
    //Evitamos que la petición se haga a la cache.
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
    var iv = getIV();
    var nonce = getNonce();
    var ts = getTimestamp();
    var secret = {
      dominio : dominio,
      nonce : nonce,
      ts : ts
    };
    var secretString = JSON.stringify(secret);
    console.log(secretString);
    var secretCif = GCM_encrypt(cache.serverKey,iv,secretString,correo);
    var data = {
      iv : iv,
      aad : correo,
      payload : secretCif
    };
    console.log("Estos son los datos que voy a enviar: ");
    console.log(data);
    console.log(JSON.stringify(data));
    $.ajax({
        type: "POST",
        url: SERVER_DIR+":8080/PTC/askforpass",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
          console.log("La respuesta es:");
          console.log(response);
          if(response!="false"){
            responseObj = JSON.parse(response).data;
            var ivRes = responseObj.iv;
            var payloadCif = responseObj.payload;
            var payload = GCM_decrypt(cache.serverKey,ivRes,payloadCif,cache.mail);
            console.log("El payload es:");
            console.log(payload);
            var payloadObj = JSON.parse(payload).data;
            if(payloadObj.nonce - nonce == 1){
              if(!isInTsCache(payloadObj.ts)){
                tsCache.push(payloadObj.ts);
                var userPassCif = payloadObj.payload;
                if(payloadObj.estado ==MSG_STATE_OK){
                  var userPass = GCM_decrypt(cache.passKey,payloadObj.iv,userPassCif,cache.mail);
                  var userPassObj = JSON.parse(userPass);
                  chrome.tabs.sendMessage(tabId,{type:GCE_FILLFORM,login:userPassObj.user,pass:userPassObj.password,dominio: dominio});
                }else{
                  if(payloadObj.estado==MSG_STATE_NO_PASSWD){
                    chrome.tabs.sendMessage(tabId,{type:GCE_SHOW_BARRA,dom:dominio});
                    console.log("He enviado la peticion para mostrar la barra.");
                  }
                }
              console.log("Ha enviado el mensaje de peticion.");
              }else{
                console.log("Fallo por ts");
              }
            }else{
              console.log("Fallo en el nonce");
            }
          }else{
            cache.registered = false;
            console.log("Fallo en la respuesta");
          }
        }
    }).fail(function(){
      chrome.browserAction.setBadgeText({text: "X"});
    });
}

function validUser(user){
  if(user===""){
    return false;
  }
  return true;
}

function getUsuarioPass(dominio,tabId){
  //TO-DO:pedir contraseñas a el movil.
  console.log("Funcion getUsuarioPass:");
  console.log(cache);
  if(cache.registered){
      console.log("Estoy registrado");
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
  var serverKey = cache.serverKey;
  var mail = cache.mail;
  var payloadUserPass = {
    user : usuario,
    password : pass
  };
  var payloadUserPassPlain = JSON.stringify(payloadUserPass);
  var ivPass = getIV();
  var payloadUserPassCipher = GCM_encrypt(cache.passKey,ivPass,payloadUserPassPlain,mail);
  var nonce = getNonce();
  var ts = getTimestamp();
  var payload = {
    data:{
      ts : ts,
      nonce : nonce,
      iv : ivPass,
      dominio: dom,
      payload : payloadUserPassCipher,
      usuario : usuario
    }
  };
  var payloadPlain = JSON.stringify(payload);
  console.log("El payload plano es:");
  console.log(payloadPlain);
  var iv = getIV();
  var payloadCipher = GCM_encrypt(serverKey,iv,payloadPlain,mail);
  var data = {
    iv : iv,
    aad: mail,
    payload : payloadCipher
  };
  console.log("Voy a enviar el mensaje al servidor para guardar la contraseña");
  $.ajax({
        type: "POST",
        url: SERVER_DIR+":8080/PTC/addpass",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            console.log("Me ha llegado a añadir: "+response);
        }
    }).fail(function(){
      chrome.browserAction.setBadgeText({text: "X"});
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.type == GCE_HASFORM){
      console.log(cacheIds);
        analyzeHasForm(request,sender,sendResponse);
    }else if(request.type == GCE_REGISTERED){
        console.log("Me ha llegado un registered");
        cache.registered = true;
        keys = getKeys(request.password);
        cache.serverKey = keys.ks;
        cache.passKey = keys.kp;
        cache.mail = request.mail;
        chrome.browserAction.setIcon({
            path: "iconLogin.png"
        });
        console.log(cache);
    }else if(request.type==GCE_SAVE_PASS){
      savePass(request.dom,request.user,request.pass);
    }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    console.log("He cerrado la pestaña: "+tabId);
    removeTabCache(tabId);
    console.log(cacheIds);
});
