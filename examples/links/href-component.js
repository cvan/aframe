/**
 * Link component.
 *
 * @namespace href
 */
(function () {
  window.AFRAME.registerComponent('href', {
    schema: {
      type: 'string'
    },

    init: function () {
      this.clickListener = function () { window.location.href = this.data; }.bind(this);
      this.el.addEventListener('cursor-click', this.clickListener);
    },

    remove: function () {
      this.el.removeEventListener('cursor-click', this.clickListener);
    }
  });
})();
