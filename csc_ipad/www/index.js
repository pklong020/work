'use strict'

var Storage = window.localStorage;
var CVM_PAD = {};
var USER_INFO = {};

$.ajaxSetup({
  cache: false
})
var PAGE_SIZE = 12;

var $$ = Dom7;
var myApp = new Framework7({
  animateNavBackIcon: true,
  modalTitle: '',
  cache: false,
  cacheDuration: 0,//1000 * 60 * 1,
  cacheIgnoreGetParameters: true,
  allowDuplicateUrls: true,
  pushState: false,
  modalButtonOk:"确定",
  modalButtonCancel:"取消"
});

var pageInitNUM = 0;
$$(document).on('pageInit', function (e) {
  var page = e.detail.page;
  if (page.name === 'login') {
    myApp.isInLoginPage = true;
  }else{
    myApp.isInLoginPage = false;
  }

  // pageInitNUM = pageInitNUM+1;
  // if(pageInitNUM>1) return;
  // checkNetWork(1,function(){
  //   pageInitNUM = 0;
  // })
})
var getTheTime = function(minseconds){
  var seconds = minseconds/1000;
  var day = parseInt(seconds/86400);
  var hour = parseInt((seconds-86400*day)/3600);
  var minute = parseInt((seconds-86400*day-hour*3600)/60);
  var second = parseInt(seconds-86400*day-hour*3600-minute*60);
  return day+'天'+hour+'小时'+minute+'分'+second+'秒'
}

$$(document).on('ajaxStart', function (e) {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function () {
    myApp.hideIndicator();
});

var view_home, view_pool, view_host, view_vm;
var is_reload = false;

function initPages(event){
  view_home                     = view_home || myApp.addView("#view-home",            {dynamicNavbar: false,domCache: true,linksView: "#view-home"});
  view_pool                 = view_pool     || myApp.addView("#view-pool",        {dynamicNavbar: false,domCache: true,linksView: "#view-pool"});

  view_home.router.load({            url: "tpl/home/index.html",animatePages: false, reload:is_reload});  
  view_pool.router.load({        url: "tpl/pool/index.html",animatePages: false, reload:is_reload});

  myApp.showTab("#view-home");

  is_reload = true;
}


$(function(){

  var infos = eval('(' + Storage.getItem('userInfo') + ')');
  if(infos&&infos.token&&infos.tokenKey){
    USER_INFO = infos;
    BASE_URL = Storage.getItem("baseNet") + "/ipad/v1";
    initPages();
  }else{
    myApp.addView('#view-login', {dynamicNavbar: false,domCache: true}).router.load({url: 'tpl/login.html',animatePages: false});
    myApp.loginScreen();
  }

  /*filter*/
  function ViewModel(){
    var self = this;
    this.page = ko.observable("");
    this.changePage = function(str){
      this.page(str);
    }
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, document.getElementById("indexFilter"));
  window.indexFilter_viewModel = viewModel;


  $$('.dashboardlogout').on('click', function (){
    myApp.confirm('确定退出当前用户吗？',function(){
      myApp.Login_Again = true;
      myApp.addView('#view-login', {dynamicNavbar: false,domCache: true}).router.load({url: 'tpl/login.html',animatePages: false});
      Storage.removeItem("userInfo");
      USER_INFO.password = '';
      USER_INFO.token = '';
      USER_INFO.tokenKey = '';
      Storage.setItem("userInfo",JSON.stringify(USER_INFO));
      myApp.hidePreloader();
      reSetAllRequets();
      myApp.loginScreen();
    });
  });
});

/*菜单tab页加载机制 start*/
var clickedBusness = false;
function clickBusness(){
    window.indexFilter_viewModel.changePage('business');
    if(clickedBusness) return;
    window.business_index_viewModel.loadData();
    clickedBusness = true;
}
var clickedPool = false
function clickPool(){
    window.indexFilter_viewModel.changePage('pool');
    if(clickedPool) return;
    window.pool_index_viewModel.loadData();
    clickedPool = true;
}
var clickedHost = false;
function clickHost(){
    window.indexFilter_viewModel.changePage('host');
    if(clickedHost) return;
    window.indexFilter_host_viewModel.getResPools();
    clickedHost = true;
}
var clickedVm = false;
function clickVm(){
    window.indexFilter_viewModel.changePage('vm');
    if(clickedVm) return;
    window.vm_index_viewModel.loadData();
    clickedVm = true;
}
var clickedStorage = false;
function clickStorage(){
    window.indexFilter_viewModel.changePage('storage');
    if(clickedStorage) return;
    window.storage_index_viewModel.loadData();
    clickedStorage = true;
}
var clickedSetting = false;
function clickSetting(){
    if(clickedSetting) return;
    window.settings_profile_viewModel.loadInfo();
    clickedSetting = true;
}

function reSetAllRequets(){
  clickedPool = false;
  clickedHost = false;
  clickedVm = false;
  clickedStorage = false;
  clickedSetting = false;
}
/*菜单tab页加载机制 end*/

/*内容tab页加载机制 start*/
var hostListclicked = false;
function innerTabclick_host(){
  window.poolShow_index_viewModel.changeNav('host');
  if(hostListclicked) return;
  hostListclicked = true;
  window.hostList_viewModel.loadData(false);
}
var vmListclicks = {
  "pool":false,
  "host":false,
  "business":false
}
function innerTabclick_vm(page){
  window.poolShow_index_viewModel.changeNav('vm');
  var clicked;
  switch(page){
    case 'pool':
      clicked = vmListclicks.pool;
      break;
    case 'host':
      clicked = vmListclicks.host;
      break;
    case 'business':
      clicked = vmListclicks.business;
      break;
  }
  if(clicked) return;
  switch(page){
    case 'pool':
      vmListclicks.pool = true;
      break;
    case 'host':
      vmListclicks.host = true;
      break;
    case 'business':
      vmListclicks.business = true;
      break;
  }
  window.vmList_viewModel.loadData(false);
}
var storageListclicks = {
  "pool":false,
  "host":false
}
function innerTabclick_storage(page){
  var clicked;
  switch(page){
    case 'pool':
      clicked = storageListclicks.pool;
      break;
    case 'host':
      clicked = storageListclicks.host;
      break;
  }
  if(clicked) return;
  switch(page){
    case 'pool':
      storageListclicks.pool = true;
      break;
    case 'host':
      storageListclicks.host = true;
      break;
  }
  window.storageList_viewModel.loadData();
}
var diskListclicks = {
  "vm":false,
  "storage":false
}
function innerTabclick_disk(page){
  var clicked;
  switch(page){
    case 'vm':
      clicked = diskListclicks.vm;
      break;
    case 'storage':
      clicked = diskListclicks.storage;
      break;
  }
  if(clicked) return;
  switch(page){
    case 'vm':
      diskListclicks.vm = true;
      break;
    case 'storage':
      diskListclicks.storage = true;
      break;
  }
  window.diskList_viewModel.loadData();
}
var vmPerformanceClicked = false
function innerTabclick_performance(hypervisor,state){
  if(vmPerformanceClicked) return;
  vmPerformanceClicked = true;
  if(hypervisor == 'PowerVM'||state!='运行中'){
    window.vm_performance_viewModel.isShowCharts(false);
  }else{
    window.vm_performance_viewModel.setTimeSelected('最近一小时');
  }
}
/*内容tab页加载机制 end*/