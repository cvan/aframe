module.exports = function initMetaTags (scene) {
  // if (!scene.isMobile) { return; }
  injectMetaTags();
};

/**
 * Injects the necessary metatags in the document for mobile support to:
 * 1. Prevent the user to zoom in the document
 * 2. Ensure that window.innerWidth and window.innerHeight have the correct
 *    values and the canvas is properly scaled
 * 3. To allow fullscreen mode when pinning a web app on the home screen on
 *    iOS.
 * Adapted from: https://www.reddit.com/r/web_design/comments/3la04p/
 *
 * @type {Object}
 */
function injectMetaTags () {
  var headEl = document.head;

  var meta;
  var metaTags = [];
  var metaAttrs = [
    {name: 'viewport', content: 'width=device-width,initial-scale=1,shrink-to-fit=no,user-scalable=no'},

    // iOS-specific meta tags for fullscreen when pinning to homescreen.
    {name: 'apple-mobile-web-app-capable', content: 'yes'},
    {name: 'apple-mobile-web-app-status-bar-style', content: 'black'},
    {rel: 'apple-touch-icon', content: 'https://aframe.io/images/aframe-logo.png', sizes: '480x480'},

    // W3C-standardised meta tags.
    {name: 'web-app-capable', content: 'yes'},
    {name: 'theme-color', content: 'black'}
  ];
  metaAttrs.forEach(function (attrs) {
    meta = createMetaTagIfDoesNotExist(attrs);
    if (!meta) { return; }
    var headScriptEl = headEl.querySelector('script');
    if (headScriptEl) {
      headScriptEl.parentNode.insertBefore(meta, headScriptEl);
    } else {
      headEl.appendChild(meta);
    }
    metaTags.push(meta);
  });
  return metaTags;
}

function createMetaTagIfDoesNotExist (attrs) {
  if (!attrs || attrs.name && document.querySelector('meta[name="' + attrs.name + '"]')) {
    return;
  }
  return createTag('meta', attrs);
}

function createTag (name, attrs) {
  if (!attrs) { return; }
  var meta = document.createElement(name);
  Object.keys(attrs).forEach(function (key) {
    meta[key] = attrs[key];
  });
  return meta;
}
