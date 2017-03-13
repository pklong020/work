myApp.onPageInit("storage-list", function(page) {

  function ViewModel(){
    var self = this;
    this.dataList = ko.observableArray([]);
    this.fromPage=ko.observable("");
    this.hypervisor = ko.observable(page.query.hypervisor);
    this.belongTab = ko.observable(page.query.belongTab);

    this.loading = false;
    this.page = 1;
    this.noMore = ko.observable();
    self.isInit = true;
    this.loadData = function(is_loadMore){
      if (self.loading) return;
      self.loading = true;
      if(!is_loadMore) self.page = 1;

      var url;
      switch(page.query.fromPage){
        case "pool":
          this.fromPage("pool");
          url=BASE_URL+"/resPool/"+page.query.id+"/storagePool";
          break;
        case "host":
          this.fromPage("host");
          url=BASE_URL+"/host/"+page.query.id+"/storagePool";
          break;
      }
      
      RestServiceJs.query(url,{"dcId":CVM_PAD.dcId,"hypervisor":page.query.hypervisor,"firstResult":(self.page-1)*PAGE_SIZE,"maxResult":PAGE_SIZE},function(data){
        //$.ajax("tpl/storage/index.json?id="+page.query.id+"&page="+self.page).done(function(data){
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
            case 'plugException':
              data.data[i].state='挂载异常';
              data.data[i].stateCss='orange';
              break;
            case 'OK':
              data.data[i].state='活动';
              data.data[i].stateCss='green';
              break;
            case 'unPlug':
              data.data[i].state='未挂载';
              data.data[i].stateCss='gray';
              break;
            case 'INACTIVE':
              data.data[i].state='未活动';
              data.data[i].stateCss='gray';
              break;
            case 'Deleting':
              data.data[i].state='删除中';
              data.data[i].stateCss='orange';
              break;
            case 'UnPluging':
              data.data[i].state='卸载中';
              data.data[i].stateCss='orange';
              break;
            case 'Pluging':
              data.data[i].state='挂载中';
              data.data[i].stateCss='orange';
              break;
            default:
              data.data[i].state='异常';
              data.data[i].stateCss='orange';
              break;
          }
          switch(data.data[i].type){
            case 'udev':
              data.data[i].type = '可移动存储';
              break;
            case 'lvm':
              data.data[i].type = '本地LVM卷组';
              break;
            case 'ext':
              data.data[i].type = '本地EXT';
              break;
            case 'nfs':
              data.data[i].type = 'NFS共享存储';
              break;
            case 'lvmoiscsi':
              data.data[i].type = '软件ISCSI';
              break;
            case 'lvmohba':
              data.data[i].type = '硬件HBA';
              break;
            case 'NFS':
              data.data[i].type = 'NFS共享存储';
              break;
            case 'FCSAN':
              data.data[i].type = 'FC SAN';
              break;
            case 'iSCSI':
              data.data[i].type = 'iSCSI';
              break;
            case 'LOCAL':
              data.data[i].type = '本地存储';
              break;
            case 'UNKNOW':
              data.data[i].type = '未知';
              break;
            case 'LVPOOL':
              data.data[i].type = '本地LVM卷组';
              break;
            case 'SVC_POOL':
              data.data[i].type = 'SVC存储池';
              break;
            case 'EMC_POOL':
              data.data[i].type = 'EMC VNX存储池';
              break;
            case 'DS4700_POOL':
              data.data[i].type = 'DS4700存储池';
              break;
            case 'NETAPP_POOL':
              data.data[i].type = 'NETAPP FAS存储池';
              break;
            default:
              data.data[i].type = '未知';
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
  window.storageList_viewModel = viewModel;

  $$(page.container).find('.pull-to-refresh-content').on('refresh', function (e) {
    viewModel.loadData();
  });
  $$(page.container).find('.infinite-scroll').on('infinite', function () {
    viewModel.loadData(true);
  });  
  
});