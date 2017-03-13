var BASE_URL = '';
myApp.onPageInit("login", function(page) {
  function ViewModel(){
    var lastTime = parseInt(Storage.getItem('cacheTime'));
    var timeTakes = (new Date().getTime() - lastTime)/86400000;
    if(timeTakes>7){//day
      Storage.removeItem("userInfo");
      Storage.removeItem("cacheTime");
    }
    
    var baseNet = Storage.getItem("baseNet");
    var userInfo = JSON.parse(Storage.getItem("userInfo"));
    var Required = false;
    this.network = baseNet ? ko.observable(baseNet) : ko.observable("http://10.10.111.204:8095");
    this.username = userInfo ? ko.observable(userInfo.account) : ko.observable("demo");
    this.password = userInfo ? ko.observable(userInfo.password) : ko.observable("demo");
    this.dashboard = null;
    this.login = function(){
      if(this.network()==""){
        myApp.alert('请填写网络！');
        return;
      }
      if(this.username()==""){
        myApp.alert('用户名不能为空！');
        return;
      }
      if(this.password()==""){
        myApp.alert('密码不能为空！');
        return;
      }
      var self = this;

      function goLogin(data){
        data.password = self.password();
        USER_INFO = data;
        Storage.setItem("userInfo",JSON.stringify(data));
        Storage.setItem("cacheTime",new Date().getTime());

        myApp.closeModal('.login-screen.modal-in');
        if(!this.dashboard){
          this.dashboard = myApp.addView('#view-dashboard', {dynamicNavbar: false,domCache: true});
        }
        myApp.showAssisTime = true;
        this.dashboard.router.load({url: "tpl/dashboard.html",animatePages: false});
        myApp.popup('.popup-dashboard');

        if(myApp.Login_Again){
          window.overview_viewModel.loadData();
          window.overview_viewModel.loadDatacenters();
          window.overview_viewModel.changeDc('');
          $$('#backToDasboard').hide();
          window.Assistive_viewModel.setHigh();
        }

        setTimeout(function(){
          $$("#assistive").show();
        },2000);
      }

      if(this.username().toLowerCase()=="demo"&&this.password().toLowerCase()=="demo"){
        BASE_URL = "demoapi";
        return goLogin({"name":"测试用户","id":1,"account":"demo","password":"demo","flag":true,"token":"demo"});
      }

      Storage.setItem("baseNet",this.network());
      BASE_URL = Storage.getItem("baseNet") + "/pad/v3.0";
      
      checkNetWork(1,function(){
        $.ajax({
          type: 'POST',  
          url: BASE_URL+"/user/login",  
          data: JSON.stringify({
            "account": self.username(),
            "password": self.password()
          }),
          processData: false,  
          dataType: 'json',
          contentType: 'application/json',
          success: function(data){
            goLogin(data);
          },  
          error: function(req, status, ex){
            checkNetWork(1,function(){
              if(!navigator.onLine){
                myApp.alert('当前网络不可用，请检查您的网络设置！');
                return;
              }
              if(req){
                if(req.responseText){
                  if(JSON.parse(req.responseText).exception == 'sys.rest.connect.error'){
                    myApp.alert('请检查CSC服务是否正常！');
                  }else{
                    myApp.alert(JSON.parse(req.responseText).exception);
                  }
                }else if(req.statusText=='timeout'){
                  myApp.alert('请求超时！');
                }else{
                  myApp.alert('请检查服务器环境是否启动/网络地址填写是否正确！');
                }
              }else{
                myApp.alert('未知错误！');
              }
            });
          },  
          timeout:60000  
        });
      });
        
      
    }
  }
  ko.applyBindings(new ViewModel(), $$(page.container)[0]);
});
