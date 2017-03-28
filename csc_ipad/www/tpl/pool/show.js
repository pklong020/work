
myApp.onPageInit("pool-show", function(page) {
  hostListclicked = false;
  vmListclicks.pool = false;
  storageListclicks.pool = false;
  function ViewModel(){
    var self = this;
    this.name = ko.observable(page.query.vdcName);
    this.activeNav = ko.observable('host');
    this.changeNav = function(target){
      self.activeNav(target);
    }
    this.loadData = function(){
      myApp.addView('#view_pool_host',    {dynamicNavbar: false,domCache: true,linksView:'#view-pool'}).router.load({url: 'tpl/host/list.html?id='+page.query.id+'&index='+page.query.index+'&belongTab=pool',animatePages: false});
      myApp.addView('#view_pool_vm',      {dynamicNavbar: false,domCache: true,linksView:'#view-pool'}).router.load({url: 'tpl/vm/list.html?fromPage=pool&id='+page.query.id+'&index='+page.query.index+'&belongTab=pool',animatePages: false});
      
    };

    this.refresh = function(){
      if(self.activeNav() == 'host'){
        window.hostList_viewModel.loadData();
      }else{
        window.vmList_viewModel.loadData();
      }
    }
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);

  viewModel.loadData();

  window.poolShow_index_viewModel = viewModel;

});

