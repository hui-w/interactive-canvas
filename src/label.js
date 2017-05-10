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
      this.textBoundary = null;

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

      // Register the internal events
      this.onSizeChange.add(function(width, height) {
        this.updateTextBoundary();
      }.bind(this));
    },

    setProp: function(key, value) {
      this._super(key, value);

      switch (key) {
        case 'horizontalAlign':
          if (this.updatePropValue('horizontalAlign', value)) {
            this.updateTextBoundary();
            this.requestPaint();
          }
          break;
        case 'verticalAlign':
          if (this.updatePropValue('verticalAlign', value)) {
            this.updateTextBoundary();
            this.requestPaint();
          }
          break;
        case 'text':
          if (this.updatePropValue('text', value)) {
            this.updateTextBoundary();
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
            this.updateTextBoundary();
            this.requestPaint();
          }
      }
    },

    getTextBoundary: function() {
      if (this.textBoundary == null) {
        this.updateTextBoundary();
      }

      return this.textBoundary;
    },

    // To calculate the text boundary
    updateTextBoundary: function(context) {
      if (!context) {
        // This method may be called ouside of paint without context
        context = this.getContext();

        if (!context) {
          // Still no context as the canvas may not renderred
          return;
        }
      }

      this.isBoundaryUpdated = true;

      context.save();

      // Set the font temporary for mesuring the size
      context.font = this.getProp('fontSize') + 'px ' + this.getProp('fontFace');

      // Calculate size of the boundary
      var textWidth = parseInt(context.measureText(this.getProp('text')).width);
      var textHeight = this.getProp('fontSize');

      // Calculate position of the boundary
      var textLeft = 0,
        textTop = 0;
      if (this.getProp('horizontalAlign') == 'center') {
        textLeft = parseInt(this.width / 2 - textWidth / 2);
      } else if (this.getProp('horizontalAlign') == 'right') {
        textLeft = this.width - textWidth;
      }

      if (this.getProp('verticalAlign') == 'middle') {
        textTop = parseInt(this.height / 2 - textHeight / 2);
      } else if (this.getProp('verticalAlign') == 'bottom') {
        textTop = this.height - textHeight;
      }

      this.textBoundary = {
        left: textLeft,
        top: textTop,
        width: textWidth,
        height: textHeight
      }

      context.restore();
    },

    paint: function(context) {
      // Prepare to paint
      this.saveContext(context);

      // Base Paint()
      this._super(context, true);

      // Set the font and render the text
      context.font = this.getProp('fontSize') + 'px ' + this.getProp('fontFace');
      context.fillStyle = this.getProp('fontColor');
      context.textBaseline = 'top';
      var b = this.getTextBoundary();
      context.fillText(this.getProp('text'), b.left, b.top);

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
