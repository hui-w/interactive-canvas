var menu_prototype = {
  init: function(left, top) {
    this._super(left, top);

    this.onRenderExtra.push(this.renderMask);
    this.onRenderExtra.push(this.renderBorder);
  },

  renderMask: function(context) {
    context.fillStyle = "RGBA(0, 0, 0, 0.5)";
    context.fillRect(0, 0, this.width - 0, this.height - 0);
  },

  renderBorder: function(context) {
    var height = Config.Menu.buttonHeight * (4 + 0.4 * 3) + this.padding.v * 2;
    var left = this.width / 2 - Config.Menu.buttonWidth / 2 - this.padding.h;
    var top = this.height / 2 - height / 2;
    var width = Config.Menu.buttonWidth + this.padding.h * 2;

    // Main dialog
    context.beginPath();
    context.rect(left, top, width, height);
    context.strokeStyle = "RGBA(0, 0, 0, 1)";
    context.fillStyle = "RGBA(255, 255, 255, 0.8)";
    context.stroke();
    context.fill();
  },
}

var Menu = CanvasApp.extend(menu_prototype);
