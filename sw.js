'use strict';

// Incrementing CACHE_VERSION will kick off the install event and force previously cached
// resources to be cached again.
var CACHE_VERSION = 1;
var CURRENT_CACHES = {
  offline: 'offline-v' + CACHE_VERSION
};
var OFFLINE_URL = '/_info/';

// Install the Service Worker ASAP.
self.addEventListener('install', function (event) {
  // TODO: Install `/_info/`.
  var request = new Request(OFFLINE_URL);
  event.waitUntil(
    getFromCache(request).then(function (response) {
      return response;
    }, function () {
      return cacheInRenderStore(new Request(OFFLINE_URL));
    })
  );
});

self.addEventListener('activate', function (event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle
  // the case where there are multiple versioned caches.
  let expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected"
            // cache names, then delete it.
            console.log('Deleting expired cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// When fetching, distinguish on the method.
self.addEventListener('fetch', function (event) {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.pathname !== '/_info/' ||
      event.request.headers.has('X-Mock-Response')) {
    return;
  }

  // `GET` implies looking for a cached copy…
  if (event.request.method === 'GET') {
    console.log('GET', event.request.url);
    event.respondWith(getFromCache(event.request));
  } else if (event.request.method === 'PUT') {
    console.log('PUT', event.request.url);
    // While `PUT` means to cache contents…
    event.respondWith(cacheInRenderStore(event.request).then(function () {
      return new Response({status: 202});
    }));
  }
});

function getFromCache (request) {
  console.log('getFromCache', request.url);
  return self.caches.open(CURRENT_CACHES.offline).then(function (cache) {
    return cache.match(OFFLINE_URL);
  });
}

function cacheInRenderStore (request) {
  return request.text().then(function (contents) {
    var headers = {
      'Content-Type': 'application/json',
      'X-Mock-Response': 'yes'
    };
    var response = new Response(contents, {headers: headers});
    return self.caches.open(CURRENT_CACHES.offline);
  }).then(function (cache) {
    return cache.put(OFFLINE_URL, response);
  });
}
