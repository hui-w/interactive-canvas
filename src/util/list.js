/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
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
      this.onAdd = new Callback();
    },

    add: function(item) {
      this.items.push(item);
      this.onAdd.trigger([item]);
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
