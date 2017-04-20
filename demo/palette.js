/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
 * @licence MIT
 */

'use strict';

(function() {
  function Palette(wrapperId) {
    this.colors = [
      'RGBA(243, 83, 37, 1)',
      'RGBA(129, 188, 6, 1)',
      'RGBA(5, 166, 240, 1)',
      'RGBA(255, 186, 8, 1)'
    ];

    this.canvas = null;
    this.label = null;
    this.targetPanel = null;
    this.panels = [];

    // Render a canvas object into the DOM
    this.prepareCanvas();

    // Render a label into the canvas
    this.prepareLabel();

    // Render the target panel
    this.prepareTargetPanel();

    // Render the color panels
    this.prepareColorPanels(this.canvas, this.colors, this.targetPanel, this.highligtPanel);

    // Render the canvas when everything is ready
    var wrapper = $(wrapperId);
    this.canvas.renderInto(wrapper);
  }

  Palette.prototype = {
    // ----- Prepare the canvas
    prepareCanvas: function() {
      this.canvas = new Canvas(500, 200);
      this.canvas.setFillStyle('#F2F2F2');
      this.canvas.setLineWidth(1);
      this.canvas.setStrokeStyle('#726EAE');
      this.canvas.onDidPaint.add(function(context) {
        context.save();
        context.textBaseline = 'top';
        context.fillText("Canvas Painted at " + (new Date()).valueOf(), 4, 4);
        context.restore();
        console.log('Canvas Did Paint');
      }.bind(this));
    },

    // ----- Prepare the label into canvas
    prepareLabel: function() {
      this.label = new Label(80, 140, 0, 0, "Try to click the colorful rectangles");
      this.label.setFillStyle('#5FBA7D');
      this.label.setLineWidth(2);
      this.label.setStrokeStyle('#5FBA7D');
      this.label.setFontColor('#000');
      this.canvas.controls.add(this.label);
    },

    // ----- Prepare the target panel
    prepareTargetPanel: function() {
      this.targetPanel = new Panel(20, 120, 40, 40);

      // The panel style
      this.targetPanel.setFillStyle('#FFF');
      this.targetPanel.setStrokeStyle('#000');
      this.targetPanel.setLineWidth(1);

      // Add it into the canvas
      this.canvas.controls.add(this.targetPanel);

      // Register the event
      this.targetPanel.onCapture.add(function(left, top) {
        // Output the log
        this.label.setText(['Target Panel Captured on [', left, top, ']'].join(' '));

        // Restore the background
        this.targetPanel.setFillStyle('#FFF');

        // Restore borders of color panels
        this.panels.forEach(function(panel) {
          panel.setLineWidth(0);
        });
      }.bind(this));
    },

    // ----- Prepare the color panels
    prepareColorPanels: function() {
      var panels = [];

      this.colors.forEach(function(color, index) {
        // Create a panel
        var panel = new Panel(20, 20, 40, 40, index);

        // Register the event
        panel.onRelease.add(function(left, top) {
          // Output the log
          this.label.setText(
            ['Captured Panel',
              panel.id,
              'on [',
              left, top,
              ']',
              '; Color code:',
              panel.getProp('fillStyle')
            ].join(' ')
          );

          // Copy its background color to the target
          this.targetPanel.setFillStyle(panel.getProp('fillStyle'));

          // Highlight self
          this.highligtPanel(panels, panel);
        }.bind(this));

        // Set the background color of the panel
        panel.setFillStyle(color);

        // Add the panel into the controls hierarchy
        if (panels.length > 0) {
          // Add as the child of last panel
          panels[panels.length - 1].controls.add(panel);
        } else {
          // Add into canvas
          this.canvas.controls.add(panel);
        }

        // ----- Push the panel into the list
        panels.push(panel)
      }.bind(this));

      this.panels = panels;

      return panels;
    },

    // Highlight the selected panel
    highligtPanel: function(panels, panelToHighlight) {
      panels.forEach(function(panel) {
        if (panel === panelToHighlight) {
          // Highlight self by border
          panel.setLineWidth(1);
        } else if (panel.getProp('lineWidth') !== 0) {
          // Un-highlight others
          panel.setLineWidth(0);
        }
      });
    }
  };

  window.Palette = Palette;
})();
