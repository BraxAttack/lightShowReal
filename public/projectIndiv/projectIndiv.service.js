angular.module('lightShowApp')
  .factory('ProjectIndivData', function($firebaseArray){
    var ref = firebase.database().ref('/ProjectsData');
    var projectsIndiv = $firebaseArray(ref);

    return projectsIndiv;

  });
