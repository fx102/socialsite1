define([], function(){
	return Backbone.Model.extend({
		defaults: {
			//must specify the none collection attributes
			name: {},
			email: '',
			biography: '',
			birthday: {}
		},
		urlRoot: '/accounts'
	})
});