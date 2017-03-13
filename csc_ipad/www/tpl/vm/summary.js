myApp.onPageInit("vm-summary", function(page) {
  function ViewModel(){
    var self = this;
    this.hypervisor = ko.observable(page.query.hypervisor);
    this.summary = ko.observable({
      "osVersion": "",
      "cpu": "",
      "maxcpu": "",
      "mincpu": "",
      "vcpu": "",
      "maxVcpu": "",
      "minVcpu": "",
      "memory": "",
      "maxMemory": "",
      "minMemory": "",
      "type":'',
      "network": []
    });
    this.loadData = function(data){
      myApp.pullToRefreshDone();
      self.summary(data);
    };
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);
  window.vm_summary_viewModal = viewModel;

  $$(page.container).find('.pull-to-refresh-content').on('refresh', function (e) {
    viewModel.loadData(viewModel.summary());
  });
});