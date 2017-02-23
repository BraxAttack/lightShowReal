angular.module('lightShowApp')
.controller("ProjectIndivCtrl", function($firebaseArray, $http, $timeout, $interval, $scope, Auth, projectIndivData, profile, templates) {
    var projectIndivCtrl = this;

    var projectID = projectIndivData;
    var profileID = profile.$id;

    console.log("profile " + profileID);
    console.log("profile " + projectID);

/*
    var element = document.getElementById('homepageProjectsAddFab').style.display;
    if (element === null) {
      alert("nulls")

    }
*/
if ( angular.element('homepageProjectsAddFab').length > 0) {
  alert("go");
  document.getElementById('homepageProjectsAddFab').style.display = "none";
}


    projectIndivCtrl.currentFrame = 0;
    projectIndivCtrl.lastFrame = 0
//uncomment this to load data
    projectIndivCtrl.projectDataParsed = [];

    projectIndivCtrl.isplaying = "false";
    projectIndivCtrl.selectedTool = "square";


    projectIndivCtrl.selectedPreset = 0;
    projectIndivCtrl.lastselectedPreset = 0;
    projectIndivCtrl.presetExamp = [];

    var stop = $interval(function () {
        if(projectIndivCtrl.templates == null) {
            projectIndivCtrl.templates = templates;
            console.log(projectIndivCtrl.templates);
            projectIndivCtrl.templates.forEach(function(i) {
                projectIndivCtrl.presetExamp.push([])
            })
            $scope.$apply()

        }else{
          $interval.cancel(stop)
          document.getElementById('template0').style.backgroundColor = '#4CAF50';
        }
        console.log("going");
    }, 100);


    $(document).keydown(function(evt){
      console.log(evt);
    })


    projectIndivCtrl.setPreset = function(index, pID) {
      projectIndivCtrl.selectedPreset = index;
      document.getElementById('template'+projectIndivCtrl.lastselectedPreset).style.backgroundColor = 'gray';
      document.getElementById('template'+index).style.backgroundColor = '#4CAF50';

      if(projectIndivCtrl.presetExamp[projectIndivCtrl.selectedPreset] == '') {
        var ref = firebase.database().ref('/TemplateData/').child(pID);
        var templateData = $firebaseArray(ref).$loaded()
        .then(function (templateData){
            console.log(JSON.parse(templateData[0]['$value']));
            projectIndivCtrl.presetExamp[projectIndivCtrl.selectedPreset] = JSON.parse(templateData[0]['$value']);

        })

      }

      projectIndivCtrl.lastselectedPreset = projectIndivCtrl.selectedPreset;
    }






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

    projectIndivCtrl.selectedToolSet = function(tool) {
      projectIndivCtrl.selectedTool = tool;
      projectIndivCtrl.setNodeINVar = 'nope';

      document.getElementById('square').style.backgroundColor = 'gray';
      document.getElementById('draw').style.backgroundColor = 'gray';
      document.getElementById('preset').style.backgroundColor = 'gray';

      document.getElementById(tool).style.backgroundColor = '#4CAF50';
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


    projectIndivCtrl.displayLastFrame = "true";

    projectIndivCtrl.ShowLastFrame = function(variable) {
      projectIndivCtrl.displayLastFrame = variable;
      if(variable == "false"){
        document.getElementById('showLastFrameTrue').style.display = "none";
        document.getElementById('ShowLastFrameFalse').style.display = "block";
      }else if (variable == "true") {
        document.getElementById('showLastFrameTrue').style.display = "block";
        document.getElementById('ShowLastFrameFalse').style.display = "none";

      }

      projectIndivCtrl.setFrame();

    }


    projectIndivCtrl.setFrame = function() {

      for (i = 0; i < 400; i++) {
        document.getElementById('Display'+i).style.backgroundColor = projectIndivCtrl.ColorPalate[projectIndivCtrl.projectDataParsed[i][projectIndivCtrl.currentFrame]];

      }

      for (i = 0; i < 400; i++) {
        document.getElementById('LastFrameDisplay'+i).style.backgroundColor = "";

      }

      if(projectIndivCtrl.displayLastFrame == "true"){
        if((projectIndivCtrl.currentFrame - 1) >= 0){
          var fminone = projectIndivCtrl.currentFrame - 1;
          for (i = 0; i < 400; i++) {
            document.getElementById('LastFrameDisplay'+i).style.backgroundColor = projectIndivCtrl.ColorPalate[projectIndivCtrl.projectDataParsed[i][fminone]];

          }
        }
      }

      document.getElementById('currentFrame'+projectIndivCtrl.lastFrame).style.backgroundColor = "gray";
      projectIndivCtrl.lastFrame = projectIndivCtrl.currentFrame;
      document.getElementById('currentFrame'+projectIndivCtrl.currentFrame).style.backgroundColor = "#4CAF50";



    }

    projectIndivCtrl.setHighlightFrameSquare = function(id) {
        for (i = 0; i < 400; i++) {

          document.getElementById('High'+i).style.backgroundColor = '';

        }

        //console.log(id);
        var inxVar = Number(projectIndivCtrl.setNodeINVar) % 20;
        var inyVar = Math.floor(Number(projectIndivCtrl.setNodeINVar) / 20);

        var outxVar = Number(id) % 20;
        var outyVar = Math.floor(Number(id) / 20)


        if(inxVar <= outxVar && inyVar < outyVar) {
          var columnsadd = outyVar - inyVar + 1;
          var rowsadd =  outxVar - inxVar + 1;

          for (c = 0; c < columnsadd; c++) {
              for (r = 0; r < rowsadd; r++) {
                var calcid = ((inyVar + c) * 20)+inxVar+r;
                document.getElementById('High'+calcid).style.backgroundColor = 'white';
              }
          }


        }else if (inxVar > outxVar && inyVar <= outyVar) {
          var columnsadd = outyVar - inyVar + 1;
          var rowsadd =  inxVar - outxVar + 1;

          for (c = 0; c < columnsadd; c++) {
              for (r = 0; r < rowsadd; r++) {
                var calcid = ((inyVar + c) * 20)+outxVar+r;
                document.getElementById('High'+calcid).style.backgroundColor = 'white';
              }
          }

        }else if (inxVar > outxVar && inyVar > outyVar) {
          var columnsadd = inyVar - outyVar + 1;
          var rowsadd =  inxVar - outxVar + 1;

          for (c = 0; c < columnsadd; c++) {
              for (r = 0; r < rowsadd; r++) {
                var calcid = ((outyVar + c) * 20)+outxVar+r;
                document.getElementById('High'+calcid).style.backgroundColor = 'white';
              }
          }

        }else{
          var columnsadd = inyVar - outyVar + 1;
          var rowsadd =  outxVar - inxVar + 1;

          for (c = 0; c < columnsadd; c++) {
              for (r = 0; r < rowsadd; r++) {
                var calcid = ((outyVar + c) * 20)+inxVar+r;
                document.getElementById('High'+calcid).style.backgroundColor = 'white';
              }
          }
      }
    }

    projectIndivCtrl.setHighlightFrameDraw = function() {
      projectIndivCtrl.drawingArray.forEach(function(i) {
        document.getElementById('High'+i).style.backgroundColor = 'white';

      });

    }

    projectIndivCtrl.setNode = function(id) {
      //alert("fire");
      //console.log(projectIndivCtrl.projectData[0]);
      //console.log(projectIndivCtrl.projectData[0][id]);
      projectIndivCtrl.projectDataParsed[id][projectIndivCtrl.currentFrame] = projectIndivCtrl.SelectedColor.index;
      //console.log(projectIndivCtrl.projectDataParsed[id][projectIndivCtrl.currentFrame]);
      projectIndivCtrl.setFrame();

    }



    projectIndivCtrl.setNodeIN = function(id) {
      projectIndivCtrl.setNodeINVar = id;
      projectIndivCtrl.drawingArray = [];
      projectIndivCtrl.isClickedDown = "true";

    }



    projectIndivCtrl.setNodeMouseOver = function(id){
      for (i = 0; i < 400; i++) {
        document.getElementById('High'+i).style.backgroundColor = '';

      }
      document.getElementById('High'+id).style.backgroundColor = 'white';


      if(projectIndivCtrl.isClickedDown == "true"){
          projectIndivCtrl.drawingArray.push(id);

          if (projectIndivCtrl.selectedTool == "square") {
              projectIndivCtrl.setHighlightFrameSquare(id);

          }else if (projectIndivCtrl.selectedTool == "draw") {
              projectIndivCtrl.setHighlightFrameDraw();

          }else{
            console.log('preset');




          }




      }

    }


    projectIndivCtrl.setNodeOUT = function(id) {

      projectIndivCtrl.setNodeOUTVar = id;

      if(projectIndivCtrl.setNodeINVar == 'nope'){

      }else{
          if(projectIndivCtrl.selectedTool == "square"){

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

          }else if (projectIndivCtrl.selectedTool == "draw") {
              projectIndivCtrl.drawingArray.forEach(function(element) {
                  projectIndivCtrl.projectDataParsed[element][projectIndivCtrl.currentFrame] = projectIndivCtrl.SelectedColor.index;
              });

              projectIndivCtrl.setFrame()
              projectIndivCtrl.drawingArray = [];

          }else {
              console.log('preset');

              var xid = id % 20;

              projectIndivCtrl.presetExamp[projectIndivCtrl.selectedPreset].forEach(function(frame, index) {
                  frame.forEach(function(element) {
                    var elID = element + id;
                    if(elID>= 0 && elID < 400) {
                        if(xid >= 10) {
                          if((elID % 20) >= (xid - 10)){

                            projectIndivCtrl.projectDataParsed[elID][projectIndivCtrl.currentFrame + index] = projectIndivCtrl.SelectedColor.index;

                          }
                        }else if (xid < 10) {
                          console.log(elID )
                          if((elID % 20) < (10 + xid)){
                            console.log(elID % 20);
                            projectIndivCtrl.projectDataParsed[elID][projectIndivCtrl.currentFrame + index] = projectIndivCtrl.SelectedColor.index;

                          }
                        }

                    }



                  })
              });
              projectIndivCtrl.setFrame()
          }

      }


    /* clears highlight */
    for (i = 0; i < 400; i++) {

      document.getElementById('High'+i).style.backgroundColor = '';

    }

    projectIndivCtrl.isClickedDown = "false";


    }


    projectIndivCtrl.setFrameNumber = function(frame) {
      projectIndivCtrl.currentFrame = frame;
      projectIndivCtrl.setFrame()
      document.getElementById('songHolder').currentTime = frame * .1;
    }


    projectIndivCtrl.playShow = function() {
      projectIndivCtrl.displayLastFrame = "false"

      if(projectIndivCtrl.isplaying == "false"){
        projectIndivCtrl.playShowInterval = $interval(function() {
          projectIndivCtrl.currentFrame +=1;
          projectIndivCtrl.setFrame();
          console.log(projectIndivCtrl.currentFrame);
          document.getElementById('songHolder').play();
          //$scope.$apply();
          if(projectIndivCtrl.currentFrame % 300 == 0){
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
      projectIndivCtrl.displayLastFrame = "true"
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
        projectIndivCtrl.displayLastFrame = "false";

    }

    projectIndivCtrl.volumeDown = function() {
      var volume = document.getElementById('songHolder').volume;
      var voldown = volume - .1;
      document.getElementById('songHolder').volume = voldown;

    }

    projectIndivCtrl.volumeUp = function() {
      var volume = document.getElementById('songHolder').volume;
      var volup = volume + .1;
      document.getElementById('songHolder').volume = volup;

    }

    projectIndivCtrl.volumeMute = function() {
      document.getElementById('songHolder').volume = 0;

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
