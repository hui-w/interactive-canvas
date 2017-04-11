/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
 * @licence MIT
 *
 * EventHandler
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

    trigger: function() {
      var args = arguments;
      this.items.filter(function(item) {
        return typeof item === 'function';
      }).forEach(function(item) {
        item.apply(this, args);
      });
    }
  };

  this.EventHandler = Class.extend(prototype);
})();
