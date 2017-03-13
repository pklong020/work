myApp.onPageInit("pool-list-search", function(page) {
  function ViewModel(){
    var self = this;
    this.dataList = ko.observableArray([]);
    this.forPage = ko.observable(page.query.forPage);

    this.hypervisor = ko.observable(page.query.hypervisor);
    this.poolSelected = ko.observable("全部");
    this.setPoolSelected = function(object,event){
      //var hypervisor = event.currentTarget.attributes["hypervisor"].nodeValue;
      var val = event.currentTarget.attributes["toselect"].nodeValue;
      self.poolSelected(val);
      //var hype = hypervisor ? hypervisor : "";
      var id = val.indexOf("全部")>-1 ? "" : val.replace(/[^0-9]/ig,"");
      if(page.query.forPage == 'vm'){
        window.vm_index_viewModel.loadData(false, self.hypervisor(), id);
      }
      if(page.query.forPage == 'storage'){
        window.storage_index_viewModel.loadData(false, self.hypervisor(), id);
      }
    }

    this.loading = false;
    this.page = 1;
    this.loadData = function(is_loadMore){
      if (self.loading) return;
      self.loading = true;
      if(!is_loadMore) self.page = 1;

      RestServiceJs.query(BASE_URL+"/resPool",{"dcId":CVM_PAD.dcId,"hypervisor":self.hypervisor(), "firstResult":(self.page-1)*PAGE_SIZE,"maxResult":PAGE_SIZE},function(data){
        //$.ajax("tpl/pool/list_search.json?id="+page.query.id+"&page="+self.page).done(function(data){
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
