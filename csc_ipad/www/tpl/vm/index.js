myApp.onPageInit("vm-index", function(page) {

// 虚拟机-操作系统占比
function initVm_os_chart(os) {
    $(page.container).find('#vm_os_chart').highcharts({
        chart: {
            marginTop: 15,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            backgroundColor: "none"
        },
        title: {
            text: ''
        },
        credits:{
          enabled: false,
          text : ""
        }, 
        legend:{
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderColor:"none",
          labelFormat: '{name}：<b>{y}</b> 台',
          itemMarginTop: 10,
          itemStyle: {
            
            fontWeight: 'normal',
            fontSize:'12px'
          },          
        },
        plotOptions: {
            pie: {
                innerSize: '40%',
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
            name: '操作系统',
            data: [{
                  name: 'Windows',
                  y: os[0],
                  color:"#4791d2"
              },
              {
                  name: 'Linux',
                  y: os[1],
                  color:"#ffd800"
              },
              {
                  name: 'Other',
                  y: os[2],
                  color:"#5bd544"
              }
          ]
        }]
    });
}


// 虚拟机-状态占比
function initVm_status_chart(states) {
    $(page.container).find('#vm_status_chart').highcharts({
        chart: {
            marginTop: 15,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            backgroundColor: "none"
        },
        title: {
            text: ''
        },
        credits:{
          enabled: false,
          text : ""
        }, 
        legend:{
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderColor:"none",
          labelFormat: '{name}：<b>{y}</b> 台',
          itemMarginTop: 10,
          itemStyle: {
            
            fontWeight: 'normal',
            fontSize:'12px'
          },          
        },
        plotOptions: {
            pie: {
                innerSize: '40%',
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
            name: '状态',
            data: [{
                  name: '运行中',
                  y: states[0],
                  color:"#5bd544"
              },
              {
                  name: '已关机',
                  y: states[1],
                  color:"#ffd800"
              },
              {
                  name: '其他',
                  y: states[2],
                  color:"#4791d2"
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
    this.vmNum = ko.observable("");
    this.dcName = ko.observable(CVM_PAD.dcName);

    this.loading = false;
    this.page = 1;
    this.noMore = ko.observable();
    self.isInit = true;
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

      RestServiceJs.query(BASE_URL+"/vm",{"dcId":CVM_PAD.dcId,"resourcePoolId":this.resPoolId(),"ownerHostId":this.hostId(),"hypervisor":this.hypervisor(), "firstResult":(self.page-1)*PAGE_SIZE,"maxResult":PAGE_SIZE},function(data){
      //$$.getJSON("tpl/vm/index.json?id="+page.query.id+"&page="+self.page,function(data){
        self.loading = false;
        if(!is_loadMore){
          myApp.pullToRefreshDone();
          if(!self.isInit){
            myApp.attachInfiniteScroll($$(page.container).find('.infinite-scroll'));
          }
          self.isInit = false;
          self.dataList.removeAll();

          var os = [data.winVm,data.linuxVm,data.othersVm], status = [data.okStateVm,data.stoppeStatedVm,data.otherStatedVm];
          initVm_os_chart(os);
          initVm_status_chart(status);
          self.vmNum(data.size);

          self.noMore(false);
          if(data.data.length < PAGE_SIZE) self.noMore(true);
        }
        for(var i=0; i<data.data.length; i++){
          var reg1 = /windows/i,
              reg2 = /centos/i,
              reg3 = /redhat/i,
              reg4 = /suse/i;
          if(data.data[i].osVersion.match(reg1)&&data.data[i].osVersion.match(reg1).index>-1){
            data.data[i].type="windows";
          }else if(data.data[i].osVersion.match(reg2)&&data.data[i].osVersion.match(reg2).index>-1){
            data.data[i].type="centos";
          }else if(data.data[i].osVersion.match(reg3)&&data.data[i].osVersion.match(reg3).index>-1){
            data.data[i].type="redhat";
          }else if(data.data[i].osVersion.match(reg4)&&data.data[i].osVersion.match(reg4).index>-1){
            data.data[i].type="suse";
          }else{
            data.data[i].type="others";
          }
          switch(data.data[i].state){
            case 'STOPPED':
              data.data[i].state='已关机';
              data.data[i].stateCss='gray';
              break;
            case 'OK':
              data.data[i].state='运行中';
              data.data[i].stateCss='green';
              break;
            case 'disconnected':
              data.data[i].state='已断开';
              data.data[i].stateCss='gray';
              break;
            case 'STOPPING':
              data.data[i].state='正在关机';
              data.data[i].stateCss='orange';
              break;
            case 'STARTING':
              data.data[i].state='正在开机';
              data.data[i].stateCss='yellow';
              break;
            case 'DELETING':
              data.data[i].state='正在删除';
              data.data[i].stateCss='orange';
              break;
            case 'RESTARTING':
              data.data[i].state='正在重启';
              data.data[i].stateCss='yellow';
              break;
            case 'EXECUTING':
              data.data[i].state='正在部署';
              data.data[i].stateCss='yellow';
              break;
            case 'UNKNOWN':
              data.data[i].state='未知';
              data.data[i].stateCss='gray';
              break;
            case 'SUSPENDED':
              data.data[i].state='挂起';
              data.data[i].stateCss='orange';
              break;
            case 'RESIZING':
              data.data[i].state='调整中';
              data.data[i].stateCss='orange';
              break;
            case 'SUSPENDING':
              data.data[i].state='挂起中';
              data.data[i].stateCss='orange';
              break;
            case 'RESUMEING':
              data.data[i].state='恢复中';
              data.data[i].stateCss='orange';
              break;
            case 'CONVERTING':
              data.data[i].state='转换中';
              data.data[i].stateCss='orange';
              break;
            case 'RELOCATING':
              data.data[i].state='迁移中';
              data.data[i].stateCss='orange';
              break;
            case 'REVERTING':
              data.data[i].state='还原中';
              data.data[i].stateCss='orange';
              break;
            case 'SAVE_AS_TEMPLATE':
              data.data[i].state='另存为模板中';
              data.data[i].stateCss='orange';
              break;
            default:
              data.data[i].state='异常';
              data.data[i].stateCss='orange';
              break;
          }
          data.data[i].memory = Number((Number(data.data[i].memory)/1024).toFixed(2));
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
  window.vm_index_viewModel = viewModel;

  $$(page.container).find('.pull-to-refresh-content').on('refresh', function (e) {
    viewModel.loadData(false, viewModel.hypervisor(), viewModel.resPoolId(),viewModel.hostId());
  });
  $$(page.container).find('.infinite-scroll').on('infinite', function () {
    viewModel.loadData(true, viewModel.hypervisor(), viewModel.resPoolId(),viewModel.hostId());
  });  
  
});





