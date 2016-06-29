/* global fetch */

// Install the Service Worker ASAP.
self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// When fetching, distinguish on the method.
self.addEventListener('fetch', function (event) {
  if (event.request.url !== 'http://localhost:9000/_info/') {
    return;
  }

  // `GET` implies looking for a cached copy…
  if (event.request.method === 'GET') {
    console.log('GET', event.request.url);
    event.respondWith(getFromRenderStoreOrNetwork(event.request));
  } else if (event.request.method === 'PUT') {
    console.log('PUT', event.request.url);
    // While `PUT` means to cache contents…
    event.respondWith(cacheInRenderStore(event.request).then(function () {
      return new Response({status: 202});
    }));
  }
});

// It tries to recover a cached copy for the document. If not found,
// it respond from the network.
function getFromRenderStoreOrNetwork (request) {
  return self.caches.open('_info').then(function (cachedResponse) {
    return cachedResponse.text();
  }).then(function (contents) {
    // Craft an `application/json` response for the contents to be cached.
    var headers = {'Content-Type': 'application/json'};
    var response = new Response(contents, {headers: headers});
  }).catch(console.error.bind(console));
}

// Obtains the interpolated HTML contents of a `PUT` request from the
// `pokemon.js` client code and crafts an HTML response for the interpolated
// result.
function cacheInRenderStore (request) {
  return request.text().then(function (contents) {
    // Craft an `application/json` response for the contents to be cached.
    var headers = {'Content-Type': 'application/json'};
    var response = new Response(contents, {headers: headers});
    return self.cache.put('_info', response);
  });
}
