/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
 * @licence MIT
 *
 * Label
 */

(function() {
  var prototype = {
    font: null,
    text: null,
    horizontalAlign: null,
    verticalAlign: null,

    init: function(left, top, text, id) {
      this._super(left, top, 0, 0, id);

      this.font = {
        size: 12,
        face: 'Arial, Helvetica, sans-serif',
        color: '#000000'
      };

      this.text = text;
      this.horizontalAlign = 'left';
      this.verticalAlign = 'top';
    },

    setHorizontalAlign: function(horizontalAlign) {
      if (horizontalAlign === this.horizontalAlign) {
        return;
      }

      this.horizontalAlign = horizontalAlign;
      this.requestPaint();
    },

    setVerticalAlign: function(verticalAlign) {
      if (verticalAlign === this.verticalAlign) {
        return;
      }

      this.verticalAlign = verticalAlign;
      this.requestPaint();
    },

    setText: function(text) {
      if (text === this.text) {
        return;
      }

      this.text = text;
      this.requestPaint();
    },

    setFontColor: function(fontColor) {
      if (fontColor === this.font.color) {
        return;
      }

      this.font.color = fontColor;
      this.requestPaint();
    },

    setFontSize: function(fontSize) {
      if (fontSize === this.font.size) {
        return;
      }

      this.font.size = fontSize;
      this.requestPaint();
    },

    // Set the font and get the size
    updateSize: function(context) {
      context.font = this.font.size + 'px ' + this.font.face;
      this.width = context.measureText(this.text).width;
      this.height = this.font.size;
    },

    paint: function(context) {
      // Prepare to paint
      this.saveContext(context);

      // Update the width and height
      this.updateSize(context);

      // Base Paint()
      this._super(context, true);

      // Set the font color and render the text
      context.fillStyle = this.font.color;
      context.fillTextEx(this.text, 0, 0, this.horizontalAlign, this.verticalAlign);

      // Paint completed
      this.restoreContext(context);
    }
  };

  this.Label = Panel.extend(prototype);
})();
