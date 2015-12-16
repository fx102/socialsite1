define(['SocialNetView', 'text!templates/infoField.html',
		'models/Info', 'views/infoField']
	, function(SocialNetView, InfoFieldTemplate,
				InfoModel, InfoFieldView)
	{
	return SocialNetView.extend({
    	el: $('#standard'),

    	initialize: function(){
    		this.render();
    	},

    	render: function(){
	      if ( null != this.collection.models ) {
	        _.each(this.collection.models, function (infoJSON) {
	          var infoModel = new InfoModel(infoJSON);
	          var infoHtml = (new InfoFieldView({ destroy: false, model: infoModel })).render().el;
	          $el.append(infoHtml);
	        });
	      }
    	}
	});
});