var AlertsView = Backbone.View.extend({
  'className': 'alert-status',
  'template': _.template($('#alerts-view').html()),
  initialize: function() {
    this.stationCode = null;
    this.incidents = null;
    this.render();
  },
  render: function(){
    var alerts = this.apiGetAlerts();
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
      _this.incidents = data.Incidents;
      return data;
    })
    .fail(function() {
      console.log("error loading WMATA data");
      return false;
    });
  },
  displayAlerts: function(){
    var output = this.$el.html(this.template({ 'incidents': this.incidents }));
    $('.main-body').html(output); // may want to handle this differently?
  }
});
