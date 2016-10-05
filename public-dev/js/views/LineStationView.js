var LineStationView = Backbone.View.extend({
  'el': '.main-body',
  'className': 'line-station-view',
  'linesTemplate': _.template($('#line-view').html()),
  'stationsTemplate': _.template($('#line-station-view').html()),
  initialize: function() {
    this.render();
  },
  render: function(){
    var lines = this.apiGetLines();
  },
  apiGetLines: function(){
    var _this = this;
    var params = {
      "api_key": api_key,
    };
    var fullUrl = baseEndpoint + 'jLines?' + $.param(params);
    $.ajax({
      url: fullUrl,
      type: "GET",
      crossDomain: true,
      dataType: 'jsonp'
    })
    .done(function(data) {
      _this.$el.html(_this.linesTemplate({ 'lines': data.Lines }));
      _this.initLineEvents();
      return data;
    })
    .fail(function() {
      console.log("error loading WMATA data");
      return false;
    });
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
      console.log('we are in stations',data.Stations);
      _this.$el.find('.station-list').remove();
      _this.$el.append(_this.stationsTemplate({ 'stations': data.Stations }));
      return data;
    })
    .fail(function() {
      console.log("error loading WMATA data");
      return false;
    });
  },
  initLineEvents: function() {
    var _this = this;
    $('.line-item').on('click', function(event){
      event.preventDefault();
      var lineCode = $(this).attr('data-line-code');
      _this.apiGetStations(lineCode);
    });
  },

});
