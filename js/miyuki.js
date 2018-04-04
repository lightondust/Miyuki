GLOBAL = {
	SERVICEWORKER: "/js/sw.js",
	USINGSERVICEWORKER: true,
	SERVICEWORKERSCOPE: "/miyuki/"
}

function toggleMenuDisplay(){
   var stateOn = "inline-block";
   var stateOff = "none";
   var stateTo = "";
   var menuDisplay = document.getElementById("menu").style.display; 
   if (menuDisplay === stateOn){
       stateTo = stateOff;
   }else{
       stateTo = stateOn;
   }
   document.getElementById("menu").style.display = stateTo;
}

/*Service Worker 初期設定*/
window.addEventListener("load",function(){
	if(GLOBAL.USINGSERVICEWORKER){
		if ('serviceWorker' in navigator) {
			console.log("ServiceWorker Available");
			navigator.serviceWorker.register(
				GLOBAL.SERVICEWORKER,
				{scope: GLOBAL.SERVICEWORKERSCOPE}
			).then(function(registration) {
				// 登録成功
				console.log('ServiceWorker registration successful with scope: ', registration.scope);
			}).catch(function(err) {
				// 登録失敗
				console.log('ServiceWorker registration failed: ', err);
			});
		}else{
		}
	}else{
		if ('serviceWorker' in navigator) {
		}else{
		}
	} 
	
});
