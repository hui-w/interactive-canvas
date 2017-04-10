/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT
 *
 * Panel
 */

(function() {
  var prototype = {
    fillStyle: null,

    init: function(left, top, width, height, id) {
      this._super(left, top, width, height, id);

      this.fillStyle = null;
    },

    paint: function(context) {
      this._super(context);

      if (this.fillStyle != null) {
        context.fillStyle = this.fillStyle;
        context.fillRect(0, 0, this.width, this.height);
      }
    },

    setFillStyle: function(fillStyle) {
      if (this.fillStyle === fillStyle) {
        return;
      }

      this.fillStyle = fillStyle;
      this.requestPaint();
    }
  };

  this.Panel = Component.extend(prototype);
})();
