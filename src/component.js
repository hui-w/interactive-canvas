/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT 
 *
 * Base class for canvas components
 */
var component_prototype = {
  // Position and size
  id: null,
  left: 0,
  top: 0,
  width: 0,
  height: 0,

  isEnabled: true,
  isVisible: true,

  // Look and feel
  fillStyle: null,
  strokeStyle: null,
  lineWidth: 0,

  /* Method to render the extra content
   * Example:
   *  panel.onRenderExtra.push(function(context) {
   *    context.fillStyle = "RGBA(255, 0, 0, 0.5)";
   *    context.fillRect(0, 0, this.width, this.height);
   *  });
   */
  onRenderExtra: [],

  /*
   * Events
   */
  onSizeChanged: [],
  onPositionChanged: [],

  /*
   * Parent and child components
   */
  parent: null,
  children: [],

  // Event to update UI
  onrequestPaint: null,

  // Events handler
  onCapture: null,
  onDrag: null,
  onRelease: null,

  init: function(left, top, width, height, id) {
    // Init the component
    if (left != undefined) {
      this.left = left;
    }
    if (top != undefined) {
      this.top = top;
    }
    if (width != undefined) {
      this.width = width;
    }
    if (height != undefined) {
      this.height = height;
    }
    if (id != undefined) {
      this.id = id;
    }

    // Init all values
    this.isEnabled = true;
    this.isVisible = true;
    this.fillStyle = null;
    this.strokeStyle = null;
    this.lineWidth = 0;
    this.onRenderExtra = [];
    this.onSizeChanged = [];
    this.onPositionChanged = [];
    this.parent = null;
    this.children = [];
    this.onrequestPaint = null;
  },

  setEnabled: function(isEnabled) {
    if (this.isEnabled === isEnabled) {
      return;
    }

    this.isEnabled = isEnabled;
    this.requestPaint();

    // Update children
    this.children.forEach(function(child) {
      child.setEnabled(isEnabled);
    });
  },

  setVisible: function(isVisible) {
    if (this.isVisible === isVisible) {
      return;
    }

    this.isVisible = isVisible;
    this.requestPaint();

    // Update children
    this.children.forEach(function(child) {
      child.setVisible(isVisible);
    });
  },

  setPosition: function(left, top) {
    if (this.left === left && this.top === top) {
      return;
    }

    this.left = left;
    this.top = top;
    this.requestPaint();

    // Callbacks
    this.triggerCallbacks(this.onPositionChanged, [left, top]);

    // Update children
    this.children.forEach(function(child) {
      // Recaculate children's translate
      child.requestPaint();
    });
  },

  setPaintHandler: function(handler) {
    this.onrequestPaint = handler;

    // Update children
    this.children.forEach(function(child) {
      child.setPaintHandler(handler);
    });
  },

  setSize: function(width, height) {
    if (this.width === width && this.height === height) {
      return;
    }

    this.width = width;
    this.height = height;

    // Callbacks
    this.triggerCallbacks(this.onSizeChanged, [width, height]);

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

  setFillStyle: function(fillStyle) {
    if (this.fillStyle === fillStyle) {
      return;
    }

    this.fillStyle = fillStyle;
    this.requestPaint();
  },

  // Add a child component
  addChild: function(child) {
    this.children.push(child);
    child.bindParent(this);
  },

  // Set the parent of current component
  bindParent: function(parent) {
    this.parent = parent;
  },

  // Request redraw
  requestPaint: function() {
    if (typeof this.onrequestPaint == 'function') {
      this.onrequestPaint();
    }
  },

  // Get absolute position on the canvas
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

  // Check if the point is inside the component rectangle
  isPointInside: function(left, top) {
    var position = this.getAbsPostion();
    return left >= position.left &&
      left <= position.left + this.width &&
      top >= position.top &&
      top <= position.top + this.height;
  },

  handleEvent: function(eventType, left, top) {
    if (!this.isEnabled || !this.isVisible) {
      // The component is disabled of hidden
      return;
    }

    switch (eventType) {
      case 'capture':
        if (typeof this.onCapture === 'function') {
          this.onCapture(left, top);
        }
        break;
      case 'drag':
        if (typeof this.onDrag === 'function') {
          this.onDrag(left, top);
        }
        break;
      case 'release':
        if (typeof this.onRelease === 'function') {
          this.onRelease(left, top);
        }
        break;
    }

    // Propagate to children
    this.children.forEach(function(child) {
      child.handleEvent(eventType, left, top);
    })
  },

  render: function(context) {
    if (!this.isVisible) {
      // The component is hidden
      return;
    }

    context.save();

    // Get the absolute left and top
    var position = this.getAbsPostion();
    context.translate(position.left, position.top);

    // Background
    if (this.fillStyle) {
      context.fillStyle = this.fillStyle;
      context.fillRect(0, 0, this.width, this.height);
    }

    // Border
    if (this.strokeStyle && this.lineWidth > 0) {
      context.lineWidth = this.lineWidth;
      context.strokeStyle = this.strokeStyle;
      context.strokeRect(0, 0, this.width, this.height);
    }

    // Render customized content
    this.triggerCallbacks(this.onRenderExtra, [context]);

    context.restore();

    // Render all children
    this.children.forEach(function(child) {
      child.render(context);
    });
  },

  // Trigger callbacks with args array
  triggerCallbacks: function(callbacks, args) {
    if (typeof callbacks == 'function') {
      callbacks.apply(this, args);
    } else if (typeof callbacks == 'object') {
      for (var i = 0; i < callbacks.length; i++) {
        var callback = callbacks[i];
        if (typeof callback == 'function') {
          callback.apply(this, args);
        }
      }
    }
  }
};

var Component = Class.extend(component_prototype);
