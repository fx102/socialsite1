define(['SocialNetView', 'text!templates/index.html',
        'views/status', 'models/Status'],
function(SocialNetView, indexTemplate, StatusView, Status) {
  var indexView = SocialNetView.extend({
    el: $('#content'),

    events: {
      "submit form": "updateStatus",
      "click #download": "download"
    },

    initialize: function() {
      this.collection.on('add', this.onStatusAdded, this);
      this.collection.on('reset', this.onStatusCollectionReset, this);
    },

    onStatusCollectionReset: function(collection) {
      var that = this;
      collection.each(function (model) {
        that.onStatusAdded(model);
      });
    },

    onStatusAdded: function(status) {
      var statusHtml = (new StatusView({ model: status })).render().el;
      $(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
    },

    updateStatus: function() {
      var statusText = $('input[name=status]').val();
      var statusCollection = this.collection;
      $.post('/accounts/me/status', {
        status: statusText
      }, function(data) {
        statusCollection.add(new Status({status:statusText}));
      });
      return false;
    },

    exportToCSV: function(exportHeaders, customHeaders, accounts){
      var result = "data:text/csv;charset=utf-8,";

      result += (exportHeaders.join() + '\n');

      _.each(accounts, function(account, i){
        var values = [];
        values.push(account.name.first);
        values.push(account.name.last);
        values.push(account.email);
        _.each(customHeaders, function(header){
          if(account.custominfo && account.custominfo[header]){
            values.push(account.custominfo[header]);            
          }else{
            values.push("");
          }
        });
        i < accounts.length ? result += (values.join() + '\n') : result += values.join();
      });

      var downloadName = "test";
      var encodedUri = encodeURI(result);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", downloadName+".csv");
      
      link.click();
    },

    download: function(e){
      var that = this;
      e.preventDefault();
      var exportHeaders = ['First Name', 'Last Name', 'Email', 'Weight', 'Height', 'Company', 'Phone', 'Mobile', 'City',  'Nationality', 'Cool?'];
      var customHeaders = ['Weight', 'Height', 'Company', 'Phone', 'Mobile', 'City',  'Nationality', 'Cool?'];
      $.get( "/download", function( data ) {
        that.exportToCSV(exportHeaders, customHeaders, data);
      });
      return false;
    },

    render: function() {
      this.$el.html(indexTemplate);
    }
  });

  return indexView;
});
