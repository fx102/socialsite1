define(['SocialNetView', 'text!templates/infoField.html',
		'models/Info', 'views/infoField']
	, function(SocialNetView, InfoFieldTemplate,
				InfoModel, InfoFieldView)
	{
	return SocialNetView.extend({
		tagName: 'div',

    	initialize: function(){
    		this.render();
    	},

    	renderHTML: function(ifcustom){
    		var that = this;
	      if ( null != this.collection.models ) {
	        _.each(this.collection.models, function (infoJSON) {
	          var infoModel = new InfoModel(infoJSON);
	          var infoHtml = (new InfoFieldView({ custom: ifcustom, model: infoModel })).render().el;
	          $(infoHtml).appendTo($(that.el));
	        });
	      }
	      return that;
    	}
	});
});