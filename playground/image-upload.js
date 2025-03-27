const ImageKit = require('imagekit');

var imagekit = new ImageKit({
  publicKey: 'public_EDgp88ndVCN1OaMZMgMXhJwh6yA=',
  privateKey: 'private_lbRKx8mHgXwOne5YoluvZLslqBk=',
  urlEndpoint: 'https://ik.imagekit.io/qinoqbrbp',
  authenticationEndpoint: 'http://www.yourserver.com/auth',
});

const res = imagekit.getAuthenticationParameters();
console.log('🚀 ~ res:', res);
