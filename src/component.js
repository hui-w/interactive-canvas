/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/interactive-canvas
 * @licence MIT
 *
 * [Class: Component]
 * Base class of components which does't implement "Paint()" method
 */

'use strict';

(function() {
  var prototype = {
    left: null,
    top: null,
    width: null,
    height: null,
    id: null,

    // Protected properties
    parent: null,
    controls: null,

    // Properties with getter and setter
    properties: null,

    // Absolute position of the component
    // This will be caculated when renderring
    absLeft: null,
    absTop: null,

    // Events
    onRequestPaint: null,
    onPositionChange: null,
    onSizeChange: null,
    onWillPaint: null,
    onDidPaint: null,

    // Interactive
    onCapture: null,
    onDrag: null,
    onRelease: null,

    init: function(left, top, width, height, id) {
      this.left = left ? left : 0;
      this.top = top ? top : 0;
      this.width = width ? width : 0;
      this.height = height ? height : 0;
      this.id = id;

      this.controls = new List();
      this.parent = null;

      this.properties = {
        isEnabled: true,
        isVisible: true,
        fillStyle: null,
        strokeStyle: '#000',
        lineWidth: 0
      };

      // Initial value of absolute position
      this.absLeft = null;
      this.absTop = null;

      this.onRequestPaint = new EventHandler();
      this.onPositionChange = new EventHandler();
      this.onSizeChange = new EventHandler();
      this.onCapture = new EventHandler();
      this.onDrag = new EventHandler();
      this.onRelease = new EventHandler();
      this.onWillPaint = new EventHandler();
      this.onDidPaint = new EventHandler();

      // When component added
      this.controls.onAdd.add(function(component) {
        // Set the parent of the child
        component.parent = this;

        component.onRequestPaint.add(function() {
          // Invoke the request paint chain
          this.onRequestPaint.trigger();
        }.bind(this));
      }.bind(this));
    },

    // [Protected] Update the value of the property
    updatePropValue: function(key, value, propagate) {
      if (this.properties[key] === value) {
        return false;
      }

      // Update the value and request to paint
      this.properties[key] = value;

      // Update children
      if (propagate) {
        this.controls.forEach(function(component) {
          component.setProp(key, value, propagate);
        });
      }

      return true;
    },

    // Set the value of the property
    getProp: function(key, subKey) {
      if (key == null) {
        return null;
      }

      if (this.properties[key] != null && subKey != null) {
        return this.properties[key][subKey];
      } else {
        return this.properties[key];
      }
    },

    // Set te value of the property
    setProp: function(key, value) {
      switch (key) {
        case 'isEnabled':
          if (this.updatePropValue('isEnabled', value, true)) {
            this.requestPaint();
          }
          break;
        case 'isVisible':
          if (this.updatePropValue('isVisible', value, true)) {
            this.requestPaint();
          }
          break;
        case 'fillStyle':
          if (this.updatePropValue('fillStyle', value)) {
            this.requestPaint();
          }
          break;
        case 'strokeStyle':
          if (this.updatePropValue('strokeStyle', value)) {
            this.requestPaint();
          }
          break;
        case 'lineWidth':
          if (this.updatePropValue('lineWidth', value)) {
            this.requestPaint();
          }
          break;
      }
    },

    // Invoked in the callback of WillPaint
    saveContext: function(context) {
      if (this.absLeft == null || this.absTop == null) {
        // Absolute left and top are usually caculated by parent component
        // This case is for the root controls
        this.absLeft = this.left;
        this.absTop = this.top;
      }
      context.save();

      if (this.absLeft !== 0 || this.absTop !== 0) {
        context.translate(this.absLeft, this.absTop);
      }

      // Trigger the will paint event
      this.onWillPaint.trigger(context);
    },

    // Invoked in the callback of DidPaint
    restoreContext: function(context) {
      // Trigger the did paint event
      this.onDidPaint.trigger(context);

      // Restore the context
      context.restore();

      // Paint the visible children
      this.controls.filter(function(component) {
        return component.getProp('isVisible') &&
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
      if (!this.getProp('isEnabled') || !this.getProp('isVisible')) {
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

    // Trigger the event to push the paint request into the queue
    requestPaint: function() {
      this.onRequestPaint.trigger();
    },

    // Find the context in the parent chain
    getContext: function() {
      var component = this;
      while (component != null) {
        if (component.context) {
          return component.context;
        }
        component = component.parent;
      }

      return null;
    },

    // Calculate the absolute position by parents
    getAbsPostion: function() {
      var left = this.left;
      var top = this.top;
      var parent = this.parent;

      // Get the left and top of all parents
      while (parent != null) {
        left += parent.left;
        top += parent.top;
        parent = parent.parent;
      }

      return { left: left, top: top };
    },

    setPosition: function(left, top) {
      if (this.left === left && this.top === top) {
        return;
      }

      this.left = left;
      this.top = top;
      this.requestPaint();

      // Callbacks
      this.onPositionChange.trigger(left, top);

      // Update children
      this.controls.forEach(function(control) {
        // Recaculate children's translate
        control.requestPaint();
      });
    },

    setSize: function(width, height) {
      if (this.width === width && this.height === height) {
        return;
      }

      this.width = width;
      this.height = height;

      // Callbacks
      this.onSizeChange.trigger(width, height);

      this.requestPaint();
    }
  };

  window.Component = Class.extend(prototype);
})();
