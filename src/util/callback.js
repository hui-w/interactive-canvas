/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
 * @licence MIT
 *
 * Callback
 */

(function() {
  var prototype = {
    items: null,

    init: function() {
      this.items = [];
    },

    add: function(item) {
      this.items.push(item);
    },

    trigger: function(args) {
      this.items.filter(function(item) {
        return typeof item === 'function';
      }).forEach(function(item) {
        item(args);
      });
    }
  };

  this.Callback = Class.extend(prototype);
})();
