define(['router'], function(router) {
  var initialize = function() {
    checkLogin(runApplication);
  };

/*
Check callback function on:
http://recurial.com/programming/understanding-callback-functions-in-javascript/
*/
  var checkLogin = function(callback) {
    $.ajax("/account/authenticated", {
      method: "GET",
      success: function() {
        //calls back the runApplication function when there is a response
        return callback(true);
      },
      error: function(data) {
        return callback(false);
      }
    });
  };

  var runApplication = function(authenticated) {
    if (!authenticated) {
      window.location.hash = 'login';
    } else {
      window.location.hash = 'index';
    }
    Backbone.history.start();
  };

  return {
    initialize: initialize
  };
});
