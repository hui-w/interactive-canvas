var app_prototype = {
  menu: null,

  init: function() {
    this._super();

    // Prepare the child components
    this.initChildren();

    // Register the children
    this.registerComponents([
      this.menu
    ]);

    // Initialize
    this.render();
  },

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
