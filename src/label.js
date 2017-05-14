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
    textObject: null,

    init: function(left, top, width, height, text, id) {
      this._super(left, top, width, height, id);

      // When text is changed
      this.onTextChange = new EventHandler();

      // The text boundary with relative position
      this.textObject = null;

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
        this.updateTextObject();
      }.bind(this));
    },

    setProp: function(key, value) {
      this._super(key, value);

      switch (key) {
        case 'horizontalAlign':
          if (this.updatePropValue('horizontalAlign', value)) {
            this.updateTextObject();
            this.requestPaint();
          }
          break;
        case 'verticalAlign':
          if (this.updatePropValue('verticalAlign', value)) {
            this.updateTextObject();
            this.requestPaint();
          }
          break;
        case 'text':
          if (this.updatePropValue('text', value)) {
            this.updateTextObject();
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
            this.updateTextObject();
            this.requestPaint();
          }
      }
    },

    getTextObject: function() {
      if (this.textObject == null) {
        this.updateTextObject();
      }

      return this.textObject;
    },

    // To calculate the text boundary
    updateTextObject: function(context) {
      // This method may be called ouside of paint without context
      if (!context) {
        context = this.getContext();

        if (!context) {
          // Still no context as the canvas may not renderred
          return;
        }
      }

      context.save();

      // Set the font temporary for mesuring the size
      var fontSize = this.getProp('fontSize');
      context.font = fontSize + 'px ' + this.getProp('fontFace');

      var maxLineWidth = 0,
        sumLineHeight = 0;

      // Parsing the string into lines with width and height of each line
      var lines = [];
      this.getProp('text').split(/\n/).forEach(function(lineContent) {
        var lineWidth = context.measureText(lineContent).width;
        var lineHeight = fontSize;
        lines.push({
          width: lineWidth,
          height: lineHeight,
          content: lineContent
        });

        // Update the text width and height
        if (lineWidth > maxLineWidth) {
          maxLineWidth = lineWidth;
        }
        sumLineHeight += lineHeight;
      }.bind(this));

      // Calculate position of the boundary
      var paragraphLeft = 0,
        paragraphTop = 0;
      if (this.getProp('horizontalAlign') == 'center') {
        paragraphLeft = parseInt((this.width - maxLineWidth) / 2);
      } else if (this.getProp('horizontalAlign') == 'right') {
        paragraphLeft = this.width - maxLineWidth;
      }

      if (this.getProp('verticalAlign') == 'middle') {
        paragraphTop = parseInt((this.height - sumLineHeight) / 2);
      } else if (this.getProp('verticalAlign') == 'bottom') {
        paragraphTop = this.height - sumLineHeight;
      }

      // Calculate the left and top of each line
      lines.forEach(function(line, index) {
        line.top = paragraphTop + fontSize * index;
        if (this.getProp('horizontalAlign') == 'center') {
          line.left = paragraphLeft + parseInt((maxLineWidth - line.width) / 2);
        } else if (this.getProp('horizontalAlign') == 'right') {
          line.left = paragraphLeft + maxLineWidth - line.width;
        } else {
          line.left = paragraphLeft;
        }
      }.bind(this));

      this.textObject = {
        left: paragraphLeft,
        top: paragraphTop,
        width: maxLineWidth,
        height: sumLineHeight,
        lines: lines
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
      var t = this.getTextObject();
      t.lines.forEach(function(line) {
        context.fillText(line.content, line.left, line.top);
      });
      // context.fillText(this.getProp('text'), b.left, b.top);

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
