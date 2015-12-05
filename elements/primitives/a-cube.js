var registerPrimitive = require('../lib/register-primitive');

module.exports = registerPrimitive('a-cube', {
  defaults: {
    value: {
      geometry: {
        primitive: 'box',
        width: 5,
        height: 5,
        depth: 5
      },
      material: {
        color: 'gray'
      }
    }
  },

  mappings: {
    value: {
      width: 'geometry.width',
      height: 'geometry.height',
      depth: 'geometry.depth',
      color: 'material.color'
    }
  }
});
