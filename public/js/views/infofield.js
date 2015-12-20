define(['SocialNetView', 'text!templates/infoField.html', 'helpers/PubSub'], 
  function(SocialNetView, infoFieldTemplate, PubSub) {
  return SocialNetView.extend({
    custom: false,
    tagName: 'p',

    events: {
      "click #del" : "delInfo"
    },

    delInfo: function() {
      this.model.destroy();
      this.remove();
      return false;
    },

    initialize: function() {
      this.custom = this.options.custom;
    },

    render: function() {
      $(this.el).html(_.template(infoFieldTemplate, {
        model: this.model.toJSON(),
        custom: this.custom
      }));
      return this;
    }
  });
});
