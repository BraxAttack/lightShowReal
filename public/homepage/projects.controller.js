angular.module('lightShowApp')
  .controller('ProjectsCtrl', function($state, $timeout, Auth, Users, profile, projects, currentPage){
    var projectsCtrl = this;

    projectsCtrl.currentPage = currentPage;
    projectsCtrl.currentPage.add("Projects");

    projectsCtrl.profile = profile;
    projectsCtrl.projects = projects;



    projectsCtrl.getDisplayName = Users.getDisplayName;
    projectsCtrl.getGravatar = Users.getGravatar;

    projectsCtrl.users = Users.all;

    Users.setOnline(projectsCtrl.profile.$id);

    projectsCtrl.newProject = {
      projectName: '',
      songTitle: '',
      songurl: '',
      lastEdit: '',
      user: projectsCtrl.profile.$id
    };

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

    projectsCtrl.selectColor = function(color) {
      projectsCtrl.selectedColor = color
    };

    $("#file").on("change", function(event) {
      selectedFile = event.target.files[0];

    });

    projectsCtrl.percentage = 0;
    projectsCtrl.newProject.songurl = 'null';

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

      });

    };


//start new project creation;
    projectsCtrl.songurlLoop = function() {
      if(projectsCtrl.newProject.songurl == 'null') {
          //console.log(projectsCtrl.newProject.songurl);
          //projectsCtrl.songurlLoop();
          $timeout(function() {
            projectsCtrl.songurlLoop();
          }, 1000);
      }else{
        //console.log(projectsCtrl.newProject.songurl);
          var projectKey = firebase.database().ref('Projects/' + projectsCtrl.profile.$id).push().key;
          var projectUpdates = {};

          projectUpdates['/Projects/' + projectsCtrl.profile.$id + '/' + projectKey] = projectsCtrl.newProject;
          firebase.database().ref().update(projectUpdates)
          .then(function(ref){

          $state.go('homepage.projects');
          //$state.go('channels.messages', {projectId: ref.key});
          return;
        });
      }
    };

    projectsCtrl.createProject = function(){

      projectsCtrl.uploadFile();

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
  });




/*angular.module('lightShowApp')
  .controller('ProjectsCtrl', function(currentPage){
    var projectsCtrl = this;

    projectsCtrl.currentPage = currentPage;

    projectsCtrl.currentPage.add("Projects");

    projectsCtrl.projects = [
      {
        title: 'OneB',
        creator: 'BaxAttack',
        lastModified: '1/23/17',
        songTitle: 'WildestDreams.mp3'
      },
      {
        title: 'OneB',
        creator: 'BaxAttack',
        lastModified: '1/23/17',
        songTitle: 'WildestDreams.mp3'
      },
      {
        title: 'OneB',
        creator: 'BaxAttack',
        lastModified: '1/23/17',
        songTitle: 'WildestDreams.mp3'
      },
      {
        title: 'OneB',
        creator: 'BaxAttack',
        lastModified: '1/23/17',
        songTitle: 'WildestDreams.mp3'
      },
      {
        title: 'OneB',
        creator: 'BaxAttack',
        lastModified: '1/23/17',
        songTitle: 'WildestDreams.mp3'
      },
      {
        title: 'OneB',
        creator: 'BaxAttack',
        lastModified: '1/23/17',
        songTitle: 'WildestDreams.mp3'
      },
      {
        title: 'OneB',
        creator: 'BaxAttack',
        lastModified: '1/23/17',
        songTitle: 'WildestDreams.mp3'
      },


    ];


  });
*/
