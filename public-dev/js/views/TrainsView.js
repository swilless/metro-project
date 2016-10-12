var TrainsView = Backbone.View.extend({
  'className': 'trains-status',
  'template': _.template($('#trains-status-view').html()),
  initialize: function() {
    this.stationCode = null;
    this.render();
  },
  render: function(){
    this.initStationEvents();
  },
  initStationEvents: function() {
    var _this = this;
    $('.station-item').on('click',function(e){
      e.preventDefault();
      var stationCode = $(this).attr('data-station-code');
      var trainsStatus = new TrainsView();
      _this.apiGetTrainsStatus(stationCode.trim());
      //trigger overlayview
    });
  },
  apiGetTrainsStatus: function(stationCode) {
    var params = {
      "api_key": api_key,
    };
    var fullUrl = nextTrainEndpoint + stationCode.trim() + '?' + $.param(params);
    var _this = this;
    $.ajax({
      url: fullUrl,
      type: "GET",
      crossDomain: true,
      dataType: 'jsonp'
    })
    .done(function(data) {
      var output = _this.$el.html(_this.template({ 'trains': data.Trains }));
      $('.main-body').html(output); // may want to handle this differently?
      return data;
    })
    .fail(function() {
      console.log("error loading WMATA data");
      return false;
    });
  }
});
