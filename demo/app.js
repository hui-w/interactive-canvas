var app_prototype = {
  menu: null,
  header: null,
  footer: null,
  home: null,
  about: null,

  init: function() {
    this._super();

    // Prepare the child components
    this.initChildren();

    // Register the children
    this.registerComponents([
      this.menu,
      this.header,
      this.footer,
      this.home,
      this.about
    ]);

    // Initialize
    this.render();
  },

  canvasResized: function(width, height) {

  },

  canvasWillPaint: function(context) {
    // Draw the background
    context.save();
    context.fillStyle = Config.Canvas.fill;
    context.fillRect(0, 0, this.width, this.height);
    context.restore();
  },

  canvasDidPaint: function(context) {
    console.log("- canvas painted");
  },

  // User defined methods
  initChildren: function() {
    this.menu = new Menu(0, 0);
  }
}

var App = CanvasApp.extend(app_prototype);

// The entry point
var app = null;
addEventListener("load", function() {
  app = new App();
});
