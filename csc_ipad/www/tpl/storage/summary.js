myApp.onPageInit("storage-summary", function(page) {

// 单个存储池-使用率占比图
function initsingleStorage_use_chart(data) {
    $('#singleStorage_use_chart'+viewModel.belongTab()).highcharts({
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
          name: '存储',
          data: [{
                  name: '未用',
                  y: data.availStorage,
                  color:"#fadf4f"
              },
              {
                  name: '已用',
                  y: data.storageTotal-data.availStorage,
                  color:"#f87b38"
              }
          ]
      }]
    });   
}

// 单个存储池-分配率占比图
function initsingleStorage_assigned_chart(data) {
    $('#singleStorage_assigned_chart'+viewModel.belongTab()).highcharts({
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
          name: '存储',
          data: [{
                  name: '未分配',
                  y: data.storageTotal-data.allocatedStorage,
                  color:"#fadf4f"
              },
              {
                  name: '已分配',
                  y: data.allocatedStorage,
                  color:"#f87b38"
              }
          ]
      }]
    });   
}

  function ViewModel(){
    this.summary = ko.observable({
      "storageTotal":'',
      "vdisk":'',
      "hostNum":'',
      "vmNum":'',
      "type":'',
      "path":'',
      "shared":''
    });
    this.belongTab = ko.observable(page.query.belongTab);
    this.hypervisor = ko.observable(page.query.hypervisor);
    this.loadData = function(){
      var self = this;
      RestServiceJs.query(BASE_URL+"/storagePool/"+page.query.id+"/summary",{"dcId":CVM_PAD.dcId,"hypervisor":page.query.hypervisor},function(data){
      //$$.getJSON("tpl/storage/summary.json?id="+page.query.id, function(data){
        myApp.pullToRefreshDone();
        switch(data.type){
          case 'udev':
            data.type = '可移动存储';
            break;
          case 'lvm':
            data.type = '本地LVM卷组';
            break;
          case 'ext':
            data.type = '本地EXT';
            break;
          case 'nfs':
            data.type = 'NFS共享存储';
            break;
          case 'lvmoiscsi':
            data.type = '软件ISCSI';
            break;
          case 'lvmohba':
            data.type = '硬件HBA';
            break;
          case 'NFS':
            data.type = 'NFS共享存储';
            break;
          case 'FCSAN':
            data.type = 'FC SAN';
            break;
          case 'iSCSI':
            data.type = 'iSCSI';
            break;
          case 'LOCAL':
            data.type = '本地存储';
            break;
          case 'UNKNOW':
            data.type = '未知';
            break;
          case 'LVPOOL':
            data.type = '本地LVM卷组';
            break;
          case 'SVC_POOL':
            data.type = 'SVC存储池';
            break;
          case 'EMC_POOL':
            data.type = 'EMC VNX存储池';
            break;
          case 'DS4700_POOL':
            data.type = 'DS4700存储池';
            break;
          case 'NETAPP_POOL':
            data.type = 'NETAPP FAS存储池';
            break;
          default:
            data.type = '未知';
            break;
        }
        self.summary(data);

        initsingleStorage_use_chart(data);
        if(page.query.hypervisor=='winserver'){
          initsingleStorage_assigned_chart(data);
        }
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