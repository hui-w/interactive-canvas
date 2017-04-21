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
    this.width = 0;
    this.height = 0;
    this.canvas = null;
    this.label = null;

    // A user defined component derived from Panel
    this.toolbar = null;

    this.render();
  }

  ResponsiveApp.prototype = {
    render: function() {
      // Create a canvas object
      var isFullScreen = true;
      this.canvas = new Canvas(0, 0, isFullScreen);
      this.canvas.setProp('fillStyle', '#FFF');
      this.canvas.onDidPaint.add(function(context) {
        console.log('Canvas Did Paint');
      }.bind(this));

      // Create a toolbar and add into the canvas
      this.toolbar = new Toolbar(0, 0, 0, 0, 'footer1');
      this.toolbar.setProp('fillStyle', '#F2F2F2');
      this.canvas.controls.add(this.toolbar);

      // Create a label and add into the canvas
      this.label = new Label(10, 10, 0, 0, 'Label Text', 'label1')
      this.label.setProp('isVisible', false);
      this.label.setProp('fontSize', 20);
      this.canvas.controls.add(this.label);

      // When canvas size changed,
      // adjust the toolbar and the label
      this.canvas.onSizeChange.add(function(width, height) {
        // Keep the value of new width and height
        this.width = width;
        this.height = height;

        // Make sure the tool bar has the same width of the canvas
        // and it's always docked to the bottom of the canvas
        this.toolbar.setPosition(0, height - 100);
        this.toolbar.setSize(width, 100);

        this.updateLabelPosition();
      }.bind(this));

      // When label text changed, update the position
      this.label.onTextChange.add(function() {
        this.updateLabelPosition();
      }.bind(this));

      this.toolbar.onSave = function() {
        this.label.setProp('isVisible', true);
        this.label.setProp('text', 'Great! You have just clicked the save button.');
      }.bind(this);

      // Render the canvas when everything is ready
      var wrapper = $(this.wrapperId);
      this.canvas.renderInto(wrapper);
    },

    updateLabelPosition: function() {
      // Keep the label on the center screen
      var labelLeft = (this.width - this.label.width) / 2;
      var labelTop = (this.height - 100 - this.label.height) / 2;
      this.label.setPosition(labelLeft, labelTop);
    }
  };

  window.ResponsiveApp = ResponsiveApp;

  /* ===== Define the class for toolbar */
  window.Toolbar = Panel.extend({
    saveButton: null,
    onSave: null,

    init: function(left, top, width, height, id) {
      this._super(left, top, width, height, id);
      this.onSave = null;

      // Create a button to render on the right bottom
      this.saveButton = new Button(0, 0, 120, 30, 'Save Button', 'button1');
      this.controls.add(this.saveButton);

      // Adjust the position when toolbar's size changed 
      this.onSizeChange.add(function(width, height) {
        // Make sure the button is always on the right side of the toolbar
        this.saveButton.setPosition(width - 155, 35);
      }.bind(this));

      // Register the button event
      this.saveButton.onTap.add(function() {
        if (typeof this.onSave == 'function') {
          this.onSave();
        }
      }.bind(this));
    }
  });

})();
