(function() {
  // The array  for color panels
  var panels = [];

  // Render the container canvas
  var wrapper = $('wrapper');
  var canvas = new Canvas(wrapper, 500, 300);
  canvas.setFillStyle('#F2F2F2');
  // canvas.setLineWidth(1);
  // canvas.setStrokeStyle('#f00');
  canvas.onDidPaint.add(function(context) {
    // Always show the log when it redraws
    console.log('Canvas Paint');
  });

  // Render the target panel (with orange color)
  var pnlTarget = new Panel(20, 120, 40, 40);

  // The panel style
  pnlTarget.setFillStyle('#FFF');
  pnlTarget.setStrokeStyle('#000');
  pnlTarget.setLineWidth(1);

  // Add it into the canvas
  canvas.controls.add(pnlTarget);

  // Register the event
  pnlTarget.onCapture.add(function(left, top) {
    console.log('Target Panel Captured on [', left, top, ']');

    // Restore the background
    this.setFillStyle('#FFF');

    // Restore borders of color panels
    panels.forEach(function(panel) {
      panel.setLineWidth(0);
    });
  }.bind(pnlTarget));

  // Render the color panels
  var colors = [
    'RGBA(243, 83, 37, 1)',
    'RGBA(129, 188, 6, 1)',
    'RGBA(5, 166, 240, 1)',
    'RGBA(255, 186, 8, 1)'
  ];

  colors.forEach(function(color, index) {
    // Create a panel
    var panel = new Panel(20, 20, 40, 40, index);

    // Register the event
    panel.onRelease.add(function(left, top) {
      console.log('Captured Panel', this.id, 'on[', left, top, ']');

      // Copy its background color to the target
      pnlTarget.setFillStyle(this.fillStyle);

      // Highlight self by border
      this.setLineWidth(1);
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

    // Push the panel into the list
    panels.push(panel)
  });
})();
