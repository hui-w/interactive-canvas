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

      context.save();

      // Set the font temporary for mesuring the size
      context.font = this.getProp('fontSize') + 'px ' + this.getProp('fontFace');

      if (!this.getProp('isSizeFixed')) {
        // Set the caculated size
        this.width = parseInt(context.measureText(this.getProp('text')).width);
        this.height = this.getProp('fontSize');
      }
      context.restore();
    },

    // Get the boundary of renderred text
    getTextBoundary: function() {
      var left = this.left;
      var top = this.top;
      var width = this.width;
      var height = this.height;

      if (this.getProp('horizontalAlign') == 'center') {
        left -= parseInt(this.width / 2);
      } else if (this.getProp('horizontalAlign') == 'right') {
        left -= this.width;
      }

      if (this.getProp('verticalAlign') == 'middle') {
        top -= parseInt(this.height / 2);
      } else if (this.getProp('verticalAlign') == 'bottom') {
        top -= this.height;
      }

      return {
        left: left,
        top: top,
        width: width,
        height: height
      }
    },

    paint: function(context) {
      // Update the width and height
      this.updateSize(context);

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
