/**
 * Provides a post message API for scenes contained
 * in an iframe.
 */
module.exports = function initPostMessageAPI (scene) {
  // postMessage API handler
  window.addEventListener('message', postMessageAPIHandler.bind(scene));
};

function postMessageAPIHandler (event) {
  var scene = this;
  if (!event.data) { return; }

  switch (event.data.type) {
    case 'vr': {
      switch (event.data.data) {
        case 'enter':
          scene.enterVR();
          break;
        case 'exit':
          scene.exitVR();
          break;
      }
    }
  }
}
