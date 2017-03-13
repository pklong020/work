myApp.onPageInit("vm-performance", function(page) {

// 单个虚拟机内存使用率曲线
function initMemoryUse_chart(data, xAxis) {
    $('#memoryUse_chart'+viewModel.belongTab()).highcharts({
        title: {
            text: '内存使用率(%)',
        },
        credits:{
          enabled: false,
          text : ""
        },  
        colors: [
            '#E35733', // orange
            '#4c97d7', // blue
            '#52d74c', // green
            '#e268de' // purple
        ],               
        xAxis: {
            categories: xAxis
        },
        yAxis: {
            title: {
                text: ''
            }
        },        
        tooltip: {
            pointFormat:'<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y:.2f}%</b>'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0,
            itemMarginTop: 10
        },
        series: [data]
    });
}
// 单个虚拟机cpu总量使用率曲线
function initcpuUse_chart1(data,xAxis) {
    $('#cpuUse_chart1'+viewModel.belongTab()).highcharts({
        title: {
            text: 'CPU使用率(%)',
        },
        credits:{
          enabled: false,
          text : ""
        },  
        colors: [
            '#E35733', // orange
            '#4c97d7', // blue
            '#52d74c', // green
            '#e268de' // purple
        ],               
        xAxis: {
            categories: xAxis
        },
        yAxis: {
            title: {
                text: ''
            },
        },        
        tooltip: {
            pointFormat:'<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y:.2f}%</b>'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0,
            itemMarginTop: 10
        },
        series: [data]
    });
}
// 单个虚拟机cpu线程使用率曲线
function initcpuUse_chart2(data,xAxis) {
    $('#cpuUse_chart2'+viewModel.belongTab()).highcharts({
        title: {
            text: 'CPU使用率(%)',
        },
        credits:{
          enabled: false,
          text : ""
        },  
        colors: [
            '#E35733', // orange
            '#4c97d7', // blue
            '#52d74c', // green
            '#e268de' // purple
        ],               
        xAxis: {
            categories: xAxis
        },
        yAxis: {
            title: {
                text: ''
            },
        },        
        tooltip: {
            pointFormat:'<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y:.2f}%</b>'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0,
            itemMarginTop: 10
        },
        series: data
    });
}

// 单个虚拟机磁盘使用率曲线
function initDiskUse_chart(data,xAxis) {
    $('#diskUse_chart'+viewModel.belongTab()).highcharts({
        title: {
            text: '磁盘使用率(kb/s)',
        },
        credits:{
          enabled: false,
          text : ""
        },  
        colors: [
            '#E35733', // orange
            '#4c97d7', // blue
            '#52d74c', // green
            '#e268de' // purple
        ],               
        xAxis: {
            categories: xAxis
        },
        yAxis: {
            title: {
                text: ''
            },
        },        
        tooltip: {
            pointFormat:'<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y:.2f}kb/s</b>'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0,
            itemMarginTop: 10
        },
        series: data
    });
}

// 单个虚拟机网络使用率曲线
function initNetwork_chart(data,xAxis) {
    $('#network_chart'+viewModel.belongTab()).highcharts({
        title: {
            text: '网络速率(kb/s)',
        },
        credits:{
          enabled: false,
          text : ""
        },  
        colors: [
            '#E35733', // orange
            '#4c97d7', // blue
            '#52d74c', // green
            '#e268de' // purple
        ],               
        xAxis: {
            categories: xAxis
        },
        yAxis: {
            title: {
                text: ''
            },
        },        
        tooltip: {
            pointFormat:'<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y:.2f}kb/s</b>'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0,
            itemMarginTop: 10
        },
        series: data
    });
}

  function ViewModel(){
    var self = this;
    this.name = ko.observable(page.query.name);
    this.hypervisor = ko.observable(page.query.hypervisor);
    this.isShowCharts = ko.observable(true);
    this.vcpu = ko.observable('');
    this.belongTab = ko.observable(page.query.belongTab);

    this.timeItems = ko.observableArray(['最近十分钟','最近一小时','最近一天','最近一周','最近一个月','最近一年','自定义']);
    this.timeSelected = ko.observable("最近一小时");
    this.showSelect = ko.observable(false);

    this.setTimeSelected = function(val){
      self.timeSelected(val);
      var type="",start="",end="";
      switch(val){
        case '最近十分钟':
          type = 'cunstom';
          start = (Date.parse(new Date())-600000);
          end = Date.parse(new Date());
          break;
        case '最近一小时':
          type = "hour";
          start = (Date.parse(new Date())-3600000);
          end = Date.parse(new Date());
          break;
        case '最近一天':
          type = "day";
          start = (Date.parse(new Date())-86400000);
          end = Date.parse(new Date());
          break;
        case '最近一周':
          type = "week";
          start = (Date.parse(new Date())-604800000);
          end = Date.parse(new Date());
          break;
        case '最近一个月':
          type = "month";
          start = (Date.parse(new Date())-2592000000);
          end = Date.parse(new Date());
          break;
        case '最近一年':
          type = "year";
          start = (Date.parse(new Date())-31536000000);
          end = Date.parse(new Date());
          break;
        case '自定义':
          type = "cunstom";
          start = "";
          end = "";
          $$('#vmPerformanceDate').val('请选择时间范围');
          break;
      }
      if(type=="cunstom" && start=="" && end==""){
        self.showSelect(true);
      }else{
        self.showSelect(false);
        self.loadData(type,start,end);
      }
    }
    this.loadData = function(type,start,end){
      RestServiceJs.query(BASE_URL+"/vm/"+page.query.id+"/statics",{"dcId":CVM_PAD.dcId,"hypervisor":page.query.hypervisor,"type":type,"startTime":start||"","endTime":end||""},function(data){
        if(data.exceptionMessage){
          myApp.alert(data.exceptionMessage);
          return;
        }
        var startTime = new Date(Number(data.meta.start+"000"));
        var endTime = new Date(Number(data.meta.end+"000"));
        var timeRange = endTime - startTime;
        var isDay = false;
        if(timeRange > 86400000){
          isDay = true;
        }
        var Range = [];
        var calendarRange = myApp.calendar({
            input: '#vmPerformanceDate',
            dateFormat: 'yyyy.mm.dd',
            inputReadOnly: true,
            rangePicker: true,
            maxDate:new Date(),
            monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            dayNames: ['周日','周一','周二','周三','周四','周五','周六'],
            dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
            onChange:function(p,val,n){
              Range = val;
            },
            onClose:function(p){
              if(Range.length==2){
                self.loadData('cunstom',Range[0],Range[1]);
              }else if(Range.length==1){
                myApp.alert('请选择一个时间范围！',function(){
                  calendarRange.open();
                });
              }
            }
        });

        var xAxis = [];
        if(page.query.hypervisor=='winserver'){
          var memory = {
                "name":"内存使用率",
                "data":[]
              }
          var cpus = [];
          var cpu = {
                "name":"CPU使用率",
                "data":[]
              }
          var disks = [];
          var networks = [];
          var memoryIndex = 0;
          var memoryFreeIndex = 0;
          var diskIndex = [];
          var networkIndex = [];
          $.each(data.meta.legend,function(index,val){
            var items = val.split(':');
            if(items[items.length-1].indexOf('cpu')>-1){
              var val1 = items[items.length-1];
              cpus.push({
                "name":val1+"使用率",
                "data":[]
              })
            }
            if(items[items.length-1].indexOf('vbd')>-1){
              var val2 = items[items.length-1];
              disks.push({
                "name":val2,
                "data":[]
              });
              diskIndex.push(index);
            }
            if(items[items.length-1].indexOf('vif')>-1){
              var val3 = items[items.length-1];
              networks.push({
                "name":val3.indexOf('tx')>-1 ? '上行速率' : '下行速率',
                "data":[]
              });
              networkIndex.push(index);
            }
            if(items[items.length-1].indexOf('memory')>-1&&items[items.length-1].indexOf('memory_internal_free')<0){
              memoryIndex = index;
            }
            if(items[items.length-1].indexOf('memory_internal_free')>-1){
              memoryFreeIndex = index;
            }
          });
          for(var i=data.data.length-1;i>-1;i--){
            var mem_total = Number(data.data[i].v[memoryIndex])/1024;
            var mem_free = Number(data.data[i].v[memoryFreeIndex]);
            memory.data.push((mem_total-mem_free)/mem_total*100);
            xAxis.push(getDates(data.data[i].t, isDay));
            cpu.data[i] = 0;
            $.each(cpus,function(index,val){
              cpus[index].data.push(Number(data.data[i].v[index])*100);
              cpu.data[i] = cpu.data[i] + Number(data.data[i].v[index])*100;
            });
            cpu.data[i] = cpu.data[i]/Number(self.vcpu());
            $.each(disks,function(index,val){
              var thisIndex = diskIndex[index];
              disks[index].data.push(Number(data.data[i].v[thisIndex])/1024);
            });
            $.each(networks,function(index,val){
              var thisIndex = networkIndex[index];
              networks[index].data.push(Number(data.data[i].v[thisIndex])/1024);
            });
          }
          cpu.data.reverse();
          cpus.reverse();
          cpus = cpus.slice(0,Number(self.vcpu()));
          initMemoryUse_chart(memory,xAxis);
          initcpuUse_chart1(cpu,xAxis);
          initcpuUse_chart2(cpus,xAxis);
          initDiskUse_chart(disks,xAxis);
          initNetwork_chart(networks,xAxis);
        }
        if(page.query.hypervisor=='VMware'){
          var memory = {
                "name":"内存使用率",
                "data":[]
              }
          var cpu = {
                "name":"CPU使用率",
                "data":[]
              }
          var disks = [];
          var networks = [];
          var VMwareDateNum = data.data.CPU_PERCENT_COUNTER.length;
          var timeInterval = (endTime-startTime)/VMwareDateNum;
          for(var i=0;i<VMwareDateNum;i++){
            var date = new Date(Number(data.meta.start+"000")+timeInterval*i);
            xAxis.push(getDates(date, isDay));
          }
          for(item in data.data){
            $.each(data.data[item],function(index,val){
              if(val=='null'){
                data.data[item][index] = null;
              }else{
                data.data[item][index] = Number(val);
              }
            })
            if(item.indexOf('CPU_PERCENT')>-1){
              cpu.data = data.data[item];
            }
            if(item.indexOf('MEMORY_PERCENT')>-1){
              memory.data = data.data[item];
            }
            if(item.indexOf('VIRTUAL_DISK_READING')>-1){
              $.each(data.data[item],function(index,val){
                data.data[item][index] = Number(val);
              });
              disks.push({
                'name':item.split('&')[1]+'读取',
                'data':data.data[item]
              })
            }
            if(item.indexOf('VIRTUAL_DISK_WRITING')>-1){
              $.each(data.data[item],function(index,val){
                data.data[item][index] = Number(val);
              });
              disks.push({
                'name':item.split('&')[1]+'写入',
                'data':data.data[item]
              })
            }
            if(item.indexOf('NETWORK_RECEIVED')>-1){
              networks.push({
                'name':item.split('&')[1]+'下行',
                'data':data.data[item]
              })
            }
            if(item.indexOf('NETWORK_TRANSMITTED')>-1){
              networks.push({
                'name':item.split('&')[1]+'上行',
                'data':data.data[item]
              })
            }
          }
          initMemoryUse_chart(memory,xAxis);
          initcpuUse_chart1(cpu,xAxis);
          initDiskUse_chart(disks,xAxis);
          initNetwork_chart(networks,xAxis);
        }
        
      }); 
    };
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);
  window.vm_performance_viewModel = viewModel;

  $$('#vm-times-show').on('click', function(event) {
    myApp.popover($("#popover-vm-times").html(), event.target)
  });
});

function getDates(s, isDay){
  var date = s.length == 10 ? new Date(Number(s)*1000) : new Date(Number(s));
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();
  var hour = date.getHours()<10 ? '0'+date.getHours() : date.getHours();
  var minutes = date.getMinutes()<10 ? '0'+date.getMinutes() : date.getMinutes();
  var seconds = date.getSeconds()<10 ? '0'+date.getSeconds() : date.getSeconds();
  if(isDay){
    return year+'-'+month+'-'+day+' '+hour+':'+minutes+':'+seconds;
  }
  return hour+':'+minutes+':'+seconds;
}