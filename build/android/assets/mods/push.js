function push() {
}

push.register = function(e) {

	var pnOptions;

	if (Ti.Platform.name === 'android') {
		pnOptions = {
			senderId : '366200381710', // It's the same as your project id
			notificationSettings : {
				backgroundOnly : false,
				sound : 'default',
				smallIcon : 'appicon.png', // Place icon in platform/android/res/drawable/notification_icon.png
				largeIcon : 'appicon.png', // Same
				vibrate : true, // Whether the phone should vibrate
				insistent : false, // Whether the notification should be insistent
				group : 'News', // Name of group to group similar notifications together
				localOnly : false, // Whether this notification should be bridged to other devices
				priority : 2 // Notification priority, from -2 to 2
			}
		};

	} else if (Ti.Platform.name === 'iPhone OS') {
		// Sets interactive notifications as well if iOS8 and above. Interactive notifications is optional.
		if (parseInt(Ti.Platform.version.split('.')[0], 10) >= 8) {
			var thumbUpAction = Ti.App.iOS.createUserNotificationAction({
				identifier : 'THUMBUP_IDENTIFIER',
				title : 'Agree',
				activationMode : Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_FOREGROUND,
				destructive : false,
				authenticationRequired : false
			});

			var thumbDownAction = Ti.App.iOS.createUserNotificationAction({
				identifier : 'THUMBDOWN_IDENTIFIER',
				title : 'Disagree',
				activationMode : Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,
				destructive : false,
				authenticationRequired : false
			});

			var thumbUpDownCategory = Ti.App.iOS.createUserNotificationCategory({
				identifier : 'THUMBUPDOWN_CATEGORY',
				// The following actions will be displayed for an alert dialog
				actionsForDefaultContext : [thumbUpAction, thumbDownAction],
				// The following actions will be displayed for all other notifications
				actionsForMinimalContext : [thumbUpAction, thumbDownAction]
			});

			pnOptions = {
				types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND],
				categories : [thumbUpDownCategory]
			};
		} else {//No support for interactive notifications, omit categories
			pnOptions = {
				types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND]
			};
		}
	}

	// set cross-platform events

	var onReceive = function(event) {
		if (Config.mode == 0) {
			Ti.API.info('push.receive: ' + JSON.stringify(event));
		}
		var modal = Ti.UI.createWindow({
			title : 'room.name',
			navBarHidden : false,
			exitOnClose : false,
			modal : true,
			windowSoftInputMode : Config.softInput,
			backgroundColor : Config.backgroundColor,
			barColor : Config.actionbarBackgroundColor,
			navTintColor : Config.titleButtonColor,
			orientationModes : Config.orientation,
			titleAttributes : {
				color : Config.titleTextColor
			}
		});
		modal.open();
	};

	var onReceive = function(event) {
		if (Config.mode == 0) {
			Ti.API.info('push.receive: ' + JSON.stringify(event));
		}
	};

	var onStart = function(event) {
		if (Config.mode == 0) {
			Ti.API.info('push.start: ' + JSON.stringify(event));
		}

		var chatRoomId = event.data.chatRoomId;
		var chat = null;
		var chatrooms = Ti.App.Properties.getObject('chatrooms', null);

		for (var index in chatrooms) {
			if (chatrooms[index].id == chatRoomId) {
				chat = chatrooms[index];
			}
		}

		var Window = require('/ui/Chat');
		var nav = null;

		if (!Config.isAndroid) {
			nav = Ti.UI.iOS.createNavigationWindow();
		}

		if (Config.isAndroid) {
			new Window(nav, null, chat).open();
		} else {
			nav.openWindow(new Window(nav, null, chat));
		}

	};

	var onResume = function(event) {
		if (Config.mode == 0) {
			Ti.API.info('push.resume: ' + JSON.stringify(event));
		}

		var chatRoomId = event.data.chatRoomId;
		var chat = null;
		var chatrooms = Ti.App.Properties.getObject('chatrooms', null);

		for (var index in chatrooms) {
			if (chatrooms[index].id == chatRoomId) {
				chat = chatrooms[index];
			}
		}

		var Window = require('/ui/Chat');
		var nav = null;

		if (!Config.isAndroid) {
			nav = Ti.UI.iOS.createNavigationWindow();
		}

		if (Config.isAndroid) {
			new Window(nav, null, chat).open();
		} else {
			nav.openWindow(new Window(nav, null, chat));
		}

	};

	// Create instance with base url
	var tiPush = require('ti-push-notification').init({
		backendUrl : Config.SERVER_BASE_URL + 'push_subscribe'
	});

	// register this device
	tiPush.registerDevice({
		pnOptions : pnOptions,
		onReceive : onReceive,
		onStart : onStart,
		onResume : onResume,
		extraOptions : {
			ubqti_api_version : Config.ubqti_api_version,
			ubqti_api_token : Ti.App.Properties.getObject('me', new Object).session_token,
			device_type : Config.device_type
		}
	});

};

module.exports = push;
