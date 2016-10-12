var StationsView = Backbone.View.extend({
  'className': 'stations-view',
  'template': _.template($('#stations-view').html()),
  initialize: function() {
    this.overlay = null;
    this.render();
  },
  render: function(){
    // do nothing?
  },
  apiGetStations: function(data){
    var _this = this;
    var params = {
      "api_key": api_key,
      "LineCode": data
    };
    var fullUrl = baseEndpoint + 'jStations?' + $.param(params);
    $.ajax({
      url: fullUrl,
      type: "GET",
      crossDomain: true,
      dataType: 'jsonp'
    })
    .done(function(data) {
      if (data.Stations) {
        _this.$el.html(_this.template({ 'stations': data.Stations }));
        // var overlay = new OverlayView();
        var overlay = new OverlayView();
        $('#overlay').html(overlay.$el);
        // _this.$el.find('.station-list').remove();
        overlay.showOverlayView(_this);
        $('.overlay-view a.station-item').on('click',function(){
          var stationCode = $(this).attr('data-station-code');
          var trainsView = new TrainsView();
          trainsView.apiGetTrainsStatus(stationCode);
          overlay.closeOverlayView();
        });
      }

      // _this.$el.find('.station-list').remove();
      // _this.$el.append(_this.stationsTemplate({ 'stations': data.Stations }));
      // var stations = new TrainsView();
      return data;
    })
    .fail(function() {
      console.log("error loading WMATA data");
      return false;
    });
  },
  initStationEvents: function() {
    var _this = this;

  },
});
