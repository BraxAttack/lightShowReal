angular.module('lightShowApp')
  .factory('projects', function($firebaseArray){

    var user = firebase.auth().currentUser.uid

    //var ref = firebase.database().ref('/Projects/' + user);
    var ref = firebase.database().ref().child('projects').orderByChild(user)

    var projects = $firebaseArray(ref);

    console.log(projects)
    return projects;
  });
