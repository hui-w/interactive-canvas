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
      if (this.getProp('fillStyle') != null) {
        context.fillStyle = this.getProp('fillStyle');
        context.fillRect(0, 0, this.width, this.height);
      }

      // Border
      if (this.getProp('strokeStyle') && this.getProp('lineWidth') > 0) {
        context.lineWidth = this.getProp('lineWidth');
        context.strokeStyle = this.getProp('strokeStyle');
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
