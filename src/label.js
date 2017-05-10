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

      // Parsing lines
      var lines = [];
      this.getProp('text').split(/\n/).forEach(function(content) {
        lines.push({
          width: context.measureText(content).width,
          height: this.getProp('fontSize'),
          content: content
        });
      }.bind(this));

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

      this.textObject = {
        left: textLeft,
        top: textTop,
        width: textWidth,
        height: textHeight,
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
      var b = this.getTextObject();
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
