/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT
 *
 * List
 */

(function() {
  var prototype = {
    items: null,
    onAdd: null,

    init: function() {
      this.items = [];
      this.onAdd = null;
    },

    add: function(item) {
      this.items.push(item);
      if (typeof this.onAdd == 'function') {
        this.onAdd(item);
      }
    },

    filter: function(fun) {
      return this.items.filter(fun);
    },

    forEach: function(callback) {
      this.items.forEach(callback);
    }
  };

  this.List = Class.extend(prototype);
})();
