'use strict';

(function() {
  // ----- Render the canvas into wrapper
  function renderCanvas(wrapper) {
    var canvas = new Canvas(wrapper, 500, 300);
    canvas.setFillStyle('#F2F2F2');
    // canvas.setLineWidth(1);
    // canvas.setStrokeStyle('#f00');
    return canvas;
  }

  // ----- Render the label into canvas
  function renderLabel(canvas) {
    var label = new Label(80, 20, "Component Based HTML5 Canvas");
    label.setFillStyle('#5FBA7D');
    label.setLineWidth(2);
    label.setStrokeStyle('#5FBA7D');
    label.setFontColor('#fff');
    canvas.controls.add(label);
    return label;
  }

  // ----- Render the target panel
  function renderTargetPanel(canvas, panels) {
    var panel = new Panel(20, 120, 40, 40);

    // The panel style
    panel.setFillStyle('#FFF');
    panel.setStrokeStyle('#000');
    panel.setLineWidth(1);

    // Add it into the canvas
    canvas.controls.add(panel);

    // Register the event
    panel.onCapture.add(function(left, top) {
      console.log('Target Panel Captured on [', left, top, ']');

      // Restore the background
      this.setFillStyle('#FFF');

      // Restore borders of color panels
      panels.forEach(function(panel) {
        panel.setLineWidth(0);
      });
    }.bind(panel));
    return panel;
  }

  // ----- Render the color panels
  function renderColorPanels(canvas, colors, targetPanel, highlightHandler) {
    var panels = [];

    colors.forEach(function(color, index) {
      // Create a panel
      var panel = new Panel(20, 20, 40, 40, index);

      // Register the event
      panel.onRelease.add(function(left, top) {
        console.log('Captured Panel', this.id, 'on[', left, top, ']');

        // Copy its background color to the target
        targetPanel.setFillStyle(this.getProp('fillStyle'));

        // Highlight self
        highlightHandler(panels, this);
      }.bind(panel));

      // Set the background color of the panel
      panel.setFillStyle(color);

      // Add the panel into the controls hierarchy
      if (panels.length > 0) {
        // Add as the child of last panel
        panels[panels.length - 1].controls.add(panel);
      } else {
        // Add into canvas
        canvas.controls.add(panel);
      }

      // ----- Push the panel into the list
      panels.push(panel)
    });

    return panels;
  }

  // Highlight the selected panel
  function highligtPanel(panels, panelToHighlight) {
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

  /* ===== Main Entry ===== */

  // Colors for color panels
  var colors = [
      'RGBA(243, 83, 37, 1)',
      'RGBA(129, 188, 6, 1)',
      'RGBA(5, 166, 240, 1)',
      'RGBA(255, 186, 8, 1)'
    ],
    canvas, label, targetPanel, panels;

  // Render a canvas object into the DOM
  canvas = renderCanvas($('app-wrapper'))

  // Render a label into the canvas
  label = renderLabel(canvas);

  // Render the target panel
  targetPanel = renderTargetPanel(canvas, panels);

  // Render the color panels
  panels = renderColorPanels(canvas, colors, targetPanel, highligtPanel);
})();
