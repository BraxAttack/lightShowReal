angular.module('lightShowApp')
  .factory('projects', function($firebaseArray){

    var user = firebase.auth().currentUser.uid

    var ref = firebase.database().ref('/Projects/' + user);
    var projects = $firebaseArray(ref);

    return projects;
  });
