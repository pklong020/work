myApp.onPageInit("dashboard", function(page) {
  $$('.dashboardlogout').on('click', function (){
    myApp.confirm('确定退出当前用户吗？',function(){
      myApp.Login_Again = true;
      myApp.showAssisTime = false;
      myApp.addView('#view-login', {dynamicNavbar: false,domCache: true}).router.load({url: 'tpl/login.html',animatePages: false});
      Storage.removeItem("userInfo");
      USER_INFO.password = '';
      USER_INFO.token = '';
      USER_INFO.tokenKey = '';
      Storage.setItem("userInfo",JSON.stringify(USER_INFO));
      myApp.closeModal('.popup.modal-in');
      $$("#assistive").hide();
      window.overview_viewModel.whichDc('');
      myApp.hidePreloader();
      reSetAllRequets();
      myApp.loginScreen();
    });
  });
  // 首页cpu占比图
var initTotal_cpu_chart = function(data) {
    $(page.container).find('#total_cpu_chart').highcharts({
      chart: {
          marginTop: 10,
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
                  y: data.x86TotalCpu - data.x86UsedCpu,
                  color:"#ffd800"
              }
          ]
      }]
    });   
}
var initTotal_cpu_chart2 = function(data) {
    $(page.container).find('#total_cpu_chart2').highcharts({
      chart: {
          marginTop: 10,
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
        // labelFormatter: function() {  
        //             return this.name + '：' + '<span style="{color}">'+ this.y + 'GHz' + '</span>';  
        // }, 
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
                  y: data.pvmTotalCpu - data.pvmUsedCpu,
                  color:"#ffd800"
              }
          ]
      }]
    });   
}
// 首页内存占比图
var initTotal_memory_chart = function(data) {
    $(page.container).find('#total_memory_chart').highcharts({
      chart: {
          marginTop: 10,
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
}
// 首页存储占比图
var initTotal_storage_chart = function(data) {
  var init = 'GB';
  if(data.isTB) init = 'TB';
    $(page.container).find('#total_storage_chart').highcharts({
      chart: {
          marginTop: 10,
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
  function ViewModel(){
    this.datacenters = ko.observableArray([]);
    this.infos = ko.observable({
      "dcNum":0,
      "resPoolNumber":0,
      "busDomainNum":0,
      "hostNubmer":0,
      "projectNum":0,
      "vmNumber":0 
    });
    this.infos2 = ko.observable({
      "storageTotal":0,
      "x86TotalCpu":0,
      "pvmTotalCpu":0,
      "memoryTotal":0,
      "isTB":false
    });

    this.loading = false;
    var self = this;
    this.loadData = function(){
      //在这里实现总览数据的加载
      if(this.loading) return;
      this.loading = true;
      RestServiceJs.query(BASE_URL+"/overallDetails/resourceSummary",{},function(data){
        self.infos(data);
        self.loading = false;
        if(data.isDemo){
            myApp.closeModal('.popup.modal-in');
            $$('#backToDasboard').show();
            setTimeout(function(){
              popoverClose();
            },0)
        }
      });
      
      RestServiceJs.query(BASE_URL+"/overallDetails/resourceStat",{},function(data){
        data.x86TotalCpu = Number((Number(data.x86TotalCpu)/1000).toFixed(2));
        data.x86UsedCpu = Number((Number(data.x86UsedCpu)/1000).toFixed(2));
        data.memoryTotal = Number((Number(data.memoryTotal)/1024).toFixed(2));
        data.memoryUsed = Number((Number(data.memoryUsed)/1024).toFixed(2));
        data.pvmTotalCpu = Number(Number(data.pvmTotalCpu).toFixed(2));
        data.pvmUsedCpu = Number(Number(data.pvmUsedCpu).toFixed(2));
        if(Number(data.storageTotal)>1023){
          data.isTB = true;
          data.storageTotal = Number((Number(data.storageTotal)/1024).toFixed(2));
          data.storageUsed = Number((Number(data.storageUsed)/1024).toFixed(2));
        }else{
          data.isTB = false;
          data.storageTotal = Number(Number(data.storageTotal).toFixed(2));
          data.storageUsed = Number(Number(data.storageUsed).toFixed(2));
        }
        self.infos2(data);
        initTotal_cpu_chart(data);
        initTotal_cpu_chart2(data);
        initTotal_memory_chart(data);
        initTotal_storage_chart(data);
      },null,true);
    };
    this.loadDatacenters = function(){
      RestServiceJs.query(BASE_URL+"/datacenters",{},function(data){
        self.datacenters(data.data);
      });
    }
    this.whichDc = ko.observable('');
    this.changeDc = function(id){
      this.whichDc(id);
    }
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);

  viewModel.loadData();
  viewModel.loadDatacenters();

  window.overview_viewModel = viewModel;

  // function ViewModel2(){
  //   this.datacenters = ko.observableArray([]);
  //   this.loadDatacenters = function(){
  //     var self = this;
  //     RestServiceJs(BASE_URL+"/datacenters").query({},function(data){
  //       self.datacenters(data.data);
  //     });
  //   }

  // }
  // var viewModel2 = new ViewModel2();
  // ko.applyBindings(viewModel2, document.getElementById("assistive"));
  // viewModel2.loadDatacenters();
  // windows.assistive_viewModel = viewModel2;
});



var indexFilter_business, indexFilter_pool, indexFilter_host, indexFilter_vm, indexFilter_storage, view_home, view_business, view_pool, view_host, view_vm, view_storage, view_settings_left, view_settings_right;
var is_reload = false;

function popoverClose(event){
  var datacenter_id = event && $(event.target).attr("datacenter_id") || 1;
  var datacenter_name = event && $(event.target).attr("datacenter_name") || "demo数据中心";
  CVM_PAD.dcId = datacenter_id;
  CVM_PAD.dcName = datacenter_name;
  myApp.closeModal(".login-screen.modal-in");

  indexFilter_business=indexFilter_business || myApp.addView('#indexFilter-business', {dynamicNavbar: false,domCache: true,linksView: "#indexFilter-business"});
  indexFilter_pool       = indexFilter_pool || myApp.addView('#indexFilter-pool',     {dynamicNavbar: false,domCache: true,linksView: "#indexFilter-pool"});
  indexFilter_host       = indexFilter_host || myApp.addView('#indexFilter-host',     {dynamicNavbar: false,domCache: true,linksView: "#indexFilter-host"});
  indexFilter_vm           = indexFilter_vm || myApp.addView('#indexFilter-vm',       {dynamicNavbar: false,domCache: true,linksView: "#indexFilter-vm"});
  indexFilter_storage = indexFilter_storage || myApp.addView('#indexFilter-storage',  {dynamicNavbar: false,domCache: true,linksView: "#indexFilter-storage"});
  
  view_home                     = view_home || myApp.addView("#view-home",            {dynamicNavbar: false,domCache: true,linksView: "#view-home"});
  view_business             = view_business || myApp.addView("#view-business",        {dynamicNavbar: false,domCache: true,linksView: "#view-business"});
  view_pool                     = view_pool || myApp.addView("#view-pool",            {dynamicNavbar: false,domCache: true,linksView: "#view-pool"});
  view_host                     = view_host || myApp.addView("#view-host",            {dynamicNavbar: false,domCache: true,linksView: "#view-host"});
  view_vm                         = view_vm || myApp.addView("#view-vm",              {dynamicNavbar: false,domCache: true,linksView: "#view-vm"});
  view_storage              =  view_storage || myApp.addView("#view-storage",         {dynamicNavbar: false,domCache: true,linksView: "#view-storage"});
  view_settings_left   = view_settings_left || myApp.addView("#view-settings-left",   {dynamicNavbar: false,domCache: true,linksView: "#view-settings-main"});
  view_settings_right = view_settings_right || myApp.addView("#view-settings-main",   {dynamicNavbar: false,domCache: true,linksView: "#view-settings-main"});

  indexFilter_business.router.load({ url: "tpl/filter/filter_business.html",animatePages: false, reload:is_reload});
  indexFilter_pool.router.load({     url: "tpl/filter/filter_pool.html",animatePages: false, reload:is_reload});
  indexFilter_host.router.load({     url: "tpl/filter/filter_host.html",animatePages: false, reload:is_reload});
  indexFilter_vm.router.load({       url: "tpl/filter/filter_vm.html",animatePages: false, reload:is_reload});
  indexFilter_storage.router.load({  url: "tpl/filter/filter_storage.html",animatePages: false, reload:is_reload});

  view_home.router.load({            url: "tpl/home/index.html",animatePages: false, reload:is_reload});  
  view_business.router.load({        url: "tpl/business/index.html",animatePages: false, reload:is_reload});
  view_pool.router.load({            url: "tpl/pool/index.html",animatePages: false, reload:is_reload});
  view_host.router.load({            url: "tpl/host/index.html",animatePages: false, reload:is_reload});
  view_vm.router.load({              url: "tpl/vm/index.html",animatePages: false, reload:is_reload});
  view_storage.router.load({         url: "tpl/storage/index.html",animatePages: false, reload:is_reload});    
  view_settings_left.router.load({   url: "tpl/settings/index.html",animatePages: false, reload:is_reload});
  view_settings_right.router.load({  url: "tpl/settings/profile.html",animatePages: false, reload:is_reload});

  myApp.showTab("#view-home");

  is_reload = true;
}

