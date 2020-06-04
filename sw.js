/*importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

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
}*/

self.addEventListener('notificationclick', event => {
  if (event.action === 'close') {
    event.notification.close();
  } else {
    self.clients.openWindow('https://www.nvizionsolutions.com/');
  }
});

self.addEventListener('push', event => {
  const options = {
    body: 'Here is a notification body!',
    icon: 'images/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {action: 'explore', title: 'Explore this new world',
        icon: 'images/tick.png'},
      {action: 'close', title: 'Close notification',
        icon: 'images/xmark.png'},
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});


