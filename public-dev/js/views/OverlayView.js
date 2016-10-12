var OverlayView = Backbone.View.extend({
  'className': 'overlay-view',
  'template': _.template($('#template-overlayview').html()),
  'initialize': function() {
    this.currentSubview = null;
    this.render();
  },
  'render': function() {
    this.$el.html(this.template({}));
    this.$subViewContainer = this.$el.find('.overlay-subview');
  },
  'showOverlayView': function(view) {
    var _this = this;
    if (_this.currentSubview) {
      _this.closeOverlayView(function() {
        _this.showOverlayView(view);
      })
    } else {
      _this.currentSubview = view;
      _this.currentSubview.overlayView = _this;
      _this.$subViewContainer.html(this.currentSubview.$el);
      _this.$el.addClass('active');
      if (window.iframeParent) {
        _this.$subViewContainer.css({
          'margin-top': Math.max(0,window.iframeParent.scrollTop) + 'px'
        });
      }
    }
  },
  'closeOverlayView': function(done) {
    var _this = this;
    if (_this.currentSubview) {
      _this.$el.removeClass('active');
      setTimeout(function() {
        if (_this.$subViewContainer) {
          _this.$subViewContainer.html('');
        }
        _this.currentSubview = null;
        done && done();
      },500);
    }
  }
});
