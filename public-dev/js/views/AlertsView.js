var AlertsView = Backbone.View.extend({
  'className': 'alert-status',
  'template': _.template($('#alerts-view').html()),
  initialize: function() {
    this.stationCode = null;
    this.render();
  },
  render: function(){
    this.apiGetAlerts();
  },
  apiGetAlerts: function(){
    var params = {
      "api_key": api_key,
    };
    var fullUrl = incidentsEndpoint + $.param(params);
    var _this = this;
    $.ajax({
      url: fullUrl,
      type: "GET",
      crossDomain: true,
      dataType: 'jsonp'
    })
    .done(function(data) {
      console.log('alerts data',data);
      var output = _this.$el.html(_this.template({ 'incidents': data.Incidents }));
      $('.main-body').html(output); // may want to handle this differently?
      return data;
    })
    .fail(function() {
      console.log("error loading WMATA data");
      return false;
    });
  }
});
