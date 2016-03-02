var registerComponent = require('../../core/component').registerComponent;
var THREE = require('../../lib/three');

var controls = new THREE.VRControls(new THREE.Object3D());

module.exports.Component = registerComponent('keyboard-shortcuts', {
  schema: {
    enterVR: { default: true },
    resetSensor: { default: true }
  },

  init: function () {
    var self = this;
    var scene = this.el;
    this.listener = window.addEventListener('keyup', function (event) {
      if (self.enterVREnabled) {
        if (event.keyCode === 70) {  // f.
          scene.enterVR();
        } else if (event.keyCode === 27) {  // Escape.
          // The new WebVR API doesn't use Fullscreen, so let's
          // still exit VR when the Escape key is pressed. This also works
          // fine in older builds using the old WebVR API.
          scene.exitVR();
        }
      }
      if (self.resetSensorEnabled && event.keyCode === 90) {  // z.
        controls.resetSensor();
      }
    }, false);
  },

  update: function (oldData) {
    var data = this.data;
    this.enterVREnabled = data.enterVR;
    this.resetSensorEnabled = data.resetSensor;
  },

  remove: function () {
    window.removeEventListener('keyup', this.listener);
  }
});
