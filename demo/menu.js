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
    // Main dialog
    context.beginPath();
    context.rect(this.left, this.top, this.width, this.height);
    context.strokeStyle = "RGBA(0, 0, 0, 1)";
    context.fillStyle = "RGBA(255, 255, 255, 0.8)";
    context.stroke();
    context.fill();
  },
}

var Menu = Component.extend(menu_prototype);
