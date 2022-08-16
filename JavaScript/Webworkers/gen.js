if (typeof w == "undefined") {
  w = new Worker("./worker.js");
}
w.onmessage = function (event) {
  document.getElementById("message").innerHTML = event.data;
};
