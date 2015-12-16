define(['SocialNetView', 'text!templates/info.html']
	, function(SocialNetView, InfoTemplate
			   )
	{
	return SocialNetView.extend({
    	el: $('#content'),

    	events: {
    		'click #modify': 'modify',
    		'click #save': 'save',
    		'click #cancel': 'cancel'
    	},

	    initialize: function () {
	      //bind model data when it changes
	      this.model.bind('change', _.bind(this.render, this));
	      //Any number of custom info
	      //new CustomInfoView(this.custominfo);
	    },

	    modify: function(){
	    	this.$('div.editable').addClass('editing');
	    },

	    save: function(){

	    },

	    cancel: function(){
	    	this.$('div').removeClass('editing');
	    },

    	render: function(){
    		console.log(this.model.toJSON());
	      	this.$el.html(
	        	_.template(InfoTemplate, this.model.toJSON())
  			);
    	}
	});
});