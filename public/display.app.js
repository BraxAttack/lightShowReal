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
  .controller('lightShowAppDisplayCtrl', function($scope, $interval, $timeout, $firebaseArray) {
      var displayctrl = this

      displayctrl.displayColorArray = [];
      displayctrl.userSeat = 0;
      displayctrl.currentPage = "chooseShow";
      displayctrl.ColorPalate = [
        '',
        '#f44336',
        '#E91E63',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#03A9F4',
        '#00BCD4',
        '#009688',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFEB3B',
        '#FFC107',
        '#FF9800',
        '#FF5722',
        '#795548',
        '#9E9E9E',
        '#607D8B',
        '#b71c1c',
        '#c62828',
        '#d32f2f',
        '#e53935',
        '#f44336',
        '#ef5350',
        '#e57373',
        '#ef9a9a',
        '#ffcdd2',
        '#ffebee',
        '#880E4F',
        '#AD1457',
        '#C2185B',
        '#D81B60',
        '#E91E63',
        '#EC407A',
        '#F06292',
        '#F48FB1',
        '#F8BBD0',
        '#FCE4EC',
        '#4A148C',
        '#6A1B9A',
        '#7B1FA2',
        '#8E24AA',
        '#9C27B0',
        '#AB47BC',
        '#BA68C8',
        '#CE93D8',
        '#E1BEE7',
        '#F3E5F5',
        '#311B92',
        '#4527A0',
        '#512DA8',
        '#5E35B1',
        '#673AB7',
        '#7E57C2',
        '#9575CD',
        '#B39DDB',
        '#D1C4E9',
        '#EDE7F6',
        '#01579B',
        '#0277BD',
        '#0288D1',
        '#039BE5',
        '#03A9F4',
        '#29B6F6',
        '#4FC3F7',
        '#81D4FA',
        '#B3E5FC',
        '#E1F5FE',
        '#1B5E20',
        '#2E7D32',
        '#388E3C',
        '#43A047',
        '#4CAF50',
        '#66BB6A',
        '#81C784',
        '#A5D6A7',
        '#C8E6C9',
        '#E8F5E9',
        '#F57F17',
        '#F9A825',
        '#FBC02D',
        '#FDD835',
        '#FFEB3B',
        '#FFEE58',
        '#FFF176',
        '#FFF59D',
        '#FFF9C4',
        '#BF360C',
        '#D84315',
        '#E64A19',
        '#F4511E',
        '#FF5722',
        '#FF7043',
        '#FF8A65',
        '#FFAB91',
        '#FFCCBC',
        '#FBE9E7',
        '#212121',
        '#424242',
        '#616161',
        '#757575',
        '#9E9E9E',
        '#BDBDBD',
        '#E0E0E0',
        '#EEEEEE',
        '#F5F5F5',
        '#FAFAFA'

      ];

      var ref = firebase.database().ref('/Playlists/');
      var PlaylistsList = $firebaseArray(ref).$loaded()
      .then(function (PlaylistsList){
          displayctrl.shows = PlaylistsList;

      })

      displayctrl.chooseShow = function(id, uid, indexVar) {
        displayctrl.showID = id;
        displayctrl.showUID = uid;
        displayctrl.currentPage = "chooseSeat";
        displayctrl.currentPlaylist = indexVar;


      }

      displayctrl.getShowData = function(id, uid) {
        var seatNum = displayctrl.userSeat.toString();
        var Getref = firebase.database().ref('/ProjectData/'+ displayctrl.showUID + '/' + displayctrl.showID + '/' + seatNum );
        var songData = $firebaseArray(Getref).$loaded()
        .then(function (songData){
            console.log(JSON.parse(songData[0]['$value']));
            displayctrl.songDataActual = JSON.parse(songData[0]['$value']);
            displayctrl.currentPage = "displayShow";
            $timeout(function () {
              document.getElementById('displayDiv').style.backgroundColor = "#4CAF50";

              var seattext = "Seat " + seatNum;
              document.getElementById('seatNum').innerHTML = seattext;
              document.getElementById('showBeginsSoon').innerHTML = "The Show Will Begin Soon...";

            }, 100);


            $interval(function () {
              var offsetRef = firebase.database().ref(".info/serverTimeOffset");
              offsetRef.on("value", function(snap) {
                var offset = snap.val();
                var estimatedServerTimeMs = new Date().getTime() + offset;
                displayctrl.serverTime = estimatedServerTimeMs;
              });
            }, 3000);

            $interval(function () {
              displayctrl.serverTime += 50;
              displayctrl.Tminus = Math.ceil((displayctrl.serverTime - displayctrl.shows[displayctrl.currentPlaylist]['startTime']) / 100) * 100;
              var dindex = displayctrl.Tminus / 100;
              console.log(dindex);

              if(dindex >= -110 && dindex < 0) {
                console.log(dindex)
                document.getElementById('seatNum').innerHTML = "";
                document.getElementById('showBeginsSoon').innerHTML = "";
                document.getElementById('seatNum').innerHTML = "";
                if(dindex >= -110 & dindex < -101){
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
                  $timeout(function () {
                      document.getElementById('countdown').innerHTML = "";
                      document.getElementById('displayDiv').style.backgroundColor = "black"
                  }, 100);
                }
              }else if (dindex > 10) {
                document.getElementById('seatNum').innerHTML = "";
                document.getElementById('showBeginsSoon').innerHTML = "";
                document.getElementById('displayDiv').style.backgroundColor = "black";
              }


              document.getElementById('displayDiv').style.backgroundColor = displayctrl.ColorPalate[displayctrl.songDataActual[dindex]];


            }, 50);

        })

      }



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
