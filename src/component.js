/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/gomoku
 * @licence MIT
 *
 * Component
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
    components: null,

    // Absolute position of the component
    // This will be caculated when renderring
    absLeft: null,
    absTop: null,

    // Event to update UI
    onRequestPaint: null,

    init: function(left, top, width, height, id) {
      this.left = left;
      this.top = top;
      this.width = width;
      this.height = height;
      this.id = id;

      // Initial value of absolute position
      this.absLeft = 0;
      this.absTop = 0;

      this.isEnabled = true;
      this.isVisible = true;
      this.components = new List();
      this.onRequestPaint = null;
    },

    paint: function(context) {
      // Paint the visible children
      this.components.filter(function(component) {
        return component.isVisible;
      }).forEach(function(component) {
        // Calculate the absolute position before renderring the component
        component.absLeft = this.absLeft + component.left;
        component.absTop = this.absTop + component.top;

        // Translate base on parent's translation
        context.save();
        context.translate(component.left, component.top);
        component.paint(context);
        context.restore();
      }.bind(this));
    },

    handleEvent: function(eventType, left, top) {

    },

    setEnabled: function(isEnabled) {
      if (this.isEnabled === isEnabled) {
        return;
      }

      this.isEnabled = isEnabled;
      this.requestPaint();

      // Update children
      this.components.forEach(function(component) {
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
      this.components.forEach(function(component) {
        component.setVisible(isVisible);
      });
    },

    // Trigger the event to push the paint request into the queue
    requestPaint: function() {
      if (typeof this.onRequestPaint == 'function') {
        this.onRequestPaint();
      }
    },
  };

  this.Component = Class.extend(prototype);
})();
