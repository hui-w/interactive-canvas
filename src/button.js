/** 
 * @author Wang, Hui (huiwang@qlike.com) 
 * @repo https://github.com/hui-w/canvas-ui
 * @licence MIT
 *
 * Button
 */

'use strict';

(function() {
  var prototype = {
    init: function(left, top, width, height, id) {
      this._super(left, top, width, height, id);
    }
  };

  window.Button = Label.extend(prototype);
})();
