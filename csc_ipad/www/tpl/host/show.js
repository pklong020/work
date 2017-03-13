myApp.onPageInit("host-show", function(page) {
  vmListclicks.host = false;
  storageListclicks.host = false;
  
  function ViewModel(){
    var self = this;
    this.name = ko.observable(page.query.name);
    this.belongTab = page.query.belongTab ? ko.observable(page.query.belongTab) : ko.observable("");
    this.summary = ko.observable({
      "resourcePoolName":'',
      "cpuSlots":'',
      "ip":'',
      "state":'',
      "runTime":''
    });
    this.hypervisor = ko.observable(page.query.hypervisor);
    this.loadData = function(){
      RestServiceJs.query(BASE_URL+"/host/"+page.query.id+"/summary",{"dcId":CVM_PAD.dcId,"resPoolId":page.query.resourcePoolId,"hypervisor":page.query.hypervisor},function(data){
        myApp.pullToRefreshDone();
        data.runTime = getTheTime(new Date() - new Date(data.runTime*1000));
        data.cpuSpeed = Number((Number(data.cpuSpeed)/1000).toFixed(2));
        self.summary(data);

        var thisInterval = setInterval(function(){
          if(window.HostIndex_Summary_details_viewModel){
            if(window.HostIndex_Summary_details_viewModel.loadData){
              clearInterval(thisInterval);
              window.HostIndex_Summary_details_viewModel.loadData(data);
            }
          }
        },200);

      });
      var links = page.query.linksView ? page.query.linksView : 'view-host';
      myApp.addView('#view_host_summary'+self.belongTab(), {dynamicNavbar: false,domCache: true,linksView:'#'+links}).router.load({url: 'tpl/host/summary.html?id='+page.query.id+'&resourcePoolId='+page.query.resourcePoolId+"&hypervisor="+page.query.hypervisor+"&belongTab="+self.belongTab(),animatePages: false});
      myApp.addView('#view_host_vm'+self.belongTab(),      {dynamicNavbar: false,domCache: true,linksView:'#'+links}).router.load({url: 'tpl/vm/list.html?fromPage=host&id='+page.query.id+'&resourcePoolId='+page.query.resourcePoolId+"&hypervisor="+page.query.hypervisor+"&belongTab="+self.belongTab(),animatePages: false});
      myApp.addView('#view_host_storage'+self.belongTab(), {dynamicNavbar: false,domCache: true,linksView:'#'+links}).router.load({url: 'tpl/storage/list.html?fromPage=host&id='+page.query.id+'&resourcePoolId='+page.query.resourcePoolId+"&hypervisor="+page.query.hypervisor+"&belongTab="+self.belongTab(),animatePages: false});
    };
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);
  window.HostIndex_Summary_viewModel = viewModel;
  viewModel.loadData();
});

