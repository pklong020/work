myApp.onPageInit("settings-profile", function(page) {
	function ViewModel(){
		var self = this;
		this.info = ko.observable({
			"name": "", 
			"account": "", 
			"roleName": "", 
			"email":"", 
			"mobilephone":""
		});
		this.loadInfo = function(){
			RestServiceJs.get(BASE_URL+"/user",USER_INFO.id,{},function(data){
				self.info(data);
			})
		}
	}
	var viewModel = new ViewModel();
	ko.applyBindings(viewModel, $$(page.container)[0]);
	window.settings_profile_viewModel = viewModel;
	if(clickedSetting){
		viewModel.loadInfo();
	}
});