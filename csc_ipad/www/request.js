var requestNUM = 0;
var errerNUM = [0,0,0,0,0];
var interAlert = false;

function backToLogin(res){
  requestNUM = 0;
  myApp.showAssisTime = false;
  myApp.Login_Again = true;
  reSetAllRequets();
  myApp.hidePreloader();
  // window.overview_viewModel.whichDc('');
  if(!myApp.isInLoginPage) myApp.addView('#view-login', {dynamicNavbar: false,domCache: true}).router.load({url: 'tpl/login.html',animatePages: false});
  interAlert = false;
  // $$("#assistive").hide();
  Storage.removeItem("userInfo");
  USER_INFO.password = '';
  USER_INFO.token = '';
  USER_INFO.tokenKey = '';
  Storage.setItem("userInfo",JSON.stringify(USER_INFO));
  if(res&&res.tokenCheck==false){
    myApp.alert('您的登录已过期，请重新登录！',function(){
      myApp.closeModal('.popup.modal-in');
      return myApp.loginScreen();
    });
  }else{
    myApp.closeModal('.popup.modal-in');
    return myApp.loginScreen();
  }
}
function checkNetWork(thisRequest,callback){
  if(callback){
    setTimeout(function(){
      if(navigator.onLine){
        callback();
      }else{
        if(thisRequest>1||interAlert) return;
        myApp.alert('当前网络不可用，请检查您的网络设置！',function(){
          return backToLogin();
        });
      }
    },200);
  }else{
    if(!navigator.onLine){
      if(interAlert) return;
      interAlert = true;
      myApp.alert('当前网络不可用，请检查您的网络设置！',function(){
        return backToLogin();
      });
    }
  }
}
function alertErrer(req, status, ex){
  checkNetWork(1,function(){
    if(req){
      if(req.responseText){
        if(JSON.parse(req.responseText).exception == 'sys.rest.connect.error'){
          errerNUM[0]++;
          if(errerNUM[0]==1){
            myApp.alert('请检查CSC服务是否正常！',function(){
              errerNUM[0]=0;
            });
          }
        }else{
          errerNUM[1]++;
          if(errerNUM[1]==1){
            myApp.alert(JSON.parse(req.responseText).exception,function(){
              errerNUM[1]=0;
            });
          }
        }
      }else if(req.statusText=='timeout'){
        errerNUM[2]++;
        if(errerNUM[2]==1){
          myApp.alert('请求超时！',function(){
            errerNUM[2]=0;
          });
        }
      }else{
        errerNUM[3]++;
        if(errerNUM[3]==1){
          myApp.alert('无法连接到服务器！',function(){
            errerNUM[3]=0;
          });
        }
      }
    }else{
      errerNUM[4]++;
      if(errerNUM[4]==1){
        myApp.alert('未知错误！',function(){
          errerNUM[4]=0;
        });
      }
    }
  });
}
var loadingNum = 0;
var isLoading = false;
var RestServiceJs = (function() {
  var self = {};

  self.post = function(newurl, params, callback, error) {
      var needLoading = true;
      setTimeout(function(){
        if(!isLoading&&needLoading) {
          myApp.showPreloader();
          isLoading = true;
        }
      },300);

      loadingNum = loadingNum+1;
      requestNUM = requestNUM+1;
      var url = newurl;
      if(newurl&&newurl.indexOf('demoapi')>-1) url = url+'.json';

      var thisRequest = requestNUM;
      checkNetWork(thisRequest,function(){
        params.client_token = USER_INFO.token || '';
        params.client_account = USER_INFO.tokenKey || '';
        $.ajax({
            type: 'POST',  
            url: url,  
            data: JSON.stringify(params),
            processData: false,  
            dataType: 'json',
            contentType: 'application/json',
            success: function(res){
              if(res.tokenCheck == false){
                requestNUM = 0;
                backToLogin(res);
                // if(thisRequest==1){
                //   backToLogin(res);
                // }
              }else{
                requestNUM = 0;
                callback(res);
              }
            },  
            error: error ? error : function(req, status, ex) {
              alertErrer(req, status, ex);
            },
            complete:function(){
              needLoading = false;
              loadingNum = loadingNum-1;
              if(loadingNum == 0){
                myApp.hidePreloader();
                isLoading = false;
              }
            },
            timeout:60000  
        });
      });
  };  
   
  self.put= function(newurl, params, callback, error) {
      var needLoading = true;
      setTimeout(function(){
        if(!isLoading&&needLoading) {
          myApp.showPreloader();
          isLoading = true;
        }
      },300);

      loadingNum = loadingNum+1;
      requestNUM = requestNUM+1;
      var url = newurl;
      if(newurl&&newurl.indexOf('demoapi')>-1) url = url+'.json';

      var thisRequest = requestNUM;
      checkNetWork(thisRequest,function(){
        $.ajax({
          type: 'PUT',  
          url: url,  
          data: JSON.stringify(params), 
          processData: false,  
          dataType: 'json',
          contentType: 'application/json',  
          success: function(res){
            if(res.tokenCheck == false){
              requestNUM = 0;
              backToLogin(res);
              // if(thisRequest==1){
              //   backToLogin(res);
              // }
            }else{
              requestNUM = 0;
              callback(res);
            }
          },  
          error: error ? error : function(req, status, ex) {
            alertErrer(req, status, ex);
          },
          complete:function(){
            needLoading = false;
            loadingNum = loadingNum-1;
            if(loadingNum == 0){
              myApp.hidePreloader();
              isLoading = false;
            }
          },
          timeout:60000  
        });  
      });
  };  
   
  self.get = function(newurl, id, params, callback, error, dontShowLoading) {
      var needLoading = true;
      setTimeout(function(){
        if(!isLoading&&needLoading&&!dontShowLoading) {
          myApp.showPreloader();
          isLoading = true;
        }
      },300);

      if(!dontShowLoading) loadingNum = loadingNum+1;
      requestNUM = requestNUM+1;
      var url = newurl;
      if(newurl&&newurl.indexOf('demoapi')>-1) url = url+'.json';

      var thisRequest = requestNUM;
      checkNetWork(thisRequest,function(){
        var end = '';
        if(url.indexOf('demoapi')>-1){
          url = url.replace('.json','');
          end = '.json';
        }
        params.client_token = USER_INFO.token || '';
        params.client_account = USER_INFO.tokenKey || '';
        $.ajax({
            type: 'GET',  
            url: url + '/' + id +end,
            data: params, 
            dataType: 'json',
            contentType: 'application/json',  
            success: function(res){
              if(res.tokenCheck == false){
                requestNUM = 0;
                backToLogin(res);
                // if(thisRequest==1){
                //   backToLogin(res);
                // }
              }else{
                requestNUM = 0;
                callback(res);
              }
            },  
            error: error ? error : function(req, status, ex) {
              alertErrer(req, status, ex);
            },
            complete:function(){
              needLoading = false;
              if(!dontShowLoading){
                loadingNum = loadingNum-1;
                if(loadingNum == 0){
                  myApp.hidePreloader();
                  isLoading = false;
                }
              }
            },
            timeout:60000
        });
      });
  };
   
  self.query = function(newurl, params, callback, error, dontShowLoading) {
      var needLoading = true;
      setTimeout(function(){
        if(!isLoading&&needLoading&&!dontShowLoading) {
          myApp.showPreloader();
          isLoading = true;
        }
      },300);
      
      if(!dontShowLoading) loadingNum = loadingNum+1;
      requestNUM = requestNUM+1;
      var url = newurl;
      if(newurl&&newurl.indexOf('demoapi')>-1) url = url+'.json';

      var thisRequest = requestNUM;
      checkNetWork(thisRequest,function(){
        params.client_token = USER_INFO.token || '';
        params.client_account = USER_INFO.tokenKey || '';
        $.ajax({
            type: 'GET',  
            url: url,
            data: params, 
            dataType: 'json',
            contentType: 'application/json',  
            success: function(res){
              if(res.tokenCheck == false){
                requestNUM = 0;
                backToLogin(res);
                // if(thisRequest==1){
                //   backToLogin(res);
                // }
              }else{
                requestNUM = 0;
                callback(res);
              }
            },  
            error: error ? error : function(req, status, ex) {
              alertErrer(req, status, ex);
            },
            complete:function(){
              needLoading = false;
              if(!dontShowLoading){
                loadingNum = loadingNum-1;
                if(loadingNum == 0){
                  myApp.hidePreloader();
                  isLoading = false;
                }
              }
            },
            timeout:60000
        });  
      });
  };  

  return self;
})();

