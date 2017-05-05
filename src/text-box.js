/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/interactive-canvas
 * @licence MIT
 *
 * TextBox (WIP)
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
        verticalAlign: 'top',
        isSizeFixed: false
      };
      this.properties = Object.assign({}, this.properties, newProperties);
    },

    setProp: function(key, value) {
      this._super(key, value);

      switch (key) {
        case 'horizontalAlign':
          if (this.updatePropValue('horizontalAlign', value)) {
            this.requestPaint();
          }
          break;
        case 'verticalAlign':
          if (this.updatePropValue('verticalAlign', value)) {
            this.requestPaint();
          }
          break;
        case 'text':
          if (this.updatePropValue('text', value)) {
            this.updateSize();
            this.requestPaint();
            this.onTextChange.trigger();
          }
          break;
        case 'fontColor':
          if (this.updatePropValue('fontColor', value)) {
            this.requestPaint();
          }
          break;
        case 'fontSize':
          if (this.updatePropValue('fontSize', value)) {
            this.updateSize();
            this.requestPaint();
          }
          break;
      }
    },

    // Set the font and get the size
    updateSize: function(context) {
      if (!context) {
        // This method may be called ouside of paint without context
        context = this.getContext();

        if (!context) {
          // Still no context as the canvas may not renderred
          return;
        }
      }

      context.font = this.getProp('fontSize') + 'px ' + this.getProp('fontFace');

      if (!this.getProp('isSizeFixed')) {
        // Set the caculated size
        this.width = context.measureText(this.getProp('text')).width;
        this.height = this.getProp('fontSize');
      }
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

  window.TextBox = Label.extend(prototype);
})();
