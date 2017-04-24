/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/interactive-canvas
 * @licence MIT
 */

'use strict';

(function() {

  function renderBriefLook() {
    // Create a canvas
    var canvas = new Canvas(500, 100);
    canvas.setProp('lineWidth', 1);

    // Create a button
    var button = new Button(10, 10, 130, 32, 'Click this button');
    button.onTap.add(function(left, top) {
      var message = '[Timestamp ' + new Date().getTime() +
        '] Button has been clicked at [' + left + ', ' + top + ']';
      label.setProp('text', message);
    });

    // Create a label
    var label = new Label(10, 60, 0, 0, 'Label');

    // Add the button and label into the canvas
    canvas.controls.add(button);
    canvas.controls.add(label);

    // Render the canvas when everything is ready
    var wrapper = $('brief-look-wrapper');
    canvas.renderInto(wrapper);
  }

  addEventListener('load', function() {
    // Render the brif look
    renderBriefLook();

    // Render the palette
    var palette = new Palette('palette-wrapper');
  });

})();
