function GCM_encrypt(key,iv,input,aad){
  var keyBits = sjcl.codec.base64.toBits(key);
  var ivBits = sjcl.codec.base64.toBits(iv);
  var aadBits = sjcl.codec.base64.toBits(aad);
  var inputBits = sjcl.codec.utf8String.toBits(input);

  var prp = new sjcl.cipher.aes(keyBits);
  return sjcl.codec.base64.fromBits(sjcl.mode.gcm.encrypt(prp, inputBits,ivBits));
}

function GCM_decrypt(key,iv,input,aad){
  var keyBits = sjcl.codec.base64.toBits(key);
  var ivBits = sjcl.codec.base64.toBits(iv);
  var aadBits = sjcl.codec.base64.toBits(aad);
  var inputBits = sjcl.codec.base64.toBits(input);

  var prp = new sjcl.cipher.aes(keyBits);
  return sjcl.codec.utf8String.fromBits(sjcl.mode.gcm.decrypt(prp, inputBits,ivBits));
}