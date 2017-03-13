myApp.onPageInit("storage-index", function(page) {

// 存储池-是否共享占比图
function initStorage_share_chart(share, total) {
    $('#storage_share_chart').highcharts({
      chart: {
          marginTop: 10,
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
        align: 'right',
        verticalAlign: 'middle',
        itemMarginTop: 10,
        backgroundColor:"none",
        borderColor:"none",
        itemStyle: {
          
          fontWeight: 'normal'
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
                  name: '共享',
                  y: share,
                  color:"#fadf4f"
              },
              {
                  name: '本地',
                  y: total-share,
                  color:"#f87b38"
              }
          ]
      }]
    });   
}


// 存储池-使用率占比图
function initStorage_use_chart(free, total) {
    $('#storage_use_chart').highcharts({
      chart: {
          marginTop: 10,
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
        align: 'right',
        verticalAlign: 'middle',
        itemMarginTop: 10,
        backgroundColor:"none",
        borderColor:"none",
        itemStyle: {
          
          fontWeight: 'normal'
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
                  y: free,
                  color:"#fadf4f"
              },
              {
                  name: '已用',
                  y: total-free,
                  color:"#f87b38"
              }
          ]
      }]
    });   
}

  function ViewModel(){
    this.hypervisor = ko.observable("");
    this.resPoolId = ko.observable("");
    this.hostId = ko.observable("");
    this.dataList = ko.observableArray([]);
    this.dcName = ko.observable(CVM_PAD.dcName);
    this.infos = ko.observable({
      "totalSize":'',
      "sharedSize":'',
      "local":'',
      "used":'',
      "availSize":'',
      "svc":'',
      "nfs":'',
      "storage":''
    });

    this.loading = false;
    this.page = 1;
    this.noMore = ko.observable();
    this.loadData = function(is_loadMore, hypervisor, resPoolId, hostId){
      if(hypervisor){
        this.hypervisor(hypervisor);
      }else{
        this.hypervisor("");
      }
      if(resPoolId){
        this.resPoolId(resPoolId);
      }else{
        this.resPoolId("");
      }
      if(hostId){
        this.hostId(hostId);
      }else{
        this.hostId("");
      }
      var self = this;
      if (self.loading) return;
      self.loading = true;
      if(!is_loadMore) self.page = 1;

      RestServiceJs.query(BASE_URL+"/storagePool",{"dcId":CVM_PAD.dcId,"resourcePoolId":this.resPoolId(),"hostId":this.hostId(),"hypervisor":this.hypervisor(), "firstResult":(self.page-1)*PAGE_SIZE,"maxResult":PAGE_SIZE},function(data){
      //$$.getJSON("tpl/storage/index.json?id="+page.query.id+"&page="+self.page,function(data){
        data.totalSize = Number((Number(data.totalSize)/1024).toFixed(2));
        data.sharedSize = Number(data.sharedSize/1024);
        data.availSize = Number(data.availSize/1024);
        self.infos(data);
        self.loading = false;
        if(!is_loadMore){
          myApp.pullToRefreshDone();
          myApp.detachInfiniteScroll($$(page.container).find('.infinite-scroll'));
          myApp.attachInfiniteScroll($$(page.container).find('.infinite-scroll'));
          self.dataList.removeAll();
          self.noMore(false);
          if(data.data.length < PAGE_SIZE) self.noMore(true);

          initStorage_share_chart(data.sharedSize,data.totalSize);
          initStorage_use_chart(data.availSize,data.totalSize);
        }
        for(var i=0; i<data.data.length; i++){
          switch(data.data[i].type){
            case 'udev':
              data.data[i].type = '可移动存储';
              break;
            case 'lvm':
              data.data[i].type = '本地LVM卷组';
              break;
            case 'ext':
              data.data[i].type = '本地EXT';
              break;
            case 'nfs':
              data.data[i].type = 'NFS共享存储';
              break;
            case 'lvmoiscsi':
              data.data[i].type = '软件ISCSI';
              break;
            case 'lvmohba':
              data.data[i].type = '硬件HBA';
              break;
            case 'NFS':
              data.data[i].type = 'NFS共享存储';
              break;
            case 'FCSAN':
              data.data[i].type = 'FC SAN';
              break;
            case 'iSCSI':
              data.data[i].type = 'iSCSI';
              break;
            case 'LOCAL':
              data.data[i].type = '本地存储';
              break;
            case 'UNKNOW':
              data.data[i].type = '未知';
              break;
            case 'LVPOOL':
              data.data[i].type = '本地LVM卷组';
              break;
            case 'SVC_POOL':
              data.data[i].type = 'SVC存储池';
              break;
            case 'EMC_POOL':
              data.data[i].type = 'EMC VNX存储池';
              break;
            case 'DS4700_POOL':
              data.data[i].type = 'DS4700存储池';
              break;
            case 'NETAPP_POOL':
              data.data[i].type = 'NETAPP FAS存储池';
              break;
            default:
              data.data[i].type = '未知';
              break;
          }
          switch(data.data[i].state){
            case 'plugException':
              data.data[i].state='挂载异常';
              data.data[i].stateCss='orange';
              break;
            case 'OK':
              data.data[i].state='活动';
              data.data[i].stateCss='green';
              break;
            case 'unPlug':
              data.data[i].state='未挂载';
              data.data[i].stateCss='gray';
              break;
            case 'INACTIVE':
              data.data[i].state='未活动';
              data.data[i].stateCss='gray';
              break;
            case 'Deleting':
              data.data[i].state='删除中';
              data.data[i].stateCss='orange';
              break;
            case 'UnPluging':
              data.data[i].state='卸载中';
              data.data[i].stateCss='orange';
              break;
            case 'Pluging':
              data.data[i].state='挂载中';
              data.data[i].stateCss='orange';
              break;
            default:
              data.data[i].state='异常';
              data.data[i].stateCss='orange';
              break;
          }
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
  window.storage_index_viewModel = viewModel;

  $$(page.container).find('.pull-to-refresh-content').on('refresh', function (e) {
    viewModel.loadData(false, viewModel.hypervisor(), viewModel.resPoolId(),viewModel.hostId());
  });
  $$(page.container).find('.infinite-scroll').on('infinite', function () {
    viewModel.loadData(true, viewModel.hypervisor(), viewModel.resPoolId(),viewModel.hostId());
  });  
  
});





