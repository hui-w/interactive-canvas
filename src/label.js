/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/interactive-canvas
 * @licence MIT
 *
 * Label
 */

'use strict';

(function() {
  var prototype = {
    onTextChange: null,
    textBoundary: null,

    init: function(left, top, width, height, text, id) {
      this._super(left, top, width, height, id);

      // When text is changed
      this.onTextChange = new EventHandler();

      // The text boundary with relative position
      this.textBoundary = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      }

      // Extend properties
      var newProperties = {
        fontSize: 12,
        fontFace: 'Arial, Helvetica, sans-serif',
        fontColor: '#000000',
        text: text,
        horizontalAlign: 'left',
        verticalAlign: 'top',
        alignMode: 'boundary' // 'basePoint' | 'boundary'
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
            this.updateBoundary();
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
            this.updateBoundary();
            this.requestPaint();
          }
          break;
      }
    },

    // To calculate the text boundary
    updateBoundary: function(context) {
      if (!context) {
        // This method may be called ouside of paint without context
        context = this.getContext();

        if (!context) {
          // Still no context as the canvas may not renderred
          return;
        }
      }

      context.save();

      // Set the font temporary for mesuring the size
      context.font = this.getProp('fontSize') + 'px ' + this.getProp('fontFace');

      var textWidth = parseInt(context.measureText(this.getProp('text')).width);
      var textHeight = this.getProp('fontSize');

      // Calculate size of the boundary
      this.textBoundary.width = textWidth;
      this.textBoundary.height = textHeight

      // Calculate position of the boundary
      if (this.getProp('horizontalAlign') == 'center') {
        this.textBoundary.left = - parseInt(textWidth / 2);
      } else if (this.getProp('horizontalAlign') == 'right') {
        this.textBoundary.left = - textWidth;
      }

      if (this.getProp('verticalAlign') == 'middle') {
        this.textBoundary.top = - parseInt(textHeight / 2);
      } else if (this.getProp('verticalAlign') == 'bottom') {
        this.textBoundary.top = -textHeight;
      }

      context.restore();
    },

    paint: function(context) {
      // Update the width and height
      this.updateBoundary(context);

      // Prepare to paint
      this.saveContext(context);

      // Base Paint()
      this._super(context, true);

      // Set the font and render the text
      context.font = this.getProp('fontSize') + 'px ' + this.getProp('fontFace');
      context.fillStyle = this.getProp('fontColor');
      context.fillTextEx(this.getProp('text'), 0, 0,
        this.getProp('horizontalAlign'),
        this.getProp('verticalAlign')
      );

      /*
      function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
      }
      */

      // Paint completed
      this.restoreContext(context);
    }
  };

  window.Label = Panel.extend(prototype);
})();
