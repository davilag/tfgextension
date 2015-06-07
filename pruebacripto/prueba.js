var key = "ZV54ZnTZ0+d7wF7R3je0tg==";
var iv = "emFKaDJtVUh0YWUzdDFsdg==";
var aad = "d.avilag23@gmail.com";
var ptext = '{"dominio":"twitter","nonce":72825886,"ts":1431191892448}';

var pass = "prueba";

$(document).ready(function(){
  var cifrado = GCM_encrypt(key,iv,ptext,aad);
  var descifrado = GCM_decrypt(key,iv,cifrado,aad);
  var hash = sha256Hash(pass);

  console.log("La salida de cifrado es: "+cifrado);
  console.log("La salida de descifrado es: "+descifrado);
  console.log("La salida de la hash es: "+hash.ks + "    "+hash.kp);
});