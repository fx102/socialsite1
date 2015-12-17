define(['SocialNetView', 'text!templates/infoField.html'], 
  function(SocialNetView, infoFieldTemplate) {
  return SocialNetView.extend({
    custom: false,
    destroy: false,
    tagName: 'p',

    delInfo: function() {

    },

    initialize: function() {
      this.custom = this.options.custom;
      this.addButton = this.options.destroy;
    },

    render: function() {
      $(this.el).html(_.template(infoFieldTemplate, {
        model: this.model.toJSON(),
        custom: this.custom,
        destroy: this.destroy
      }));
      return this;
    }
  });
});
