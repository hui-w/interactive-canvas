/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
 * @licence MIT
 *
 * Component
 * Does't implement "Paint()" method
 */

(function() {
  var prototype = {
    left: null,
    top: null,
    width: null,
    height: null,
    id: null,

    isEnabled: null,
    isVisible: null,
    controls: null,

    // Look and feel
    fillStyle: null,
    strokeStyle: null,
    lineWidth: null,

    // Absolute position of the component
    // This will be caculated when renderring
    absLeft: null,
    absTop: null,

    // Event to update UI
    onRequestPaint: null,

    // Events handler
    onCapture: null,
    onDrag: null,
    onRelease: null,

    init: function(left, top, width, height, id) {
      this.left = left;
      this.top = top;
      this.width = width;
      this.height = height;
      this.id = id;

      // Initial value of absolute position
      this.absLeft = null;
      this.absTop = null;

      this.isEnabled = true;
      this.isVisible = true;
      this.controls = new List();

      this.fillStyle = null;
      this.strokeStyle = '#000';
      this.lineWidth = 0;

      this.onRequestPaint = new EventHandler();
      this.onCapture = new EventHandler();
      this.onDrag = new EventHandler();
      this.onRelease = new EventHandler();

      // When component added
      this.controls.onAdd.add(function(component) {
        component.onRequestPaint.add(function() {
          // Invoke the request paint chain
          this.onRequestPaint.trigger();
        }.bind(this));
      }.bind(this));
    },

    // Invoked in the callback of WillPaint
    componentWillPaint: function(context) {
      if (!this.absLeft || !this.absTop) {
        // Absolute left and top are usually caculated by parent component
        // This case is for the root controls
        this.absLeft = this.left;
        this.absTop = this.top;
      }
      context.save();
      if (this.absLeft !== 0 && this.absTop !== 0) {
        context.translate(this.absLeft, this.absTop);
      }
    },

    // Invoked in the callback of DidPaint
    componentDidPaint: function(context) {
      // Restore the context
      context.restore();

      // Paint the visible children
      this.controls.filter(function(component) {
        return component.isVisible &&
          typeof component.paint === 'function';
      }).forEach(function(component) {
        // Calculate the absolute position before renderring the component
        component.absLeft = this.absLeft + component.left;
        component.absTop = this.absTop + component.top;
        component.paint(context);
      }.bind(this));
    },

    // Check if the point is inside the component rectangle
    // Assume this will always be called after painting
    isPointInside: function(left, top) {
      return left >= this.absLeft &&
        left <= this.absLeft + this.width &&
        top >= this.absTop &&
        top <= this.absTop + this.height;
    },

    handleEvent: function(eventType, left, top) {
      if (!this.isEnabled || !this.isVisible) {
        // The component is disabled of hidden
        return;
      }

      if (this.isPointInside(left, top)) {
        switch (eventType) {
          case 'capture':
            this.onCapture.trigger(left, top);
            break;
          case 'drag':
            this.onDrag.trigger(left, top);
            break;
          case 'release':
            this.onRelease.trigger(left, top);
            break;
        }
      }

      // Propagate to children
      this.controls.forEach(function(component) {
        if (typeof component.handleEvent === 'function') {
          component.handleEvent(eventType, left, top);
        }
      });
    },

    setEnabled: function(isEnabled) {
      if (this.isEnabled === isEnabled) {
        return;
      }

      this.isEnabled = isEnabled;
      this.requestPaint();

      // Update children
      this.controls.forEach(function(component) {
        component.setEnabled(isEnabled);
      });
    },

    setVisible: function(isVisible) {
      if (this.isVisible === isVisible) {
        return;
      }

      this.isVisible = isVisible;
      this.requestPaint();

      // Update children
      this.controls.forEach(function(component) {
        component.setVisible(isVisible);
      });
    },

    setFillStyle: function(fillStyle) {
      if (this.fillStyle === fillStyle) {
        return;
      }

      this.fillStyle = fillStyle;
      this.requestPaint();
    },

    setStrokeStyle: function(strokeStyle) {
      if (this.strokeStyle === strokeStyle) {
        return;
      }

      this.strokeStyle = strokeStyle;
      this.requestPaint();
    },

    setLineWidth: function(lineWidth) {
      if (this.lineWidth === lineWidth) {
        return;
      }

      this.lineWidth = lineWidth;
      this.requestPaint();
    },

    // Trigger the event to push the paint request into the queue
    requestPaint: function() {
      this.onRequestPaint.trigger();
    }
  };

  this.Component = Class.extend(prototype);
})();
