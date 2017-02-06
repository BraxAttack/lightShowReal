angular.module('lightShowApp')
  .controller('ProjectsCtrl', function($state, $timeout, Auth, Users, profile, projects, currentPage){
    var projectsCtrl = this;

    projectsCtrl.currentPage = currentPage;
    projectsCtrl.currentPage.add("Projects");

    projectsCtrl.profile = profile;
    projectsCtrl.projects = projects;

    projectsCtrl.downloadURLforAudio = "dasdf";

    projectsCtrl.getDisplayName = Users.getDisplayName;
    projectsCtrl.getGravatar = Users.getGravatar;

    projectsCtrl.users = Users.all;

    Users.setOnline(projectsCtrl.profile.$id);

    projectsCtrl.newProject = {
      projectName: '',
      songTitle: '',
      lastEdit: '',
      color: '',
      user: projectsCtrl.profile.$id
    };

    projectsCtrl.newProjectData = {
      songData: []
    }

    projectsCtrl.colorList = [
      '#d32f2f',
      '#C2185B',
      '#7B1FA2',
      '#512DA8',
      '#303F9F',
      '#0288D1',
      '#1976D2',
      '#0097A7',
      '#00796B',
      '#388E3C',
      '#689F38',
      '#AFB42B',
      '#FBC02D',
      '#FFA000',
      '#F57C00',
      '#E64A19',
      '#5D4037',
      '#616161',
      '#455A64'
    ]

    projectsCtrl.selectedColor = "#d32f2f";
    projectsCtrl.newProject.color = projectsCtrl.selectedColor;

    projectsCtrl.selectColor = function(color) {
      projectsCtrl.selectedColor = color;
      projectsCtrl.newProject.color = projectsCtrl.selectedColor;
    };

    $("#file").on("change", function(event) {
      selectedFile = event.target.files[0];

    });

    projectsCtrl.percentage = 0;
    projectsCtrl.newProject.songurl = 'null';


/*
    projectsCtrl.myFunction = function() {
        alert(document.getElementById("actualUpload").duration);

    }
*/

    projectsCtrl.uploadFile = function(event) {




      var filename = selectedFile.name;
      var storageRef = firebase.storage().ref('/projectSongs/' + filename);
      var uploadTask = storageRef.put(selectedFile);



      uploadTask.on('state_changed', function(snapshot){

        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        projectsCtrl.percentage = percentage;

      }, function(error) {

      }, function() {

        var songKey = firebase.database().ref('Songs/').push().key;
        var downloadURL = uploadTask.snapshot.downloadURL;
        var updates = {};
        var songData = {
          url: downloadURL,
          user: projectsCtrl.profile.$id
        };
        updates['/Songs/' + projectsCtrl.profile.$id + '/' + songKey] = songData;
        firebase.database().ref().update(updates);

        //alert(downloadURL);
        projectsCtrl.newProject.songurl = downloadURL;
        console.log(songKey);

        alert(downloadURL)


      });

    };


    projectsCtrl.checkDurrationLoop = function(vid, projectKey) {
      console.log(vid);


      if(isNaN(vid.duration)) {
          console.log("wee1");
            $timeout(function() {
              projectsCtrl.checkDurrationLoop(vid, projectKey);
            }, 1000);
        }else{

          var projectDataUpdates = {};
          //alert("trueness");

          console.log(vid.duration);
          //console.log(projectsCtrl.newProjectData.songData);

          //10 frames for each second of the song plus 4 just in case
          var numberOfFrames = (vid.duration * 10) + 4;

          //creates blank frames for number of frames in song
          for (f = 0; f < numberOfFrames; f++) {
            projectsCtrl.newProjectData.songData.push([]);
            for (y = 0; y < 50; y++) {
              projectsCtrl.newProjectData.songData[f].push([]);
              for (x = 0; x < 50; x++) {
                projectsCtrl.newProjectData.songData[f][y].push([]);
                projectsCtrl.newProjectData.songData[f][y][x] = 0;
              }
            }
          }

          //console.log(projectsCtrl.newProjectData.songData);

          //adds song data
//commented out cause firebase dont like it cause it's too big
/*
          projectDataUpdates['/ProjectsData/' + projectsCtrl.profile.$id + '/' + projectKey] = projectsCtrl.newProjectData;
          firebase.database().ref().update(projectDataUpdates);
*/
        if (typeof projectsCtrl.newProjectData.songData === 'object') {
          //console.log(projectsCtrl.newProjectData.songData);
          //var JSONdata = JSON.stringify(projectsCtrl.newProjectData.songDat);

          var arr = [projectsCtrl.newProjectData.songData];
          var JSONdata = JSON.stringify(arr);

          var text = JSONdata;
          var filename = projectKey;
          var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
          saveAs(blob, filename+".txt");

          var storageRefData = firebase.storage().ref('/projectSongs/' + filename + '.txt');
          var uploadTaskData = storageRefData.put(blob);

          var file = uploadTaskData;
          console.log("test");
          $timeout(function() {
            $state.go('homepage.projects');
          }, 1000);


          storageRefData.put(file).then(function(snapshot) {
            console.log('Uploaded a blob or file!');

          });

        }


      //  var blob = new Blob([JSONdata], {type: "text/javascript"});
      //  saveAs(blob, filename+".txt");









        };

    }

//start new project creation;
    projectsCtrl.songurlLoop = function() {
/*    if(projectsCtrl.newProject.songurl == 'null') {
          //console.log(projectsCtrl.newProject.songurl);
          //projectsCtrl.songurlLoop();
          $timeout(function() {
            projectsCtrl.songurlLoop();
          }, 1000);
      }else{ */
        //console.log(projectsCtrl.newProject.songurl);
          var projectKey = firebase.database().ref('Projects/' + projectsCtrl.profile.$id).push().key;
          var projectUpdates = {};
          var projectDataUpdates = {};


          projectUpdates['/Projects/' + projectsCtrl.profile.$id + '/' + projectKey] = projectsCtrl.newProject;
          firebase.database().ref().update(projectUpdates)
          .then(function(ref){


            //var filename = selectedFile.name;
            var storageRef = firebase.storage().ref('/projectSongs/' + projectKey);
            var uploadTask = storageRef.put(selectedFile);

            uploadTask.on('state_changed', function(snapshot){

              var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              projectsCtrl.percentage = percentage;

            }, function(error) {
              alert(error);

            }, function() {


              var downloadURL = uploadTask.snapshot.downloadURL;
              var updates = {};
              var songData = {
                url: downloadURL,
                user: projectsCtrl.profile.$id
              };

              //projectsCtrl.newProject.songurl = downloadURL;


              //alert(downloadURL)




              const storageRef = firebase.storage().ref().child('projectSongs/' + projectKey);
              storageRef.getDownloadURL().then(function(url){

                //alert(url);
                url => this.image = url

                var x = document.createElement("AUDIO");

                if (x.canPlayType("audio/mpeg")) {
                    x.setAttribute("src", url);
                    x.setAttribute("id", "songID");
                }

                //x.setAttribute("controls", "controls");
                document.body.appendChild(x);

                var vid = document.getElementById("songID");

                //calls function that loops until durration is found
                projectsCtrl.checkDurrationLoop(vid, projectKey);

              });




            });
            //alert("something")



        //  $state.go('homepage.projects');
          //$state.go('channels.messages', {projectId: ref.key});
          return;
        });
      };
  //  };

    projectsCtrl.createProject = function(){

      //projectsCtrl.uploadFile();

      projectsCtrl.songurlLoop();

    };
//end new project creation

    projectsCtrl.logout = function(){
      projectsCtrl.profile.online = null;
      projectsCtrl.profile.$save().then(function(){
        Auth.$signOut().then(function(){
          $state.go('login');
        });
      });
    };










   projectsCtrl.initGeolocation = function() {
     alert("wee2");
   if (navigator && navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(projectsCtrl.successCallback, projectsCtrl.errorCallback);
          } else {
              console.log('Geolocation is not supported');
          }
  }

 projectsCtrl.errorCallback = function() {}

 projectsCtrl.successCallback = function(position) {
      var mapUrl = "http://maps.google.com/maps/api/staticmap?center=";
      mapUrl = mapUrl + position.coords.latitude + ',' + position.coords.longitude;
      mapUrl = mapUrl + '&zoom=15&size=512x512&maptype=roadmap&sensor=false';
      var imgElement = document.getElementById("static-map");
      imgElement.src = mapUrl;
      alert(position.coords.latitude + "/" + position.coords.longitude);
    }




    projectsCtrl.filedownload = function() {
      alert("wee3");
      var text = "lots of text and stuff that's not too important";
      var filename = "myFile"
      var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
      saveAs(blob, filename+".txt");


      var storageRefData = firebase.storage().ref('/projectSongs/mytextthingy');
      var uploadTaskData = storageRefData.put(blob);

      var file = uploadTaskData;
      ref.put(file).then(function(snapshot) {
        console.log('Uploaded a blob or file!');
      });

    };







  });
