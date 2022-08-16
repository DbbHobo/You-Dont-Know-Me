let uri = "http://username:password@www.example.com:80/path/to/file.php?foo=316&bar=this+has+spaces#anchor";
let encoded_uri = encodeURI(uri);
let decoded_uri = decodeURI(encoded_uri);
let encodeURIComponent_uri = encodeURIComponent(uri);
let decodeURIComponent_uri = decodeURIComponent(encodeURIComponent_uri);
console.log(encoded_uri);
console.log(decoded_uri);
console.log(encodeURIComponent_uri);
console.log(decodeURIComponent_uri);