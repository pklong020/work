myApp.onPageInit("home-index", function(page) {
  function ViewModel(){
    var self = this;
    this.dcInfo = ko.observable({
        "id": "",
        "name": ""
      });
    this.setDcInfo = function(){
      this.dcInfo({
        "id": CVM_PAD.dcId,
        "name": CVM_PAD.dcName
      });
    }
    this.infos = ko.observable({
      "vmNumber": "",
      "cpuCoreNumber":"",
      "x86TotalCpu": "",
      "pvmTotalCpu": "",
      "memorySize": "",
      "storageSize": "",
      "busDomainNum": "",
      "projectNum": "",
      "resPoolNumber": "",
      "hostNubmer": ""
    });
    this.stat = ko.observable({
      "vmNumber": "",
      "x86TotalCpu": "",
      "pvmTotalCpu": "",
      "memoryTotal": "",
      "storageTotal": "",
      "busDomainNum": "",
      "projectNum": "",
      "resPoolNumber": "",
      "hostNubmer": "",
      "isTB":false
    });

    this.loadData = function(){
      RestServiceJs.query(BASE_URL+"/overallDetails/resourceSummary",{},function(data){
        myApp.pullToRefreshDone();
        data.memorySize = Number((Number(data.memorySize)/1024).toFixed(2));
        data.storageSize = Number((Number(data.storageSize)/1024).toFixed(2));
        self.infos(data);
      });
      RestServiceJs.query(BASE_URL+"/overallDetails/resourceStat",{},function(data){
        data.x86TotalCpu = Number((Number(data.x86TotalCpu)/1000).toFixed(2));
        data.x86UsedCpu = Number((Number(data.x86UsedCpu)/1000).toFixed(2));
        data.memoryTotal = Number((Number(data.memoryTotal)/1024).toFixed(2));
        data.memoryUsed = Number((Number(data.memoryUsed)/1024).toFixed(2));
        if(Number(data.storageTotal)>1023){
          data.isTB = true;
          data.storageTotal = Number((Number(data.storageTotal)/1024).toFixed(2));
          data.storageUsed = Number((Number(data.storageUsed)/1024).toFixed(2));
        }else{
          data.isTB = false;
          data.storageTotal = Number(Number(data.storageTotal).toFixed(2));
          data.storageUsed = Number(Number(data.storageUsed).toFixed(2));
        }
        
        data.pvmTotalCpu = Number(Number(data.pvmTotalCpu).toFixed(2));
        data.pvmUsedCpu = Number(Number(data.pvmUsedCpu).toFixed(2));
        self.stat(data);
        initTotal_x86_chart_home(data);
        initTotal_power_chart_home(data);
      },null,true);
    }
    this.refresh = function(){
      self.loadData();
    }
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);

  viewModel.loadData();
  viewModel.setDcInfo();

  $$(page.container).find('.pull-to-refresh-content').on('refresh', function (e) {
    viewModel.loadData();
  });

});

function initTotal_x86_chart_home(data){
  $('#total_cpu_chart_home').highcharts({
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
          
          fontWeight: 'normal'
        },
        // labelFormatter: function() {  
        //             return this.name + '：' + '<span style="{color}">'+ this.y + 'GHz' + '</span>';  
        // }, 
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
                  distance: -25,
                  color: '#6d6d72',
                  style:{
                    fontSize:'13px'
                  },
                  connectorColor: '#000000',
                  format: '{point.percentage:.1f} %'
              },
              showInLegend: true
          }
      },
      series: [{
          type: 'pie',
          name: 'CPU',
          data: [{
                  name: '已用',
                  y: data.x86UsedCpu,
                  color:"#4791d2"
              },
              {
                  name: '未用',
                  y: data.x86TotalCpu-data.x86UsedCpu,
                  color:"#ffd800"
              }
          ]
      }]
    }); 
  $('#total_memory_chart_home').highcharts({
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
          
          fontWeight: 'normal'
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
                  distance: -25,
                  color: '#6d6d72',
                  style:{
                    fontSize:'13px'
                  },
                  connectorColor: '#000000',
                  format: '{point.percentage:.1f} %'
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
                  color:"#4791d2"
              },
              {
                  name: '未用',
                  y: data.memoryTotal - data.memoryUsed,
                  color:"#ffd800"
              }
          ]
      }]
    }); 
  var init = 'GB';
  if(data.isTB) init = 'TB';
  $('#total_storage_chart_home').highcharts({
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
        fontWeight: 'normal'
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
                distance: -25,
                color: '#6d6d72',
                style:{
                  fontSize:'13px'
                },
                connectorColor: '#000000',
                format: '{point.percentage:.1f} %'
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
                color:"#4791d2"
            },
            {
                name: '未用',
                y: data.storageTotal - data.storageUsed,
                color:"#ffd800"
            }
        ]
    }]
  });
}

function initTotal_power_chart_home(data){
  $('#total_cpu_chart_home2').highcharts({
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
          
          fontWeight: 'normal'
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
                  distance: -25,
                  color: '#6d6d72',
                  style:{
                    fontSize:'13px'
                  },
                  connectorColor: '#000000',
                  format: '{point.percentage:.1f} %'
              },
              showInLegend: true
          }
      },
      series: [{
          type: 'pie',
          name: 'CPU',
          data: [{
                  name: '已用',
                  y: data.pvmUsedCpu,
                  color:"#4791d2"
              },
              {
                  name: '未用',
                  y: data.pvmTotalCpu-data.pvmUsedCpu,
                  color:"#ffd800"
              }
          ]
      }]
    });
  $('#total_memory_chart_home2').highcharts({
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
          
          fontWeight: 'normal'
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
                  distance: -25,
                  color: '#6d6d72',
                  style:{
                    fontSize:'13px'
                  },
                  connectorColor: '#000000',
                  format: '{point.percentage:.1f} %'
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
                  color:"#4791d2"
              },
              {
                  name: '未用',
                  y: data.memoryTotal - data.memoryUsed,
                  color:"#ffd800"
              }
          ]
      }]
    });
  var init = 'GB';
  if(data.isTB) init = 'TB';
  $('#total_storage_chart_home2').highcharts({
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
        fontWeight: 'normal'
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
                distance: -25,
                color: '#6d6d72',
                style:{
                  fontSize:'13px'
                },
                connectorColor: '#000000',
                format: '{point.percentage:.1f} %'
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
                color:"#4791d2"
            },
            {
                name: '未用',
                y: data.storageTotal - data.storageUsed,
                color:"#ffd800"
            }
        ]
    }]
  });
}


