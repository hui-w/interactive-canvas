/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/interactive-canvas
 * @licence MIT
 *
 * EventHandler
 */

'use strict';

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

  window.EventHandler = Class.extend(prototype);
})();
