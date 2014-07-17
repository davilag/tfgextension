//Función para obetener el dominio a partir de una url.

function getDominio(url){
  var dominio = url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
  return dominio;
}

//Listener que salta cuando se cambia el estado de una pestaña
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0].id === tabId) {
            if (changeInfo && changeInfo.status === 'complete') {
              $.getJSON( "localhost:8080/urls.json", function( data ) {
                  
              });
                var log ="login";
                var password = "hola";
                var dominio = getDominio(tabs[0].url);
                chrome.tabs.sendMessage(tabId, {type: "fill_form",login:log,pass: password});
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

