myApp.onPageInit("pool-index", function(page) {


  function ViewModel(){
    var self = this;
    this.hypervisor = ko.observable("");
    this.pools_count = ko.observable("");
    this.dataList = ko.observableArray([]);
    this.vdcName = ko.observable("");
    this.infos = ko.observable("");

    this.search = function(){
      var reg1 = /^\w+$/;
      if(!!self.vdcName()){
        var newname = self.vdcName().replace(/[\u4e00-\u9fa5]/g,'').replace(/\-/g,'');
        if(!reg1.test(newname) && !!newname){
          myApp.alert('请勿输入除“-”、“_”以外的特殊字符！');
          return;
        }
      }
      self.loadData(false,self.vdcName());
    }
    this.loading = false;
    this.page = 1;
    this.noMore = ko.observable();
    self.isInit = true;
    this.loadData = function(is_loadMore,vdcName){
      if (self.loading) return;
      self.loading = true;
      if(!is_loadMore) self.page = 1;
      if(!vdcName) var vdcName = "";

      RestServiceJs.query(BASE_URL+"/vdc",{"name":vdcName, "firstResult":(self.page-1)*PAGE_SIZE,"maxResult":PAGE_SIZE},function(data){
        self.infos(data);
        self.loading = false;
        if(!is_loadMore){
          myApp.pullToRefreshDone();
          if(!self.isInit){
            myApp.attachInfiniteScroll($$(page.container).find('.infinite-scroll'));
          }
          self.isInit = false;
          self.dataList.removeAll();

          var dataLength
          if(!data.vdcs){
            dataLength = 0;
          }else{
            dataLength = data.vdcs.length;
          }
          self.pools_count(dataLength);
          
          self.noMore(false);
          if(data.vdcs.length < PAGE_SIZE) self.noMore(true);
        }
        for(var i=0; i<data.vdcs.length; i++){       
          self.dataList.push(data.vdcs[i]);
        }
        self.page++;
        if(is_loadMore && (data.vdcs.length < PAGE_SIZE)){
          myApp.detachInfiniteScroll($$(page.container).find('.infinite-scroll'));
          $$(page.container).find('.infinite-scroll-preloader').remove();
          self.noMore(true);
        }
      })
    }
    this.refresh = function(){
      self.loadData(false);
    }
  }


  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);
  window.pool_index_viewModel = viewModel;

  $$(page.container).find('.pull-to-refresh-content').on('refresh', function (e) {
    viewModel.loadData(false);
  });
  $$(page.container).find('.infinite-scroll').on('infinite', function () {
    viewModel.loadData(true, viewModel.vdcName());
  });  
  
});

