define(['models/InfoCollection'], function(InfoCollection){
	return Backbone.Model.extend({
		defaults: {
			//must specify the none collection attributes
			name: {},
			email: '',
			counter: 0,
			custominfokeys: [],
			custominfo: {}
		},
		
		urlRoot: '/accounts'
	})
});