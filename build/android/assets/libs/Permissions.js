var Config = require('/libs/Config');

function Permissions() {
}

Permissions.geoOpen = false;
Permissions.mediaOpen = false;

Permissions.getAll = function(win, callback) {

	if (Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS) == true && Ti.Media.hasCameraPermissions() == true) {

		callback();

	} else {

		var timer = setInterval(function() {

			if ((Config.isAndroid && win.focus) || !Config.isAndroid) {

				if (Permissions.geoOpen == false && Permissions.mediaOpen == false) {

					if (Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS) == false) {
						if (Config.mode == 0) {
							Ti.API.info('Permissions.requestGeo');
						}
						Permissions.geoOpen = true;
						Permissions.geolocation(win);
					}

					if (Ti.Media.hasCameraPermissions() == false) {
						if (Config.mode == 0) {
							Ti.API.info('Permissions.requestMedia');
						}
						Permissions.mediaOpen = true;
						Permissions.media(win);
					}

				}

			} else {
				if (Config.mode == 0) {
					Ti.API.info('win.nofocus');
				}
			}
			if (Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS) == true && Ti.Media.hasCameraPermissions() == true) {
				callback();
				clearInterval(timer);
			}
		}, 1000);

	}

};

Permissions.editPermissions = function(win) {

	Permissions.geoOpen = false;
	Permissions.mediaOpen = false;

	if (!Config.isAndroid) {
		Ti.Platform.openURL(Ti.App.iOS.applicationOpenSettingsURL);
	}

	if (Config.isAndroid) {

		var intent = Ti.Android.createIntent({
			action : 'android.settings.APPLICATION_SETTINGS',
		});

		intent.addFlags(Ti.Android.FLAG_ACTIVITY_NEW_TASK);

		Ti.Android.currentActivity.startActivity(intent);

	}

};

Permissions.geolocation = function(win) {

	var hasLocationPermissions = Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS);
	if (Config.mode == 0) {
		Ti.API.info('Ti.Geolocation.hasLocationPermissions: ' + hasLocationPermissions);
	}

	if (hasLocationPermissions) {
		Permissions.geoOpen = false;
		return true;
	}

	if (!Config.isAndroid) {

		var map = {};
		map[Ti.Geolocation.AUTHORIZATION_ALWAYS] = 'AUTHORIZATION_ALWAYS';
		map[Ti.Geolocation.AUTHORIZATION_AUTHORIZED] = 'AUTHORIZATION_AUTHORIZED';
		map[Ti.Geolocation.AUTHORIZATION_DENIED] = 'AUTHORIZATION_DENIED';
		map[Ti.Geolocation.AUTHORIZATION_RESTRICTED] = 'AUTHORIZATION_RESTRICTED';
		map[Ti.Geolocation.AUTHORIZATION_UNKNOWN] = 'AUTHORIZATION_UNKNOWN';
		map[Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE] = 'AUTHORIZATION_WHEN_IN_USE';

		var locationServicesAuthorization = Ti.Geolocation.locationServicesAuthorization;
		if (Config.mode == 0) {
			Ti.API.info('Ti.Geolocation.locationServicesAuthorization: ' + 'Ti.Geolocation.' + map[locationServicesAuthorization]);
		}

		if (locationServicesAuthorization === Ti.Geolocation.AUTHORIZATION_RESTRICTED) {
			return alert('Because permission are restricted by some policy which you as user cannot change, we don\'t request as that might also cause issues.');

		} else if (locationServicesAuthorization === Ti.Calendar.AUTHORIZATION_DENIED) {

			var dialog = Ti.UI.createAlertDialog({
				title : 'Permisos no otorgados',
				message : 'No autorizaste los permisos para usar la geolocalización, si los desactivaste de forma permanente los puedes activar a continuación',
				buttonNames : ['Cambiar', 'Cancelar'],
				cancel : 1
			});

			dialog.addEventListener('click', function(e) {
				if (e.index === e.source.cancel) {
					Permissions.mediaOpen = false;
				} else {
					Permissions.editPermissions(win);
				}
			});

			dialog.show();

		}
	}

	Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
		if (Config.mode == 0) {
			Ti.API.info('Ti.Geolocation.requestLocationPermissions: ' + JSON.stringify(e));
		}

		if (e.success) {

			Permissions.geoOpen = false;
			return true;

		} else if (Config.isAndroid) {

			var dialog = Ti.UI.createAlertDialog({
				title : 'Permisos no otorgados',
				message : 'No autorizaste los permisos para usar la geolocalización, si los desactivaste de forma permanente los puedes activar en: Settings -> Apps -> CCU -> Permissions',
				buttonNames : ['Cambiar', 'Cancelar'],
				cancel : 1
			});

			dialog.addEventListener('click', function(e) {
				if (e.index === e.source.cancel) {
					Permissions.geoOpen = false;
					return false;
				} else {
					Permissions.editPermissions(win);
				}
			});

			dialog.show();

		} else {

			var dialog = Ti.UI.createAlertDialog({
				title : 'Permisos no otorgados.',
				message : e.error,
				ok : 'OK'
			});

			dialog.addEventListener('click', function(e) {
				Permissions.geoOpen = false;
				return false;
			});

			dialog.show();

		}
	});
};

Permissions.media = function(win) {

	var hasCameraPermissions = Ti.Media.hasCameraPermissions();
	if (Config.mode == 0) {
		Ti.API.info('Ti.Media.hasCameraPermissions: ' + hasCameraPermissions);
	}

	if (hasCameraPermissions) {
		Permissions.mediaOpen = false;
		return true;
	}

	if (!Config.isAndroid) {

		var map = {};
		map[Ti.Media.CAMERA_AUTHORIZATION_AUTHORIZED] = 'CAMERA_AUTHORIZATION_AUTHORIZED';
		map[Ti.Media.CAMERA_AUTHORIZATION_DENIED] = 'CAMERA_AUTHORIZATION_DENIED';
		map[Ti.Media.CAMERA_AUTHORIZATION_RESTRICTED] = 'CAMERA_AUTHORIZATION_RESTRICTED';
		map[Ti.Media.CAMERA_AUTHORIZATION_NOT_DETERMINED] = 'CAMERA_AUTHORIZATION_NOT_DETERMINED';

		var cameraAuthorizationStatus = Ti.Media.cameraAuthorizationStatus;
		if (Config.mode == 0) {
			Ti.API.info('Ti.Media.cameraAuthorizationStatus: ' + 'Ti.Media.' + map[cameraAuthorizationStatus]);
		}

		if (cameraAuthorizationStatus === Ti.Media.CAMERA_AUTHORIZATION_RESTRICTED) {
			return alert('Because permission are restricted by some policy which you as user cannot change, we don\'t request as that might also cause issues.');

		} else if (cameraAuthorizationStatus === Ti.Media.CAMERA_AUTHORIZATION_DENIED) {

			var dialog = Ti.UI.createAlertDialog({
				title : 'Permisos no otorgados',
				message : 'No autorizaste los permisos para usar la cámara, si los desactivaste de forma permanente los puedes activar a continuación',
				buttonNames : ['Cambiar', 'Cancelar'],
				cancel : 1
			});

			dialog.addEventListener('click', function(e) {
				if (e.index === e.source.cancel) {
					Permissions.mediaOpen = false;
				} else {
					Permissions.editPermissions(win);
				}
			});

			dialog.show();

		}

	}

	Ti.Media.requestCameraPermissions(function(e) {
		if (Config.mode == 0) {
			Ti.API.info('Ti.Media.requestCameraPermissions: ' + JSON.stringify(e));
		}

		if (e.success) {

			Permissions.mediaOpen = false;
			return true;

		} else if (Config.isAndroid) {

			var dialog = Ti.UI.createAlertDialog({
				title : 'Permisos no otorgados',
				message : 'No autorizaste los permisos para usar la cámara, si los desactivaste de forma permanente los puedes activar en: Settings -> Apps -> CCU -> Permissions',
				buttonNames : ['Cambiar', 'Cancelar'],
				cancel : 1
			});

			dialog.addEventListener('click', function(e) {
				if (e.index === e.source.cancel) {
					Permissions.mediaOpen = false;
				} else {
					Permissions.editPermissions(win);
				}
			});

			dialog.show();

		} else {

			var dialog = Ti.UI.createAlertDialog({
				title : 'Permisos no otorgados.',
				message : e.error,
				ok : 'OK'
			});

			dialog.addEventListener('click', function(e) {
				Permissions.mediaOpen = false;
				return false;
			});

			dialog.show();

		}
	});
};

module.exports = Permissions;
