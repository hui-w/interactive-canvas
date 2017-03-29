/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT
 *
 * Canvas label
 */
var label_prototype = {
  font: null,

  init: function(left, top, text, id) {
    this._super(this, left, top, 0, 0, id);

    this.font = {
      size: 12,
      face: "Arial, Helvetica, sans-serif",
      color: "#000000"
    };

    this.text = text;
    this.horizontalAlign = 'left';
    this.verticalAlign = 'top';

    this.onRenderExtra.push(function(context) {
      context.fillStyle = this.font.color;
      context.font = this.font.size + "px " + this.font.face;
      context.fillTextEx(this.text, 0, 0, this.horizontalAlign, this.verticalAlign);
    });
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
  }
};

var Label = Component.extend(label_prototype);
