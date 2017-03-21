var registerComponent = require('../../core/component').registerComponent;
var utils = require('../../utils');

/**
 * Automatically enter VR, either upon `vrdisplayactivate` (e.g., putting a VR headset),
 * or immediately enter VR (if possible) if the display name contains a data string.
 * The default data string is 'GearVR' for the Oculus Carmel browser (which currently does only VR).
 */
module.exports.Component = registerComponent('auto-enter-vr', {
  schema: {
    display: {type: 'string', default: 'GearVR'},
    enabled: {type: 'boolean', default: true}
  },

  init: function () {
    var scene = this.el;
    var self = this;

    // Define the methods for attaching event listeners easily
    // (and also to allow mock testing of the methods).
    this.shouldAutoEnterVR = this.shouldAutoEnterVR.bind(this);
    this.enterVR = function () {
      // Check if we should try to enter VR.

      // Evidently, we need to wait for the next tick.
      setTimeout(function () {
        if (self.shouldAutoEnterVR()) {
          scene.enterVR();
        }
      }, 0);
    };
    this.exitVR = function () {
      setTimeout(function () {
        scene.exitVR();
      }, 0);
    };

    // Don't do anything when `?auto-enter-vr=false`.
    if (utils.getUrlParameter('auto-enter-vr') === 'false') { return; }

    this.attachEventListeners();
  },

  attachEventListeners: function () {
    // Enter VR on `vrdisplayactivate` (e.g., putting on a VR headset).
    window.addEventListener('vrdisplayactivate', this.enterVR);
    // Exit VR on `vrdisplaydeactivate` (e.g., taking off a VR headset).
    window.addEventListener('vrdisplaydeactivate', this.exitVR);
  },

  removeEventListeners: function () {
    window.removeEventListener('vrdisplayactivate', this.enterVR);
    window.removeEventListener('vrdisplaydeactivate', this.exitVR);
  },

  remove: function () {
    this.removeEventListeners();
  },

  update: function () {
    return this.shouldAutoEnterVR() ? this.enterVR() : this.exitVR();
  },

  shouldAutoEnterVR: function () {
    var scene = this.el;
    var data = this.data;

    // If `false`, we should not auto-enter VR.
    if (!data.enabled) { return false; }

    // If we have a data string to match against display name, try and get it.
    // If we can't get the headset's display name, or if it doesn't match,
    // then we should not auto-enter VR.
    if (data.display && data.display !== 'all') {
      var display = scene.effect && scene.effect.getVRDisplay && scene.effect.getVRDisplay();
      if (!display || !display.displayName || display.displayName.indexOf(data.display) < 0) {
        return false;
      }
    }

    // We should auto-enter VR.
    return true;
  }
});
