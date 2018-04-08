var CACHE_NAME = 'miyuki_base_180404v1';
var urlsToCache = [ 
	'/miyuki/miyuki.html', 
	'/miyuki/css/miyuki.css', 
	'/miyuki/js/miyuki.js' ];

self.addEventListener('install', function(event) {
	// インストール処理
	event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
		console.log('Opened cache');
		return cache.addAll(urlsToCache);
	}));
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
	  caches.keys().then(function(cacheNames) {
	    return Promise.all(
	      cacheNames.filter(function(cacheName) {
	        // Return true if you want to remove this cache,
	        // but remember that caches are shared across
	        // the whole origin
	      	if(cacheName !== CACHE_NAME){return true;}
	      }).map(function(cacheName) {
	        return caches.delete(cacheName);
	      })
	    );
	  })
	);
});

var dataCacheName = 'miyuk_dynamic_180404v1';

self.addEventListener('fetch', function(event) {
	console.log(event);
	event.respondWith(
		caches.open(dataCacheName).then(function(cache) {
			return cache.match(event.request).then(function(response) {
				var fetchPromise = fetch(event.request).then(function(networkResponse) {
					cache.put(event.request, networkResponse.clone());
					return networkResponse;
				})
				return response || fetchPromise;
			})
		})
	);
	  // event.respondWith(
	  //   caches.match(event.request).then(function(response) {
	  //     return response || fetch(event.request);
	  //   })
	  // );
});