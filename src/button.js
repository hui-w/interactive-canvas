/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/interactive-canvas
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
        radius: 0,
        focusStyle: {
          fillStyle: '#337AB7',
          strokeStyle: '#337AB7',
          lineWidth: 1,
          fontColor: '#fff'
        }
      };
      this.properties = Object.assign({}, this.properties, newProperties);

      // Set the default value of properties
      this.properties['fillStyle'] = '#FFF';
      this.properties['strokeStyle'] = '#337AB7';
      this.properties['lineWidth'] = 1;
      this.properties['fontColor'] = '#337AB7';
      this.properties['horizontalAlign'] = 'center';
      this.properties['verticalAlign'] = 'middle';

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
        context.fillStyle = this.getProp('focusStyle', 'fillStyle');
        context.strokeStyle = this.getProp('focusStyle', 'strokeStyle');
        context.lineWidth = this.getProp('focusStyle', 'lineWidth');
      } else {
        context.fillStyle = this.getProp('fillStyle');
        context.strokeStyle = this.getProp('strokeStyle');
        context.lineWidth = this.getProp('lineWidth');
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
          context.fillStyle = this.getProp('focusStyle', 'fontColor');
        } else {
          context.fillStyle = this.getProp('fontColor');
        }
        context.font = this.getProp('fontSize') + "px " + this.getProp('fontFace');
        context.textBaseline = 'top';
        var b = this.getTextObject();
        context.fillText(this.getProp('text'), b.left, b.top);
      }

      // Paint completed
      this.restoreContext(context);
    },

    setProp: function(key, value) {
      this._super(key, value);

      switch (key) {
        case 'isOn':
          if (this.updatePropValue('isOn', value)) {
            this.requestPaint();
          }
          break;
        case 'radius':
          if (this.updatePropValue('radius', value)) {
            this.requestPaint();
          }
          break;
        case 'focusStyle':
          // TODO: to be enhanced
          this.properties['focusStyle'] = Object.assign(
            this.properties['focusStyle'],
            value
          );
          this.requestPaint();
          break;
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
