var AlertsView = Backbone.View.extend({
  'className': 'alert-status',
  'template': _.template($('#alerts-view').html()),
  initialize: function(callback) {
    this.stationCode = null;
    this.incidents = null;
    this.render(callback);
  },
  render: function(callback){
    var alerts = this.apiGetAlerts(callback);
  },
  apiGetAlerts: function(callback){
    var callbackExists = typeof callback  !== 'undefined' ? callback : false;
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
      if(callbackExists){
        callback(data);
      } else {
        _this.displayAlerts();
      }
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
