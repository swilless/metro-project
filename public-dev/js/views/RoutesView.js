var RoutesView = Backbone.View.extend({
  'className': 'routes-view',
  'template': _.template($('#template-routesview').html()),
  'initialize': function(starting,ending,frequency,alarm,lineColors,transferStation) {
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
      } else if(number > 12) {
        number = number - 12;
      }
    } else if(method == 'minutes'){
      number = dateObj.getMinutes();
      if(number < 10){
        number = '0' + number.toString();
      }
    } else if(method == 'period'){
      number = dateObj.getHours();
      if(number > 11){
        number = 'pm';
      } else {
        number = 'am';
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
      _this.getNextTrains(startingStationData,endingStationData,data.StationToStationInfos,_this);
    })
    .fail(function(error) {
      console.log("error loading WMATA data",error);
      return false;
    });
  },
  getNextTrains: function(startingStationData,endingStationData,stationsData,_this){
    var params = {
      "api_key": api_key,
    };
    var fullUrl = nextTrainEndpoint + startingStationData.Code + '?' + $.param(params);
    $.ajax({
      url: fullUrl,
      type: "GET",
      crossDomain: true,
      dataType: 'jsonp'
    })
    .done(function(data) {
      _this.renderAllData(startingStationData,endingStationData,stationsData,data,_this);
    })
    .fail(function(error) {
      console.log("error loading WMATA data",error);
      return false;
    });
  },
  renderAllData: function(startingStationData,endingStationData,stationsData,nextTrains,_this){
    // console.log('finally in here with stationsData',stationsData[0].RailTime);
    // console.log('and got next trains like:',nextTrains.Trains);
    console.log('line colors like',_this.lineColors);
    var lineColors = _this.lineColors.split('_');
    console.log('and after',lineColors);
    var dt = new Date();
    var currentTime = _this.returnTimeString(dt,'hours') + ":" + _this.returnTimeString(dt,'minutes') + ' ' + _this.returnTimeString(dt,'period');
    dt.setMinutes(dt.getMinutes() + 10);
    var secondIncrement = _this.returnTimeString(dt,'hours') + ":" + _this.returnTimeString(dt,'minutes') + ' ' + _this.returnTimeString(dt,'period');
    dt.setMinutes(dt.getMinutes() + 10);
    var thirdIncrement = _this.returnTimeString(dt,'hours') + ":" + _this.returnTimeString(dt,'minutes') + ' ' + _this.returnTimeString(dt,'period');
    dt.setMinutes(dt.getMinutes() + 10);
    var fourthIncrement = _this.returnTimeString(dt,'hours') + ":" + _this.returnTimeString(dt,'minutes') + ' ' + _this.returnTimeString(dt,'period');
    if(stationsData){
      var trainsArray = [];
      $.each(nextTrains.Trains,function(i,train){
        if(parseInt(train.Min)){
          var originalDT = new Date();
          var arrival = originalDT.setMinutes(originalDT.getMinutes() + parseInt(train.Min));
          train.arrivalTime = _this.returnTimeString(originalDT,'hours') + ":" + _this.returnTimeString(originalDT,'minutes');
          trainsArray.push(train);
          console.log('hi train',train);
        }
      });

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
        'secondIncrement': secondIncrement,
        'thirdIncrement': thirdIncrement,
        'fourthIncrement': fourthIncrement,
        'railTime': stationsData[0].RailTime,
        'trains': trainsArray,
        'lineColors': lineColors,
      };
      $('.main-body').html('');
      $('.main-body').append(_this.template(dataObj));
    }
  }
});
