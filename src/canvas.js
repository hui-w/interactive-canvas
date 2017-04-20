/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
 * @licence MIT
 *
 * Canvas
 */

'use strict';

(function() {
  var prototype = {
    wrapper: null,
    isFullscreen: null,
    canvas: null,
    context: null,
    delayTimer: null,

    // Event handlers
    onResized: null,
    onWillPaint: null,
    onDidPaint: null,

    init: function(wrapper, width, height, isFullscreen) {
      this._super(0, 0, width, height);

      // Init the members
      this.wrapper = wrapper;
      this.isFullscreen = isFullscreen;
      this.canvas = null;
      this.delayTimer = null;

      // Init the event handlers
      this.onResized = new EventHandler();
      this.onWillPaint = new EventHandler();
      this.onDidPaint = new EventHandler();

      // Handle the painting request from children
      this.onRequestPaint.add(function() {
        // When painting is requested by children
        this.requestPaint();
      }.bind(this));

      // Render the canvas when initialized
      this.render();
    },

    render: function() {
      this.canvas = this.wrapper.createChild('canvas', {
        'width': this.width,
        'height': this.height
      });
      if (typeof G_vmlCanvasManager != 'undefined') {
        this.canvas = G_vmlCanvasManager.initElement(this.canvas);
      }
      this.context = this.canvas.getContext('2d');

      // Handle the mouse events
      this.canvas.addEventListener('mousedown', this.handleMouse.bind(this), false);
      this.canvas.addEventListener('mousemove', this.handleMouse.bind(this), false);
      this.canvas.addEventListener('mouseup', this.handleMouse.bind(this), false);

      // Handle the touch events
      this.canvas.addEventListener('touchstart', this.handleTouch.bind(this), false);
      this.canvas.addEventListener('touchend', this.handleTouch.bind(this), false);
      this.canvas.addEventListener('touchmove', this.handleTouch.bind(this), false);

      // Request to paint when renderred
      this.requestPaint();
    },

    /*
     * ===== Handle the paint
     */

    // Add the paint request into the queue
    requestPaint: function() {
      if (this.delayTimer) {
        // To aviod duplicated render
        return;
      }

      this.delayTimer = setTimeout(function() {
        this.paint(this.context);
        this.delayTimer = null;
      }.bind(this), 50);
    },

    paint: function(context) {
      this.onWillPaint.trigger(context);

      // Clear the canvas
      this.canvas.width = this.canvas.width;
      this.canvas.height = this.canvas.height;

      // Prepare to paint
      this.saveContext(context);

      // Paint the canvas
      // Background
      if (this.getProp('fillStyle')) {
        context.fillStyle = this.getProp('fillStyle');
        context.fillRect(0, 0, this.width, this.height);
      }

      // Border
      if (this.getProp('strokeStyle') && this.getProp('lineWidth') > 0) {
        context.lineWidth = this.getProp('lineWidth');
        context.strokeStyle = this.getProp('strokeStyle');
        context.strokeRect(0, 0, this.width, this.height);
      }

      // Paint completed
      this.restoreContext(context);

      this.onDidPaint.trigger(context);
    },

    /*
     * ===== Handle the events
     */

    // Mouse events
    handleMouse: function(e) {
      switch (e.type) {
        case 'mousedown':
          this.capture(e);
          break;
        case 'mousemove':
          this.drag(e);
          break;
        case 'mouseup':
          this.release(e);
          break;
      }
    },

    // Touch events
    handleTouch: function(e) {
      e.preventDefault();
      switch (e.type) {
        case 'touchstart':
          if (e.touches.length == 1) {
            this.capture(e.targetTouches[0]);
          } else if (e.touches.length == 2) {}
          break;
        case 'touchend':
          if (e.changedTouches.length == 1) {
            this.release(e.changedTouches[0]);
          }
          break;
        case 'touchmove':
          if (e.changedTouches.length == 1) {
            this.drag(e.changedTouches[0]);
          } else if (e.touches.length == 2) {}
          break;
      }
    },

    // Get the event position on the canvas
    getEventPosition: function(ev) {
      return {
        left: ev.pageX - this.canvas.offsetLeft,
        top: ev.pageY - this.canvas.offsetTop
      };
    },

    capture: function(e) {
      var pos = this.getEventPosition(e);
      this.dispatchEvent('capture', pos.left, pos.top);
    },

    drag: function(e) {
      var pos = this.getEventPosition(e);
      this.dispatchEvent('drag', pos.left, pos.top);
    },

    release: function(e) {
      var pos = this.getEventPosition(e);
      this.dispatchEvent('release', pos.left, pos.top);
    },

    // Dispatch the event to children
    dispatchEvent: function(eventType, left, top) {
      this.controls.forEach(function(component) {
        if (typeof component.handleEvent === 'function') {
          component.handleEvent(eventType, left, top);
        }
      });
    }
  };

  window.Canvas = Component.extend(prototype);
})();
