var Config = require('/libs/Config');
var Permissions = require('/libs/Permissions');
var db = require('/mods/db');
var xhr = require('/mods/xhr');

db.checkDB();

(function() {

	var win = Ti.UI.createWindow({
		navBarHidden : true,
		exitOnClose : true,
		windowSoftInputMode : Config.softInput,
		backgroundColor : Config.sidemenuBackgroundColor,
		orientationModes : Config.orientation,
	});

	function blur() {
		if (Config.mode == 0) {
			Ti.API.info('win.blur');
		}
		win.focus = false;
	}

	function focus() {
		if (Config.mode == 0) {
			Ti.API.info('win.focus');
		}
		win.focus = true;
	}

	function gotPermissions() {
		if (Config.mode == 0) {
			Ti.API.log('gotPermissions');
		}
		win.removeEventListener('blur', blur);
		win.removeEventListener('focus', focus);

		if (Config.isAndroid) {
			Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
		} else {
			Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
		}

		if (Ti.App.Properties.getObject('me', null) != null) {
			var Window = require('/ui/Menu');
			new Window();
		} else {
			var Window = require('/ui/Login');
			new Window();
		}
	}


	win.addEventListener('blur', blur);

	win.addEventListener('focus', focus);

	win.addEventListener('open', function(e) {
		if (Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS) == true && Ti.Media.hasCameraPermissions() == true) {
			gotPermissions();
		} else {
			Permissions.getAll(win, gotPermissions);
		}
	});

	win.open();

})();
