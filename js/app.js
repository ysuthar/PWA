/** Web Push Set up**/
const applicationServerPublicKey = 'BOYGO2Zn0wltgcsg6qf6e_LYekSNMHnaK9ExfUX8-uP6-EcDNZOt6KsttwZTSAzSYa-pVjiDTJS4zScbJAEycjY';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
var swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


/** ServiceWorker Registration **/
  if ('serviceWorker' in navigator && 'PushManager' in window && 'SyncManager' in window) {
    console.log('Service Worker and Push is supported');

    navigator.serviceWorker.register('sw.js')
    .then(function(swReg) {
      console.log('Service Worker is registered', swReg);

      swRegistration = swReg;

      swRegistration.sync.register('sendGeoLocation');

      initializeUI();
    })
    .catch(function(error) {
      console.error('Service Worker Error', error);
    });
  } else {
    console.warn('Push messaging is not supported');
    pushButton.textContent = 'Push Not Supported';
  }

/* Push Notification Subscribe **/
function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}


function initializeUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(subscription) {
      console.log('User is subscribed.');

      updateSubscriptionOnServer(subscription);

      isSubscribed = true;

      updateBtn();

    })
    .catch(function(err) {
      console.log('Failed to subscribe the user: ', err);
      updateBtn();
    });

    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

function updateBtn() {
  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

/** Notification Permissions **/
Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
    /* Trigger Timebased Notification **/
    setTimeout(function(){displayNotification(); },10000)
});


//* Trigger Manual Notification  **/
document.querySelector('#notification-button').onclick = async () => {
  const reg = await navigator.serviceWorker.getRegistration();
  Notification.requestPermission().then(permission => {
    if (permission !== 'granted') {
      alert('you need to allow push notifications');
    } else {
      const timestamp = new Date().getTime() + 5 * 1000; // now plus 5000ms
      reg.showNotification(
        'Manual Push Notification..!!',
        {
          tag: timestamp, // a unique ID
          body: 'I am triggered manually through button.',
	        icon: 'images/logo.png',
	        vibrate: [100, 50, 100],
          showTrigger: timestamp, // set the time for the push notification
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
        }
      );
    }
  });
};

//* Cancel Notification **/
document.querySelector('#notification-cancel').onclick = async () => {
  const reg = await navigator.serviceWorker.getRegistration();
  const notifications = await reg.getNotifications({
    includeTriggered: true
  });
  notifications.forEach(notification => notification.close());
  alert(`${notifications.length} notification(s) cancelled`);
};

//* Display Notification **/
function displayNotification() {
  if (Notification.permission == 'granted') {
  	const timestamp = new Date().getTime() + 5 * 1000; // now plus 5000ms
    navigator.serviceWorker.getRegistration().then(function(reg) {
      var options = {
        body: 'I am triggered manually through javaScript timer',
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
      reg.showNotification('Timer Based Notification..!!', options);
    });
  }
}


// Scheduled Notification 
if ("showTrigger" in Notification.prototype) {
  const createScheduledNotification = async (tag, title, timestamp) => {
    const registration = await navigator.serviceWorker.getRegistration();
    registration.showNotification(title, {
      tag: tag,
      body: "This notification was scheduled 30 seconds ago",
      showTrigger: new TimestampTrigger(timestamp + 30 * 1000)
    });
  };
}
else{
  console.log("Notification Triggers Not supported")
}

/** QR Code Generator **/
var qrcode = new QRCode("qrcode");

function makeCode () {		
	var elText = document.getElementById("qrtext");
	
	if (!elText.value) {
		alert("Input a text");
		elText.focus();
		return;
	}
	
	qrcode.makeCode(elText.value);
}

makeCode();

/*$("#qrtext").
	on("blur", function () {
		makeCode();
	}).
	on("keydown", function (e) {
		if (e.keyCode == 13) {
			makeCode();
		}
	});
*/

document.querySelector('#regenerate-code').onclick = async () => {
  makeCode();
};

/** Geo Location **/ 
if ("geolocation" in navigator) {
    console.log('yes')
} else {
    console.log('no')
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setCurrentPosition, positionError, {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 0
    });
}

function setCurrentPosition(position) {
    document.querySelector('.accuracy').innerHTML = position.coords.accuracy;
    //document.querySelector('.altitude').innerHTML = position.coords.altitude;
    //document.querySelector('.altitudeAccuracy').innerHTML = position.coords.altitudeAccuracy;
    document.querySelector('.heading').innerHTML = position.coords.heading;
    document.querySelector('.latitude').innerHTML = position.coords.latitude;
    document.querySelector('.longitude').innerHTML = position.coords.longitude;
    document.querySelector('.speed').innerHTML = position.coords.speed;
}

function positionError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.error("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.error("An unknown error occurred.");
            break;
    }
}


var geoWatch;

function startWatch() {
    if (!geoWatch) {
        if ("geolocation" in navigator && "watchPosition" in navigator.geolocation) {
            geoWatch = navigator.geolocation.watchPosition(setCurrentPosition, positionError, {
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 0
            });
        }
    }
}

setInterval(function(){navigator.geolocation.getCurrentPosition(setCurrentPosition, positionError, {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 0
});console.log('geo updated')},10000);