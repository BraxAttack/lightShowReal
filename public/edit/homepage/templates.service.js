angular.module('lightShowApp')
  .factory('templates', function($firebaseArray){

    var user = firebase.auth().currentUser.uid

    var ref = firebase.database().ref('/users/' + user + '/templates/');
    var templates = $firebaseArray(ref);

    return templates;
  });
