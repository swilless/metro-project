var MapView = Backbone.View.extend({
  'className': 'map-view',
  'template': _.template($('#map').html()),
  initialize: function() {
    this.render();
  },
  render: function(){
    $('#show-map').on('click',function(){
      $('#map').slideToggle();
    });
  }
});
