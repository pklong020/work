myApp.onPageInit("business-index", function(page) {
  // 业务域-cpu占比图
function init_cpu_chart(data) {
    $('#business_cpu_chart').highcharts({
      chart: {
          marginTop: 0,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: "none"
      },
      exporting:{
          enabled: false
      },
      credits:{
          enabled: false,
          text : ""
      },

      title: {
          floating:true,
          text: ''
      },
      legend:{
        enabled:true,
        margin: 0,
        layout: 'vertical',
        backgroundColor:"none",
        borderColor:"none",
        itemStyle: {
          
          fontWeight: 'normal',
          fontSize:'12px'
        },
        labelFormat: '{name}：<b>{y}</b>个',
      },
      plotOptions: {
          pie: {
              innerSize: '70%',
              borderWidth:1,
              allowPointSelect: false,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  color:'#6d6d72',
                  distance: -25,
                  style:{
                    fontSize:'12px',
                    fontWeight:'normal'
                  },
                  format: '{point.percentage:.1f}%'
              },
              showInLegend: true
          }
      },
      series: [{
          type: 'pie',
          name: 'CPU',
          data: [{
                  name: '已用',
                  y: data.cpuUsed,
                  color:"#ffd800"
              },
              {
                  name: '未用',
                  y: data.cpuTotal-data.cpuUsed,
                  color:"#59cb5c"
              }
          ]
      }]
    });   
}
// 资源池-内存占比图
function init_memory_chart(data) {
    $('#business_memory_chart').highcharts({
      chart: {
          marginTop: 0,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: "none"
      },
      exporting:{
          enabled: false
      },
      credits:{
          enabled: false,
          text : ""
      },

      title: {
          floating:true,
          text: ''
      },
      legend:{
        enabled:true,
        margin: 0,
        layout: 'vertical',
        backgroundColor:"none",
        borderColor:"none",
        itemStyle: {
          
          fontWeight: 'normal',
          fontSize:'12px'
        },
        labelFormat: '{name}：<b>{y:.2f}</b>GB',
      },
      plotOptions: {
          pie: {
              innerSize: '70%',
              borderWidth:1,
              allowPointSelect: false,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  color:'#6d6d72',
                  distance: -25,
                  style:{
                    fontSize:'12px',
                    fontWeight:'normal'
                  },
                  format: '{point.percentage:.1f}%'
              },
              showInLegend: true
          }
      },
      series: [{
          type: 'pie',
          name: '内存',
          data: [{
                  name: '已用',
                  y: data.memoryUsed,
                  color:"#ffd800"
              },
              {
                  name: '未用',
                  y: data.memoryTotal-data.memoryUsed,
                  color:"#59cb5c"
              }
          ]
      }]
    });   
}
// 资源池-存储占比图
function init_storage_chart(data) {
    $('#business_storage_chart').highcharts({
      chart: {
          marginTop: 0,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: "none"
      },
      exporting:{
          enabled: false
      },
      credits:{
          enabled: false,
          text : ""
      },

      title: {
          floating:true,
          text: ''
      },
      legend:{
        enabled:true,
        margin: 0,
        layout: 'vertical',
        backgroundColor:"none",
        borderColor:"none",
        itemStyle: {
          
          fontWeight: 'normal',
          fontSize:'12px'
        },
        labelFormat: '{name}：<b>{y:.2f}</b>GB',
      },
      plotOptions: {
          pie: {
              innerSize: '70%',
              borderWidth:1,
              allowPointSelect: false,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  color:'#6d6d72',
                  distance: -25,
                  style:{
                    fontSize:'12px',
                    fontWeight:'normal'
                  },
                  format: '{point.percentage:.1f}%'
              },
              showInLegend: true
          }
      },
      series: [{
          type: 'pie',
          name: '存储',
          data: [{
                  name: '已用',
                  y: data.storageUsed,
                  color:"#ffd800"
              },
              {
                  name: '未用',
                  y: data.storageTotal-data.storageUsed,
                  color:"#59cb5c"
              }
          ]
      }]
    });   
}

  function ViewModel(){
    var self = this;
    this.busdomainNum = ko.observable("");
    this.projectNum = ko.observable("");
    this.dataList = ko.observableArray([]);
    this.busdomainName = ko.observable("");
    this.busdomainId = ko.observable("");
    this.isShowAll = ko.observable(true);
    this.projectNum2 = ko.observable("");
    this.dcName = ko.observable(CVM_PAD.dcName);

    this.loading = false;
    this.page = 1;
    this.noMore = ko.observable();
    self.isInit = true;
    this.loadData = function(is_loadMore, id, name){
      if (self.loading) return;
      self.loading = true;
      if(!is_loadMore) self.page = 1;

      if(id&&name){
        this.isShowAll(false);
        this.busdomainId(id);
        this.busdomainName(name);
      }else{
        this.isShowAll(true);
        this.busdomainId("");
        this.busdomainNum(window.indexFilter_busdomain_viewModel.busdomain.busdomainNum);
      }
      
      RestServiceJs.query(BASE_URL+"/busdomain/projects",{"dcId":CVM_PAD.dcId,"vdcId":this.busdomainId(), "firstResult":(self.page-1)*PAGE_SIZE,"maxResult":PAGE_SIZE},function(data){
        if(id&&name){
          init_cpu_chart(data.busdomain);
          init_memory_chart(data.busdomain);
          init_storage_chart(data.busdomain);
        }

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
        self.projectNum(data.size);
        for(var i=0; i<data.data.length; i++){       
          self.dataList.push(data.data[i]);
        }
        self.page++;

        if(is_loadMore && (data.data.length < PAGE_SIZE)){
          myApp.detachInfiniteScroll($$(page.container).find('.infinite-scroll'));
          $$(page.container).find('.infinite-scroll-preloader').remove();
          self.noMore(true);
        }
      });

    }
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);

  window.business_index_viewModel = viewModel;

  $$(page.container).find('.pull-to-refresh-content').on('refresh', function (e) {
    viewModel.loadData(false,viewModel.busdomainId(),viewModel.busdomainName());
  });
  $$(page.container).find('.infinite-scroll').on('infinite', function () {
    viewModel.loadData(true,viewModel.busdomainId(),viewModel.busdomainName());
  });
});


