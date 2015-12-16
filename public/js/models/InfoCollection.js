define(['models/Info'], function(Info) {
  return Backbone.Collection.extend({
    model: Info
  });
});