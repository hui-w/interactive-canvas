/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
 * @licence MIT
 */

'use strict';

(function() {

  function renderBriefLook() {
    // Create the canvas
    var canvas = new Canvas($('brief-look-wrapper'), 500, 100);
    canvas.setLineWidth(1);

    // Create the button
    var button = new Button(10, 10, 130, 32, 'Click this button');
    button.onTap.add(function(left, top) {
      var message = 'Button has been clicked at [' + left + ', ' + top + ']';
      label.setText(message);
    });

    // Create the label
    var label = new Label(10, 60, 0, 0, 'Label');

    // Add the button and label into the canvas
    canvas.controls.add(button);
    canvas.controls.add(label);
  }

  addEventListener('load', function() {
    // Render the brif look
    renderBriefLook();

    // Render the palette
    var palette = new Palette('palette-wrapper');
  });

})();
