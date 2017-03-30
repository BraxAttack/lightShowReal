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
      displayctrl.timeState = "ShowWillBeginSoon";
      displayctrl.billingSetVar = false;
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



      firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage)
        // ...
      });

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          displayctrl.user = user;
          //alert(uid)
          // ...
        } else {
          // User is signed out.
          // ...
        }
        // ...
      });






      var ref = firebase.database().ref('/Showings/');
      var PlaylistsList = $firebaseArray(ref).$loaded()
      .then(function (PlaylistsList){
        displayctrl.shows = [];
        angular.forEach(PlaylistsList, function(value, key) {
          displayctrl.PlaylistsListVar = PlaylistsList;
          if(!isNaN(key)){
            angular.forEach(PlaylistsList[key], function(value2, key2) {
              if(key2 == "$id"){

              }else if(key2 == '$priority'){

              }else {
                //console.log(key2)
                //console.log("val2")
                value2.keyvalue = key;
                value2.dollaValue = key2

                //console.log(value2)
                displayctrl.shows.push(value2);
                //console.log(displayctrl.shows);
                //console.log("-------")
              }
            });

          }
        })

          //console.log(displayctrl.shows);



      })

      displayctrl.chooseShow = function(id, uid, indexVar, keyValue, indexKey) {
        displayctrl.showID = id;
        displayctrl.showUID = uid;
        displayctrl.currentPage = "chooseSeat";
        displayctrl.currentPlaylist = indexVar;
        displayctrl.keyValue = keyValue;
        displayctrl.indexKey = indexKey;
        displayctrl.billingSetVar = false;


      }


displayctrl.getShowData = function(id, uid) {
  //console.log(displayctrl.shows[displayctrl.currentPlaylist])
  var GetrefShowing = firebase.database().ref('/Showings/'+ displayctrl.shows[displayctrl.currentPlaylist]['uid'] + '/' + displayctrl.shows[displayctrl.currentPlaylist]['dollaValue']);
  var showingData = $firebaseArray(GetrefShowing).$loaded()
  .then(function (showingData){
    displayctrl.showingData = showingData


    console.log(displayctrl.showingData)

    var seatNum = displayctrl.userSeat.toString();
    var Getref = firebase.database().ref('/Playlists/'+ displayctrl.shows[displayctrl.currentPlaylist]['uid'] + '/' + displayctrl.shows[displayctrl.currentPlaylist]['playlistID']);
    var songData = $firebaseArray(Getref).$loaded()
    .then(function (songData){
        //console.log(JSON.parse(songData[0]['$value']));
        //document.getElementById('videoScrensaver').play()
        //displayctrl.songDataActual = JSON.parse(songData[0]['$value']);

        if(displayctrl.billingSetVar == false) {
          displayctrl.billingSetVar = true;
          //console.log(displayctrl.user.uid)
          //console.log(displayctrl.PlaylistsListVar[displayctrl.keyValue][displayctrl.indexKey]);

          var addusertoBilling = {};
          addusertoBilling['/Billing/' + displayctrl.showingData[7]['$value'] + '/' + displayctrl.shows[displayctrl.currentPlaylist]['dollaValue'] + '/' + displayctrl.user.uid] = 1;
          firebase.database().ref().update(addusertoBilling)
          .then(function(ref){

                var Getcount = firebase.database().ref('/Billing/' + displayctrl.showingData[7]['$value'] + '/' + displayctrl.shows[displayctrl.currentPlaylist]['dollaValue'] + '/count');
                var countdata = $firebaseArray(Getcount).$loaded()
                .then(function (countdata){
                  console.log(countdata[0] == null)

                  if(countdata[0] == null){

                    var addusertoBillingcount = {};
                      addusertoBillingcount['/Billing/' + displayctrl.showingData[7]['$value'] + '/' + displayctrl.shows[displayctrl.currentPlaylist]['dollaValue'] + '/count/0'] = 1;
                      firebase.database().ref().update(addusertoBillingcount)
                      .then(function(ref){


                          }, function() {
                             return
                       });


                  }else{
                    var addusertoBillingcount2 = {};
                      addusertoBillingcount2['/Billing/' + displayctrl.showingData[7]['$value'] + '/' + displayctrl.shows[displayctrl.currentPlaylist]['dollaValue'] + '/count/0'] = countdata[0]['$value'] + 1;
                      firebase.database().ref().update(addusertoBillingcount2)
                      .then(function(ref){


                          }, function() {
                             return
                       });
                  }

                })



/*
                var addusertoBillingcount = {};
                  addusertoBillingcount['/Billing/' + displayctrl.showingData[6]['$value'] + '/' + displayctrl.showingData[3]['$value'] + '/count'] = refdata + 1;
                  firebase.database().ref().update(addusertoBillingcount)
                  .then(function(ref){


                      }, function() {
                         return
                   });
*/

             }, function() {
                return
          });

        }

        //console.log(songData[0])
        var seatNum = displayctrl.userSeat.toString();
        displayctrl.songDataActual = [];

        angular.forEach(songData[0], function(value, key) {
            //console.log(value)
            var Getref = firebase.database().ref('/ProjectData/'+ displayctrl.showingData[7]['$value'] + '/' + value + '/' + seatNum );
            var songData = $firebaseArray(Getref).$loaded()
            .then(function (songData){
              displayctrl.songDataActual.push(JSON.parse(songData[0]['$value']));



        })
      })


      displayctrl.hypezonePresetArray = [
        'randomColors',
        'linesTB',
        'circleOut'
      ];

      displayctrl.hypeZoneDataActual = [];

      angular.forEach(displayctrl.hypezonePresetArray, function(value, key) {
          var seatNumhype = displayctrl.userSeat.toString();
          console.log(value)
          var Getrefhype = firebase.database().ref('/HypezonePresetData/'+ value + '/' + seatNumhype );
          var hypeData = $firebaseArray(Getrefhype).$loaded()
          .then(function (hypeData){
            displayctrl.hypeZoneDataActual.push(JSON.parse(hypeData[0]['$value']));

            console.log(displayctrl.hypeZoneDataActual)
      })
    })


      //console.log(displayctrl.songDataActual)
      displayctrl.currentPage = "displayShow";

      $timeout(function () {
        document.getElementById('displayDiv').style.backgroundColor = "#4CAF50";

        displayctrl.seattext = "Seat " + seatNum;

      }, 100);

      $interval(function () {
        var offsetRef = firebase.database().ref(".info/serverTimeOffset");
        offsetRef.on("value", function(snap) {

          var offset = snap.val();
          var estimatedServerTimeMs = new Date().getTime() + offset;
          displayctrl.serverTime = estimatedServerTimeMs;
          displayctrl.serverTime2 = estimatedServerTimeMs;
        });

        //console.log(displayctrl.countdownvar2arrayval)

      }, 2000);


      displayctrl.updateIntervalFast = $interval(function() {
        displayctrl.serverTime2 += 10;
        //console.log(displayctrl.showingData[10])
        //console.log(displayctrl.countdownvar2arrayval)
        console.log(displayctrl.showingData[10][displayctrl.hypeZoneDataActual[displayctrl.showingData[9]['$value']][displayctrl.countdownvar2arrayval]])

        if(displayctrl.showingData[2]['$value'] == 'nullVal'){

          //console.log(displayctrl.showingData[5]['$value']);
          displayctrl.countdownvar2 = (Number(displayctrl.serverTime2) - Number(displayctrl.showingData[6]['$value'])).toFixed(1);

          displayctrl.countdownvar2arrayval = (displayctrl.countdownvar2 * .01).toFixed(0)


          document.getElementById('displayDiv').style.backgroundColor = displayctrl.ColorPalate[displayctrl.songDataActual[displayctrl.showingData[3]['$value']][displayctrl.countdownvar2arrayval]];
          //document.getElementById('completediv').style.backgroundColor = "black";

        }else{

          if((displayctrl.showingData[2]['$value'] + 500) < Number(displayctrl.serverTime2 )) {
            displayctrl.countdownvar2 = (Number(displayctrl.serverTime2) - Number(displayctrl.showingData[2]['$value'])).toFixed(1);

            displayctrl.countdownvar2arrayval = ((displayctrl.countdownvar2 * .01).toFixed(0))% 600;

            //console.log(displayctrl.countdownvar2arrayval)
            document.getElementById('displayDiv').style.backgroundColor = displayctrl.showingData[10][displayctrl.hypeZoneDataActual[displayctrl.showingData[9]['$value']][displayctrl.countdownvar2arrayval]];
            //document.getElementById('completediv').style.backgroundColor = "black";

          }else{
            //continues the regular process until .5 seconds after the start time
            displayctrl.countdownvar2 = (Number(displayctrl.serverTime2) - Number(displayctrl.showingData[6]['$value'])).toFixed(1);

            displayctrl.countdownvar2arrayval = (displayctrl.countdownvar2 * .01).toFixed(0)


            document.getElementById('displayDiv').style.backgroundColor = displayctrl.ColorPalate[displayctrl.songDataActual[displayctrl.showingData[3]['$value']][displayctrl.countdownvar2arrayval]];
            //document.getElementById('completediv').style.backgroundColor = "black";

          }




        }




      }, 10)




      displayctrl.setDisplayInterval = $interval(function () {
        displayctrl.lengthofSong = displayctrl.songDataActual[displayctrl.showingData[3]['$value']].length

        //console.log(displayctrl.lengthofSong)
        //console.log(displayctrl.songDataActual.length - 1)
        //console.log(displayctrl.showingData[2]['$value'])
        var timecount = (displayctrl.countdownvar2 * .001).toFixed(0);
        //console.log(timecount);

        if(displayctrl.showingData[3]['$value'] == 0) {
          //console.log("begin")
          if(timecount > -11 && timecount < 0){
            displayctrl.timeState = 'Countdown';
            displayctrl.countdownDisplay = timecount;
            document.getElementById('displayDiv').style.backgroundColor = "#f44336";
            $interval.cancel(displayctrl.hypezoneInterval);
            displayctrl.startHypezoneInterval = false;

          }else if(timecount == 0){
            displayctrl.countdownDisplay = "Go"
            $interval.cancel(displayctrl.hypezoneInterval);
            displayctrl.startHypezoneInterval = false;

          }else if((displayctrl.lengthofSong/10) < timecount) {
            displayctrl.timeState = 'midComplete';
            document.getElementById('displayDiv').style.backgroundColor = "#212121";
            $interval.cancel(displayctrl.hypezoneInterval);
            displayctrl.startHypezoneInterval = false;

          }else if(timecount > 0 ){
            displayctrl.timeState = 'Displaying';
            $interval.cancel(displayctrl.hypezoneInterval);
            displayctrl.startHypezoneInterval = false;

          }else{
            displayctrl.timeState = 'ShowWillBeginSoon';
            document.getElementById('displayDiv').style.backgroundColor = "#4CAF50";
            //console.log(displayctrl.shows[displayctrl.keyValue]['hypezone'])


          }


        }else if(displayctrl.songDataActual.length + 1 == displayctrl.showingData[3]['$value']){
          //console.log("end")
          if(timecount > -11 && timecount < 0){
            displayctrl.timeState = 'Countdown';
            displayctrl.countdownDisplay = timecount;
            document.getElementById('displayDiv').style.backgroundColor = "#f44336";
            $interval.cancel(displayctrl.hypezoneInterval);
            displayctrl.startHypezoneInterval = false;

          }else if(timecount == 0){
            displayctrl.countdownDisplay = "Go"
            $interval.cancel(displayctrl.hypezoneInterval);
            displayctrl.startHypezoneInterval = false;

          }else if((displayctrl.lengthofSong/10) < timecount) {
            displayctrl.timeState = 'TotalComplete';
            document.getElementById('displayDiv').style.backgroundColor = "#212121";
            $interval.cancel(displayctrl.hypezoneInterval);
            displayctrl.startHypezoneInterval = false;

          }else if(timecount > 0 ){
            displayctrl.timeState = 'Displaying';
            $interval.cancel(displayctrl.hypezoneInterval);
            displayctrl.startHypezoneInterval = false;

          }else{
            displayctrl.timeState = 'midShowWillBeginSoon';
            document.getElementById('displayDiv').style.backgroundColor = "#4CAF50";
            //console.log(displayctrl.shows[displayctrl.keyValue]['hypezone'])


          }

        }else if (displayctrl.songDataActual.length > displayctrl.showingData[3]['$value']) {
          //console.log("mid")
          if(timecount > -11 && timecount < 0){
            displayctrl.timeState = 'Countdown';
            displayctrl.countdownDisplay = timecount;
            document.getElementById('displayDiv').style.backgroundColor = "#f44336";
            $interval.cancel(displayctrl.hypezoneInterval);
            displayctrl.startHypezoneInterval = false;

          }else if(timecount == 0){
            displayctrl.countdownDisplay = "Go"
            $interval.cancel(displayctrl.hypezoneInterval);
            displayctrl.startHypezoneInterval = false;

          }else if((displayctrl.lengthofSong/10) < timecount) {
            displayctrl.timeState = 'midComplete';
            document.getElementById('displayDiv').style.backgroundColor = "#212121";
            $interval.cancel(displayctrl.hypezoneInterval);
            displayctrl.startHypezoneInterval = false;

          }else if(timecount > 0 ){
            displayctrl.timeState = 'Displaying';
            $interval.cancel(displayctrl.hypezoneInterval);
            displayctrl.startHypezoneInterval = false;

          }else{
            displayctrl.timeState = 'midShowWillBeginSoon';
            document.getElementById('displayDiv').style.backgroundColor = "#4CAF50";
            //console.log(displayctrl.shows[displayctrl.keyValue]['hypezone'])


          }


        }


      }, 1000);




    })

  })

}
/*
      displayctrl.getShowData = function(id, uid) {
        var seatNum = displayctrl.userSeat.toString();
        var Getref = firebase.database().ref('/ProjectData/'+ displayctrl.showUID + '/' + displayctrl.showID + '/' + seatNum );
        var songData = $firebaseArray(Getref).$loaded()
        .then(function (songData){
            //console.log(JSON.parse(songData[0]['$value']));
            //document.getElementById('videoScrensaver').play()
            var countupforalert = 1;

            displayctrl.songDataActual = JSON.parse(songData[0]['$value']);
            displayctrl.currentPage = "displayShow";


            if(displayctrl.billingSetVar == false) {
              displayctrl.billingSetVar = true;
              console.log(displayctrl.user.uid)
              console.log(displayctrl.PlaylistsListVar[displayctrl.keyValue][displayctrl.indexKey]);


              var addusertoBilling = {};
              addusertoBilling['/Billing/' + displayctrl.PlaylistsListVar[displayctrl.keyValue][displayctrl.indexKey]['uid'] + '/' + displayctrl.PlaylistsListVar[displayctrl.keyValue][displayctrl.indexKey]['id'] + '/' + displayctrl.user.uid] = 1;
              firebase.database().ref().update(addusertoBilling)
              .then(function(ref){


                 }, function() {
                    return
              });


            }


            $timeout(function () {
              document.getElementById('displayDiv').style.backgroundColor = "#4CAF50";

              displayctrl.seattext = "Seat " + seatNum;

            }, 100);

            $interval(function () {
              var offsetRef = firebase.database().ref(".info/serverTimeOffset");
              offsetRef.on("value", function(snap) {

                var offset = snap.val();
                var estimatedServerTimeMs = new Date().getTime() + offset;
                displayctrl.serverTime = estimatedServerTimeMs;
                displayctrl.serverTime2 = estimatedServerTimeMs;
              });

            }, 2000);

            displayctrl.startHypezoneInterval = false;

            displayctrl.setDisplayInterval = $interval(function () {
              //console.log(displayctrl.songDataActual.length )

              var timecount = (displayctrl.countdownvar2 * .001).toFixed(0);
              //console.log(timecount);
              if(timecount > -11 && timecount < 0){
                displayctrl.timeState = 'Countdown';
                displayctrl.countdownDisplay = timecount;
                document.getElementById('displayDiv').style.backgroundColor = "#f44336";
                $interval.cancel(displayctrl.hypezoneInterval);
                displayctrl.startHypezoneInterval = false;

              }else if(timecount == 0){
                displayctrl.countdownDisplay = "Go"
                $interval.cancel(displayctrl.hypezoneInterval);
                displayctrl.startHypezoneInterval = false;

              }else if((displayctrl.songDataActual.length/10) < timecount) {
                displayctrl.timeState = 'Complete';
                document.getElementById('displayDiv').style.backgroundColor = "#212121";
                $interval.cancel(displayctrl.hypezoneInterval);
                displayctrl.startHypezoneInterval = false;

              }else if(timecount > 0 ){
                displayctrl.timeState = 'Displaying';
                $interval.cancel(displayctrl.hypezoneInterval);
                displayctrl.startHypezoneInterval = false;

              }else{
                displayctrl.timeState = 'ShowWillBeginSoon';
                document.getElementById('displayDiv').style.backgroundColor = "#4CAF50";
                //console.log(displayctrl.shows[displayctrl.keyValue]['hypezone'])

                if(displayctrl.startHypezoneInterval != true) {
                  displayctrl.startHypezoneInterval = true;
                  displayctrl.hypezoneInterval = $interval(function() {
                    displayctrl.hypeIntCount = ((displayctrl.serverTime2 - displayctrl.shows[displayctrl.keyValue]['hypezone']['HypeStartTIme']) * .01).toFixed(0);
                    //console.log(displayctrl.hypeIntCount);



                  }, 10);
                }


              }
            }, 1000);

            //console.log(displayctrl.PlaylistsListVar[displayctrl.keyValue])





            displayctrl.updateIntervalFast = $interval(function() {
              displayctrl.serverTime2 += 10;
              displayctrl.countdownvar2 = (displayctrl.serverTime2 - displayctrl.PlaylistsListVar[displayctrl.keyValue][displayctrl.indexKey]['startTime']).toFixed(1);
              displayctrl.countdownvar2arrayval = (displayctrl.countdownvar2 * .01).toFixed(0)

              document.getElementById('displayDiv').style.backgroundColor = displayctrl.ColorPalate[displayctrl.songDataActual[displayctrl.countdownvar2arrayval]];
              //document.getElementById('completediv').style.backgroundColor = "black";



            }, 10)


        })

      }

*/



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
