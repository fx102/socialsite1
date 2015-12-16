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
    		'click #modify': 'modify',
    		'click #save': 'save',
    		'click #cancel': 'cancel'
    	},

	    initialize: function () {
	      //bind model data when it changes
	      this.model.bind('change', _.bind(this.render, this));
	      //new CustomInfoView(new InfoCollection({}));
		  new StandardInfoView({collection: 
				new InfoCollection([{key: "First Name", value: this.model.get("name").first}])
			});
			console.log('I am here');
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
	      	this.$el.html(
	        	_.template(InfoTemplate, this.model.toJSON())
  			);
  			//$(statusHtml).appendTo('.contacts_list');
    	}
	});
});