define(['SocialNetView', 'text!templates/info.html',
		'views/standardInfo', 'views/customInfo']
	, function(SocialNetView, InfoTemplate,
			   StandardInfoView, CustomInfoView)
	{
	return SocialNetView.extend({
    	el: $('#content'),
	    initialize: function () {
	    	//bind model data when it changes
	      this.model.bind('change', _.bind(this.render, this));
	      //Any number of custom info
	      new CustomInfoView(this.custominfo);
	    },
    	render: function(){
    		console.log(this.model.toJSON());
	      	this.$el.html(
	        	_.template(InfoTemplate, this.model.toJSON())
  			);
    	}
	});
});