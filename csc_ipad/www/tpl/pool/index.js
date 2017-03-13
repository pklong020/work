myApp.onPageInit("pool-index", function(page) {
  // 资源池-虚拟化类型占比
function initPool_vtype_chart(data) {
    $('#pool_vtype_chart').highcharts({
        chart: {
            marginTop: 0,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            backgroundColor: "none"
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y:.2f}</b>',
            valueSuffix: ' 个',
            shared: true
        },
        title: {
            text: ''
        },
        credits:{
          enabled: false,
          text : ""
        }, 
        legend:{
          margin: 0,
          layout: 'vertical',
          borderColor:"none",
          padding:0,
          labelFormat: '{name}：<b>{y}</b> 个',
          itemStyle: {
            
            fontWeight: 'normal',
            fontSize:'12px'
          },          
        },
        plotOptions: {
            pie: {
                borderWidth:0,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            name: '虚拟化类型',
            data: [{
                  name: 'Winserver',
                  y: data.winserverNum,
                  color:"#4791d2"
              },
              {
                  name: 'VMware',
                  y: data.vmwareNum,
                  color:"#ffd800"
              },
              {
                  name: 'PowerVM',
                  y: data.powerNum,
                  color:"#5bd544"
              }
          ]
        }]
    });
}
// 资源池-cpu占比图
function initPool_cpu_chart(data) {
    $('#pool_cpu_chart').highcharts({
      chart: {
          marginTop: 0,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: "none"
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.2f}</b>',
          valueSuffix: ' GHz',
          shared: true
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
        labelFormat: '{name}：<b>{y:.2f}</b>GHz',
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
                  y: (data.X86CpuTotal-data.X86AvailCpu)/1000,
                  color:"#ffd800"
              },
              {
                  name: '可用',
                  y: (data.X86AvailCpu)/1000,
                  color:"#59cb5c"
              }
          ]
      }]
    });   
}
function initPool_cpu_chart2(data) {
    $('#pool_cpu_chart2').highcharts({
      chart: {
          marginTop: 0,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: "none"
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.2f}</b>',
          valueSuffix: ' 核',
          shared: true
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
        labelFormat: '{name}：<b>{y:.2f}</b>核',
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
                  y: data.pvmCpuTotal-data.pvmAvailCpu,
                  color:"#ffd800"
              },
              {
                  name: '可用',
                  y: data.pvmAvailCpu,
                  color:"#59cb5c"
              }
          ]
      }]
    });   
}
// 资源池-内存占比图
function initPool_memory_chart(data) {
    $('#pool_memory_chart').highcharts({
      chart: {
          marginTop: 0,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: "none"
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.2f}</b>',
          valueSuffix: ' GB',
          shared: true
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
                  y: (data.memoryTotal-data.availMemory)/1024,
                  color:"#ffd800"
              },
              {
                  name: '可用',
                  y: (data.availMemory)/1024,
                  color:"#59cb5c"
              }
          ]
      }]
    });   
}
// 资源池-存储占比图
function initPool_storage_chart(data) {
    $('#pool_storage_chart').highcharts({
      chart: {
          marginTop: 0,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: "none"
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.2f}</b>',
          valueSuffix: ' GB',
          shared: true
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
                  y: data.storageTotal-data.availStorage,
                  color:"#ffd800"
              },
              {
                  name: '可用',
                  y: data.availStorage,
                  color:"#59cb5c"
              }
          ]
      }]
    });   
}

  function ViewModel(){
    var self = this;
    this.hypervisor = ko.observable("");
    this.pools_count = ko.observable("");
    this.dataList = ko.observableArray([]);
    this.dcName = ko.observable(CVM_PAD.dcName);

    this.loading = false;
    this.page = 1;
    this.noMore = ko.observable();
    self.isInit = true;
    this.loadData = function(is_loadMore,hypervisor){
      if(hypervisor){
        this.hypervisor(hypervisor);
      }else{
        this.hypervisor("");
      }
      if (self.loading) return;
      self.loading = true;
      if(!is_loadMore) self.page = 1;

      RestServiceJs.query(BASE_URL+"/resPool",{"dcId":CVM_PAD.dcId,"hypervisor":this.hypervisor(), "firstResult":(self.page-1)*PAGE_SIZE,"maxResult":PAGE_SIZE},function(data){
        //$.ajax("tpl/pool/index.json?id="+page.query.id+"&page="+self.page).done(function(data){

        self.loading = false;
        if(!is_loadMore){
          myApp.pullToRefreshDone();
          if(!self.isInit){
            myApp.attachInfiniteScroll($$(page.container).find('.infinite-scroll'));
          }
          self.isInit = false;
          self.dataList.removeAll();

          if(self.hypervisor()==''){
            initPool_vtype_chart(data);
            initPool_cpu_chart2(data);
            initPool_cpu_chart(data);
          }else if(self.hypervisor()=='PowerVM'){
            initPool_cpu_chart2(data);
          }else{
            initPool_cpu_chart(data);
          }
          initPool_memory_chart(data);
          initPool_storage_chart(data);

          var dataLength
          if(!data.data){
            dataLength = 0;
          }else{
            dataLength = data.data.length;
          }
          self.pools_count(dataLength);
          
          self.noMore(false);
          if(data.data.length < PAGE_SIZE) self.noMore(true);
        }
        for(var i=0; i<data.data.length; i++){       
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
  window.pool_index_viewModel = viewModel;

  $$(page.container).find('.pull-to-refresh-content').on('refresh', function (e) {
    viewModel.loadData(false, viewModel.hypervisor());
  });
  $$(page.container).find('.infinite-scroll').on('infinite', function () {
    viewModel.loadData(true, viewModel.hypervisor());
  });  
  
});

