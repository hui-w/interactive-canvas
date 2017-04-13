/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
 * @licence MIT
 */

if (typeof $ !== 'function') {
  function $() {
    var elements = new Array();
    for (var i = 0; i < arguments.length; i++) {
      var element = arguments[i];
      if (typeof element == 'string')
        element = document.getElementById(element);
      if (arguments.length == 1)
        return element;
      elements.push(element);
    }
    return elements;
  }
}

if (!Element.prototype.createChild) {
  Element.prototype.createChild = function(tag, param, innerHTML) {
    var element = document.createElement(tag);
    this.appendChild(element);
    if (param) {
      for (key in param) {
        element.setAttribute(key, param[key]);
      }
    }
    if (innerHTML) {
      element.innerHTML = innerHTML;
    }

    return element;
  };
}


// Extend the canvas prototype
var canvasPrototype = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;

if (!canvasPrototype.antiFuzzyLine) {
  canvasPrototype.antiFuzzyLine = function(x1, y1, x2, y2) {
    if (this.lineWidth % 2 == 1) {
      //-0.5 to avoid fuzzy line
      x1 -= 0.5;
      y1 -= 0.5;
      x2 -= 0.5;
      y2 -= 0.5;
    }
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
  };
}

if (!canvasPrototype.drawStone) {
  canvasPrototype.drawStone = function(isBlack, x, y, r) {
    var cx = x + r;
    var cy = y + r;

    this.save();
    this.beginPath();
    this.arc(cx, cy, r - 2, 0, 2 * Math.PI);
    this.closePath();
    var gradient = this.createRadialGradient(cx + 2, cy - 2, r - 2, cx + 2, cy - 2, 0);
    if (isBlack) {
      gradient.addColorStop(0, "#0A0A0A");
      gradient.addColorStop(1, "#636766");
    } else {
      //gradient.addColorStop(0, "#D1D1D1");
      //gradient.addColorStop(1, "#F9F9F9");
      gradient.addColorStop(0, "#999999");
      gradient.addColorStop(1, "#FFFFFF");
    }
    this.fillStyle = gradient;
    this.fill();
    this.restore();
  };
}

if (!canvasPrototype.roundRect) {
  canvasPrototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) { r = w / 2; }
    if (h < 2 * r) { r = h / 2; }
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  }
}

if (!canvasPrototype.fillTextEx) {
  /*
   * horizontalAlign: left, center, right
   * verticalAlign: top, middle, bottom
   */
  canvasPrototype.fillTextEx = function(text, x, y, horizontalAlign, verticalAlign) {
    this.save();
    var textLeft = x;
    if (horizontalAlign != "left") {
      var textWidth = this.measureText(text).width;
      if (horizontalAlign == "center") {
        textLeft -= textWidth / 2;
      } else if (horizontalAlign == "right") {
        textLeft -= textWidth;
      }
    }
    this.textBaseline = verticalAlign;
    this.fillText(text, textLeft, y);
    this.restore();
  }
}

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback /*, thisArg*/ ) {

    var T, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception. 
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = arguments[1];
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun /*, thisArg*/ ) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}

if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}
