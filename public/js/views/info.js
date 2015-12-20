define(['SocialNetView', 'text!templates/info.html',
		'views/infofields',
		'models/InfoCollection', 'helpers/PubSub', 
		'views/infofield', 'models/Info']
	, function(SocialNetView, InfoTemplate,
			   InfoCollectionView,
			   InfoCollection, PubSub, 
			   InfoFieldView, InfoModel)
	{
	return SocialNetView.extend({
    	el: $('#content'),

    	counter: 0,

    	events: {
    		'click .modify': 'modify',
    		'click .cancel': 'cancel',
    		'click #addnew' : 'addnew',
    		'submit form': 'save'
    	},

	    initialize: function (options) {
	      //bind model data when it changes
	      this.model.bind('change', _.bind(this.render, this));

	      PubSub.on("countdown", this.countdown, this);
	    },

	    modify: function(){
	    	this.$('div.editable').addClass('editing');
	    	//if not return false then there will be a '?' append to the url
	    	return false;
	    },

	    addnew: function(){
	    	var customorder = this.counter;
	    	var infoHtml = (new InfoFieldView({custom: true, model: new InfoModel({key: "", value: "", name: customorder}) })).render().el;
	        $(infoHtml).appendTo('#custom');
	    	this.counter += 1;
	    	return false;
	    },

	    save: function(){
	    	var values = {};
	    	var keys = [];
	    	if(this.counter > 0){
	    		for(i=0; i<this.counter; i++){
	    			var keyel = 'input[name=' + 'key' + i + ']';
	    			var k = $(keyel).val();
	    			valel = 'input[name=' + 'value' + i + ']';
	    			var v = $(valel).val();

	    			//if the key has value, i.e. excluding deleted fields
	    			if(k){
	    				keys.push(k);
	    				values[k] = v;
	    			}
	    		}
	    	};

			$.post('/accounts/' + this.model.get('_id') + '/personalinfo', {
				firstname: $('input[name=firstname]').val(),
				lastname: $('input[name=lastname]').val(),
				email: $('input[name=email]').val(),
				custominfokeys: keys,
				custominfo: values
			}, function(data) {
				console.log(data);
			});
			return false;
	    },

	    cancel: function(){
	    	this.$('div').removeClass('editing');
	    	return false;
	    },

    	render: function(){
    		//must set the counter here instead of the initialize method because data has not been retrieved yet when initialized
    		this.counter = !this.model.get("custominfokeys") ? 0 : this.model.get("custominfokeys").length;
	      	this.$el.html(
	        	_.template(InfoTemplate, this.model.toJSON())
  			);

  			//append standard info
  			var standardinfo = (new InfoCollectionView
  				({
  					collection: new InfoCollection
  						([
							{key: "First Name", value: this.model.get("name").first, name:"firstname"}
							, {key: "Last Name", value: this.model.get("name").last, name:"lastname"}
							, {key: "Email", value: this.model.get("email"), name:"email"}
						])
				})).renderHTML(false).el;
			$(standardinfo).appendTo('#standard');
			
			//append custom info
			var customfields = [];
			var keys = this.model.get("custominfokeys");
			var vals = this.model.get("custominfo");

			for(i=0; i < this.counter; i++){
				customfields.push({key: keys[i], value: vals[keys[i]], name: i});
			};

  			var existingcustominfo = (new InfoCollectionView
  				({
  					collection: new InfoCollection
  						(customfields)
				})).renderHTML(true).el;
			$(existingcustominfo).appendTo('#custom');
    	}
	});
});