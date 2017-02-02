angular.module('lightShowApp')
  .controller('AuthCtrl', function(Auth, $state){
    var authCtrl = this;

    authCtrl.user = {
      email: '',
      password: ''
    };

    authCtrl.menu = [
      {
        link : '',
        title: 'Dashboard',
        icon: 'dashboard'
      },
      {
        link : '',
        title: 'Friends',
        icon: 'group'
      },
      {
        link : '',
        title: 'Messages',
        icon: 'message'
      }
    ];

    authCtrl.login = function (){
      Auth.$signInWithEmailAndPassword(authCtrl.user.email, authCtrl.user.password).then(function (auth){
        $state.go('homepage.projects');
      }, function (error){
        authCtrl.error = error;
        alert(error);
      });
    };

    authCtrl.loginWithGoogle = function (){
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(auth) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        //var token = result.credential.accessToken;
        // The signed-in user info.
        //var user = result.user;
        // ...
        $state.go('homepage.projects');
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        alert(error);
      });

    };

    authCtrl.register = function (){
      Auth.$createUserWithEmailAndPassword(authCtrl.user.email, authCtrl.user.password).then(function (user){
        $state.go('homepage.projects');
      }, function (error){
        authCtrl.error = error;
      });
    };
  });
