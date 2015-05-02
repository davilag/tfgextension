var key = "MTIzNDU2Nzg5MDk4NzY1NA==";
var iv = "NzYzNDI1MTA5ODQ2MzgyNQ==";
var aad = "12457423556432ghd";
var ptext = "Hola esto es una prueba";

var pass = "prueba";

$(document).ready(function(){
  var cifrado = GCM_encrypt(key,iv,ptext,aad);
  var descifrado = GCM_decrypt(key,iv,cifrado,aad);
  var hash = sha256Hash(pass);

  console.log("La salida de cifrado es: "+cifrado);
  console.log("La salida de descifrado es: "+descifrado);
  console.log("La salida de la hash es: "+hash.ks + "    "+hash.kp);
});