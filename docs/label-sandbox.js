/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/interactive-canvas
 * @licence MIT
 */

'use strict';

(function() {
  function LabelSandbox(wrapperId) {
    this.label = null;
    this.wrapper = $(wrapperId);

    this.labelProps = {
      left: 250,
      top: 100,
      width: 220,
      height: 40,
      text: 'This is the sample text',
      horizontalAlign: 'center',
      verticalAlign: 'middle'
    };

    this.renderCanvas();
    this.renderToolbar();
  }

  LabelSandbox.prototype = {
    renderCanvas: function() {
      var canvas = new Canvas(500, 200);
      canvas.setProp('lineWidth', 1);
      // Render the crossing line into canvas
      canvas.onWillPaint.add(function(context) {
        context.save();
        context.antiFuzzyLine(250, 0, 250, 200);
        context.antiFuzzyLine(0, 100, 500, 100);
        context.lineWidth = 1;
        context.strokeStyle = '#0f0';
        context.stroke();
        context.restore();
      });

      // Render a Label into the canvas
      this.label = new Label(
        this.labelProps.left,
        this.labelProps.top,
        this.labelProps.width,
        this.labelProps.height,
        this.labelProps.text
      );
      this.label.setProp('fontSize', 20);
      this.label.setProp('horizontalAlign', this.labelProps.horizontalAlign);
      this.label.setProp('verticalAlign', this.labelProps.verticalAlign);
      this.label.onWillPaint.add(function(context) {
        // Fill the boundary background
        var b = this.getTextObject();
        context.fillStyle = 'rgba(255, 229, 0, 0.5)';
        context.fillRect(b.left, b.top, b.width, b.height);

        // Stroke the width and height
        context.strokeStyle = '#f00';
        context.lineWidth = 1;
        context.strokeRect(0, 0, this.width, this.height);
      }.bind(this.label));
      canvas.controls.add(this.label);

      // Render the canvas into the wrapper
      canvas.renderInto(this.wrapper);
    },

    /* Apply the values to label properties */
    applyValue: function() {
      this.labelProps = {
        left: $('txtLeft').value.isNumber() ? $('txtLeft').value - 0 : this.labelProps['left'],
        top: $('txtTop').value.isNumber() ? $('txtTop').value - 0 : this.labelProps['top'],
        width: $('txtWidth').value.isNumber() ? $('txtWidth').value - 0 : this.labelProps['width'],
        height: $('txtHeight').value.isNumber() ? $('txtHeight').value - 0 : this.labelProps['height'],
        text: $('txtContent').value,
        horizontalAlign: $('selHAlign').options[$('selHAlign').selectedIndex].value,
        verticalAlign: $('selVAlign').options[$('selVAlign').selectedIndex].value
      };
      this.label.setPosition(this.labelProps['left'], this.labelProps['top']);
      this.label.setSize(this.labelProps['width'], this.labelProps['height']);
      this.label.setProp('text', this.labelProps['text']);
      this.label.setProp('horizontalAlign', this.labelProps['horizontalAlign']);
      this.label.setProp('verticalAlign', this.labelProps['verticalAlign']);
    },

    /* Render a toolbar to get and set the properties of the label */
    renderToolbar: function() {
      // Line 1
      var p1 = this.wrapper.createChild('p', {
        class: 'label-fields'
      });

      // Left
      p1.createChild('span', {
        class: 'key'
      }, 'Left:');

      p1.createChild('input', {
        type: 'text',
        id: 'txtLeft',
        style: 'width: 50px;',
        class: 'value',
        value: this.labelProps['left']
      }).addEventListener("blur", function() {
        this.applyValue();
      }.bind(this), false);

      // Top
      p1.createChild('span', {
        class: 'key'
      }, 'Top:');

      p1.createChild('input', {
        type: 'text',
        id: 'txtTop',
        style: 'width: 50px;',
        class: 'value',
        value: this.labelProps['top']
      }).addEventListener("blur", function() {
        this.applyValue();
      }.bind(this), false);

      // Width
      p1.createChild('span', {
        class: 'key'
      }, 'Width:');

      p1.createChild('input', {
        type: 'text',
        id: 'txtWidth',
        style: 'width: 50px;',
        class: 'value',
        value: this.labelProps['width']
      }).addEventListener("blur", function() {
        this.applyValue();
      }.bind(this), false);

      // Height
      p1.createChild('span', {
        class: 'key'
      }, 'Height:');

      p1.createChild('input', {
        type: 'text',
        id: 'txtHeight',
        style: 'width: 50px;',
        class: 'value',
        value: this.labelProps['height']
      }).addEventListener("blur", function() {
        this.applyValue();
      }.bind(this), false);

      // Line 2
      var p2 = this.wrapper.createChild('p', {
        class: 'label-fields'
      });

      // Text content
      p2.createChild('div', null, 'Text:');
      p2.createChild('textarea', {
        style: 'width: 500px; height: 100px;',
        id: 'txtContent'
      }, this.labelProps['text']).addEventListener("blur", function() {
        this.applyValue();
      }.bind(this), false);

      // Line 3
      var p3 = this.wrapper.createChild('p', {
        class: 'label-fields'
      });

      // Horizontal Align
      p3.createChild('span', {
        class: 'key'
      }, 'Horizontal Align:');
      var selH = p3.createChild('select', {
        style: 'width: 100px;',
        id: 'selHAlign',
        class: 'value'
      });
      selH.addEventListener("change", function() {
        this.applyValue();
      }.bind(this), false);
      selH.createChild('option',
        this.labelProps['horizontalAlign'] == 'left' ? { value: 'left', selected: true } : { value: 'left' },
        'Left');
      selH.createChild('option',
        this.labelProps['horizontalAlign'] == 'center' ? { value: 'center', selected: true } : { value: 'center' },
        'Center');
      selH.createChild('option',
        this.labelProps['horizontalAlign'] == 'right' ? { value: 'right', selected: true } : { value: 'right' },
        'Right');

      // Vertical Align
      p3.createChild('span', {
        class: 'key'
      }, 'Vertical Align:');
      var selV = p3.createChild('select', {
        style: 'width: 100px;',
        id: 'selVAlign',
        class: 'value'
      });
      selV.addEventListener("change", function() {
        this.applyValue();
      }.bind(this), false);
      selV.createChild('option',
        this.labelProps['verticalAlign'] == 'top' ? { value: 'top', selected: true } : { value: 'top' },
        'Top');
      selV.createChild('option',
        this.labelProps['verticalAlign'] == 'middle' ? { value: 'middle', selected: true } : { value: 'middle' },
        'Middle');
      selV.createChild('option',
        this.labelProps['verticalAlign'] == 'bottom' ? { value: 'bottom', selected: true } : { value: 'bottom' },
        'Bottom');
    }
  };

  window.LabelSandbox = LabelSandbox;
})();
