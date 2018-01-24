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
  .module('lightShowApp', [
    'firebase',
    'angular-md5',
    'ui.router',
    'ngMaterial',
    'ngMessages'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/login.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireSignIn().then(function(auth){
              $state.go('homepage.projects');
            }, function(error){
              return;
            });
          }
        }
      })
      .state('register', {
        url: '/register',
        controller: 'AuthCtrl as authCtrl',
        templateUrl: 'auth/register.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireSignIn().then(function(auth){
              $state.go('homepage.projects');
            }, function(error){
              return;
            });
          }
        }
      })
      .state('homepage', {
        url: '/homepage',
        controller: 'HomepageCtrl as homepageCtrl',
        templateUrl: 'homepage/homepage.html',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireSignIn().catch(function(){
              $state.go('login');
            });
          },
          profile: function ($state, Auth, Users){
            return Auth.$requireSignIn().then(function(auth){
              return Users.getProfile(auth.uid).$loaded().then(function (profile){
                if(profile.displayName){
                  return profile;
                } else {
                  $state.go('profile');
                }
              });
            }, function(error){
              $state.go('login');
            });
          }
        }

      })
      .state('homepage.projects', {
        url: '/projects',
        templateUrl: 'homepage/projects.html',
        controller: 'ProjectsCtrl as projectsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireSignIn().catch(function(){
              $state.go('login');
            });
          },
          profile: function(Users, Auth){
            return Auth.$requireSignIn().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        }
      })
      .state('homepage.newproject', {
        url: '/newproject',
        templateUrl: 'homepage/newProject.html',
        controller: 'ProjectsCtrl as projectsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireSignIn().catch(function(){
              $state.go('login');
            });
          },
          profile: function(Users, Auth){
            return Auth.$requireSignIn().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        }
      })
      .state('homepage.projectindiv', {
          url: '/{projectId}/edit',
          templateUrl: 'projectIndiv/projectIndiv.html',
          controller: 'ProjectIndivCtrl as projectIndivCtrl',
        resolve: {
            projectIndivData: function($stateParams){
              return $stateParams.projectId;
            }

          }
        })
      .state('homepage.templates', {
        url: '/templates',
        templateUrl: 'homepage/templates.html',
        controller: 'TemplatesCtrl as templatesCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireSignIn().catch(function(){
              $state.go('login');
            });
          },
          profile: function(Users, Auth){
            return Auth.$requireSignIn().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        }
      })
      .state('homepage.newtemplate', {
        url: '/newtemplate',
        templateUrl: 'homepage/newTemplate.html',
        controller: 'TemplatesCtrl as templatesCtrl',

      })
      .state('homepage.GoLive', {
        url: '/golive',
        templateUrl: 'homepage/playlists.html',
        controller: 'PlaylistsCtrl as playlistsCtrl',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireSignIn().catch(function(){
              $state.go('login');
            });
          },
          profile: function(Users, Auth){
            return Auth.$requireSignIn().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        }
      })
      .state('profile', {
        url: '/profile',
        controller: 'ProfileCtrl as profileCtrl',
        templateUrl: 'users/profile.html',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireSignIn().catch(function(){
              $state.go('login');
            });
          },
          profile: function(Users, Auth){
            return Auth.$requireSignIn().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        }
      })
      .state('homepage.Billing', {
        url: '/billing',
        controller: 'BillingCtrl as billingCtrl',
        templateUrl: 'Billing/billing.html',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireSignIn().catch(function(){
              $state.go('login');
            });
          },
          profile: function(Users, Auth){
            return Auth.$requireSignIn().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        }
      })
      .state('homepage.Usage', {
        url: '/usage',
        controller: 'UsageCtrl as usageCtrl',
        templateUrl: 'Usage/usage.html',
        resolve: {
          auth: function($state, Users, Auth){
            return Auth.$requireSignIn().catch(function(){
              $state.go('login');
            });
          },
          profile: function(Users, Auth){
            return Auth.$requireSignIn().then(function(auth){
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        }
      })

    $urlRouterProvider.otherwise('/');
  })
  .config(function(){
    // Replace this config with your Firebase's config.
    // Config for your Firebase can be found using the "Web Setup"
    // button on the top right of the Firebase Dashboard in the
    // "Authentication" section.
/*
    var config = {
      apiKey: "AIzaSyBc6yn3_ydeKJ6ioDSPzkPfBqzkEff1BuA",
      authDomain: "lightsapp-b03f4.firebaseapp.com",
      databaseURL: "https://lightsapp-b03f4.firebaseio.com",
      storageBucket: "lightsapp-b03f4.appspot.com",
      messagingSenderId: "1022638520289"
    };*/
    var config = {
       apiKey: "AIzaSyBv_kb53JKsjDW8V0yN37jdITCpT5cFhoM",
       authDomain: "glowsync-9dc46.firebaseapp.com",
       databaseURL: "https://glowsync-9dc46.firebaseio.com",
       projectId: "glowsync-9dc46",
       storageBucket: "glowsync-9dc46.appspot.com",
       messagingSenderId: "452327635964"
     };

    firebase.initializeApp(config);
  });
