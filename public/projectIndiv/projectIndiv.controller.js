angular.module('lightShowApp')
.controller("ProjectIndivCtrl", function($firebaseArray, $http, $timeout, $interval, $scope, Auth, projectIndivData, profile) {
    var projectIndivCtrl = this;

    var projectID = projectIndivData;
    var profileID = profile.$id;

    console.log("profile " + profileID);
    console.log("profile " + projectID);

    projectIndivCtrl.currentFrame = 0;
    projectIndivCtrl.lastFrame = 0
//uncomment this to load data
    projectIndivCtrl.projectDataParsed = [];

    projectIndivCtrl.isplaying = "false";

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

        // Create a reference to the file we want to download
        var songRef = firebase.storage().ref().child('projectSongs/'+projectID);
        songRef.getDownloadURL().then(function(url) {
          // Insert url into an <img> tag to "download"
          console.log(url);
          document.getElementById('songHolder').src = url;


        }).catch(function(error) {
          console.log(error);

        });


      });






//comment this out to restore
//projectIndivCtrl.projectData = "none"

    projectIndivCtrl.projectID = projectID;



    projectIndivCtrl.displayArray = function() {
      console.log(projectIndivCtrl.projectDataParsed[0]);

    }

    projectIndivCtrl.SelectedColor = {
        'colorHex': '#1976D2',
        'index': 1
    };

    projectIndivCtrl.ColorPalate = [
      '',
      '#1976D2',
      '#d32f2f',
      '#C2185B',
      '#7B1FA2',
      '#512DA8',
      '#303F9F',
      '#FBC02D',
      '#0288D1',
      '#388E3C',
      '#795548',
      '#F57C00',
      '#5D4037',
      '#455A64',
    ];

    $timeout(function () {
      document.getElementById('currentFrame0').style.backgroundColor = "#4CAF50";
    }, 400);

    projectIndivCtrl.setColor = function( indexVar) {
      //console.log( indexVar);
      projectIndivCtrl.SelectedColor.colorHex = projectIndivCtrl.ColorPalate[indexVar];
      projectIndivCtrl.SelectedColor.index = indexVar;

    }

    projectIndivCtrl.setFrame = function() {

      document.getElementById('currentFrame'+projectIndivCtrl.currentFrame).style.backgroundColor = "#4CAF50";
      document.getElementById('currentFrame'+projectIndivCtrl.lastFrame).style.backgroundColor = "gray";

      for (i = 0; i < 400; i++) {

        document.getElementById('Display'+i).style.backgroundColor = projectIndivCtrl.ColorPalate[projectIndivCtrl.projectDataParsed[i][projectIndivCtrl.currentFrame]];

      }

      projectIndivCtrl.lastFrame = projectIndivCtrl.currentFrame;

    }


    projectIndivCtrl.setNode = function(id) {
      //alert("fire");
      //console.log(projectIndivCtrl.projectData[0]);
      //console.log(projectIndivCtrl.projectData[0][id]);
      projectIndivCtrl.projectDataParsed[id][projectIndivCtrl.currentFrame] = projectIndivCtrl.SelectedColor.index;
      //console.log(projectIndivCtrl.projectDataParsed[id][projectIndivCtrl.currentFrame]);
      projectIndivCtrl.setFrame()

    }

    projectIndivCtrl.setNodeIN = function(id) {
      projectIndivCtrl.setNodeINVar = id;
    }

    projectIndivCtrl.setNodeOUT = function(id) {
      projectIndivCtrl.setNodeOUTVar = id;

      var inxVar = Number(projectIndivCtrl.setNodeINVar) % 20;
      var inyVar = Math.floor(Number(projectIndivCtrl.setNodeINVar) / 20);

      var outxVar = Number(projectIndivCtrl.setNodeOUTVar) % 20;
      var outyVar = Math.floor(Number(projectIndivCtrl.setNodeOUTVar) / 20);
      //alert(inxVar + ' : ' + inyVar);
      //alert(outxVar + ' : ' + outyVar);


    if(inxVar <= outxVar && inyVar < outyVar) {
      var columnsadd = outyVar - inyVar + 1;
      var rowsadd =  outxVar - inxVar + 1;

      for (c = 0; c < columnsadd; c++) {
          for (r = 0; r < rowsadd; r++) {
            var calcid = ((inyVar + c) * 20)+inxVar+r;
            projectIndivCtrl.projectDataParsed[calcid][projectIndivCtrl.currentFrame] = projectIndivCtrl.SelectedColor.index;
          }
      }
      projectIndivCtrl.setFrame()

    }else if (inxVar > outxVar && inyVar <= outyVar) {
      var columnsadd = outyVar - inyVar + 1;
      var rowsadd =  inxVar - outxVar + 1;

      for (c = 0; c < columnsadd; c++) {
          for (r = 0; r < rowsadd; r++) {
            var calcid = ((inyVar + c) * 20)+outxVar+r;
            projectIndivCtrl.projectDataParsed[calcid][projectIndivCtrl.currentFrame] = projectIndivCtrl.SelectedColor.index;
          }
      }
      projectIndivCtrl.setFrame()
    }else if (inxVar > outxVar && inyVar > outyVar) {
      var columnsadd = inyVar - outyVar + 1;
      var rowsadd =  inxVar - outxVar + 1;

      for (c = 0; c < columnsadd; c++) {
          for (r = 0; r < rowsadd; r++) {
            var calcid = ((outyVar + c) * 20)+outxVar+r;
            projectIndivCtrl.projectDataParsed[calcid][projectIndivCtrl.currentFrame] = projectIndivCtrl.SelectedColor.index;
          }
      }
      projectIndivCtrl.setFrame()
    }else{
      var columnsadd = inyVar - outyVar + 1;
      var rowsadd =  outxVar - inxVar + 1;

      for (c = 0; c < columnsadd; c++) {
          for (r = 0; r < rowsadd; r++) {
            var calcid = ((outyVar + c) * 20)+inxVar+r;
            projectIndivCtrl.projectDataParsed[calcid][projectIndivCtrl.currentFrame] = projectIndivCtrl.SelectedColor.index;
          }
      }
      projectIndivCtrl.setFrame()
    }


    }


    projectIndivCtrl.setFrameNumber = function(frame) {
      projectIndivCtrl.currentFrame = frame;
      projectIndivCtrl.setFrame()
      document.getElementById('songHolder').currentTime = frame * .1;
    }


    projectIndivCtrl.playShow = function() {
      if(projectIndivCtrl.isplaying == "false"){
        projectIndivCtrl.playShowInterval = $interval(function() {
          projectIndivCtrl.setFrame();
          projectIndivCtrl.currentFrame +=1;
          console.log(projectIndivCtrl.currentFrame);
          document.getElementById('songHolder').play();
          //$scope.$apply();
          if(projectIndivCtrl.currentFrame % 30 == 0){
            document.getElementById('songHolder').currentTime = projectIndivCtrl.currentFrame * .1;
            document.getElementById('songHolder').play();
          }
          if(projectIndivCtrl.currentFrame == projectIndivCtrl.projectDataParsed[0].length){
            projectIndivCtrl.pauseShow();
          }

        }, 100);
        projectIndivCtrl.isplaying = "true";
      }

    }

    projectIndivCtrl.pauseShow = function() {
      projectIndivCtrl.isplaying = "false";
      $interval.cancel(projectIndivCtrl.playShowInterval);
      document.getElementById('songHolder').pause();

    }

    projectIndivCtrl.PlayFromBegin = function() {
        projectIndivCtrl.pauseShow();
        projectIndivCtrl.currentFrame = 0;
        projectIndivCtrl.playShow();
        document.getElementById('songHolder').currentTime = 0;
        document.getElementById('songHolder').play();
        //$scope.$apply();
        projectIndivCtrl.isplaying = "true";

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
