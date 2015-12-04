define(['SocialNetView', 'text!templates/status.html'], function(SocialNetView, statusTemplate) {
  var statusView = SocialNetView.extend({
    tagName: 'li',

    render: function() {
    	console.log('in status view');
    	console.log(this.model.toJSON());
      $(this.el).html(_.template(statusTemplate,this.model.toJSON()));
      return this;
    }
  });

  return statusView;
});
