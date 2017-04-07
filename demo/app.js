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
    this.menu.setSize(200, height);
    this.header.setSize(width, 100);
    this.footer.setSize(width, 100);
    this.footer.setPosition(0, height - 100);
    this.home.setSize(width - 200, height - 200);
    this.about.setSize(width - 200, height - 200);
  },

  canvasWillPaint: function(context) {
    // Draw the background
    context.save();
    context.fillStyle = 'RGBA(0,0,0,0.3)';
    context.fillRect(0, 0, this.width, this.height);
    context.restore();
  },

  canvasDidPaint: function(context) {
    console.log("- canvas painted");
  },

  // User defined methods
  initChildren: function() {
    this.menu = new Menu(0, 0);
    this.header = new Panel(0, 0, 0, 0);
    this.footer = new Panel(0, 0, 0, 0);
    this.home = new Home(200, 0);
    this.about = new About(200, 0);

    // Header
    this.header.addChild(new Label(0, 0, 'Header'));
    this.header.onRenderExtra.push(function(context) {
      context.fillStyle = "RGBA(0, 255, 0, 0.2)";
      context.fillRect(0, 0, this.width - 0, this.height - 0);
    });

    // Footer
    this.footer.onRenderExtra.push(function(context) {
      context.fillStyle = "RGBA(0, 0, 255, 0.2)";
      context.fillRect(0, 0, this.width - 0, this.height - 0);
    });
  }
}

var App = CanvasApp.extend(app_prototype);

// The entry point
var app = null;
addEventListener("load", function() {
  app = new App();
});
