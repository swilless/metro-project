// displays the customized Favorite metro line status (with optional Alarm)
var FavoritesView = Backbone.View.extend({
  'tagName': 'li',
  'className': 'favorites-list-item',
  'template': _.template($('#favorites-view').html()),
  initialize: function(data) {
    this.collection = data.collection;
    this.firstStationName = '';
    this.secondStationName = '';
    this.render();
  },
  render: function(){
    var _this = this;
    _this.$el.html('');
    this.collection.forEach(function(favorite,i){
      if(favorite.attributes.alarmTime){
        favorite.attributes.alarmTime = _this.returnFormattedDate(favorite.attributes.alarmTime);
      }

      _this.getStationName(favorite.attributes.startingStation,function(data){
        // console.log('here we go',data);
        favorite.attributes.startingStationName = data.Name;
        _this.getStationName(favorite.attributes.destinationStation,function(data){
          // console.log('and into the second',data);
          favorite.attributes.destinationStationName = data.Name;
          _this.$el.append(_this.template(favorite.attributes));
          var output = _this.$el;
          $('.main-body').html('');
          $('.main-body').append('<ul class="favorites-list favorites-view"></ul>');
          $('.main-body ul.favorites-list').append(output);
          _this.initClicks();
        });
      });

    });
    // var output = _this.$el;
    // $('.main-body').html('');
    // $('.main-body').append('<ul class="favorites-list favorites-view"></ul>');
    // $('.main-body ul.favorites-list').append(output);
    // console.log('before init');
    // _this.initClicks();
    // console.log('after init');
    return this;
  },
  returnFormattedDate: function(date) {
    var newDate = new Date(date);
    return newDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  },
  initClicks: function(){
    var _this = this;
    $('.get-routes').on('click',function(){
      var frequency = $(this).attr('data-frequency');
      var starting = $(this).attr('data-starting');
      var ending = $(this).attr('data-ending');
      var alarm = $(this).attr('data-alarm');
      var lineColors = $(this).attr('data-line-colors');
      var transferStation = $(this).attr('data-transfer');
      var routesView = new RoutesView(starting,ending,frequency,alarm,lineColors,transferStation);
    });
  },
  getStationName: function(stationCode, callback){
    var params = {
      "api_key": api_key,
      "stationCode": stationCode
    };
    var fullUrl = 'https://api.wmata.com/Rail.svc/json/jStationInfo?' + $.param(params);
    $.ajax({
      url: fullUrl,
      type: "GET",
      crossDomain: true,
      dataType: 'jsonp'
    })
    .done(function(data) {
      callback(data);
    })
    .fail(function(error) {
      console.log("error loading WMATA data",error);
      return false;
    });
  },
});
