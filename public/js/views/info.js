define(['SocialNetView', 'text!templates/info.html',
		'views/standardinfo', 'views/custominfo',
		'models/InfoCollection']
	, function(SocialNetView, InfoTemplate,
			   StandardInfoView, CustomInfoView,
			   InfoCollection)
	{
	return SocialNetView.extend({
    	el: $('#content'),

    	events: {
    		'click .modify': 'modify',
    		'click .save': 'save',
    		'click .cancel': 'cancel',
    		'click #addnew': 'addnew'
    	},

	    initialize: function () {
	      //bind model data when it changes
	      this.model.bind('change', _.bind(this.render, this));
	      //new CustomInfoView(new InfoCollection({}));
		  console.log('I am here');
	    },

	    modify: function(){
	    	this.$('div.editable').addClass('editing');
	    	
	    	//if not return false then there will be a '?' append to the url
	    	return false;
	    },

	    save: function(){
	    	return false;
	    },

	    cancel: function(){
	    	this.$('div').removeClass('editing');
	    	return false;
	    },

	    addnew: function(){
	    	//pubsub, trigger...
	    },

    	render: function(){
	      	this.$el.html(
	        	_.template(InfoTemplate, this.model.toJSON())
  			);
  			new StandardInfoView({collection: 
				new InfoCollection([
					{key: "First Name", value: this.model.get("name").first}
					, {key: "Last Name", value: this.model.get("name").last}
					, {key: "Email", value: this.model.get("email")}
					])
			});
    	}
	});
});