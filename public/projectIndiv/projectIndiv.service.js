angular.module('lightShowApp')
  .factory('ProjectIndivData', function($firebaseArray){
    var ref = firebase.database().ref('/ProjectsData/XwRJKr4w5SOChmvY5SjsN2ZXVx72/-KcAXhDJfejK-HLNOz6m');
    var projectsIndiv = $firebaseArray(ref);

    return projectsIndiv;

  });
