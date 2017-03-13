
myApp.onPageInit("pool-show", function(page) {
  hostListclicked = false;
  vmListclicks.pool = false;
  storageListclicks.pool = false;
  function ViewModel(){
    this.name = ko.observable(page.query.resourcePoolName);

    this.loadData = function(){
      myApp.addView('#view_pool_summary', {dynamicNavbar: false,domCache: true,linksView:'#view-pool'}).router.load({url: 'tpl/pool/summary.html?id='+page.query.id+'&resourcePoolName='+page.query.resourcePoolName+'&hypervisor='+page.query.hypervisor,animatePages: false});
      myApp.addView('#view_pool_host',    {dynamicNavbar: false,domCache: true,linksView:'#view-pool'}).router.load({url: 'tpl/host/list.html?id='+page.query.id+'&resourcePoolName='+page.query.resourcePoolName+'&hypervisor='+page.query.hypervisor+'&belongTab=pool',animatePages: false});
      myApp.addView('#view_pool_vm',      {dynamicNavbar: false,domCache: true,linksView:'#view-pool'}).router.load({url: 'tpl/vm/list.html?fromPage=pool&id='+page.query.id+'&resourcePoolName='+page.query.resourcePoolName+'&hypervisor='+page.query.hypervisor+'&belongTab=pool',animatePages: false});
      myApp.addView('#view_pool_storage', {dynamicNavbar: false,domCache: true,linksView:'#view-pool'}).router.load({url: 'tpl/storage/list.html?fromPage=pool&id='+page.query.id+'&resourcePoolName='+page.query.resourcePoolName+'&hypervisor='+page.query.hypervisor+'&belongTab=pool',animatePages: false});

    };

  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);

  viewModel.loadData();

  window.poolShow_index_viewModel = viewModel;

});

