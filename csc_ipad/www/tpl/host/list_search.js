myApp.onPageInit("host-list-search", function(page) {
  function ViewModel(){
    var self = this;
    this.dataList = ko.observableArray([]);

    this.hypervisor = ko.observable(page.query.hypervisor);
    this.resPoolId = ko.observable(page.query.resourcePoolId);
    this.resourcePoolName = ko.observable(page.query.resourcePoolName);
    this.hostSelected = ko.observable("全部");
    this.setHostSelected = function(object,event){
      //var hypervisor = event.currentTarget.attributes["hypervisor"].nodeValue;
      var val = event.currentTarget.attributes["toselect"].nodeValue;
      self.hostSelected(val);
      //var hype = hypervisor ? hypervisor : "";
      var id = val.indexOf("全部")>-1 ? "" : val.replace(/[^0-9]/ig,"");
      if(page.query.forPage == 'vm'){
        window.vm_index_viewModel.loadData(false, self.hypervisor(), self.resPoolId(), id);
      }
      if(page.query.forPage == 'storage'){
        window.storage_index_viewModel.loadData(false, self.hypervisor(), self.resPoolId(), id);
      }
    }

    this.loading = false;
    this.page = 1;
    this.loadData = function(is_loadMore){
      if (self.loading) return;
      self.loading = true;
      if(!is_loadMore) self.page = 1;

      RestServiceJs.query(BASE_URL+"/host",{"dcId":CVM_PAD.dcId,"hypervisor":self.hypervisor(),"resPoolId":self.resPoolId(),"firstResult":(self.page-1)*PAGE_SIZE,"maxResult":PAGE_SIZE},function(data){
      //$.ajax("tpl/host/list_search.json?id="+page.query.id+"&page="+self.page).done(function(data){
        self.loading = false;
        if(!is_loadMore){
          myApp.pullToRefreshDone();
          self.dataList.removeAll();
        }
        for(var i=0; i<data.data.length; i++){       
          self.dataList.push(data.data[i]);
        }
        self.page++;
        if(is_loadMore && (data.data.length < PAGE_SIZE)){
          myApp.detachInfiniteScroll($$(page.container).find('.infinite-scroll'));
          $$(page.container).find('.infinite-scroll-preloader').remove();
        }
      })
    }
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);

  viewModel.loadData();

  // $$(page.container).find('.pull-to-refresh-content').on('refresh', function (e) {
  //   viewModel.loadData();
  // });
  $$(page.container).find('.infinite-scroll').on('infinite', function () {
    viewModel.loadData(true);
  });  
  
});
