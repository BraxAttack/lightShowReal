angular.module('lightShowApp')
  .controller('UsageCtrl', function($state, $firebaseArray, $timeout, Auth, Users, profile, projects, currentPage){
    var usageCtrl = this;

    usageCtrl.profile = profile;
    //console.log(usageCtrl.profile)

    usageCtrl.calculateUsage = function() {
      //alert("calculating...")

      var Getcount = firebase.database().ref('/BillingShows/' + usageCtrl.profile.$id );
      var countdata = $firebaseArray(Getcount).$loaded()
      .then(function (countdata){
        //console.log(countdata)
        usageCtrl.usageShows = countdata

        usageCtrl.usageShowsCountReal = [];
        usageCtrl.usageShows.forEach(function(element) {
            //alert(element['$id'])



            var Getcountreal = firebase.database().ref('/Billing/' + usageCtrl.profile.$id + '/' + element['$id'] + '/count');
            var countdatareal = $firebaseArray(Getcountreal).$loaded()
            .then(function (countdatareal){
              //console.log(countdatareal[0] == null)
              if(countdatareal[0] == null){
                usageCtrl.usageShowsCountReal.push(0)
              }
              usageCtrl.usageShowsCountReal.push(countdatareal[0]['$value'])

            })


        });

      })
    }

    usageCtrl.calculateUsage()

  });
