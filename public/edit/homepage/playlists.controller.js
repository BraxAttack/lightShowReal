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

    $timeout(function () {
      playlistsCtrl.lengthofPlaylist = -1;
      angular.forEach(playlistsCtrl.IndivShowPlaylistData, function(value, key) {
        playlistsCtrl.lengthofPlaylist += 1;

      })
    }, 3000);



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
        //console.log(ShowingsList)
    })

    var ref2 = firebase.database().ref('/Playlists/'+playlistsCtrl.profile.$id);
    var PlaylistsList = $firebaseArray(ref2).$loaded()
    .then(function (PlaylistsList){
        playlistsCtrl.playlists = PlaylistsList;
        //console.log(PlaylistsList)
    })

    playlistsCtrl.selectAShowToEdit = function(projectID, userID, indexVar, dollaID) {
      playlistsCtrl.whichPlaylistPage = 'IndividualPlaylist';
      playlistsCtrl.IndivShowPlaylistData = [];
      angular.forEach(playlistsCtrl.playlists, function(value, key) {

        if(value['$id'] == playlistsCtrl.shows[indexVar]['playlistID']) {
          //console.log(value)
          playlistsCtrl.individualShowPlaylist = value;

          angular.forEach(playlistsCtrl.individualShowPlaylist['ids'], function(value2, key2) {
            //console.log(value2)

              angular.forEach(playlistsCtrl.projects, function(value3, key3) {

                if(value3['$id'] == value2) {
                    //console.log(value3)
                    playlistsCtrl.IndivShowPlaylistData.push(value3)

                }

              })

          })

        }

      })

      //console.log(playlistsCtrl.shows)
      //console.log(playlistsCtrl.playlists.indexOf(playlistsCtrl.shows[indexVar]['playlistID']))

      playlistsCtrl.CurrentPlalistTitle = playlistsCtrl.shows[indexVar]['showName'];
      playlistsCtrl.CurrentPlalistVenue = playlistsCtrl.shows[indexVar]['venue'];
      playlistsCtrl.CurrentPlalistDate = playlistsCtrl.shows[indexVar]['appxStartDate'];
      playlistsCtrl.incrumentPart = playlistsCtrl.shows[indexVar]['incrumentPart'];
      playlistsCtrl.CurrentPlalistuserID = userID;
      playlistsCtrl.CurrentPlalistindexVar = indexVar;
      playlistsCtrl.CurrentPlalistDollaID = dollaID;
      playlistsCtrl.CurrentPlalistStartTime = playlistsCtrl.shows[indexVar]['startTime'];


//Have to do an ng-repeat for each song and i dont feel like doing this right now cause that's a TON of work but pretty much what i would do is make a sound element for each of the items in teh playlist and then make an array of the length of each of the songs so they can be used to get CurrentPlalistlenghtOfSong workign and then the incrument wont have an issue and the remaining time wont be NAN

      angular.forEach(playlistsCtrl.IndivShowPlaylistData, function(value, key) {
        console.log(value['$id'])

        var songRef = firebase.storage().ref().child('projectSongs/'+value['$id']);
        songRef.getDownloadURL().then(function(url) {
          // Insert url into an <img> tag to "download"
          console.log(url);
          document.getElementById('songIndex'+key).src = url;
          document.getElementById('songIndex'+key).currentTime = 0;

        }).catch(function(error) {
          console.log(error);

        });

      })




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
          document.getElementById('songIndex'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).pause();
          document.getElementById('songIndex'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).currentTime = 0;
        }

        if(playlistsCtrl.countdownTime > 0 && playlistsCtrl.countdownTime < 5){
          document.getElementById('playlistEventControlsTimeShowDivTMinus').style.backgroundColor = "#4CAF50";
          document.getElementById('playlistEventControlsTimeShowDivTMinus').style.color = "#FAFAFA";
          //document.getElementById('songHolder2').currentTime = 0;
          //document.getElementById('songHolder2').play();

        }

        var timeleftfirst = playlistsCtrl.CurrentPlalistlenghtOfSong - playlistsCtrl.countdownTime;
        //console.log(timeleftfirst)
        playlistsCtrl.timeleftfirstVar = timeleftfirst;
        var timeleft = timeleftfirst.toFixed(0);
        playlistsCtrl.CurrentPlalistLimeLeftInSong = timeleft;
        //console.log(playlistsCtrl.CurrentPlalistlenghtOfSong);
        //console.log(timeleft);

        if(timeleft < 0){
          document.getElementById('songIndex'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).pause();
          document.getElementById('songIndex'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).currentTime = 0;
          playlistsCtrl.CurrentPlalistLimeLeftInSong = "0";
          document.getElementById('playlistEventControlsTimeShowDivTMinus').style.backgroundColor = "#616161";
          document.getElementById('playlistEventControlsTimeShowDivTMinus').style.color = "#757575";


          var setPlaylistTime2 = {};
          var dollaIDvar = playlistsCtrl.CurrentPlalistDollaID;
          setPlaylistTime2['/Showings/'+ playlistsCtrl.profile.$id + '/' + dollaIDvar +'/startTime'] = 100000000000000000;
          firebase.database().ref().update(setPlaylistTime2)
          .then(function(ref){


             }, function() {
                return
          });

          var setincrumentPart = {};

          if(playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart'] <= playlistsCtrl.lengthofPlaylist ){
            setincrumentPart['/Showings/'+ playlistsCtrl.profile.$id + '/' + playlistsCtrl.CurrentPlalistDollaID +'/incrumentPart'] = playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart'] + 1;
            firebase.database().ref().update(setincrumentPart)
            .then(function(ref){

                   }, function() {
                      return

            })

          }

        }else if(timeleft < playlistsCtrl.CurrentPlalistlenghtOfSong){
          playlistsCtrl.CurrentPlalistLimeLeftInSong = timeleft
          document.getElementById('playlistEventControlsTimeShowDivTMinus').style.color = "white";

        }else {
          playlistsCtrl.CurrentPlalistLimeLeftInSong = playlistsCtrl.CurrentPlalistlenghtOfSong.toFixed(0);
          document.getElementById('playlistEventControlsTimeShowDivTMinus').style.color = "white";
        }

        //incriments time between syncs
        //playlistsCtrl.countdownTime += 1
        playlistsCtrl.serverTime += 1000


      }, 1000);


    }


/* get back to work right here
=
=
=
=
=
=
=
=
=
=
=
=
=
=
=
=
=
=
=
=
=
=
=
=
=
=
it's the next thing down. you were working on getting the song to sync up ever 30 seconds and it was being a butt.
=
=
=
=
=
=
*/

    playlistsCtrl.updateTimeIntervalVolume = $interval(function () {
      if(playlistsCtrl.countdownTimeMili > -4) {
        document.getElementById('songIndex'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).volume = 1;

      }else{
        document.getElementById('songIndex'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).volume = 0;
      }

    }, 15000);

    playlistsCtrl.updateTimeInterval = $interval(function () {
      document.getElementById('songIndex'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).currentTime = playlistsCtrl.countdownTimeMili;
      document.getElementById('songIndex'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).play()

    }, 15000);

    playlistsCtrl.SyncTimeForShow = function() {
      //alert("sync")

      var setPlaylistTime2 = {};
      var dollaIDvar2 = playlistsCtrl.CurrentPlalistDollaID;

      setPlaylistTime2['/Showings/'+ playlistsCtrl.profile.$id + '/' + dollaIDvar2 +'/startTime'] = Number(playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['startTime']) - Number(playlistsCtrl.timeAdjustHistoryVar);

      firebase.database().ref().update(setPlaylistTime2)
      .then(function(ref){
          playlistsCtrl.timeAdjustHistoryVar = 0;

         }, function() {
            return
      });


    }


    playlistsCtrl.timeAdjustHistoryVar = 0;

    playlistsCtrl.timeAdjust = function(direction) {
      var dirtime = direction;
      var dirtimeedit = Number(playlistsCtrl.timeAdjustHistoryVar) + Number(dirtime);
      playlistsCtrl.timeAdjustHistoryVar = dirtimeedit;
      console.log(playlistsCtrl.countdownTimeMili + (playlistsCtrl.timeAdjustHistoryVar * .001))
      document.getElementById('songIndex'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).currentTime = Number(playlistsCtrl.countdownTimeMili) + Number(playlistsCtrl.timeAdjustHistoryVar * .001);
      document.getElementById('songIndex'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).play();


    }




    playlistsCtrl.updateTimeIntervalPAUSEPLAY = $interval(function () {
      var countdownvar2 = .001 * (playlistsCtrl.serverTime2 - playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['startTime']);
      playlistsCtrl.countdownTimeMili = countdownvar2.toFixed(2);
      //console.log(playlistsCtrl.countdownTimeMili);
      if(playlistsCtrl.countdownTimeMili >= 0 && playlistsCtrl.countdownTimeMili < 0.05 ){
        document.getElementById('playlistEventControlsTimeShowDivTMinus').style.backgroundColor = "#4CAF50";
        document.getElementById('playlistEventControlsTimeShowDivTMinus').style.color = "#FAFAFA";
        playlistsCtrl.timeAdjustHistoryVar = 0;
        document.getElementById('songIndex'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).volume = 1;
        document.getElementById('songIndex'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).currentTime = 0;
        document.getElementById('songIndex'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).play();

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

                angular.forEach(playlistsCtrl.IndivShowPlaylistData, function(value, key) {
                  //console.log(value['$id'])
                  document.getElementById('songIndex'+key).pause();
                  document.getElementById('songIndex'+key).currentTime = 0;

                })

                if(playlistsCtrl.serverTimeOffset == 'null'){
                  alert("An error has occured, please try again.")
                }else {
                  var currentTime =  new Date().getTime() + playlistsCtrl.serverTimeOffset;
                  var setPlaylistTime = {};
                  var dollaIDvar = playlistsCtrl.CurrentPlalistDollaID;
                  setPlaylistTime['/Showings/'+ playlistsCtrl.profile.$id + '/' + dollaIDvar +'/startTime'] = currentTime + addtime;
                  firebase.database().ref().update(setPlaylistTime)
                  .then(function(ref){


                     }, function() {
                        return
                  });
                }
              })
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

      //console.log(playlistData)


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
            hypezonePreset: 'nullVal',
            tMinus: 1.0000000000001491e+25,
            showInSeq: 0,
            showName: playlistsCtrl.newPlaylistShowName,
            venue: playlistsCtrl.newPlaylistVenue,
            appxStartDate: playlistsCtrl.myDate,
            appxStartTime: playlistsCtrl.showtime,
            zhypezonePresetIncrument: 0,
            artist: playlistsCtrl.artistName,
            zzhypezonePresetColors:  {
              '0': "#000000",
              '1': "#f44336",
              '2': "#4CAF50",
              '3': "#03A9F4"
            }

      }

      //console.log(showingData)

      newShowing['/showingsTonight/' + playlistsCtrl.newPlaylistCity + playlistsCtrl.newPlaylistState + '/' +playlistsCtrl.profile.$id + '/' + showingKey] = showingData;
      firebase.database().ref().update(newShowing);


      var newShowingBilling = {};

      var showingDataBilling = {
          playlistID: playlistsCtrl.selectedPlaylistForShowCreation['$id'],
          uid: playlistsCtrl.profile.$id,
          showName: playlistsCtrl.newPlaylistShowName,
          venue: playlistsCtrl.newPlaylistVenue,
          appxStartDate: playlistsCtrl.myDate


      }

      //console.log(showingData)

      newShowingBilling['/BillingShows/' + playlistsCtrl.profile.$id + '/' + showingKey] = showingDataBilling;
      firebase.database().ref().update(newShowingBilling);

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

    playlistsCtrl.SetIncrumentPartFunc = function(setVal) {

      var confirm = $mdDialog.confirm()
            .title('Are you sure you want to Change Songs?')
            .textContent('The current song will stop playing')
            .ariaLabel('TutorialsPoint.com')
            .targetEvent(event)
            .ok('Yes I\'m sure')
            .cancel('No');
            $mdDialog.show(confirm).then(function() {

                angular.forEach(playlistsCtrl.IndivShowPlaylistData, function(value, key) {
                  //console.log(value['$id'])
                  document.getElementById('songIndex'+key).pause();
                  document.getElementById('songIndex'+key).currentTime = 0;

                })
                var setPlaylistTime2 = {};
                var dollaIDvar = playlistsCtrl.CurrentPlalistDollaID;
                setPlaylistTime2['/Showings/'+ playlistsCtrl.profile.$id + '/' + dollaIDvar +'/startTime'] = 100000000000000000;
                firebase.database().ref().update(setPlaylistTime2)
                .then(function(ref){


                   }, function() {
                      return
                });

                var setincrumentPart = {};

                setincrumentPart['/Showings/'+ playlistsCtrl.profile.$id + '/' + playlistsCtrl.CurrentPlalistDollaID +'/incrumentPart'] = setVal;
                firebase.database().ref().update(setincrumentPart)
                .then(function(ref){


                   }, function() {
                      return
                });

                playlistsCtrl.getDurrationInterval = $interval(function () {

                }, 10000);

                $interval.cancel(playlistsCtrl.getDurrationInterval);


                $timeout(function () {
                    playlistsCtrl.getDurrationInterval = $interval(function () {
                       playlistsCtrl.CurrentPlalistlenghtOfSong = document.getElementById('songIndex'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).duration;

                       angular.forEach(playlistsCtrl.IndivShowPlaylistData, function(value, key) {
                         document.getElementById('playlistButton'+key).style.backgroundColor = '';


                       })
                       document.getElementById('playlistButton'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).style.backgroundColor = '#4CAF50';


                     }, 1000);

                 }, 500);

            })

    }


    playlistsCtrl.getDurrationInterval = $interval(function () {
       playlistsCtrl.CurrentPlalistlenghtOfSong = document.getElementById('songIndex'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).duration;

       angular.forEach(playlistsCtrl.IndivShowPlaylistData, function(value, key) {
         document.getElementById('playlistButton'+key).style.backgroundColor = '';


       })
       document.getElementById('playlistButton'+playlistsCtrl.shows[playlistsCtrl.CurrentPlalistindexVar]['incrumentPart']).style.backgroundColor = '#4CAF50';


     }, 1000);


     playlistsCtrl.hypezonePresets = [
       'bubble_chart',
       'border_top',
       'graphic_eq'

     ]

     playlistsCtrl.hypezoneIsLive = 'false';

     playlistsCtrl.setHypezoneLive = function(value) {
       playlistsCtrl.hypezoneIsLive = value;

       if(playlistsCtrl.hypezoneIsLive == 'true') {

         playlistsCtrl.serverTimeOffset2 = 'null';
         var offsetRef = firebase.database().ref(".info/serverTimeOffset");
         offsetRef.on("value", function(snap) {
           var offset = snap.val();
           playlistsCtrl.serverTimeOffset2 = offset;
         });

         console.log(playlistsCtrl.serverTimeOffset2)
           if(playlistsCtrl.serverTimeOffset2 == null){
             alert("An error has occured, please try again.")
           }else {
             var currentTime =  new Date().getTime() + playlistsCtrl.serverTimeOffset2;
             console.log(currentTime)
             var setPlaylistTime2 = {};
             var dollaIDvar2 = playlistsCtrl.CurrentPlalistDollaID;
             setPlaylistTime2['/Showings/'+ playlistsCtrl.profile.$id + '/' + dollaIDvar2 +'/hypezonePreset'] = currentTime;
             firebase.database().ref().update(setPlaylistTime2)
             .then(function(ref){


                }, function() {
                   return
             });
           }

       }else {
         var setPlaylistTime3 = {};
         var dollaIDvar2 = playlistsCtrl.CurrentPlalistDollaID;
         setPlaylistTime3['/Showings/'+ playlistsCtrl.profile.$id + '/' + dollaIDvar2 +'/hypezonePreset'] = 'nullVal';
         firebase.database().ref().update(setPlaylistTime3)
         .then(function(ref){


            }, function() {
               return
         });

       }

     }


     playlistsCtrl.selectedHypezonePreset = 0

     playlistsCtrl.hypezoneColors = [
       '#f44336',
       '#E91E63',
       '#9C27B0',
       '#673AB7',
       '#3F51B5',
       '#2196F3',
       '#00BCD4',
       '#009688',
       '#4CAF50',
       '#8BC34A',
       '#FFEB3B',
       '#FF9800',
       '#FF5722',
       '#795548',
       '#9E9E9E',
       '#607D8B'

     ]

     playlistsCtrl.colorsPrimary = "#f44336";
     playlistsCtrl.colorsSecondary = "#4CAF50";
     playlistsCtrl.colorsTertiary = "#03A9F4";

     playlistsCtrl.selectedColorToChange = "primaryColor";

     playlistsCtrl.setColorsLevelFunction = function(color) {
       document.getElementById('primaryColor').style.backgroundColor = "#7d7d7d"
       document.getElementById('secondaryColor').style.backgroundColor = "#7d7d7d"
       document.getElementById('tertiaryColor').style.backgroundColor = "#7d7d7d"

       document.getElementById(color).style.backgroundColor = "white"
       playlistsCtrl.selectedColorToChange = color;


     }

     playlistsCtrl.syncColorsFunction = function() {
       var hypezoneColorObj = {
         '0': "#000000",
         '1': playlistsCtrl.colorsPrimary,
         '2': playlistsCtrl.colorsSecondary,
         '3': playlistsCtrl.colorsTertiary
       }
       var setPlaylistTime3 = {};
       var dollaIDvar2 = playlistsCtrl.CurrentPlalistDollaID;
       setPlaylistTime3['/Showings/'+ playlistsCtrl.profile.$id + '/' + dollaIDvar2 +'/zzhypezonePresetColors'] = hypezoneColorObj;
       firebase.database().ref().update(setPlaylistTime3)
       .then(function(ref){


          }, function() {
             return
       });


     }

     playlistsCtrl.setColorFunction = function(color) {

       if(color == "random") {
         //console.log(Math.floor(Math.random() * playlistsCtrl.hypezoneColors.length) )

         playlistsCtrl.colorsPrimary = playlistsCtrl.hypezoneColors[Math.floor(Math.random() * playlistsCtrl.hypezoneColors.length)]
         playlistsCtrl.colorsSecondary = playlistsCtrl.hypezoneColors[Math.floor(Math.random() * playlistsCtrl.hypezoneColors.length)]
         playlistsCtrl.colorsTertiary = playlistsCtrl.hypezoneColors[Math.floor(Math.random() * playlistsCtrl.hypezoneColors.length)]

       }else {
           if(playlistsCtrl.selectedColorToChange == "primaryColor"){
             playlistsCtrl.colorsPrimary = color;

           }else if (playlistsCtrl.selectedColorToChange == "secondaryColor") {
               playlistsCtrl.colorsSecondary = color;

           }else if (playlistsCtrl.selectedColorToChange == "tertiaryColor") {
             playlistsCtrl.colorsTertiary = color;

           }
        }

        playlistsCtrl.syncColorsFunction()

     }

     playlistsCtrl.setHypezonePreset = function(preset) {
        playlistsCtrl.selectedHypezonePreset = preset;

        var setPlaylistTime3 = {};
        var dollaIDvar2 = playlistsCtrl.CurrentPlalistDollaID;
        setPlaylistTime3['/Showings/'+ playlistsCtrl.profile.$id + '/' + dollaIDvar2 +'/zhypezonePresetIncrument'] = preset;
        firebase.database().ref().update(setPlaylistTime3)
        .then(function(ref){


           }, function() {
              return
        });



     }

  });
