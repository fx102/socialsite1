define(['views/index', 'views/register', 'views/login',
        'views/forgotpassword', 'views/profile', 'views/contacts',
        'views/addcontact', 'models/Account', 'models/StatusCollection',
        'models/ContactCollection', 'views/info', 'models/User'],
function(IndexView, RegisterView, LoginView, ForgotPasswordView, ProfileView,
         ContactsView, AddContactView, Account, StatusCollection,
         ContactCollection, InfoView, User) {
  var SocialRouter = Backbone.Router.extend({
    currentView: null,

    routes: {
      'addcontact': 'addcontact',
      'index': 'index',
      'login': 'login',
      'register': 'register',
      'forgotpassword': 'forgotpassword',
      'profile/:id': 'profile',
      'contacts/:id': 'contacts',
      'info/:id' : 'info',
      'download' : 'download',
      'logout': 'logout'
    },

    changeView: function(view) {
      if ( null != this.currentView ) {
        this.currentView.undelegateEvents();
      }
      this.currentView = view;
      this.currentView.render();
    },

    index: function() {
      var statusCollection = new StatusCollection();
      statusCollection.url = '/accounts/me/activity';
      this.changeView(new IndexView({
        collection: statusCollection
      }));
      statusCollection.fetch();
    },

    addcontact: function() {
      this.changeView(new AddContactView());
    },

    login: function() {
      this.changeView(new LoginView());
    },

    forgotpassword: function() {
      this.changeView(new ForgotPasswordView());
    },

    register: function() {
      this.changeView(new RegisterView());
    },

    profile: function(id) {
      var model = new Account({id:id});
      this.changeView(new ProfileView({model:model}));
      model.fetch();
    },
    
    contacts: function(id) {
      var contactId = id ? id : 'me';
      var contactsCollection = new ContactCollection();
      contactsCollection.url = '/accounts/' + contactId + '/contacts';
      this.changeView(new ContactsView({
        collection: contactsCollection
      }));
      contactsCollection.fetch();
    },

    info: function(id){
      var userId = id ? id : 'me';
      console.log(userId);
      var model = new User({id:id});
      this.changeView(new InfoView({model:model}));
      model.fetch();      
    },

    download: function(){
        // $.ajax({
        //   url : '/download',
        //   type : 'GET'
        // });
      // var content = [['1st title', '2nd title', '3rd title', 'another title'], ['a a a', 'bb\nb', 'cc,c', 'dd"d'], ['www', 'xxx', 'yyy', 'zzz']];

      // var finalVal = '';

      // for (var i = 0; i < content.length; i++) {
      //     var value = content[i];

      //     for (var j = 0; j < value.length; j++) {
      //         var innerValue =  value[j]===null?'':value[j].toString();
      //         var result = innerValue.replace(/"/g, '""');
      //         if (result.search(/("|,|\n)/g) >= 0)
      //             result = '"' + result + '"';
      //         if (j > 0)
      //             finalVal += ',';
      //         finalVal += result;
      //     }

      //     finalVal += '\n';
      // }

      // console.log('here');

      // var downloadName = "test";
      // var csvContent = "data:text/csv;charset=utf-8,";

      // csvContent += finalVal;
      
      // var encodedUri = encodeURI(csvContent);
      // var link = document.createElement("a");
      // link.setAttribute("href", encodedUri);
      // link.setAttribute("download", downloadName+".csv");
      
      // link.click();
    },

    logout: function() {
      //with reference to http://danialk.github.io/blog/2013/07/28/advanced-security-in-backbone-application/
      var that = this;
        $.ajax({
          url : '/logout',
          type : 'DELETE'
        }).done(function(response){
          that.changeView(new LoginView());
        });
    }
  });

  return new SocialRouter();
});

