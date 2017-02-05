angular.module('lightShowApp')
.controller("ProjectIndivCtrl", function($firebaseArray, Auth, projectIndivData, profile) {
    var projectIndivCtrl = this;

    var projectID = projectIndivData;
    var profileID = profile.$id;


    var ref = firebase.database().ref('/ProjectsData/').child(profileID).child(projectID).child('songData');
    var projectsIndiv = $firebaseArray(ref);


    projectIndivCtrl.projectData = projectsIndiv;




    projectIndivCtrl.editSquareArray = {}

    for (y = 0; y < 50; y++) {
      for (x = 0; x < 50; x++) {
            //console.log(x + "/" + y);
      }

    }

})
