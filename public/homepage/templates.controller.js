angular.module('lightShowApp')
  .controller('TemplatesCtrl', function(currentPage){
    var templatesCtrl = this;

    templatesCtrl.currentPage = currentPage;

    templatesCtrl.currentPage.add("Templates");

    templatesCtrl.templates = [
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
