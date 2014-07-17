//Función para obetener el dominio a partir de una url.

function getDominio(url){
  var urlDom = url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
  var urlDomSplit= urlDom.split(".");
  var dominio = urlDomSplit[urlDomSplit.length-2]+"."+urlDomSplit[urlDomSplit.length-1];
  return dominio;
}

function sendMessage(dominio,tabId){
  $.getJSON( "http://localhost:8080/"+dominio+".json?nocache=" + (new Date()).getTime(), function( data ) { //Evitamos que la petición se haga a la cache.
    var log =data.login;
    var password = data.pass;
    chrome.tabs.sendMessage(tabId, {type: "fill_form",login:log,pass: password});
  });

}
//Listener que salta cuando se cambia el estado de una pestaña
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0].id === tabId) {
            if (changeInfo && changeInfo.status === 'complete') {
              $.getJSON( "http://localhost:8080/urls.json?nocache=" + (new Date()).getTime(), function( data ) {//Evitamos que la petición se haga a la cache.
                console.log("Ha hecho bien la peticion")
                var dominio = getDominio(tabs[0].url);
                console.log("el dominio es: "+dominio);
                for(i = 0; i<data.urls.length;i++){
                  if(dominio == data.urls[i]){
                    sendMessage(dominio,tabId);
                  }
                }
              });

            }
        }
        else {
            return false;
        }
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.greeting == "finished"){
      alert("Ha llegado algo de vuelta");
      
    }
});
