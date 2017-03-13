myApp.onPageInit("settings-password", function(page) {
  function ViewModel(){
	var self = this;
	this.save = function(){
		if(self.info().oldPassword == '' || self.info().newPassword_a == '' || self.info().newPassword_b == ''){
			myApp.alert('密码不能为空!');
			return;
		}
		if(self.info().oldPassword != USER_INFO.password){
			myApp.alert('密码错误!');
			return;
		}
		if(self.info().newPassword_a != self.info().newPassword_b){
			myApp.alert('请输入一致的新密码!');
			return;
		}
		if(self.info().newPassword_a.length<6){
			myApp.alert('密码最少6位!');
			return;
		}
		self.saveNow(self.info().oldPassword, self.info().newPassword_a);
	}
	this.info = ko.observable({
		"oldPassword": "", 
		"newPassword_a": "", 
		"newPassword_b": "",
	});
	var client_token = USER_INFO.token;
  	var client_account = USER_INFO.tokenKey
	this.saveNow = function(oldPassword, password){
		RestServiceJs.put(BASE_URL+"/user/"+USER_INFO.id+"?client_token="+client_token+"&client_account="+client_account,{"password":password,"oldPassword":oldPassword},function(data){
			myApp.alert('恭喜，密码修改成功!');
			self.info({
				"oldPassword": "", 
				"newPassword_a": "", 
				"newPassword_b": "",
			});
		})
	}
  }
  var viewModel = new ViewModel();
  ko.applyBindings(viewModel, $$(page.container)[0]);
});