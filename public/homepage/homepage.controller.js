angular.module('lightShowApp')
  .controller('HomepageCtrl', function($state, $mdDialog, Auth, Users, profile){
    var homepageCtrl = this;

    homepageCtrl.profile = profile;

    homepageCtrl.userProfile = firebase.auth().currentUser;

    homepageCtrl.user = {
      firstname: 'B',
      lastname: 'Y',
      email: '@'
    };


    homepageCtrl.menu = [
      {
        link : 'projects',
        title: 'Projects',
        icon: 'dashboard'
      },
      {
        link : 'templates',
        title: 'Templates',
        icon: 'invert_colors'
      },
      {
        link : 'showplans',
        title: 'Playlists',
        icon: 'list'
      }
    ];


    homepageCtrl.logout = function(){
        var confirm = $mdDialog.confirm()
              .title('Are you sure you want to Log Out?')
              .textContent('')
              .ariaLabel('TutorialsPoint.com')
              .targetEvent(event)
              .ok('Yes')
              .cancel('No');
              $mdDialog.show(confirm).then(function() {
                    Auth.$signOut().then(function(){
                      $state.go('login');
                    });
                 }, function() {
                    $scope.status = 'You decided to keep your record.';
              });
    };

  });
