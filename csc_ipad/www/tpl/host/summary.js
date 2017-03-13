myApp.onPageInit("host-summary", function(page) {
  // 单个资源池-cpu占比图
function initSingleHost_cpu_chart(data) {
  var unit = "GHz";
  if(viewModel.summary().hypervisor=="PowerVM") unit = "核";
  $('#singleHost_cpu_chart'+viewModel.belongTab()).highcharts({
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
                  y: data.totalCpu-data.availCpu,
                  color:"#ffd800"
              },
              {
                  name: '未用',
                  y: data.availCpu,
                  color:"#4395d5"
              }
          ]
      }]
    });   
}
// 单个资源池-内存占比图
function initSingleHost_memory_chart(data) {
    $('#singleHost_memory_chart'+viewModel.belongTab()).highcharts({
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
                  name: '未用',
                  y: data.availMemory,
                  color:"#4395d5"
              }
          ]
      }]
    });   
}
// 单个资源池-存储占比图
function initSingleHost_storage_chart(data) {
    $('#singleHost_storage_chart'+viewModel.belongTab()).highcharts({
      chart: {
          marginTop: 0,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: "none"
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.2f}</b>',
          valueSuffix: ' TB',
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
        labelFormat: '{name}：<b>{y:.2f}</b>TB',
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
                  name: '未用',
                  y: data.availStorage,
                  color:"#4395d5"
              }
          ]
      }]
    });   
}
  function ViewModel(){
    this.summary = ko.observable({
      "hypervisor":'',
      "vmNum":'',
      "runningVmNum":'',
      "cpuUnit":'',
      "cpuSlots":'',
      "cpuSpeed":'',
      "model":'',
      "vendor":''
    });
    this.summary2 = ko.observable({
      "totalCpu":'',
      "memory":'',
      "storage":''
    });
    this.belongTab = ko.observable(page.query.belongTab);
    this.loadData = function(data){
      var self = this;
      self.summary(data);
      RestServiceJs.query(BASE_URL+"/host/"+page.query.id+"/statics",{"dcId":CVM_PAD.dcId,"hypervisor":data.hypervisor},function(res){
        myApp.pullToRefreshDone();
        res.totalCpu = data.hypervisor == 'PowerVM' ? Number((Number(res.totalCpu)).toFixed(2)) : Number((Number(res.totalCpu)/1000).toFixed(2));
        res.availCpu = data.hypervisor == 'PowerVM' ? Number((Number(res.availCpu)).toFixed(2)) : Number((Number(res.availCpu)/1000).toFixed(2));
        res.memory = Number((Number(res.memory)/1024).toFixed(2));
        res.availMemory = Number((Number(res.availMemory)/1024).toFixed(2));
        res.storage = Number((Number(res.storage)/1024).toFixed(2));
        res.availStorage = Number((Number(res.availStorage)/1024).toFixed(2));
        self.summary2(res);
        initSingleHost_cpu_chart(res);
        initSingleHost_memory_chart(res);
        initSingleHost_storage_chart(res);
      },null,true);
      
    };
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);
  window.HostIndex_Summary_details_viewModel = viewModel;

  $$(page.container).find('.pull-to-refresh-content').on('refresh', function (e) {
    viewModel.loadData(viewModel.summary());
  });
});