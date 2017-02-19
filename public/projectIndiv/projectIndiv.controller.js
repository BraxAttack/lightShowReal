angular.module('lightShowApp')
.controller("ProjectIndivCtrl", function($firebaseArray, $http, $timeout, Auth, projectIndivData, profile) {
    var projectIndivCtrl = this;

    var projectID = projectIndivData;
    var profileID = profile.$id;

    console.log("profile " + profileID);
    console.log("profile " + projectID);

    projectIndivCtrl.currentFrame = 0;
//uncomment this to load data
    projectIndivCtrl.projectDataParsed = [];

    var ref = firebase.database().ref('/ProjectData/').child(profileID).child(projectID);
    var projectsIndiv = $firebaseArray(ref).$loaded()
    .then(function (projectData){
        //console.log(projectData);
        projectIndivCtrl.projectData = projectData;
        projectIndivCtrl.projectDataParsed = [];

        for (d = 0; d < 400; d++) {
            var arraypush = JSON.parse(projectIndivCtrl.projectData[d]['$value']);
            projectIndivCtrl.projectDataParsed.push(arraypush);

        }
        console.log(projectIndivCtrl.projectDataParsed[0].length);


        //saves ram (i think...)
        projectIndivCtrl.projectData = "none";
        $timeout(function () {
          projectIndivCtrl.setFrame();
        }, 100);

      });

//comment this out to restore
//projectIndivCtrl.projectData = "none"

    projectIndivCtrl.projectID = projectID;



    projectIndivCtrl.displayArray = function() {
      console.log(projectIndivCtrl.projectDataParsed[0]);

    }

    projectIndivCtrl.ColorPalate = [
      '',
      '#1976D2'
    ];

    projectIndivCtrl.setFrame = function() {

      for (i = 0; i < 400; i++) {
        //console.log('Display'+i);
        if(projectIndivCtrl.projectDataParsed[i][projectIndivCtrl.currentFrame] == 1){
            document.getElementById('Display'+i).style.backgroundColor = "red";
        }


      }
    }


    projectIndivCtrl.setNode = function(id) {
      //alert("fire");
      //console.log(projectIndivCtrl.projectData[0]);
      //console.log(projectIndivCtrl.projectData[0][id]);
      projectIndivCtrl.projectDataParsed[id][0] = 1;
      console.log(projectIndivCtrl.projectDataParsed[id][0]);
      projectIndivCtrl.setFrame()

    }


    projectIndivCtrl.setFrameNumber = function(frame) {
      projectIndivCtrl.currentFrame = frame;
      projectIndivCtrl.setFrame()
    }


    projectIndivCtrl.SaveProject = function() {

      projectIndivCtrl.uploadCount = 0;

      for (i = 0; i < 400; i++) {
          var projectDataUpload = {};
          //console.log(projectsCtrl.newProjectData.songData[i])
          projectDataUpload['/ProjectData/'+ profileID + '/' + projectIndivCtrl.projectID + '/' + i] = JSON.stringify(projectIndivCtrl.projectDataParsed[i]);
          firebase.database().ref().update(projectDataUpload)
          .then(function(ref){
              projectIndivCtrl.uploadCount += 1;

              if(projectIndivCtrl.uploadCount == 400) {
                alert("done");
              }

          })

      }

    }


})
