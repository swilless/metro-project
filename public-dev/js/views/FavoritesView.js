// displays the customized Favorite metro line status (with optional Alarm)
var FavoritesView = Backbone.View.extend({
  'tagName': 'li',
  'className': 'favorites-list-item',
  'template': _.template($('#favorites-view').html()),
  initialize: function(data) {
    this.collection = data.collection;
    this.render();
  },
  render: function(){
    var _this = this;
    _this.$el.html('');
    this.collection.forEach(function(favorite,i){
      if(favorite.attributes.alarmTime){
        favorite.attributes.alarmTime = _this.returnFormattedDate(favorite.attributes.alarmTime);
      }
      console.log('checking',favorite.attributes);
      _this.$el.append(_this.template(favorite.attributes));
    });
    var output = _this.$el;
    $('.main-body').html('');
    $('.main-body').append('<ul class="favorites-list favorites-view"></ul>');
    $('.main-body ul.favorites-list').append(output);
    _this.initClicks();
    return this;
  },
  returnFormattedDate: function(date) {
    var newDate = new Date(date);
    return newDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  },
  initClicks: function(){
    var _this = this;
    $('.fav-item.get-routes').on('click',function(){
      var frequency = $(this).attr('data-frequency');
      var starting = $(this).attr('data-starting');
      var ending = $(this).attr('data-ending');
      var alarm = $(this).attr('data-alarm');
      var lineColors = $(this).attr('data-line-colors');
      var transferStation = $(this).attr('data-transfer');
      var routesView = new RoutesView(starting,ending,frequency,alarm,lineColors,transferStation);
    });
  }
});
