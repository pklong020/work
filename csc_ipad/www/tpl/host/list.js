myApp.onPageInit("host-list", function(page) {

  function ViewModel(){
    var self = this;
    this.dataList = ko.observableArray([]);
    this.hypervisor = ko.observable("");
    this.resPoolId = ko.observable("");
    this.belongTab = ko.observable(page.query.belongTab);

    this.selectType = ko.observable("");
    this.types = [{
      "typeId":'',
      "typeName":'全部'
    },{
      "typeId":1,
      "typeName":'虚拟化'
    },{
      "typeId":2,
      "typeName":'非虚拟化'
    }]
    this.selectType.subscribe(function(val){
      self.loadData(false,val);
    })

    this.loading = false;
    this.page = 1;
    this.noMore = ko.observable();
    self.isInit = true;
    this.loadData = function(is_loadMore, hypervisor, resPoolId){

      if (self.loading) return;
      self.loading = true;
      if(!is_loadMore) self.page = 1;

      RestServiceJs.query(BASE_URL+"/resPool/"+page.query.id+"/host",{"dcId":CVM_PAD.dcId,"hypervisor":this.hypervisor(),"firstResult":(self.page-1)*PAGE_SIZE,"maxResult":PAGE_SIZE},function(data){
        self.loading = false;
        if(!is_loadMore){
          myApp.pullToRefreshDone();
          if(!self.isInit){
            myApp.attachInfiniteScroll($$(page.container).find('.infinite-scroll'));
          }
          self.isInit = false;
          self.dataList.removeAll();
          self.noMore(false);
          if(data.data.length < PAGE_SIZE) self.noMore(true);
        }
        for(var i=0; i<data.data.length; i++){
          switch(data.data[i].state){
            case 'OK':
              data.data[i].state='运行中';
              data.data[i].stateCss='green';
              break;
            case 'RESTART':
              data.data[i].state='重启中';
              data.data[i].stateCss='orange';
              break;
            case 'DISCONNECT':
              data.data[i].state='未运行';
              data.data[i].stateCss='gray';
              break;
            case 'MAINTAIN':
              data.data[i].state='维护';
              data.data[i].stateCss='gray';
              break;
          }
          self.dataList.push(data.data[i]);
        }
        self.page++;
        if(is_loadMore && (data.data.length < PAGE_SIZE)){
          myApp.detachInfiniteScroll($$(page.container).find('.infinite-scroll'));
          $$(page.container).find('.infinite-scroll-preloader').remove();
          self.noMore(true);
        }
      })
    }
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);
  window.hostList_viewModel = viewModel;

  viewModel.loadData(false,viewModel.hypervisor(),viewModel.resPoolId());

  $$(page.container).find('.pull-to-refresh-content').on('refresh', function (e) {
    viewModel.loadData(false,viewModel.hypervisor(),viewModel.resPoolId());
  });
  $$(page.container).find('.infinite-scroll').on('infinite', function () {
    viewModel.loadData(true,viewModel.hypervisor(),viewModel.resPoolId());
  });  

});