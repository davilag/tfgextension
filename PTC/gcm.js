function GCM_encrypt(key,iv,input,aad){
  var keyBits = sjcl.codec.base64.toBits(key);
  var ivBits = sjcl.codec.base64.toBits(iv);
  var aadBits = sjcl.codec.utf8String.toBits(aad);
  var inputBits = sjcl.codec.utf8String.toBits(input);
  console.log("El input es: "+sjcl.codec.base64.fromBits(inputBits));
  console.log("El aad es: "+sjcl.codec.base64.fromBits(aadBits));
  var prp = new sjcl.cipher.aes(keyBits);
  return sjcl.codec.base64.fromBits(sjcl.mode.gcm.encrypt(prp, inputBits,ivBits,aadBits));
}

function GCM_decrypt(key,iv,input,aad){
  var keyBits = sjcl.codec.base64.toBits(key);
  var ivBits = sjcl.codec.base64.toBits(iv);
  var aadBits = sjcl.codec.utf8String.toBits(aad);
  var inputBits = sjcl.codec.base64.toBits(input);

  var prp = new sjcl.cipher.aes(keyBits);
  return sjcl.codec.utf8String.fromBits(sjcl.mode.gcm.decrypt(prp, inputBits,ivBits,aadBits));
}

function getKeys(input){
  var inputBits = sjcl.codec.utf8String.toBits(input);
  var hashBits = sjcl.hash.sha256.hash(inputBits);
  var ks = hashBits.slice(0,hashBits.length/2);
  var kp = hashBits.slice(hashBits.length/2,hashBits.length);
  return {
    ks : sjcl.codec.base64.fromBits(ks),
    kp : sjcl.codec.base64.fromBits(kp)
  };
}

function getIV(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 16; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    var bitsText = sjcl.codec.utf8String.toBits(text);
    return sjcl.codec.base64.fromBits(bitsText);
}

function getNonce(){
  return Math.floor((Math.random()*99999999)+0); //Genera un numero aleatorio entre en 0 y el 99999999
}

function getTimestamp(){
  return Date.now();
}