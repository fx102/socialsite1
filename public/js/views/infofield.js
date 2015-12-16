define(['SocialNetView', 'text!templates/infoField.html'], 
  function(SocialNetView, infoFieldTemplate) {
  return SocialNetView.extend({
    destroy: false,
    tagName: 'p',
    events: {

    },

    delInfo: function() {

    },

    initialize: function() {
      this.addButton = this.options.destroy;
    },

    render: function() {
      $(this.el).html(_.template(infoFieldTemplate, {
        model: this.model.toJSON(),
        destroy: this.destroy
      }));
      return this;
    }
  });
});
