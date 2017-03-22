angular.module('lightShowApp')
  .controller('TemplatesCtrl', function($firebaseArray, $state, $mdDialog, $http, $timeout, $interval, $scope, Auth, profile, currentPage, templates){
    var templatesCtrl = this;

    templatesCtrl.currentPage = currentPage;

    templatesCtrl.currentPage.add("Templates");

    templatesCtrl.templates = templates;

    //console.log(templates)
    templatesCtrl.profile = profile;

    var profileID = profile.$id;



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

              var xid = id % 20;

              templatesCtrl.presetExamp.forEach(function(frame, index) {
                  frame.forEach(function(element) {
                    var elID = element + id;
                    if(elID>= 0 && elID < 400) {
                        if(xid >= 10) {
                          if((elID % 20) >= (xid - 10)){

                            templatesCtrl.projectDataParsed[elID][templatesCtrl.currentFrame + index] = templatesCtrl.SelectedColor.index;

                          }
                        }else if (xid < 10) {
                          console.log(elID )
                          if((elID % 20) < (10 + xid)){
                            console.log(elID % 20);
                            templatesCtrl.projectDataParsed[elID][templatesCtrl.currentFrame + index] = templatesCtrl.SelectedColor.index;

                          }
                        }

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


    templatesCtrl.SaveTemplate = function(ev) {

      var confirm = $mdDialog.prompt()
         .title('What would you name your template?')
         .textContent('Keep it short and simple')
         .placeholder('Template name')
         .ariaLabel('Template name')
         .initialValue('MyTemplate')
         .targetEvent(ev)
         .ok('Okay!')
         .cancel('Back to Edit');

       $mdDialog.show(confirm).then(function(result) {

         var frameisSet = "things";

         for (bf = 0; bf < 100; bf++) {
           for (bi = 0; bi < 400; bi++) {
             if(templatesCtrl.projectDataParsed[bi][bf] == 0) {

             }else {

               if( frameisSet == "things") {
                 frameisSet = bf;

               }


             }
           }
         }

         var presetArray = [];
         //console.log(presetArray);

         //console.log(100 - frameisSet);
         var numberofframes = 100 - Number(frameisSet);
         //alert(frameisSet);

         for (f = 0; f < Number(numberofframes); f++) {
           presetArray.push([]);

           var frameArray = [];
           for (i = 0; i < 400; i++) {
             if(templatesCtrl.projectDataParsed[i][f] == 0) {

             }else {
               //console.log(presetArray[f]);
               var dataspot = i - 190;
               presetArray[f].push(dataspot);

              }
            }
          }

           for(a = 0; a < frameisSet; a++){
             console.log(a);
             presetArray.splice(0, 1);
           }


           if(presetArray != ''){
             var templateKey = firebase.database().ref('TemplateData/').push().key
             var templateDataUpload = {};
             var templateUpload = {};
             var userTempUpload = {};

             templateDataUpload['/TemplateData/'+templateKey] = {'data': JSON.stringify(presetArray)};
             firebase.database().ref().update(templateDataUpload)
             .then(function(ref){

               templateUpload['/Templates/'+templateKey] = result;
               firebase.database().ref().update(templateUpload)
               .then(function(ref){

                 templateUpload['/users/'+ profile.$id + '/templates/' + templateKey] = result;
                 firebase.database().ref().update(templateUpload)
                 .then(function(ref){

                     alert(result + " upload complete.")
                     console.log(ref);
                      $state.go('homepage.projects')

                  })

                })

             })

           }else {
             alert("no preset data");
           }



       }, function() {


       });





    }

    templatesCtrl.setTemplateCenterDiv = function() {
      if(document.getElementById('Center190').style.backgroundColor == ''){
          document.getElementById('Center190').style.backgroundColor = "green";
      }else{
        document.getElementById('Center190').style.backgroundColor = "";
      }

    }

    $timeout(function () {
      templatesCtrl.setTemplateCenterDiv();

    }, 1000);



    templatesCtrl.deleteTemplate = function(tempplateID) {
      var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete this Template?')
            .textContent('')
            .ariaLabel('')
            .targetEvent(event)
            .ok('Yes')
            .cancel('No');
            $mdDialog.show(confirm).then(function() {
                var templateToDelete = {};
                templateToDelete['/users/'+ templatesCtrl.profile.$id + '/templates/' + tempplateID] = null;
                firebase.database().ref().update(templateToDelete)
                .then(function(ref){


                   }, function() {
                      return
                });


              })

    }

  })
