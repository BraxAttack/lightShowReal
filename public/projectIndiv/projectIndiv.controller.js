angular.module('lightShowApp')
.controller("ProjectIndivCtrl", function($firebaseArray, $http, Auth, projectIndivData, profile) {
    var projectIndivCtrl = this;

    var projectID = projectIndivData;
    var profileID = profile.$id;


    var ref = firebase.database().ref('/ProjectsData/').child(profileID).child(projectID).child('songData');
    var projectsIndiv = $firebaseArray(ref);


    projectIndivCtrl.projectID = projectID;
    projectIndivCtrl.projectData = projectsIndiv;


    // Create a reference to the file we want to download
    var dataRef = firebase.storage().ref().child('projectSongs/' + projectIndivCtrl.projectID +'.txt');

    // Get the download URL
    dataRef.getDownloadURL().then(function(url) {
      // Insert url into an <img> tag to "download"
      alert(url);

      $http.get(url).then(function(response) {
          var raw_html = response.data;
          alert(raw_html);
      });

    }).catch(function(error) {
      switch (error.code) {
        case 'storage/object_not_found':
          // File doesn't exist
          break;

        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;

        case 'storage/canceled':
          // User canceled the upload
          break;

        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    });

//will be for creating array to interface with
/*
    projectIndivCtrl.editSquareArray = {}

    for (y = 0; y < 50; y++) {
      for (x = 0; x < 50; x++) {
            //console.log(x + "/" + y);
      }

    }
*/
})
