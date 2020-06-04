Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
    setTimout(function(){displayNotification()},5000)
});

document.querySelector('#notification-button').onclick = async () => {
  const reg = await navigator.serviceWorker.getRegistration();
  Notification.requestPermission().then(permission => {
    if (permission !== 'granted') {
      alert('you need to allow push notifications');
    } else {
      const timestamp = new Date().getTime() + 5 * 1000; // now plus 5000ms
      reg.showNotification(
        'Demo Push Notification',
        {
          tag: timestamp, // a unique ID
          body: 'Here is a notification body!',
	        icon: 'images/logo.png',
	        vibrate: [100, 50, 100],
          showTrigger: timestamp, // set the time for the push notification
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
        }
      );
    }
  });
};

document.querySelector('#notification-cancel').onclick = async () => {
  const reg = await navigator.serviceWorker.getRegistration();
  const notifications = await reg.getNotifications({
    includeTriggered: true
  });
  notifications.forEach(notification => notification.close());
  alert(`${notifications.length} notification(s) cancelled`);
};

function displayNotification() {
  if (Notification.permission == 'granted') {
  	const timestamp = new Date().getTime() + 5 * 1000; // now plus 5000ms
    navigator.serviceWorker.getRegistration().then(function(reg) {
      var options = {
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
      reg.showNotification('Hello world!', options);
    });
  }
}

const createScheduledNotification = async (tag, title, timestamp) => {
  const registration = await navigator.serviceWorker.getRegistration();
  registration.showNotification(title, {
    tag: tag,
    body: "This notification was scheduled 30 seconds ago",
    showTrigger: new TimestampTrigger(timestamp + 30 * 1000)
  });
};