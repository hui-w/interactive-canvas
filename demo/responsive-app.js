/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
 * @licence MIT

 Tip:
  Set HTML body style for full screen app:
  <body style="overflow: hidden">
 */

'use strict';

(function() {
  function ResponsiveApp(wrapperId) {
    this.wrapperId = wrapperId;
    this.canvas = null;
    this.toolbar = null;

    this.render();
  }

  ResponsiveApp.prototype = {
    render: function() {
      // Create a canvas object
      var isFullScreen = true;
      this.canvas = new Canvas(0, 0, isFullScreen);
      this.canvas.setFillStyle('#FFF');
      this.canvas.onDidPaint.add(function(context) {
        console.log('Canvas Did Paint');
      }.bind(this));

      // Render a toolbar
      this.toolbar = new Toolbar(0, 0, 0, 0, 'footer1');
      this.toolbar.setFillStyle('#F2F2F2');

      this.canvas.controls.add(this.toolbar);

      // Adjust the position and size of the toolbar when canvas size changed
      this.canvas.onSizeChange.add(function(width, height) {
        // Make sure the tool bar has the same width of the canvas
        // and it's always docked to the bottom of the canvas
        this.toolbar.setPosition(0, height - 100);
        this.toolbar.setSize(width, 100);
      }.bind(this));

      // Render the canvas when everything is ready
      var wrapper = $(this.wrapperId);
      this.canvas.renderInto(wrapper);
    }
  };

  window.ResponsiveApp = ResponsiveApp;

  /* ===== Define the class for toolbar */
  window.Toolbar = Panel.extend({
    saveButton: null,

    init: function(left, top, width, height, id) {
      this._super(left, top, width, height, id);

      // Create a button to render on the right bottom
      this.saveButton = new Button(0, 0, 120, 30, 'Save Button', 'button1');
      this.controls.add(this.saveButton);

      // Adjust the position when toolbar's size changed 
      this.onSizeChange.add(function(width, height) {
        // Make sure the button is always on the right side of the toolbar
        this.saveButton.setPosition(width - 155, 35);
      }.bind(this));
    }
  });

})();
