var iframeMsg = function() {
  this.postMsg = function(data) {
    window.parent.postMessage(data, "*");
  };
  this.ParentPostMsg = function (data) {
    window.postMessage(data, "*");
  };
  this.listenMsg = function(cb) {
    window.addEventListener("message", function(event) {
      cb && cb(event);
    });
  };
};
let iframe = new iframeMsg();
window.iframe = iframe;
