var registerComponent = require('../core/component').registerComponent;

module.exports.Component = registerComponent('link', {
  schema: {
    url: { default: '' },
    on: { default: 'cursor-click' }
  },

  init: function () {
    this.redirect = this.redirect.bind(this);
  },

  update: function (oldData) {
    var data = this.data;
    var el = this.el;
    if (data.on !== oldData.on) {
      if (oldData.on) {
        el.removeEventListener(oldData.on, this.redirect);
      }
      el.addEventListener(data.on, this.redirect);
    }
  },

  redirect: function () {
    if (!this.el.isPlaying) { return; }
    window.location = this.data.url;
  },

  remove: function () {
    this.el.removeEventListener(this.data.on, this.redirect);
  }
});
