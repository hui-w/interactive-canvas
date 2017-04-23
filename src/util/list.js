/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/interactive-canvas
 * @licence MIT
 *
 * List
 */

'use strict';

(function() {
  var prototype = {
    items: null,
    onAdd: null,

    init: function() {
      this.items = [];
      this.onAdd = new EventHandler();
    },

    add: function(item) {
      this.items.push(item);
      this.onAdd.trigger(item);
    },

    filter: function(fun) {
      return this.items.filter(fun);
    },

    forEach: function(callback) {
      this.items.forEach(callback);
    }
  };

  window.List = Class.extend(prototype);
})();
