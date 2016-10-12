var LinesView = Backbone.View.extend({
  'el': '.main-body',
  'className': 'lines-view',
  'template': _.template($('#lines-view').html()),
  //'stationsTemplate': _.template($('#line-station-view').html()),
  initialize: function() {
    this.render();
    console.log('inited lines');
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
      _this.$el.html(_this.template({ 'lines': data.Lines }));
      _this.initLineEvents();
      return data;
    })
    .fail(function() {
      console.log("error loading WMATA data");
      return false;
    });
  },
  initLineEvents: function() {
    var _this = this;
    $('.line-item').click(function(){
      var lineCode = $(this).attr('data-line-code');
      var stationsView = new StationsView();
      stationsView.apiGetStations(lineCode);
    });
  },


});
