'use strict';

/**
 * @ngdoc overview
 * @name angularfireSlackApp
 * @description
 * # angularfireSlackApp
 *
 * Main module of the application.
 */
angular
  .module('lightShowAppDisplay', [
    'firebase'
  ])
  .controller('lightShowAppDisplayCtrl', function($scope, $interval, $firebaseArray) {

      $scope.displayColorArray = [];
      $scope.userSeat = 0;

      var ref = firebase.database().ref('/Playlists/');
      var PlaylistsList = $firebaseArray(ref).$loaded()
      .then(function (PlaylistsList){
          $scope.shows = PlaylistsList;

      })


      $scope.getShowData = function(id, uid) {
        var seatNum = $scope.userSeat.toString();
        console.log(seatNum);
        console.log($scope.userSeat);
        var Getref = firebase.database().ref('/ProjectData/'+ uid + '/' + id[seatNum] );
        var songData = $firebaseArray(Getref).$loaded()
        .then(function (songData){
            console.log(songData);

        })

      }







      $interval(function () {
        var offsetRef = firebase.database().ref(".info/serverTimeOffset");
        offsetRef.on("value", function(snap) {
          var offset = snap.val();
          var estimatedServerTimeMs = new Date().getTime() + offset;
          $scope.serverTime = estimatedServerTimeMs;

        });
      }, 3000);

      $interval(function () {
        $scope.serverTime += 50;

        var fixed = Math.ceil($scope.serverTime / 100) * 100;



        if(fixed % 2500 == 0){
          console.log("match");
          document.getElementById('displayDiv').style.backgroundColor = "black";
        }else{
          document.getElementById('displayDiv').style.backgroundColor = "blue";
        }
      }, 50);



  })

  .config(function(){
    // Replace this config with your Firebase's config.
    // Config for your Firebase can be found using the "Web Setup"
    // button on the top right of the Firebase Dashboard in the
    // "Authentication" section.

    var config = {
      apiKey: "AIzaSyBc6yn3_ydeKJ6ioDSPzkPfBqzkEff1BuA",
      authDomain: "lightsapp-b03f4.firebaseapp.com",
      databaseURL: "https://lightsapp-b03f4.firebaseio.com",
      storageBucket: "lightsapp-b03f4.appspot.com",
      messagingSenderId: "1022638520289"
    };

    firebase.initializeApp(config);
  });
