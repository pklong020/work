myApp.onPageInit("business-show", function(page) {
  vmListclicks.business = false;
  
  function ViewModel(){
    this.name = ko.observable(page.query.name);

    this.loadData = function(){
      myApp.addView('#view_business_summary', {dynamicNavbar: false,domCache: true,linksView:'#view-business'})
      .router.load({url: 'tpl/business/summary.html?id='+page.query.id, animatePages: false});
      myApp.addView('#view_business_vm',      {dynamicNavbar: false,domCache: true,linksView:'#view-business'})
      .router.load({url: 'tpl/vm/list.html?fromPage=project&id='+page.query.id+'&belongTab=business', animatePages: false});
    };
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);
  
  viewModel.loadData();
});