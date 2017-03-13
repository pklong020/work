myApp.onPageInit("volumn-list", function(page) {

  function ViewModel(){
    this.dataList = ko.observableArray([]);
    this.fromPage = ko.observable('');

    this.loading = false;
    this.page = 1;
    this.noMore = ko.observable();
    self.isInit = true;
    this.loadData = function(is_loadMore){
      var self = this;
      if (self.loading) return;
      self.loading = true;
      if(!is_loadMore) self.page = 1;

      var url;
      switch(page.query.fromPage){
        case "vm":
          this.fromPage("vm");
          url=BASE_URL+"/vm/"+page.query.id+"/disk";
          break;
        case "storage":
          this.fromPage("storage");
          url=BASE_URL+"/storagePool/"+page.query.id+"/disk";
          break;
      }

      RestServiceJs.query(url,{"dcId":CVM_PAD.dcId,"hypervisor":page.query.hypervisor,"firstResult":(self.page-1)*PAGE_SIZE,"maxResult":PAGE_SIZE},function(data){
      //$$.getJSON("tpl/volumn/list.json?id="+page.query.id+"&page="+self.page, function(data){
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
          switch(data.data[i].type){
            case 'system':
              data.data[i].type = '系统盘';
              break;
            case 'data':
              data.data[i].type = '数据盘';
              break;
            case 'unknown':
              data.data[i].type = '未知';
              break;
            case 'SYSTEM':
              data.data[i].type = '系统盘';
              break;
            case 'USER':
              data.data[i].type = '数据盘';
              break;
            case 'SUSPEND':
              data.data[i].type = '未知';
              break;
            case 'HA_STATEFILE':
              data.data[i].type = '其他';
              break;
            case 'REDO_LOG':
              data.data[i].type = '其他';
              break;
            case 'BLOCK':
              data.data[i].type = '存储LUN';
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
  window.diskList_viewModel = viewModel;

  $$(page.container).find('.pull-to-refresh-content').on('refresh', function (e) {
    viewModel.loadData();
  });
  $$(page.container).find('.infinite-scroll').on('infinite', function () {
    viewModel.loadData(true);
  });  
  
});