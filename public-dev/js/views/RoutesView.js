var RoutesView = Backbone.View.extend({
  'className': 'routes-view',
  'template': _.template($('#template-routesview').html()),
  'initialize': function(starting,ending,frequency,alarm,lineColors,transferStation) {
    console.log('init with ',lineColors);
    this.starting = starting;
    this.ending = ending;
    this.frequency = frequency;
    this.lineColors = lineColors;
    this.transferStation = transferStation;
    if(alarm){
      this.alarm = alarm;
    }
    this.render();
  },
  'render': function(starting,ending,frequency,alarm) {
    var _this = this;
    _this.returnStartingStationName(_this.starting,_this.ending,_this.returnEndingStationName,_this);
  },
  returnStartingStationName: function(startingStationCode,endingStationCode,callback,_this) {
    var params = {
      "api_key": api_key,
      "stationCode": startingStationCode
    };
    var fullUrl = 'https://api.wmata.com/Rail.svc/json/jStationInfo?' + $.param(params);
    $.ajax({
      url: fullUrl,
      type: "GET",
      crossDomain: true,
      dataType: 'jsonp'
    })
    .done(function(data) {
      return callback(endingStationCode,data,_this);
    })
    .fail(function(error) {
      console.log("error loading WMATA data",error);
      return false;
    });
  },
  returnEndingStationName: function(endingStationCode,startingStationData,_this){
    var params = {
      "api_key": api_key,
      "stationCode": endingStationCode
    };
    var fullUrl = 'https://api.wmata.com/Rail.svc/json/jStationInfo?' + $.param(params);
    $.ajax({
      url: fullUrl,
      type: "GET",
      crossDomain: true,
      dataType: 'jsonp'
    })
    .done(function(data) {
      var endingStationData = data;
      _this.computeRoutes(startingStationData,endingStationData,_this);
    })
    .fail(function(error) {
      console.log("error loading WMATA data",error);
      return false;
    });
  },
  returnTimeString: function(dateObj,method){
    var number = '';
    if(method == 'hours'){
      number = dateObj.getHours();
      if(number < 10){
        number = '0' + number.toString();
      }
    } else if(method == 'minutes'){
      number = dateObj.getMinutes();
      if(number < 10){
        number = '0' + number.toString();
      }
    }
    return number.toString();
  },
  computeRoutes: function(startingStationData,endingStationData,_this){
    var params = {
      "api_key": api_key,
      "FromStationCode": startingStationData.Code,
      "ToStationCode": endingStationData.Code
    };
    var fullUrl = 'https://api.wmata.com/Rail.svc/json/jSrcStationToDstStationInfo?' + $.param(params);
    $.ajax({
      url: fullUrl,
      type: "GET",
      crossDomain: true,
      dataType: 'jsonp'
    })
    .done(function(data) {
      console.log('whats the route time data',data);
      _this.renderAllData(startingStationData,endingStationData,data,_this);
    })
    .fail(function(error) {
      console.log("error loading WMATA data",error);
      return false;
    });
  },
  renderAllData: function(startingStationData,endingStationData,routes,_this){
    var dt = new Date();
    var currentTime = _this.returnTimeString(dt,'hours') + ":" + _this.returnTimeString(dt,'minutes');
    dt.setMinutes(dt.getMinutes() + 10);
    var nextIncrement = _this.returnTimeString(dt,'hours') + ":" + _this.returnTimeString(dt,'minutes');
    dt.setMinutes(dt.getMinutes() + 10);
    var lastIncrement = _this.returnTimeString(dt,'hours') + ":" + _this.returnTimeString(dt,'minutes');
    var dataObj = {
      'startingStation': {
        'name': startingStationData.Name,
        'stationCode': startingStationData.Code,
        'lineCode': startingStationData.LineCode,
      },
      'endingStation': {
        'name': endingStationData.Name,
        'stationCode': endingStationData.Code,
        'lineCode': endingStationData.LineCode,
      },
      'frequency': _this.frequency,
      'alarm': _this.alarm,
      'transferStation': _this.transferStation,
      'currentTime': currentTime,
      'nextIncrement': nextIncrement,
      'lastIncrement': lastIncrement,
    };
    console.log('well we got routes as...',routes);
    $('.main-body').html('');
    $('.main-body').append(_this.template(dataObj));
  }
});
