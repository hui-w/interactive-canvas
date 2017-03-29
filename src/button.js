/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 */
var button_prototype = {
  isOn: null,
  radius: null,
  text: null,
  font: null,
  capturedPosition: null,
  onClick: null,

  init: function(left, top, width, height, id) {
    this._super(left, top, width, height, id);

    this.isOn = false;
    this.radius = 0;
    this.text = null;
    this.font = {
      size: 12,
      face: "Arial, Helvetica, sans-serif",
      color: "#000000"
    };

    // The position where mouse was down
    this.capturedPosition = null;

    // Event handler
    this.onClick = [];

    // Render the button border and background
    this.onRenderExtra.push(function(context) {
      if (this.capturedPosition || this.isOn) {
        context.fillStyle = "#B5B5B5";
        context.strokeStyle = "#979797";
      } else {
        context.fillStyle = "#EBEBEB";
        context.strokeStyle = "#979797";
      }

      if (this.radius == 0) {
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(this.width, 0);
        context.lineTo(this.width, this.height);
        context.lineTo(0, this.height);
        context.closePath();
      } else {
        context.roundRect(0, 0, this.width, this.height, this.radius);
      }

      context.fill();
      context.stroke();
    });

    // Render the text
    this.onRenderExtra.push(function(context) {
      // Text
      if (this.text) {
        context.fillStyle = this.font.color;
        context.font = this.font.size + "px " + this.font.face;
        context.fillTextEx(this.text, this.width / 2, this.height / 2, 'center', 'middle');
      }
    });
  },

  setOn: function(isOn) {
    if (this.isOn === isOn) {
      return;
    }

    this.isOn = isOn;
    this.requestPaint();
  },

  setRadius: function(radius) {
    if (this.radius === radius) {
      return;
    }

    this.radius = radius;
    this.requestPaint();
  },

  setText: function(text) {
    if (this.text === text) {
      return;
    }

    this.text = text;
    this.requestPaint();
  },

  onCapture: function(left, top) {
    if (!this.isPointInside(left, top)) {
      return;
    }

    this.capturedPosition = { left: left, top: top };
    this.requestPaint();
  },

  onRelease: function(left, top) {
    if (!this.capturedPosition) {
      return;
    }

    if (this.isPointInside(left, top)) {
      // Both Capture and Release event happens on the component
      if (typeof this.onClick == 'function') {
        this.onClick();
      } else if (typeof this.onClick == 'object') {
        for (var i = 0; i < this.onClick.length; i++) {
          var handler = this.onClick[i];
          if (typeof handler == 'function') {
            handler();
          }
        }
      }
    }

    this.capturedPosition = null;
    this.requestPaint();
  },

  onDrag: function(left, top) {

  }
};

var Button = Component.extend(button_prototype);
