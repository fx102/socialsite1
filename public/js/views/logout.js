define(['SocialNetView'], function(SocialNetView) {
  return SocialNetView.extend({
    logout: function(callback) {
      $.ajax("/logout", {
        method: "GET",
        success: function() {
          console.log('log out success');
          return callback();
        },
        error: function(data) {
          console.log(data);
        }
      });
    }

    , initialize: function(){
        this.logout(function() {
          console.log('I am called');
          //app.router.navigate("login", {trigger:true});
        })
    }
  });
});