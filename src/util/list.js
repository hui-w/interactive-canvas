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

    init: function() {
      this.items = [];
    },

    add: function(item) {
      this.items.push(item);
    },

    forEach: function(callback) {
      this.items.forEach(callback);
    }
  };

  this.List = Class.extend(prototype);
})();
