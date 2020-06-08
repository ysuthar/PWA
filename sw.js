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

function getGeoLocation() {
  console.log(navigator, "GPS");
  
  if (navigator.geolocation)
    {  
        navigator.geolocation.getCurrentPosition((position)=>{
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;
          console.log(lat, lon)
        });
    }
    else
    {  
        console.log("hello this") ;
    }
}
getGeoLocation();

self.addEventListener('notificationclick', event => {
  if (event.action === 'close') {
    event.notification.close();
  } else {
    self.clients.openWindow('https://pwa.nvizion.io/');
  }
});

self.addEventListener('push', event => {

  var body;

  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }

  console.log('body', body)

  const options = {
    body: body,
    icon: 'images/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {action: 'explore', title: 'Explore more',
        icon: 'images/tick.png'},
      {action: 'close', title: 'Close notification',
        icon: 'images/xmark.png'},
    ]
  };

  // event.waitUntil(
  //   self.registration.showNotification('Web-Push Notification..!!', options)
  // );
  
  setTimeout(() => {
    self.registration.showNotification('Web-Push Notification..!!', options);
  }, 10000);

});

self.addEventListener('sync', function(event) {
  console.log("enter sync");
  if (event.tag == 'sendGeoLocation') {
    console.log("sendGeoLocation");
    event.waitUntil(getGeoLocation());
  }
});
