GLOBAL = {
	SERVICEWORKER: "/miyuki/miyuki_sw.js",
	USINGSERVICEWORKER: true,
	SERVICEWORKERSCOPE: "/miyuki/",
	YEARLIST: [197, 198, 199, 200, 201]
}

windowLoaded=false;
data = {};

function setData(res){
	data = res;
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

/*
 * ページが読み込まれてからの処理
 */
window.addEventListener('load', function(){
	windowLoaded = true;
	data = makeRequest(params={
		url:"./data/miyuki.json",
		func200: setData
	});
})

/* 
* 与えられた時期の歌一覧を挿入
*/
function insertList(period){
	var key_list = Object.keys(data);
	var insert = true;

	if(document.getElementById("list"+period).innerHTML){
		insert = false;
	}
	for(i = 0; i<GLOBAL.YEARLIST.length; i++){
		document.getElementById("list"+GLOBAL.YEARLIST[i]).innerHTML="";
	}

	if(insert){
		for(i=0; i<key_list.length; i++){
			var key_id = key_list[i];
			var song = data[key_id];
			var title = song.title;
			var date = song.date.slice(0,3);
			if(date === period+""){
				var elem = document.getElementById("list"+date);
				if(elem){
					elem.innerHTML += "<li onclick=\"insertSong('"+ key_id +"')\">" + title + "</li>";
				} else{
					console.log("problem occur:" + key_id);
				}
			}			
		}	
	}
}

/*
* 歌詞
*/
function insertSong(key_id){
	var song = data[key_id];
	var title = song.title;
	var word = song.word;
	var cont = true;
	while(cont){
		if(word.startsWith("\n")){
			word = word.slice(1);
		}else{
			cont = false;
		}
	}
	word = word.replace(/\n/g, "<br />");
	document.getElementById("song_title").innerHTML = title;
	document.getElementById("song_body").innerHTML = word;
}

/*
 * リクエスト関数
 */
function makeRequest(params) {
	// params.urlが必須
	// params.func200、params.method、params.funcNot200、params.funcErrorはオプション
	// params.mode [text]

	console.log("make Request:" + params.url);
	if (!params.method) {
		params.method = "GET";
	}
	var result;

	var xhr = new XMLHttpRequest();
	xhr.open(params.method, params.url, true);
	xhr.onload = function(e) {
		console.log("get response");
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
//				console.log(xhr.responseText);

				//レスポンスがJSONではない場合、個別に”text”をparams.modeに渡す
				if(params.mode==="text"){
					result = xhr.response;
				} else{
					result = JSON.parse(xhr.response);
				}
				if (params.func200) {
					if (windowLoaded) {
						params.func200(result);
					} else {
						window.addEventListener("load",function(){
							console.log("wait for window load: getMyStockList");
							params.func200(result);
						});
					}
				} else{
					return g_result=result;
				}
			} else {
				if (params.funcNot200) {
					params.funcNot200();
				} else {
					console.error(xhr.statusText);
				}
			}
		}
	};
	xhr.onerror = function(e) {
		if (params.funcError) {
			params.funcError();
		} else {
			console.error(xhr.statusText);
		}
	};
	xhr.send(null);
}
