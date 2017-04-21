/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
 * @licence MIT
 *
 * Button
 */

'use strict';

(function() {
  var prototype = {
    capturedPosition: null,
    onTap: null,

    init: function(left, top, width, height, text, id) {
      this._super(left, top, width, height, text, id);

      // The position where mouse was down
      this.capturedPosition = null;

      // Button click
      this.onTap = new EventHandler();

      // Extend properties
      var newProperties = {
        isOn: false,
        radius: 0
      };
      this.properties = Object.assign({}, this.properties, newProperties);

      // Register the internal events
      this.onCapture.add(this.handleCapture.bind(this));
      this.onRelease.add(this.handleRelease.bind(this));
      this.onDrag.add(this.handleDrag.bind(this));
    },

    paint: function(context) {
      // Prepare to paint
      this.saveContext(context);

      // Render the button border and background
      if (this.capturedPosition || this.getProp('isOn')) {
        context.fillStyle = "#337AB7";
        context.strokeStyle = "#337AB7";
      } else {
        context.fillStyle = "#FFF";
        context.strokeStyle = "#337AB7";
      }

      if (this.getProp('radius') == 0) {
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(this.width, 0);
        context.lineTo(this.width, this.height);
        context.lineTo(0, this.height);
        context.closePath();
      } else {
        context.roundRect(0, 0, this.width, this.height, this.getProp('radius'));
      }

      context.fill();
      context.stroke();

      // Render the text
      if (this.getProp('text')) {
        if (this.capturedPosition || this.getProp('isOn')) {
          context.fillStyle = '#fff';
        } else {
          context.fillStyle = this.getProp('fontColor');
        }
        context.font = this.getProp('fontSize') + "px " + this.getProp('fontFace');
        context.fillTextEx(this.getProp('text'), this.width / 2, this.height / 2, 'center', 'middle');
      }

      // Paint completed
      this.restoreContext(context);
    },

    setIsOn: function(isOn) {
      if (this.setProp('isOn', isOn)) {
        this.requestPaint();
      }
    },

    setRadius: function(radius) {
      if (this.setProp('radius', radius)) {
        this.requestPaint();
      }
    },

    handleCapture: function(left, top) {
      if (!this.isPointInside(left, top)) {
        return;
      }

      this.capturedPosition = { left: left, top: top };
      this.requestPaint();
    },

    handleRelease: function(left, top) {
      if (!this.capturedPosition) {
        return;
      }

      if (this.isPointInside(left, top)) {
        // Both Capture and Release event happens on the component
        this.onTap.trigger(left, top);
      }

      this.capturedPosition = null;
      this.requestPaint();
    },

    handleDrag: function(left, top) {

    }
  };

  window.Button = Label.extend(prototype);
})();
