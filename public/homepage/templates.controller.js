angular.module('lightShowApp')
  .controller('TemplatesCtrl', function($firebaseArray, $http, $timeout, $interval, $scope, Auth, profile, currentPage){
    var templatesCtrl = this;

    templatesCtrl.currentPage = currentPage;

    templatesCtrl.currentPage.add("Templates");

    templatesCtrl.templates = [
      {
        title: 'templateA',
        creator: 'BaxAttack',
        lastModified: '1/23/17'
      },
      {
        title: 'templateA',
        creator: 'BaxAttack',
        lastModified: '1/23/17'
      },
      {
        title: 'templateA',
        creator: 'BaxAttack',
        lastModified: '1/23/17'
      },
      {
        title: 'templateA',
        creator: 'BaxAttack',
        lastModified: '1/23/17'
      }

    ];










    var projectID = '-KdN_7xhXvwtCRy3FW8m';
    var profileID = profile.$id;

    console.log("profile " + profileID);
    console.log("profile " + projectID);

    templatesCtrl.currentFrame = 0;
    templatesCtrl.lastFrame = 0
  //uncomment this to load data
    templatesCtrl.projectDataParsed = [];

    templatesCtrl.isplaying = "false";
    templatesCtrl.selectedTool = "square";


    templatesCtrl.presetExamp = [];





        //console.log(projectData);

        templatesCtrl.projectDataParsed = [];

        for (d = 0; d < 400; d++) {
            var arraypush = [
              0,0,0,0,0,0,0,0,0,0,
              0,0,0,0,0,0,0,0,0,0,
              0,0,0,0,0,0,0,0,0,0,
              0,0,0,0,0,0,0,0,0,0,
              0,0,0,0,0,0,0,0,0,0,
              0,0,0,0,0,0,0,0,0,0,
              0,0,0,0,0,0,0,0,0,0,
              0,0,0,0,0,0,0,0,0,0,
              0,0,0,0,0,0,0,0,0,0,
              0,0,0,0,0,0,0,0,0,0
            ];
            templatesCtrl.projectDataParsed.push(arraypush);

        }


        //saves ram (i think...)
        templatesCtrl.projectData = "none";
        $timeout(function () {
          templatesCtrl.setFrame();
        }, 100);







  //comment this out to restore
  //templatesCtrl.projectData = "none"

    templatesCtrl.projectID = projectID;


    templatesCtrl.displayArray = function() {
      console.log(templatesCtrl.projectDataParsed[0]);

    }

    templatesCtrl.selectedToolSet = function(tool) {
      templatesCtrl.selectedTool = tool;
      templatesCtrl.setNodeINVar = 'nope';

      document.getElementById('square').style.backgroundColor = 'gray';
      document.getElementById('draw').style.backgroundColor = 'gray';
      document.getElementById('preset').style.backgroundColor = 'gray';

      document.getElementById(tool).style.backgroundColor = '#4CAF50';
    }


    templatesCtrl.SelectedColor = {
        'colorHex': '#1976D2',
        'index': 1
    };

    templatesCtrl.ColorPalate = [
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

    templatesCtrl.setColor = function( indexVar) {
      //console.log( indexVar);
      templatesCtrl.SelectedColor.colorHex = templatesCtrl.ColorPalate[indexVar];
      templatesCtrl.SelectedColor.index = indexVar;

    }

    templatesCtrl.setFrame = function() {

      document.getElementById('currentFrame'+templatesCtrl.lastFrame).style.backgroundColor = "gray";
      document.getElementById('currentFrame'+templatesCtrl.currentFrame).style.backgroundColor = "#4CAF50";

      for (i = 0; i < 400; i++) {

        document.getElementById('Display'+i).style.backgroundColor = templatesCtrl.ColorPalate[templatesCtrl.projectDataParsed[i][templatesCtrl.currentFrame]];

      }

      templatesCtrl.lastFrame = templatesCtrl.currentFrame;

    }

    templatesCtrl.setHighlightFrameSquare = function(id) {
        for (i = 0; i < 400; i++) {

          document.getElementById('High'+i).style.backgroundColor = '';

        }

        //console.log(id);
        var inxVar = Number(templatesCtrl.setNodeINVar) % 20;
        var inyVar = Math.floor(Number(templatesCtrl.setNodeINVar) / 20);

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

    templatesCtrl.setHighlightFrameDraw = function() {
      templatesCtrl.drawingArray.forEach(function(i) {
        document.getElementById('High'+i).style.backgroundColor = 'white';

      });

    }

    templatesCtrl.setNode = function(id) {
      //alert("fire");
      //console.log(templatesCtrl.projectData[0]);
      //console.log(templatesCtrl.projectData[0][id]);
      templatesCtrl.projectDataParsed[id][templatesCtrl.currentFrame] = templatesCtrl.SelectedColor.index;
      //console.log(templatesCtrl.projectDataParsed[id][templatesCtrl.currentFrame]);
      templatesCtrl.setFrame()

    }



    templatesCtrl.setNodeIN = function(id) {
      templatesCtrl.setNodeINVar = id;
      templatesCtrl.drawingArray = [];
      templatesCtrl.isClickedDown = "true";

    }



    templatesCtrl.setNodeMouseOver = function(id){
      for (i = 0; i < 400; i++) {
        document.getElementById('High'+i).style.backgroundColor = '';

      }
      document.getElementById('High'+id).style.backgroundColor = 'white';


      if(templatesCtrl.isClickedDown == "true"){
          templatesCtrl.drawingArray.push(id);

          if (templatesCtrl.selectedTool == "square") {
              templatesCtrl.setHighlightFrameSquare(id);

          }else if (templatesCtrl.selectedTool == "draw") {
              templatesCtrl.setHighlightFrameDraw();

          }else{
            console.log('preset');




          }




      }

    }


    templatesCtrl.setNodeOUT = function(id) {

      templatesCtrl.setNodeOUTVar = id;

      if(templatesCtrl.setNodeINVar == 'nope'){

      }else{
          if(templatesCtrl.selectedTool == "square"){

                  var inxVar = Number(templatesCtrl.setNodeINVar) % 20;
                  var inyVar = Math.floor(Number(templatesCtrl.setNodeINVar) / 20);

                  var outxVar = Number(templatesCtrl.setNodeOUTVar) % 20;
                  var outyVar = Math.floor(Number(templatesCtrl.setNodeOUTVar) / 20);
                  //alert(inxVar + ' : ' + inyVar);
                  //alert(outxVar + ' : ' + outyVar);


                if(inxVar <= outxVar && inyVar < outyVar) {
                  var columnsadd = outyVar - inyVar + 1;
                  var rowsadd =  outxVar - inxVar + 1;

                  for (c = 0; c < columnsadd; c++) {
                      for (r = 0; r < rowsadd; r++) {
                        var calcid = ((inyVar + c) * 20)+inxVar+r;
                        templatesCtrl.projectDataParsed[calcid][templatesCtrl.currentFrame] = templatesCtrl.SelectedColor.index;
                      }
                  }
                  templatesCtrl.setFrame()

                }else if (inxVar > outxVar && inyVar <= outyVar) {
                  var columnsadd = outyVar - inyVar + 1;
                  var rowsadd =  inxVar - outxVar + 1;

                  for (c = 0; c < columnsadd; c++) {
                      for (r = 0; r < rowsadd; r++) {
                        var calcid = ((inyVar + c) * 20)+outxVar+r;
                        templatesCtrl.projectDataParsed[calcid][templatesCtrl.currentFrame] = templatesCtrl.SelectedColor.index;
                      }
                  }
                  templatesCtrl.setFrame()
                }else if (inxVar > outxVar && inyVar > outyVar) {
                  var columnsadd = inyVar - outyVar + 1;
                  var rowsadd =  inxVar - outxVar + 1;

                  for (c = 0; c < columnsadd; c++) {
                      for (r = 0; r < rowsadd; r++) {
                        var calcid = ((outyVar + c) * 20)+outxVar+r;
                        templatesCtrl.projectDataParsed[calcid][templatesCtrl.currentFrame] = templatesCtrl.SelectedColor.index;
                      }
                  }
                  templatesCtrl.setFrame()
                }else{
                  var columnsadd = inyVar - outyVar + 1;
                  var rowsadd =  outxVar - inxVar + 1;

                  for (c = 0; c < columnsadd; c++) {
                      for (r = 0; r < rowsadd; r++) {
                        var calcid = ((outyVar + c) * 20)+inxVar+r;
                        templatesCtrl.projectDataParsed[calcid][templatesCtrl.currentFrame] = templatesCtrl.SelectedColor.index;
                      }
                  }
                  templatesCtrl.setFrame()
                }

          }else if (templatesCtrl.selectedTool == "draw") {
              templatesCtrl.drawingArray.forEach(function(element) {
                  templatesCtrl.projectDataParsed[element][templatesCtrl.currentFrame] = templatesCtrl.SelectedColor.index;
              });

              templatesCtrl.setFrame()
              templatesCtrl.drawingArray = [];

          }else {
              console.log('preset');

              templatesCtrl.presetExamp.forEach(function(frame, index) {
                  console.log(index);
                  frame.forEach(function(element) {
                    var elID = element + id;
                    if( elID>= 0 && elID < 400 ){
                      templatesCtrl.projectDataParsed[elID][templatesCtrl.currentFrame + index] = templatesCtrl.SelectedColor.index;

                    }

                  })
              });
              templatesCtrl.setFrame()
          }

      }


    /* clears highlight */
    for (i = 0; i < 400; i++) {

      document.getElementById('High'+i).style.backgroundColor = '';

    }

    templatesCtrl.isClickedDown = "false";


    }


    templatesCtrl.setFrameNumber = function(frame) {
      templatesCtrl.currentFrame = frame;
      templatesCtrl.setFrame()
      document.getElementById('songHolder').currentTime = frame * .1;
    }


    templatesCtrl.playShow = function() {
      if(templatesCtrl.isplaying == "false"){
        templatesCtrl.playShowInterval = $interval(function() {
          if(templatesCtrl.currentFrame == templatesCtrl.projectDataParsed[0].length - 1){
            templatesCtrl.pauseShow();
          }else {
            templatesCtrl.currentFrame +=1;
          }
          templatesCtrl.setFrame();


          console.log(templatesCtrl.currentFrame);
          document.getElementById('songHolder').play();
          //$scope.$apply();
          if(templatesCtrl.currentFrame % 300 == 0){
            document.getElementById('songHolder').currentTime = templatesCtrl.currentFrame * .1;
            document.getElementById('songHolder').play();
          }


        }, 100);
        templatesCtrl.isplaying = "true";
      }

    }

    templatesCtrl.pauseShow = function() {
      templatesCtrl.isplaying = "false";
      $interval.cancel(templatesCtrl.playShowInterval);
      document.getElementById('songHolder').pause();

    }

    templatesCtrl.PlayFromBegin = function() {
        templatesCtrl.pauseShow();
        templatesCtrl.currentFrame = 0;
        templatesCtrl.playShow();
        document.getElementById('songHolder').currentTime = 0;
        document.getElementById('songHolder').play();
        //$scope.$apply();
        templatesCtrl.isplaying = "true";

    }

    templatesCtrl.volumeDown = function() {
      var volume = document.getElementById('songHolder').volume;
      var voldown = volume - .1;
      document.getElementById('songHolder').volume = voldown;

    }

    templatesCtrl.volumeUp = function() {
      var volume = document.getElementById('songHolder').volume;
      var volup = volume + .1;
      document.getElementById('songHolder').volume = volup;

    }

    templatesCtrl.volumeMute = function() {
      document.getElementById('songHolder').volume = 0;

    }


    templatesCtrl.SaveTemplate = function() {
      var presetArray = [];
      templatesCtrl.frameisSet = "";

      for (bf = 0; bf < 100; bf++) {
        for (bi = 0; bi < 400; bi++) {
          if(templatesCtrl.projectDataParsed[bi][bf] == 0) {

          }else {

            if(templatesCtrl.frameisSet == "") {
                templatesCtrl.frameisSet = bf;
            }else{

            }


          }
        }
      }

      console.log(100 - templatesCtrl.frameisSet);
      var numberofframes = 100 - Number(templatesCtrl.frameisSet);

      for (f = Number(templatesCtrl.frameisSet); f < 100; f++) {
        presetArray.push([]);
        var frameArray = [];
        for (i = 0; i < 400; i++) {
          if(templatesCtrl.projectDataParsed[i][f] == 0) {

          }else {
            console.log(presetArray[f]);
            var dataspot = i - 190;
            presetArray[f].push(dataspot);

          }


        }
      }


      templatesCtrl.presetExamp = presetArray;
    }


  })
