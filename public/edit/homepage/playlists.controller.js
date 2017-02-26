angular.module('lightShowApp')
  .controller('PlaylistsCtrl', function($firebaseArray, currentPage){
    var playlistsCtrl = this;

    playlistsCtrl.currentPage = currentPage;

    playlistsCtrl.currentPage.add("Playlists");


    var ref = firebase.database().ref('/Playlists/');
    var PlaylistsList = $firebaseArray(ref).$loaded()
    .then(function (PlaylistsList){
        playlistsCtrl.shows = PlaylistsList;
        console.log(PlaylistsList)
    })


    playlistsCtrl.setShowTime = function(tplus, projectID, userID) {
      var setPlaylistTime = {};

      var offsetRef = firebase.database().ref(".info/serverTimeOffset");
      offsetRef.on("value", function(snap) {
        var offset = snap.val();
        var estimatedServerTimeMs = new Date().getTime() + offset;
        playlistsCtrl.serverTime = estimatedServerTimeMs;
      });

      setPlaylistTime['/Playlists/specialKey3/startTime'] = playlistsCtrl.serverTime + tplus;
      firebase.database().ref().update(setPlaylistTime)
      .then(function(ref){
          console.log(ref);

      })

    }

  });
