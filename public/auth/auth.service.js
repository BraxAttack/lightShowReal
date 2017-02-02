angular.module('lightShowApp')
  .factory('Auth', function($firebaseAuth){
    var auth = $firebaseAuth();

    return auth;
  });
