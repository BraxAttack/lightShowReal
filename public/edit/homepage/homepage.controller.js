angular.module('lightShowApp')
  .controller('HomepageCtrl', function($state, $mdDialog, Auth, Users, profile, currentPage){
    var homepageCtrl = this;


    homepageCtrl.currentPage = currentPage;

    homepageCtrl.currentPage.add("Homepage");

    homepageCtrl.profile = profile;

    homepageCtrl.userProfile = firebase.auth().currentUser;

    homepageCtrl.user = {
      firstname: 'B',
      lastname: 'Y',
      email: '@'
    };

      homepageCtrl.sideNavState = 'open';

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
        link : 'playlists',
        title: 'Playlists',
        icon: 'list'
      }
    ];

    homepageCtrl.closeSidenav = function() {
      document.getElementById('sidenavDivID').style.display = "none";
      document.getElementById('homepageTopBarDiv').style.left = 0;
      document.getElementById('homepageTopBarDiv').style.width = "100vw";
      document.getElementById('homepageUIViewDiv').style.left = 0;
      document.getElementById('homepageUIViewDiv').style.width = "100vw";
      homepageCtrl.sideNavState = 'closed';

    }

    homepageCtrl.openSideNav = function() {
      document.getElementById('sidenavDivID').style.display = "block";
      document.getElementById('homepageTopBarDiv').style.left = "320px";
      document.getElementById('homepageTopBarDiv').style.width = "calc(100vw - 320px)";
      document.getElementById('homepageUIViewDiv').style.left = "320px";
      document.getElementById('homepageUIViewDiv').style.width = "calc(100vw - 320px)";
      homepageCtrl.sideNavState = 'open';
    }

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
                    return
              });
    };

  });
