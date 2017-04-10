/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT
 *
 * Canvas
 */

(function() {
  var prototype = {
    wrapper: null,
    width: null,
    height: null,
    isFullscreen: null,
    canvas: null,
    context: null,
    components: null,
    delayTimer: null,

    // Event handlers
    onResized: null,
    onWillPaint: null,
    onDidPaint: null,

    init: function(wrapper, width, height, isFullscreen) {
      // Init the members
      this.wrapper = wrapper;
      this.width = width;
      this.height = height;
      this.isFullscreen = isFullscreen;
      this.canvas = null;
      this.components = new List();
      this.delayTimer = null;

      // Init the event handlers
      this.onResized = null;
      this.onWillPaint = null;
      this.onDidPaint = null;

      // Methods for initialization
      this.render();
    },

    render: function() {
      this.canvas = this.wrapper.createChild("canvas", {
        "width": this.width,
        "height": this.height
      });
      if (typeof G_vmlCanvasManager != "undefined") {
        this.canvas = G_vmlCanvasManager.initElement(this.canvas);
      }
      this.context = this.canvas.getContext("2d");

      // Handle the mouse events
      this.canvas.addEventListener("mousedown", this.handleMouse.bind(this), false);
      this.canvas.addEventListener("mousemove", this.handleMouse.bind(this), false);
      this.canvas.addEventListener("mouseup", this.handleMouse.bind(this), false);

      // Handle the touch events
      this.canvas.addEventListener("touchstart", this.handleTouch.bind(this), false);
      this.canvas.addEventListener("touchend", this.handleTouch.bind(this), false);
      this.canvas.addEventListener("touchmove", this.handleTouch.bind(this), false);
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
        this.paint();
        this.delayTimer = null;
      }.bind(this), 50);
    },

    paint: function() {
      // Clear the canvas
      this.canvas.width = this.canvas.width;
      this.canvas.height = this.canvas.height;

      // Before painting components
      if (typeof this.onWillPaint === 'function') {
        this.onWillPaint(this.context);
      }

      // Paint all managed components
      this.paintComponents(this.context);

      // After painting components
      if (typeof this.onDidPaint === 'function') {
        this.onDidPaint(this.context);
      }
    },

    paintComponents: function(context) {
      this.components.forEach(function(component) {
        if (typeof component.paint === 'function') {
          component.paint(context);
        }
      });
    },

    /*
     * ===== Handle the events
     */

    // Mouse events
    handleMouse: function(e) {
      switch (e.type) {
        case "mousedown":
          this.capture(e);
          break;
        case "mousemove":
          this.drag(e);
          break;
        case "mouseup":
          this.release(e);
          break;
      }
    },

    // Touch events
    handleTouch: function(e) {
      e.preventDefault();
      switch (e.type) {
        case "touchstart":
          if (e.touches.length == 1) {
            this.capture(e.targetTouches[0]);
          } else if (e.touches.length == 2) {}
          break;
        case "touchend":
          if (e.changedTouches.length == 1) {
            this.release(e.changedTouches[0]);
          }
          break;
        case "touchmove":
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
      this.components.forEach(function(component) {
        if (typeof component.handleEvent === 'function') {
          component.handleEvent(eventType, left, top);
        }
      });
    }
  };

  this.Canvas = Class.extend(prototype);
})();
