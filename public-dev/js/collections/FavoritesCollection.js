var FavoritesCollection = Backbone.Collection.extend({
  'model': Favorite,
  'url': "/api/favorites"
});
