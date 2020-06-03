importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

if (workbox) {
  // console.log('workbox cache', workbox.CacheableResponsePlugin);
  // console.log('Yay! Workbox is loaded 🎉');
  workbox.loadModule('workbox-strategies');
  workbox.routing.registerRoute(
    new RegExp('/.*\\.(js|html|css|png|jpg|gif|svg|eot|ttf|woff)'),
    new workbox.strategies.StaleWhileRevalidate()
  );

  // Caching API Responses
  const {CacheableResponse} = workbox.cacheableResponse;
  workbox.loadModule('workbox-cacheable-response')
  workbox.routing.registerRoute(
      new RegExp('/.*\\/(api\\/\\/).*?'),
      new workbox.strategies.StaleWhileRevalidate()
    );

} else {
  // console.log('Boo! Workbox didnt load 😬');
}