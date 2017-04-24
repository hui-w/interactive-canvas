# Interactive Canvas
Javascript library for component-based HTML5 canvas

## How simple it is

```js
    // Create the canvas
    var canvas = new Canvas(500, 100);
    canvas.setProp('lineWidth', 1);

    // Create the button
    var button = new Button(10, 10, 130, 32, 'Click this button');
    button.onTap.add(function(left, top) {
      var message = '[Timestamp ' + new Date().getTime() +
        '] Button has been clicked at [' + left + ', ' + top + ']';
      label.setProp('text', message);
    });

    // Create the label
    var label = new Label(10, 60, 0, 0, 'Label');

    // Add the button and label into the canvas
    canvas.controls.add(button);
    canvas.controls.add(label);

    // Render the canvas when everything is ready
    canvas.renderInto($('brief-look-wrapper'));
```

## Components Overview
![image](https://raw.githubusercontent.com/hui-w/interactive-canvas/master/docs/overview.png)

## More Demo
https://hui-w.github.io/interactive-canvas

## API Reference (TBD)
https://hui-w.github.io/interactive-canvas/reference.html
