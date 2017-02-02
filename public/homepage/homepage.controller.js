angular.module('lightShowApp')
  .controller('HomepageCtrl', function($state, Auth){
    var homepageCtrl = this;

    homepageCtrl.user = {
      firstname: 'Braxton',
      lastname: 'Young',
      email: 'youngbraxton@southern.edu'
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
      //alert("got it");
        Auth.$signOut().then(function(){
          $state.go('login');
        });
    };

  });
