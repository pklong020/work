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
      "vmNum": "",
      "cpuNum":"",
      "memorySize": "",
      "storageSize": "",
      "resourcePoolNum": "",
      "storagePoolNum": "",
      "hostNum": "",
      "imageNum": "",
      "networkNum": "",
      "ipPoolNum": ""
    });
    this.stat = ko.observable({
      "x86":{},
      "power":{}
    });

    this.loadData = function(){
      RestServiceJs.query(BASE_URL+"/datacenter/statics",{},function(data){
        myApp.pullToRefreshDone();
        data.memorySize = Number((Number(data.memorySize)/1024).toFixed(2));
        data.storageSize = Number((Number(data.storageSize)/1024).toFixed(2));
        self.infos(data);
      });
      RestServiceJs.query(BASE_URL+"/host/statics",{},function(data){
        data.x86.cpuTotal = Number((Number(data.x86.cpuTotal)/1000).toFixed(2));
        data.x86.cpuAvail= Number((Number(data.x86.cpuAvail)/1000).toFixed(2));
        data.x86.memoryTotal = Number((Number(data.x86.memoryTotal)/1024).toFixed(2));
        data.x86.memoryAvail = Number((Number(data.x86.memoryAvail)/1024).toFixed(2));
        if(Number(data.x86.storageTotal)>1023){
          data.x86.isTB = true;
          data.x86.storageTotal = Number((Number(data.x86.storageTotal)/1024).toFixed(2));
          data.x86.storageAvail = Number((Number(data.x86.storageAvail)/1024).toFixed(2));
        }else{
          data.isTB = false;
          data.x86.storageTotal = Number(Number(data.x86.storageTotal).toFixed(2));
          data.x86.storageAvail = Number(Number(data.x86.storageAvail).toFixed(2));
        }

        data.power.cpuTotal = Number(Number(data.power.cpuTotal).toFixed(2));
        data.power.cpuAvail= Number(Number(data.power.cpuAvail).toFixed(2));
        data.power.memoryTotal = Number((Number(data.power.memoryTotal)/1024).toFixed(2));
        data.power.memoryAvail = Number((Number(data.power.memoryAvail)/1024).toFixed(2));
        if(Number(data.power.storageTotal)>1023){
          data.power.isTB = true;
          data.power.storageTotal = Number((Number(data.power.storageTotal)/1024).toFixed(2));
          data.power.storageAvail = Number((Number(data.power.storageAvail)/1024).toFixed(2));
        }else{
          data.isTB = false;
          data.power.storageTotal = Number(Number(data.power.storageTotal).toFixed(2));
          data.power.storageAvail = Number(Number(data.power.storageAvail).toFixed(2));
        }
        
        self.stat(data);
        initTotal_x86_chart_home(data.x86);
        initTotal_power_chart_home(data.power);
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
                  y: data.cpuTotal-data.cpuAvail,
                  color:"#23b7e5"
              },
              {
                  name: '未用',
                  y: data.cpuAvail,
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
                  y: data.memoryTotal - data.memoryAvail,
                  color:"#23b7e5"
              },
              {
                  name: '未用',
                  y: data.memoryAvail,
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
                y: data.storageTotal - data.storageAvail,
                color:"#23b7e5"
            },
            {
                name: '未用',
                y: data.storageAvail,
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
                  y: data.cpuTotal - data.cpuAvail,
                  color:"#23b7e5"
              },
              {
                  name: '未用',
                  y: data.cpuAvail,
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
                  y: data.memoryTotal - data.memoryAvail,
                  color:"#23b7e5"
              },
              {
                  name: '未用',
                  y: data.memoryAvail,
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
                y: data.storageTotal - data.storageAvail,
                color:"#23b7e5"
            },
            {
                name: '未用',
                y: data.storageAvail,
                color:"#ffd800"
            }
        ]
    }]
  });
}


