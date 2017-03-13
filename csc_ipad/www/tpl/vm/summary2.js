myApp.onPageInit("vm-summary2", function(page) {
  
  function ViewModel(){
    this.summary = ko.observable({
      "vcpu":'',
      "memoryType":'',
      "memory":'',
      "type":'',
      "osVersion":''
    });
    this.showShare = ko.observable();
    this.loadData = function(data){
      var self = this;
      if(page.query.hypervisor=='winserver'){
        self.showShare(true);
        if(data.memoryType&&data.memoryType=='shared'||data.memoryType&&data.memoryType=='共享'){
          data.memoryType = '共享';
        }else if(data.memoryType&&data.memoryType=='privilege'||data.memoryType&&data.memoryType=='专享'){
          data.memoryType = '专享';
        }else if(data.memoryType&&data.memoryType=='reservation'||data.memoryType&&data.memoryType=='预留'){
          data.memoryType = '预留';
        }else if(data.memoryType&&data.memoryType=='custom'||data.memoryType&&data.memoryType=='自定义调整'){
          data.memoryType = '自定义调整';
        }else{
          data.memoryType = '未知';
        }
      }else{
        self.showShare(false);
      }
      myApp.pullToRefreshDone();
      self.summary(data);  
    };
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);
  window.vm_summary2_viewModal = viewModel;

  $$(page.container).find('.pull-to-refresh-content').on('refresh', function (e) {
    viewModel.loadData(viewModel.summary());
  });
});