myApp.onPageInit("pool-summary", function(page) {
// 单个资源池-cpu占比图
function initSinglePool_cpu_chart(data) {
    var unit = 'GHz';
    if(data.hypervisor == 'PowerVM') unit = '核';
    $('#singlePool_cpu_chart').highcharts({
      chart: {
          marginTop: 0,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: "none"
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.2f}</b>',
          valueSuffix: unit,
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
        labelFormat: '{name}：<b>{y:.2f}</b>'+unit,
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
                  y: data.cpu-data.availCpu,
                  color:"#ffd800"
              },
              {
                  name: '可用',
                  y: data.availCpu,
                  color:"#59cb5c"
              }
          ]
      }]
    });   
}
// 单个资源池-内存占比图
function initSinglePool_memory_chart(data) {
    $('#singlePool_memory_chart').highcharts({
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
                  y: data.memory-data.availMemory,
                  color:"#ffd800"
              },
              {
                  name: '可用',
                  y: data.availMemory,
                  color:"#59cb5c"
              }
          ]
      }]
    });   
}
// 单个资源池-存储占比图
function initSinglePool_storage_chart(data) {
    var init = 'GB';
    if(data.isTB) init = 'TB';
    $('#singlePool_storage_chart').highcharts({
      chart: {
          marginTop: 0,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: "none"
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.2f}</b>',
          valueSuffix: init,
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
        labelFormat: '{name}：<b>{y:.2f}</b>'+init,
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
                  y: data.storage-data.availStorage,
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
    this.summary = ko.observable({
      "hostNum":"",
      "vmNum":"",
      "hypervisor":"",
      "cpu":"",
      "memory":"",
      "storage":"",
      "cpuSlots":"",
      "isTB":false
    });
    this.loadData = function(){
      var self = this;
      RestServiceJs.get(BASE_URL+"/resPool",page.query.id,{"dcId":CVM_PAD.dcId,"hypervisor":page.query.hypervisor,"resourcePoolName":page.query.resourcePoolName},function(data){
      //$.ajax("tpl/pool/summary.json?id="+page.query.id).done(function(data){
        myApp.pullToRefreshDone();
        data.cpu = data.hypervisor == 'PowerVM' ? Number(Number(data.cpu).toFixed(2)) : Number((Number(data.cpu)/1000).toFixed(2));
        data.availCpu = data.hypervisor == 'PowerVM' ? Number(Number(data.availCpu).toFixed(2)) : Number((Number(data.availCpu)/1000).toFixed(2));
        data.memory = Number((Number(data.memory)/1024).toFixed(2));
        data.availMemory = Number((Number(data.availMemory)/1024).toFixed(2));
        if(Number(data.storage)>1023){
          data.isTB = true;
          data.storage = Number((Number(data.storage)/1024).toFixed(2));
          data.availStorage = Number((Number(data.availStorage)/1024).toFixed(2));
        }else{
          data.isTB = false;
          data.storage = Number((Number(data.storage)).toFixed(2));
          data.availStorage = Number((Number(data.availStorage)).toFixed(2));
        }
        self.summary(data);

        initSinglePool_cpu_chart(data);
        initSinglePool_memory_chart(data);
        initSinglePool_storage_chart(data);
      });      
    };
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);
  
  viewModel.loadData();

  $$(page.container).find('.pull-to-refresh-content').on('refresh', function (e) {
    viewModel.loadData();
  });
});