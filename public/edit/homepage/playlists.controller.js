angular.module('lightShowApp')
  .controller('PlaylistsCtrl', function($firebaseArray, $interval, $timeout, currentPage){
    var playlistsCtrl = this;

    playlistsCtrl.currentPage = currentPage;
    playlistsCtrl.whichPlaylistPage = 'playlistList';

    playlistsCtrl.currentPage.add("Playlists");
    playlistsCtrl.intervalSet = "none";

    var ref = firebase.database().ref('/Playlists/');
    var PlaylistsList = $firebaseArray(ref).$loaded()
    .then(function (PlaylistsList){
        playlistsCtrl.shows = PlaylistsList;
        console.log(PlaylistsList)
    })

    playlistsCtrl.selectAShowToEdit = function(projectID, userID, indexVar, dollaID) {
      playlistsCtrl.whichPlaylistPage = 'IndividualPlaylist';
      console.log(projectID)

      playlistsCtrl.CurrentPlalistTitle = playlistsCtrl.shows[indexVar]['name'];
      playlistsCtrl.CurrentPlalistVenue = playlistsCtrl.shows[indexVar]['venue'];
      playlistsCtrl.CurrentPlalistuserID = userID;
      playlistsCtrl.CurrentPlalistindexVar = indexVar;
      playlistsCtrl.CurrentPlalistDollaID = dollaID;

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
      $interval(function () {
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

      }, 1000);


    }






    playlistsCtrl.setShowTime = function(tplus, projectID, userID, indexVar, dollaID) {

      var setPlaylistTime = {};

      playlistsCtrl.currentPlaylist = indexVar;
      var offsetRef = firebase.database().ref(".info/serverTimeOffset");
      offsetRef.on("value", function(snap) {
        var offset = snap.val();
        var estimatedServerTimeMs = new Date().getTime() + offset;
        playlistsCtrl.serverTime = estimatedServerTimeMs;
      });

      var songRef = firebase.storage().ref().child('projectSongs/'+projectID);
      songRef.getDownloadURL().then(function(url) {
        // Insert url into an <img> tag to "download"
        console.log(url);
        document.getElementById('songHolder2').src = url;
        document.getElementById('songHolder2').currentTime = 0;

      }).catch(function(error) {
        console.log(error);

      });


      setPlaylistTime['/Playlists/' + dollaID +'/startTime'] = playlistsCtrl.serverTime + tplus;
      firebase.database().ref().update(setPlaylistTime)
      .then(function(ref){
          //console.log(ref);
          if(playlistsCtrl.intervalSet != "none"){
            $interval.cancel(playlistsCtrl.intervalSet);

          }



          $interval(function () {
            var offsetRef = firebase.database().ref(".info/serverTimeOffset");
            offsetRef.on("value", function(snap) {
              var offset = snap.val();
              var estimatedServerTimeMs = new Date().getTime() + offset;
              playlistsCtrl.serverTime = estimatedServerTimeMs;
            });
          }, 3000);


    playlistsCtrl.playSongInterval = $interval(function () {
      playlistsCtrl.Tminus = Math.ceil((playlistsCtrl.serverTime - playlistsCtrl.shows[playlistsCtrl.currentPlaylist]['startTime']) / 100) * 100;
      var dindex2 = playlistsCtrl.Tminus / 100;
      if(dindex2 > 0){
        $interval.cancel(playlistsCtrl.playSongInterval);
        document.getElementById('songHolder2').play();


        //for pausing the song when it's done
        var songlength = document.getElementById('songHolder2').duration;
        var songlenghtvar = songlength * 1000;
        $timeout(function () {
          document.getElementById('songHolder2').pause()

        }, songlenghtvar);

      }
    }, 20);

    playlistsCtrl.intervalSet = $interval(function () {
            playlistsCtrl.serverTime += 50;
            playlistsCtrl.Tminus = Math.ceil((playlistsCtrl.serverTime - playlistsCtrl.shows[playlistsCtrl.currentPlaylist]['startTime']) / 100) * 100;
            var dindex = playlistsCtrl.Tminus / 100;

            if(dindex >= -460 && dindex <- 0) {
              console.log(dindex)
              document.getElementById('seatNum').innerHTML = "";
              document.getElementById('showBeginsSoon').innerHTML = "";
              document.getElementById('seatNum').innerHTML = "";
              if (dindex >= -460 & dindex < -451) {
                document.getElementById('countdown').innerHTML = "45";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -450 & dindex < -441) {
                document.getElementById('countdown').innerHTML = "44";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -440 & dindex < -431) {
                document.getElementById('countdown').innerHTML = "43"
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -430 & dindex < -421) {
                document.getElementById('countdown').innerHTML = "42";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -420 & dindex < -411) {
                document.getElementById('countdown').innerHTML = "41";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -410 & dindex < -401) {
                document.getElementById('countdown').innerHTML = "40";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -400 & dindex < -391) {
                document.getElementById('countdown').innerHTML = "39";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -390 & dindex < -381) {
                document.getElementById('countdown').innerHTML = "38";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -380 & dindex < -371) {
                document.getElementById('countdown').innerHTML = "37";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -370 & dindex < -361) {
                document.getElementById('countdown').innerHTML = "36";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -360 & dindex < -351) {
                document.getElementById('countdown').innerHTML = "35";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -350 & dindex < -341) {
                document.getElementById('countdown').innerHTML = "34";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -340 & dindex < -331) {
                document.getElementById('countdown').innerHTML = "33"
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -330 & dindex < -321) {
                document.getElementById('countdown').innerHTML = "32";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -320 & dindex < -311) {
                document.getElementById('countdown').innerHTML = "31";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -310 & dindex < -301) {
                document.getElementById('countdown').innerHTML = "30";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -300 & dindex < -291) {
                document.getElementById('countdown').innerHTML = "29";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -290 & dindex < -281) {
                document.getElementById('countdown').innerHTML = "28";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -280 & dindex < -271) {
                document.getElementById('countdown').innerHTML = "27";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -270 & dindex < -261) {
                document.getElementById('countdown').innerHTML = "26";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -260 & dindex < -251) {
                document.getElementById('countdown').innerHTML = "25";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -250 & dindex < -241) {
                document.getElementById('countdown').innerHTML = "24";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -240 & dindex < -231) {
                document.getElementById('countdown').innerHTML = "23"
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -230 & dindex < -221) {
                document.getElementById('countdown').innerHTML = "22";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -220 & dindex < -211) {
                document.getElementById('countdown').innerHTML = "21";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -210 & dindex < -201) {
                document.getElementById('countdown').innerHTML = "20";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -100 & dindex < -191) {
                document.getElementById('countdown').innerHTML = "19";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -190 & dindex < -181) {
                document.getElementById('countdown').innerHTML = "18";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -180 & dindex < -171) {
                document.getElementById('countdown').innerHTML = "17";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -170 & dindex < -161) {
                document.getElementById('countdown').innerHTML = "16";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -160 & dindex < -151) {
                document.getElementById('countdown').innerHTML = "15";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -150 & dindex < -141) {
                document.getElementById('countdown').innerHTML = "14";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -140 & dindex < -131) {
                document.getElementById('countdown').innerHTML = "13"
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -130 & dindex < -121) {
                document.getElementById('countdown').innerHTML = "12";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -120 & dindex < -111) {
                document.getElementById('countdown').innerHTML = "11";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -110 & dindex < -101) {
                document.getElementById('countdown').innerHTML = "10";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -100 & dindex < -91) {
                document.getElementById('countdown').innerHTML = "9";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -90 & dindex < -81) {
                document.getElementById('countdown').innerHTML = "8";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -80 & dindex < -71) {
                document.getElementById('countdown').innerHTML = "7";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -70 & dindex < -61) {
                document.getElementById('countdown').innerHTML = "6";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -60 & dindex < -51) {
                document.getElementById('countdown').innerHTML = "5";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -50 & dindex < -41) {
                document.getElementById('countdown').innerHTML = "4";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -40 & dindex < -31) {
                document.getElementById('countdown').innerHTML = "3"
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -30 & dindex < -21) {
                document.getElementById('countdown').innerHTML = "2";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -20 & dindex < -11) {
                document.getElementById('countdown').innerHTML = "1";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"
              }else if (dindex >= -10 & dindex < -1) {
                document.getElementById('countdown').innerHTML = "GO";
                document.getElementById('displayDiv').style.backgroundColor = "#c62828"

              }
            }else if (dindex > 10) {
              document.getElementById('seatNum').innerHTML = "";
              document.getElementById('showBeginsSoon').innerHTML = "";
              document.getElementById('displayDiv').style.backgroundColor = "black";
            }else if (dindex <= -311){
              document.getElementById('displayDiv').style.backgroundColor = "#4CAF50";
              document.getElementById('seatNum').innerHTML = 'Admin';
              document.getElementById('showBeginsSoon').innerHTML = "Click a time to begin";
              document.getElementById('countdown').innerHTML = "";

            }





          }, 50);


      })

    }

  });
