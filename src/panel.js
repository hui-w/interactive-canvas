/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT
 *
 * Canvas panel
 */
var panel_prototype = {
  init: function(left, top, width, height, id) {
    this._super(left, top, width, height, id);
  }
};

var Panel = Component.extend(panel_prototype);
