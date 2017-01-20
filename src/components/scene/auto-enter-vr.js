var registerComponent = require('../../core/component').registerComponent;
var utils = require('../../utils');

/**
 * Automatically enter VR, either upon vrdisplayactivate (e.g. putting on Rift headset)
 * or immediately (if possible) if display name contains data string.
 * The default data string is ''. Currently, Firefox Nightly and
 * Oculus Carmel for Gear VR can automatically auto-enter VR. As such,
 * if there is an active VR display whose `displayName` that begins with
 * 'GearVR', we auto-enter VR.
 */
module.exports.Component = registerComponent('auto-enter-vr', {
  schema: {
    browser: {type: 'string'},
    enabled: {type: 'boolean', default: true}
  },

  init: function () {
    var scene = this.el;
    var self = this;

    // define methods to allow mock testing
    this.hasAutoEntered = false;
    this.enterVR = scene.enterVR.bind(scene);
    this.exitVR = scene.exitVR.bind(scene);
    this.shouldAutoEnterVR = this.shouldAutoEnterVR.bind(this);

    // Don't do anything if false.
    if (utils.getUrlParameter('auto-enter-vr') === 'false') { return; }

    // Enter VR on vrdisplayactivate (e.g., putting on Rift headset).
    window.addEventListener('vrdisplayactivate', function () {
      if (self.shouldAutoEnterVR()) { self.enterVR(); }
    }, false);

    // Exit VR on vrdisplaydeactivate (e.g., taking off Rift headset).
    window.addEventListener('vrdisplaydeactivate', function () {
      if (scene.is('vr-mode')) {
        self.exitVR();
      }
    }, false);

    // Check if we should try to enter VR (and wait for next tick).
    setTimeout(function () {
      if (self.shouldAutoEnterVR()) { self.enterVR(); }
    }, 0);
  },

  update: function () {
    this.hasAutoEntered = false;
    return this.shouldAutoEnterVR() ? this.enterVR() : this.exitVR();
  },

  shouldAutoEnterVR: function () {
    var scene = this.el;
    var data = this.data;

    // Bail if we've already attempted to auto-enter VR or we're already in VR mode.
    if (this.hasAutoEntered || scene.is('vr-mode')) {
      return false;
    }
    // Bail when `auto-enter-vr="enabled: false"`.
    if (!data.enabled) { return false; }

    if (data.browser) {
      var browser = data.browser.toLowerCase();
      // Begin feature detection (and UA/display Name detection when necessary).
      if (browser.indexOf('firefox') < 0 && !navigator.buildID) {
        return false;
      }
      if ((browser.indexOf('chromium') > 0 || browser.indexOf('chrome') > 0) && !('chrome' in window)) {
        return false;
      }
      var ua = navigator.userAgent.toLowerCase();
      if (browser.indexOf('samsung') > 0 && ua.indexOf('samsungbrowser') > 0) {
        return false;
      }
      if (browser.indexOf('carmel') > 0) {
        // If we're trying to filter for Carmel, we need to grab the name of the current VR display.
        var currentDisplay = scene.effect && scene.effect.getVRDisplay && scene.effect.getVRDisplay();
        if (!currentDisplay ||
            (currentDisplay.displayName || '').toLowerCase() !== 'gearvr') {
          return false;
        }
      }
    }

    this.hasAutoEntered = true;
    // We should auto-enter VR.
    return true;
  }
});
