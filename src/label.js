/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT
 *
 * Label
 */

(function() {
  var prototype = {
    init: function(left, top, width, height, id) {
      this._super(left, top, width, height, id);
    }
  };

  this.Label = Panel.extend(prototype);
})();
