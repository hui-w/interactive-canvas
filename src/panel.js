/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
 * @licence MIT
 *
 * Panel
 */

(function() {
  var prototype = {
    paint: function(context) {
      // Prepare to paint
      this.componentWillPaint(context);

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

      // Paint completed
      this.componentDidPaint(context);
    },
  };

  this.Panel = Component.extend(prototype);
})();
