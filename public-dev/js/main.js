// global variables
var api_key = "37f4497e598a4986aa586bfb2126272b";
var baseEndpoint = "https://api.wmata.com/Rail.svc/json/";
var nextTrainEndpoint = "https://api.wmata.com/StationPrediction.svc/json/GetPrediction/";
var incidentsEndpoint = "https://api.wmata.com/Incidents.svc/json/Incidents?";
var pathEndpoint = "https://api.wmata.com/Rail.svc/json/jPath?";

initData();

$(window).on('load',function() {
  var main = new MainView();

  // set routes
  var AppRouter = Backbone.Router.extend({
    routes: {
      'metro/:id': 'story',
      '*actions': 'defaultRoute'
    }
  });
  var router = new AppRouter();
  // var overlay = new OverlayView();
  // $('#overlay').html(overlay.$el);
  // router.on('route:story', function(id) {
  //   var story = data.get('stories').get(id);
  //   if (story) {
  //     overlay.showOverlayView(new StoryView({
  //       'model': story
  //     }));
  //   }
  // });


  // set up clicks
  $('.main-nav-button').on('click',function(){
    $('.load-hidden').toggleClass('active');
  });

  $('#show-alerts').on('click',function(){
    var alertsStatus = new AlertsView();
  });
  $('#show-favorites').on('click',function(){
    var favoriteCollection = new FavoritesCollection();
    favoriteCollection.fetch({
      reset: true,
      success: function(collection, response, options){
        var favoritesView = new FavoritesView({
          'collection': collection
        });
        // $('.main-body').append(favoritesView);
      },
      error: function (collection, response, options) {
        console.log('failed with response',response);
      }
    });
  });
});

// helper functions
function initData(){

}


// init Google maps
function initMap() {
  var map;
  var styledMapType = new google.maps.StyledMapType(
    [{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#1c99ed"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#1f79b5"}]},{"featureType":"administrative.province","elementType":"labels.text.fill","stylers":[{"color":"#6d6d6d"},{"visibility":"on"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#555555"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#999999"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.government","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#e1eddd"}]},{"featureType":"poi.place_of_worship","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"},{"lightness":"45"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ff9500"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"on"},{"hue":"#009aff"},{"saturation":"100"},{"lightness":"5"}]},{"featureType":"road.highway.controlled_access","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"color":"#ff9500"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway.controlled_access","elementType":"labels.icon","stylers":[{"lightness":"1"},{"saturation":"100"},{"hue":"#009aff"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#8a8a8a"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"lightness":"33"},{"saturation":"-100"},{"visibility":"on"}]},{"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"transit.station.rail","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#4db4f8"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]}]
  );
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.9072, lng: -77.0369},
    zoom: 12
  });
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');
}
//
// function performRequest(fullUrl){
//   if(fullUrl){
//     $.ajax({
//       url: fullUrl,
//       type: "GET",
//       crossDomain: true,
//       dataType: 'jsonp'
//     })
//     .done(function(data) {
//       console.log('getting data',data);
//       return data;
//     })
//     .fail(function() {
//       console.log("error loading WMATA data");
//       return false;
//     });
//   }
// }
//
// function apiGetLines() {
//   var params = {
//     "api_key": api_key,
//     // Request parameters
//   };
//   var fullURL = baseEndpoint + $.param(params);
//   return performRequest(fullURL);
// }
//
// function apiGetStationsList(lineCode) {
//   if(!lineCode) {
//     lineCode = '';
//   }
//   var params = {
//     "api_key": api_key,
//     "LineCode": lineCode,
//   };
//
//   var fullURL = baseEndpoint + $.param(params);
//   return performRequest(fullURL);
// }
