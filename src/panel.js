/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
 * @licence MIT
 *
 * Panel
 */

(function() {
  var prototype = {
    // Look and feel
    fillStyle: null,
    strokeStyle: null,
    lineWidth: null,

    init: function(left, top, width, height, id) {
      this._super(left, top, width, height, id);

      this.fillStyle = null;
      this.strokeStyle = "#000";
      this.lineWidth = 0;
    },

    paint: function(context) {
      // Background
      if (this.fillStyle != null) {
        context.fillStyle = this.fillStyle;
        context.fillRect(0, 0, this.width, this.height);
      }

      // Border
      if (this.strokeStyle && this.lineWidth > 0) {
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.strokeStyle;
        context.strokeRect(0, 0, this.width, this.height);
      }

      // Call the method of base class to paint children
      this._super(context);
    },

    setFillStyle: function(fillStyle) {
      if (this.fillStyle === fillStyle) {
        return;
      }

      this.fillStyle = fillStyle;
      this.requestPaint();
    },

    setStrokeStyle: function(strokeStyle) {
      if (this.strokeStyle === strokeStyle) {
        return;
      }

      this.strokeStyle = strokeStyle;
      this.requestPaint();
    },

    setLineWidth: function(lineWidth) {
      if (this.lineWidth === lineWidth) {
        return;
      }

      this.lineWidth = lineWidth;
      this.requestPaint();
    }
  };

  this.Panel = Component.extend(prototype);
})();
