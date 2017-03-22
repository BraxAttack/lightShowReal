angular.module('lightShowApp')
  .controller('PlaylistsCtrl', function($firebaseArray, $interval, $timeout, $mdDialog, currentPage, projects, profile){
    var playlistsCtrl = this;

    playlistsCtrl.currentPage = currentPage;
    playlistsCtrl.whichPlaylistPage = 'playlistList';
    playlistsCtrl.projects = projects;
    playlistsCtrl.profile = profile;
    playlistsCtrl.myDate = new Date();
    playlistsCtrl.isOpen = false;
    playlistsCtrl.showtime = 20.5;
    playlistsCtrl.selectedPlaylistForShowCreation = null;


    playlistsCtrl.currentPage.add("GoLive");
    playlistsCtrl.intervalSet = "none";
    playlistsCtrl.playlistOrderIDs = []


    $interval(function () {
      if(playlistsCtrl.currentPage['pageVar'] != 'GoLive') {
          $interval.cancel(playlistsCtrl.getDurrationInterval);
          $interval.cancel(playlistsCtrl.gettimeInterval);
          $interval.cancel(playlistsCtrl.updateTimeInterval);
          $interval.cancel(playlistsCtrl.updateTimeIntervalPAUSEPLAY)

      }
    }, 3000);

    var ref = firebase.database().ref('/Showings/'+playlistsCtrl.profile.$id);
    var ShowingsList = $firebaseArray(ref).$loaded()
    .then(function (ShowingsList){
        playlistsCtrl.shows = ShowingsList;
        console.log(ShowingsList)
    })

    var ref2 = firebase.database().ref('/Playlists/'+playlistsCtrl.profile.$id);
    var PlaylistsList = $firebaseArray(ref2).$loaded()
    .then(function (PlaylistsList){
        playlistsCtrl.playlists = PlaylistsList;
        console.log(PlaylistsList)
    })

    playlistsCtrl.selectAShowToEdit = function(projectID, userID, indexVar, dollaID) {
      playlistsCtrl.whichPlaylistPage = 'IndividualPlaylist';
      console.log(projectID)

      playlistsCtrl.CurrentPlalistTitle = playlistsCtrl.shows[indexVar]['showName'];
      playlistsCtrl.CurrentPlalistVenue = playlistsCtrl.shows[indexVar]['venue'];
      playlistsCtrl.CurrentPlalistDate = playlistsCtrl.shows[indexVar]['appxStartDate']
      playlistsCtrl.CurrentPlalistuserID = userID;
      playlistsCtrl.CurrentPlalistindexVar = indexVar;
      playlistsCtrl.CurrentPlalistDollaID = dollaID;
      playlistsCtrl.CurrentPlalistStartTime = playlistsCtrl.shows[indexVar]['startTime'];


      var songRef = firebase.storage().ref().child('projectSongs/'+projectID);
      songRef.getDownloadURL().then(function(url) {
        // Insert url into an <img> tag to "download"
        console.log(url);
        document.getElementById('songHolder2').src = url;
        document.getElementById('songHolder2').currentTime = 0;

       playlistsCtrl.getDurrationInterval = $interval(function () {
          playlistsCtrl.CurrentPlalistlenghtOfSong = document.getElementById('songHolder2').duration;

        }, 1000);


      }).catch(function(error) {
        console.log(error);

      });

      var offsetRef = firebase.database().ref(".info/serverTimeOffset");
      offsetRef.on("value", function(snap) {
        var offset = snap.val();
        var estimatedServerTimeMs = new Date().getTime() + offset;
        playlistsCtrl.serverTime = estimatedServerTimeMs;
      });

      playlistsCtrl.gettimeInterval = $interval(function () {
        var offsetRef = firebase.database().ref(".info/serverTimeOffset");
        offsetRef.on("value", function(snap) {
          var offset = snap.val();
          var estimatedServerTimeMs = new Date().getTime() + offset;
          playlistsCtrl.serverTime = estimatedServerTimeMs;
          playlistsCtrl.serverTime2 = estimatedServerTimeMs;

        });
      }, 3000);


      var millisec = 0;
      playlistsCtrl.updateTimeInterval = $interval(function () {
        var date = new Date();

        //var comp = date.getHours() + ":" + date.getMinutes(); + ":" + date.getSeconds()
        playlistsCtrl.CurrentPlalistCurrentTimeH = date.getHours();
        playlistsCtrl.CurrentPlalistCurrentTimeM = date.getMinutes();
        var sec = date.getSeconds();
        if(sec < 10){
          playlistsCtrl.CurrentPlalistCurrentTimeS = "0"+sec;
        }else{
          playlistsCtrl.CurrentPlalistCurrentTimeS = sec;
        }

        var countdownvar = .001 * (playlistsCtrl.serverTime - playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['startTime']);
        playlistsCtrl.countdownTime = countdownvar.toFixed(0);

        if(playlistsCtrl.countdownTime < 0){
          if(playlistsCtrl.countdownTime > -10){
            document.getElementById('playlistEventControlsTimeShowDivTMinus').style.backgroundColor = "#f44336";
            document.getElementById('playlistEventControlsTimeShowDivTMinus').style.color = "#FAFAFA";
          }else if(playlistsCtrl.countdownTime > -30){
            document.getElementById('playlistEventControlsTimeShowDivTMinus').style.backgroundColor = "#FF9800";
            document.getElementById('playlistEventControlsTimeShowDivTMinus').style.color = "#FAFAFA";
          }else if(playlistsCtrl.countdownTime > -60){
            document.getElementById('playlistEventControlsTimeShowDivTMinus').style.backgroundColor = "#FFC107";
            document.getElementById('playlistEventControlsTimeShowDivTMinus').style.color = "#FAFAFA";
          }else if(playlistsCtrl.countdownTime > -300){
            document.getElementById('playlistEventControlsTimeShowDivTMinus').style.backgroundColor = "#FFEB3B";
            document.getElementById('playlistEventControlsTimeShowDivTMinus').style.color = "#212121";

          }else{
            document.getElementById('playlistEventControlsTimeShowDivTMinus').style.backgroundColor = "#03A9F4";
          }
          document.getElementById('songHolder2').pause();
          document.getElementById('songHolder2').currentTime = 0;
        }

        if(playlistsCtrl.countdownTime > 0 && playlistsCtrl.countdownTime < 5){
          document.getElementById('playlistEventControlsTimeShowDivTMinus').style.backgroundColor = "#4CAF50";
          document.getElementById('playlistEventControlsTimeShowDivTMinus').style.color = "#FAFAFA";
          //document.getElementById('songHolder2').currentTime = 0;
          //document.getElementById('songHolder2').play();

        }

        var timeleftfirst = playlistsCtrl.CurrentPlalistlenghtOfSong - playlistsCtrl.countdownTime + Number(playlistsCtrl.timeAdjustHistoryVar);
        var timeleft = timeleftfirst.toFixed(0);
        playlistsCtrl.CurrentPlalistLimeLeftInSong = timeleft;
        //console.log(playlistsCtrl.CurrentPlalistlenghtOfSong);
        //console.log(timeleft);

        if(timeleft < 0){
          document.getElementById('songHolder2').pause();
          document.getElementById('songHolder2').currentTime = 0;
          playlistsCtrl.CurrentPlalistLimeLeftInSong = "0";
          document.getElementById('playlistEventControlsTimeShowDivTMinus').style.backgroundColor = "#616161";
          document.getElementById('playlistEventControlsTimeShowDivTMinus').style.color = "#757575";

        }else if(timeleft < playlistsCtrl.CurrentPlalistlenghtOfSong){
          playlistsCtrl.CurrentPlalistLimeLeftInSong = timeleft
          document.getElementById('playlistEventControlsTimeShowDivTMinus').style.color = "white";

        }else {
          playlistsCtrl.CurrentPlalistLimeLeftInSong = playlistsCtrl.CurrentPlalistlenghtOfSong.toFixed(0);
          document.getElementById('playlistEventControlsTimeShowDivTMinus').style.color = "white";
        }

        //incriments time between syncs
        playlistsCtrl.serverTime += 1000


      }, 1000);


    }

    playlistsCtrl.updateTimeIntervalPAUSEPLAY = $interval(function () {
      var countdownvar2 = .001 * (playlistsCtrl.serverTime2 - playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['startTime']);
      playlistsCtrl.countdownTimeMili = countdownvar2.toFixed(2);
      if(playlistsCtrl.countdownTimeMili >= 0 && playlistsCtrl.countdownTimeMili < 0.05 ){
        document.getElementById('playlistEventControlsTimeShowDivTMinus').style.backgroundColor = "#4CAF50";
        document.getElementById('playlistEventControlsTimeShowDivTMinus').style.color = "#FAFAFA";
        document.getElementById('songHolder2').currentTime = 0;
        document.getElementById('songHolder2').play();

      }
      playlistsCtrl.serverTime2 += 50

    }, 50);

    playlistsCtrl.setShowTime = function(addtime) {
      playlistsCtrl.serverTimeOffset = 'null';
      var offsetRef = firebase.database().ref(".info/serverTimeOffset");
      offsetRef.on("value", function(snap) {
        var offset = snap.val();
        playlistsCtrl.serverTimeOffset = offset;
      });
      var addtimenorm = addtime * .001;
      var confirm = $mdDialog.confirm()
            .title('Start '+ playlistsCtrl.CurrentPlalistTitle +' in ' + addtimenorm + ' seconds')
            .textContent('')
            .ariaLabel('TutorialsPoint.com')
            .targetEvent(event)
            .ok('Yes')
            .cancel('No');
            $mdDialog.show(confirm).then(function() {

                if(playlistsCtrl.serverTimeOffset == 'null'){
                  alert("An error has occured, please try again.")
                }else {
                  var currentTime =  new Date().getTime() + playlistsCtrl.serverTimeOffset;
                  var setPlaylistTime = {};
                  var dollaIDvar = playlistsCtrl.CurrentPlalistDollaID;
                  setPlaylistTime['/Playlists/'+ playlistsCtrl.profile.$id + '/' + dollaIDvar +'/startTime'] = currentTime + addtime;
                  firebase.database().ref().update(setPlaylistTime)
                  .then(function(ref){


                     }, function() {
                        return
                  });
                }
              })
    }

    playlistsCtrl.timeAdjustHistoryVar = 0;

    playlistsCtrl.timeAdjust = function(direction) {
      var dirtime = direction;
      var dirtimeedit = Number(playlistsCtrl.timeAdjustHistoryVar) + Number(dirtime);
      playlistsCtrl.timeAdjustHistoryVar = dirtimeedit;
      var setPlaylistTime2 = {};
      var dollaIDvar2 = playlistsCtrl.CurrentPlalistDollaID;

      setPlaylistTime2['/Playlists/'+ playlistsCtrl.profile.$id + '/' + dollaIDvar2 +'/startTime'] = Number(playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['startTime']) + Number(direction);

      firebase.database().ref().update(setPlaylistTime2)
      .then(function(ref){


         }, function() {
            return
      });

    }

    playlistsCtrl.deletePlaylist = function() {
      var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete this Playlist?')
            .textContent('')
            .ariaLabel('')
            .targetEvent(event)
            .ok('Yes')
            .cancel('No');
            $mdDialog.show(confirm).then(function() {
                var setPlaylistTime3 = {};
                var dollaIDvar3 = playlistsCtrl.CurrentPlalistDollaID;
                setPlaylistTime3['/Playlists/'+ playlistsCtrl.profile.$id + '/' + dollaIDvar3] = null;
                firebase.database().ref().update(setPlaylistTime3)
                .then(function(ref){

                    playlistsCtrl.whichPlaylistPage = 'playlistList';
                   }, function() {
                      return
                });
              })

    }





    playlistsCtrl.gotoAddaPlaylist = function() {
      playlistsCtrl.newPlaylistVenue = null;
      playlistsCtrl.newPlaylistSetSelectedSongVar = 0;
      playlistsCtrl.whichPlaylistPage = 'NewplaylistList';
      $timeout(function () {
        document.getElementById('newPlaylistOption0').style.backgroundColor = "#4CAF50";

      }, 20);
    }

    playlistsCtrl.setNewPlaylistSetDeselectSong = function(num) {
      playlistsCtrl.playlistOrderIDs.splice(num, 1)
    }

    playlistsCtrl.setNewPlaylistSetSelectedSongVar = function(num) {
      playlistsCtrl.newPlaylistSetSelectedSongVar = num;
      playlistsCtrl.playlistOrderIDs.push(num);


      for (var key in playlistsCtrl.projects) {
        if(!isNaN(key)){
          document.getElementById('newPlaylistOption'+key).style.backgroundColor = "";
        }

      }
      document.getElementById('newPlaylistOption'+num).style.backgroundColor = "#4CAF50";



    }

  playlistsCtrl.createPlaylist = function() {

      var playlistsKey = firebase.database().ref('Playlists/'+playlistsCtrl.profile.$id).push().key;
      var newPlaylist = {};

      var playlistData = {
        ids: [],
        playlistTitle: playlistsCtrl.newPlaylistPlaylistName
      };

      angular.forEach(playlistsCtrl.playlistOrderIDs, function(value, key) {
        playlistData.ids.push(playlistsCtrl.projects[value]['$id'])

      })

      console.log(playlistData)


      newPlaylist['/Playlists/' + playlistsCtrl.profile.$id + '/' + playlistsKey] = playlistData;
      firebase.database().ref().update(newPlaylist);



      playlistsCtrl.whichPlaylistPage = 'playlistList';



    }




    playlistsCtrl.gotoAddShowFunc = function(index) {
      playlistsCtrl.selectedPlaylistForShowCreation = playlistsCtrl.playlists[index];
      playlistsCtrl.whichPlaylistPage = 'NewShow';

    }


    playlistsCtrl.createShow = function() {

      var showingKey = firebase.database().ref('Showings/'+playlistsCtrl.profile.$id).push().key;
      var newShowing = {};

      var showingData = {
            playlistID: playlistsCtrl.selectedPlaylistForShowCreation['$id'],
            uid: playlistsCtrl.profile.$id,
            startTime: 1.0000000000001491e+25,
            showName: playlistsCtrl.newPlaylistShowName,
            venue: playlistsCtrl.newPlaylistVenue,
            appxStartDate: playlistsCtrl.myDate,
            appxStartTime: playlistsCtrl.showtime

      }

      console.log(showingData)

      newShowing['/Showings/' + playlistsCtrl.profile.$id + '/' + showingKey] = showingData;
      firebase.database().ref().update(newShowing);


    /*
      var playlistsKey = firebase.database().ref('Playlists/'+playlistsCtrl.profile.$id).push().key;

      var updates = {};
      var playlistData = {
        id: playlistsCtrl.projects[playlistsCtrl.newPlaylistSetSelectedSongVar]['$id'],
        name: playlistsCtrl.projects[playlistsCtrl.newPlaylistSetSelectedSongVar]['projectName'],
        startTime: null,
        uid: playlistsCtrl.projects[playlistsCtrl.newPlaylistSetSelectedSongVar]['user'],
        venue: playlistsCtrl.newPlaylistVenue

      };
      updates['/Playlists/' + playlistsCtrl.profile.$id + '/' + playlistsKey] = playlistData;
      firebase.database().ref().update(updates);


    */


      playlistsCtrl.whichPlaylistPage = 'playlistList';

    }


    playlistsCtrl.SetHypeColor = function() {

      var SetHypeColorVar = {};
      //console.log(projectsCtrl.newProjectData.songData[i])
      SetHypeColorVar['/Playlists/'+ playlistsCtrl.profile['$id'] + '/' + playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['$id'] + '/hypezone/HypeStartTime' ] = playlistsCtrl.serverTime2 + 5000;
      firebase.database().ref().update(SetHypeColorVar)
      .then(function(ref){


      })

    }

  });
