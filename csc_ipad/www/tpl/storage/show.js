myApp.onPageInit("storage-show", function(page) {
  diskListclicks.storage = false;
  
  function ViewModel(){
    this.name = ko.observable(page.query.name);
    this.belongTab = ko.observable(page.query.belongTab);

    this.loadData = function(){
      myApp.addView('#view_storage_summary'+this.belongTab(), {dynamicNavbar: false,domCache: true,linksView:'#view-storage'}).router.load({url: 'tpl/storage/summary.html?id='+page.query.id+'&hypervisor='+page.query.hypervisor+'&belongTab='+this.belongTab(),animatePages: false});
      myApp.addView('#view_storage_volumn'+this.belongTab(), {dynamicNavbar: false,domCache: true,linksView:'#view-storage'}).router.load({url: 'tpl/volumn/list.html?fromPage=storage&id='+page.query.id+'&hypervisor='+page.query.hypervisor+'&belongTab='+this.belongTab(),animatePages: false});  
    };
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);
  
  viewModel.loadData();
});