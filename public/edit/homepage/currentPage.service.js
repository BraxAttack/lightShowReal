angular.module('lightShowApp')
  .factory('currentPage', function(){
    var currentPage = {};

    currentPage.pageVar = 'blooba';
    currentPage.iconVar = 'blooba';
    //console.log(currentPage.pageVar);

    currentPage.add = function(pageName) {
        //console.log(currentPage.pageVar);
        currentPage.pageVar = pageName
        //console.log(currentPage.pageVar);
    }



    return currentPage;
  });
