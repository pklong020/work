myApp.onPageInit("vm-show", function(page) {
  diskListclicks.vm = false;
  vmPerformanceClicked = false;

  function ViewModel(){
    var self = this;
    this.hypervisor = ko.observable(page.query.hypervisor);
    this.name = ko.observable(page.query.name);
    this.belongTab = ko.observable(page.query.belongTab);
    this.perforClick = function(){
      innerTabclick_performance(page.query.hypervisor,self.summary().state);
    }
    this.isDisable = ko.observable(true);
    this.summary = ko.observable({
      "ip": '',
      "state":'',
      "runningTime":'',
      "stateCss":'',
      "resourcePoolName":'',
      "hostName":''
    })

    this.loadData = function(){
      var url;
      if(page.query.hypervisor=="PowerVM"){
        url = 'tpl/vm/summary.html';
      }else{
        url = 'tpl/vm/summary2.html'
      }
      myApp.addView('#view_vm_summary'+self.belongTab(), {dynamicNavbar: false,domCache: true,linksView:'#view-vm'}).router.load({url: url+"?hypervisor="+page.query.hypervisor+'&belongTab='+self.belongTab(),animatePages: false});
      myApp.addView('#view_vm_performance'+self.belongTab(),      {dynamicNavbar: false,domCache: true,linksView:'#view-vm'}).router.load({url: 'tpl/vm/performance.html?hypervisor='+page.query.hypervisor+'&id='+page.query.id+'&state='+page.query.state+'&belongTab='+self.belongTab(),animatePages: false});
      myApp.addView('#view_vm_volumn'+self.belongTab(), {dynamicNavbar: false,domCache: true,linksView:'#view-vm'}).router.load({url: 'tpl/volumn/list.html?fromPage=vm&hypervisor='+page.query.hypervisor+'&id='+page.query.id+'&belongTab='+self.belongTab(),animatePages: false});
      RestServiceJs.query(BASE_URL+"/vm/"+page.query.id+"/summary",{"dcId":CVM_PAD.dcId,"hypervisor":page.query.hypervisor},function(data){
        self.isDisable(false);
        data.state = page.query.state;
        data.stateCss = page.query.stateCss;
        data.runningTime = getTheTime(data.runningTime);
        data.type = page.query.type;
        self.summary(data);
        if(self.hypervisor()=='PowerVM'){
          data.memory = (Number(data.memory)/1024).toFixed(2);
          data.maxMemory = (Number(data.maxMemory)/1024).toFixed(2);
          data.minMemory = (Number(data.minMemory)/1024).toFixed(2);
          window.vm_summary_viewModal.loadData(data);
        }else{
          data.memory = (Number(data.memory)/1024).toFixed(2);
          window.vm_summary2_viewModal.loadData(data);
          window.vm_performance_viewModel.vcpu(data.vcpu);
        }
      });
      
    };
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);
  
  viewModel.loadData();
});