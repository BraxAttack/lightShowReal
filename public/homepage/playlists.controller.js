angular.module('lightShowApp')
  .controller('PlaylistsCtrl', function(currentPage){
    var playlistsCtrl = this;

    playlistsCtrl.currentPage = currentPage;

    playlistsCtrl.currentPage.add("Playlists");

    playlistsCtrl.templates = [
      {
        title: 'templateA',
        creator: 'BaxAttack',
        lastModified: '1/23/17'
      },
      {
        title: 'templateA',
        creator: 'BaxAttack',
        lastModified: '1/23/17'
      },
      {
        title: 'templateA',
        creator: 'BaxAttack',
        lastModified: '1/23/17'
      },
      {
        title: 'templateA',
        creator: 'BaxAttack',
        lastModified: '1/23/17'
      }

    ];


  });
