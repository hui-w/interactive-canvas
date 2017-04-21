/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
 * @licence MIT
 *
 * Label
 */

'use strict';

(function() {
  var prototype = {
    onTextChange: null,

    init: function(left, top, width, height, text, id) {
      this._super(left, top, width, height, id);

      // When text is changed
      this.onTextChange = new EventHandler();

      // Extend properties
      var newProperties = {
        fontSize: 12,
        fontFace: 'Arial, Helvetica, sans-serif',
        fontColor: '#000000',
        text: text,
        horizontalAlign: 'left',
        verticalAlign: 'top'
      };
      this.properties = Object.assign({}, this.properties, newProperties);
    },

    setHorizontalAlign: function(horizontalAlign) {
      if (this.setProp('horizontalAlign', horizontalAlign)) {
        this.requestPaint();
      }
    },

    setVerticalAlign: function(verticalAlign) {
      if (this.setProp('verticalAlign', verticalAlign)) {
        this.requestPaint();
      }
    },

    setText: function(text) {
      if (this.setProp('text', text)) {
        this.updateSize();
        this.requestPaint();
        this.onTextChange.trigger();
      }
    },

    setFontColor: function(fontColor) {
      if (this.setProp('fontColor', fontColor)) {
        this.requestPaint();
      }
    },

    setFontSize: function(fontSize) {
      if (this.setProp('fontSize', fontSize)) {
        this.updateSize();
        this.requestPaint();
      }
    },

    // Set the font and get the size
    updateSize: function(context) {
      if (!context) {
        // This method may be called ouside of paint without context
        context = this.getContext();
      }

      context.font = this.getProp('fontSize') + 'px ' + this.getProp('fontFace');
      this.width = context.measureText(this.getProp('text')).width;
      this.height = this.getProp('fontSize');
    },

    paint: function(context) {
      // Prepare to paint
      this.saveContext(context);

      // Update the width and height
      this.updateSize(context);

      // Base Paint()
      this._super(context, true);

      // Set the font color and render the text
      context.fillStyle = this.getProp('fontColor');
      context.fillTextEx(this.getProp('text'), 0, 0,
        this.getProp('horizontalAlign'),
        this.getProp('verticalAlign')
      );

      // Paint completed
      this.restoreContext(context);
    }
  };

  window.Label = Panel.extend(prototype);
})();
