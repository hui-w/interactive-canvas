/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
 * @licence MIT
 *
 * Panel
 */

(function() {
  var prototype = {
    /* "purePaint": 
        When child class invoke this as "this._super()",
        do set pure as "true".
        Then the context save/restore and translation will be ignored.
        */
    paint: function(context, purePaint) {
      // Prepare to paint
      if (!purePaint) {
        this.saveContext(context);
      }

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
      if (!purePaint) {
        this.restoreContext(context);
      }
    },
  };

  this.Panel = Component.extend(prototype);
})();
