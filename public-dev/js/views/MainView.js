// renders everything - main controller
// determines whether to render Favorites view, or the Lines view

var MainView = Backbone.View.extend({
  initialize: function() {
    this.render();
  },
  render: function(){
    var _this = this;
    this.mapView = new MapView();
    this.linesView = new LinesView();
  }
});
