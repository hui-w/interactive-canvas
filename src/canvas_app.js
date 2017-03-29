/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 *
 * Base class for canvas app
 */
var canvas_app_prototype = {
  components: null,
  delayTimer: null,

  width: null,
  height: null,

  canvas: null,
  context: null,

  // Callbacks for events
  onResized: null,
  onWillPaint: null,
  onDidPaint: null,

  init: function() {
    this.components = [];
    this.delayTimer = null;

    this.width = 0;
    this.height = 0;

    this.canvas = null;
    this.context = null;

    // Callbacks for events
    this.onResized = this.canvasResized;
    this.onWillPaint = this.canvasWillPaint;
    this.onDidPaint = this.canvasDidPaint;
  },

  /*
   * Register a component to the managed list
   */
  registerComponent: function(component) {
    component.setPaintHandler(function() {
      this.requestPaint();
    }.bind(this));

    this.components.push(component);
  },

  /*
   * Register a set of components to the managed list
   */
  registerComponents: function(components) {
    components.forEach(function(component) {
      this.registerComponent(component);
    }.bind(this));
  },

  /*
   * Add the paint request into the queue
   */
  requestPaint: function() {
    if (this.delayTimer) {
      // To aviod duplicated render
      return;
    }

    this.delayTimer = setTimeout(function() {
      this.redraw();
      this.delayTimer = null;
    }.bind(this), 50);
  },

  redrawComponents: function(context) {
    for (var i = 0; i < this.components.length; i++) {
      if (typeof this.components[i].render === 'function') {
        this.components[i].render(context);
      }
    }
  },

  dispatchEvent: function(eventType, left, top) {
    for (var i = 0; i < this.components.length; i++) {
      var component = this.components[i];
      component.handleEvent(eventType, left, top);
    }
  },

  render: function() {
    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight;

    // Create the wrapper
    var rootElement = document.body;
    var wrapper = rootElement.createChild("div", {
      "id": "app-wrapper",
      "style": "padding: " + Config.Canvas.margin + "px"
    })

    // Initialize the canvas and the context
    this.canvas = wrapper.createChild("canvas", {
      "id": "app-canvas",
      "width": 0,
      "height": 0
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

    // Calculate the size when renderred
    this.resize();

    // Check if the window size is changed
    var checkWindowsize = function() {
      var nwidth = document.documentElement.clientWidth;
      var nheight = document.documentElement.clientHeight;
      if (nwidth != this.width || nheight != this.height) {
        this.width = nwidth;
        this.height = nheight;
        this.resize();
      }
    }.bind(this);
    setInterval(checkWindowsize, 200);
  },

  resize: function() {
    // Upate the size of the canvas
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    if (typeof this.onResized === 'function') {
      this.onResized(this.width, this.height);
    }

    this.requestPaint();
  },

  // Get the event position on the canvas
  getEventPosition: function(ev) {
    return {
      left: ev.pageX - this.canvas.offsetLeft,
      top: ev.pageY - this.canvas.offsetTop
    };
  },

  /* Mouse events */
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

  /* Touch events */
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

  redraw: function() {
    // Clear the canvas
    this.canvas.width = this.canvas.width;
    this.canvas.height = this.canvas.height;

    // Before redrawing components
    if (typeof this.onWillPaint === 'function') {
      this.onWillPaint(this.context);
    }

    // Redraw all managed components
    this.redrawComponents(this.context);

    // After redrawing components
    if (typeof this.onDidPaint === 'function') {
      this.onDidPaint(this.context);
    }
  }
};

var CanvasApp = Class.extend(canvas_app_prototype);
