function Config() {
}

Config.drawer = null;

Config.ga = require('ti.ga');
Config.ga.setDispatchInterval(5);

Config.tracker = Config.ga.createTracker({
	trackingId : 'UA-88092153-1',
	useSecure : true,
	debug : true
});

Config.tracker.startSession();

Config.isAndroid = Ti.Platform.osname == 'android' ? true : false;

if (Config.isAndroid) {
	Config.device_type = 'android';
} else {
	Config.device_type = 'ios';
}

Config.googleBlue = '#4885ed';

Config.purple = '#781975';
Config.blue = '#0154a0';
Config.red = '#cb3636';
Config.green = '#45ad45';
Config.orange = '#ea8c27';
Config.yellow = '#dbd82e';
Config.darkpurple = '#631a61';
Config.darkerpurple = '#4e134c';
Config.darkred = '#b91927';
Config.darkgreen = '#2e8f4b';
Config.darkorange = '#c57621';
Config.lightpurple = '#a872a7';

Config.black = '#000000';
Config.almostblack = '#151515';
Config.darkgray = '#292929';
Config.overgray = '#3c3c3c';
Config.somegray = '#444444';
Config.lightgray = '#737373';
Config.hintgray = '#c7c7c7';
Config.somewhite = '#eeeeee';
Config.almostwhite = '#f7f7f7';
Config.white = '#ffffff';

Config.orientation = [Ti.UI.PORTRAIT];
Config.backgroundColor = Config.somewhite;
Config.containerBackgroundColor = Config.white;
Config.containerTextColor = Config.overgray;

Config.actionbarBackgroundColor = Config.darkpurple;
Config.titleTextColor = Config.white;
Config.titleButtonColor = Config.almostwhite;
Config.shadowColor = Config.purple;
Config.shadowHeight = '0dp';

Config.sidemenuBackgroundColor = Config.darkgray;
Config.sidemenuBoxesColor = Config.overgray;
Config.sidemenuTextColor = Config.somewhite;
Config.menuActionbarBackgroundColor = Config.darkgray;
Config.menuActionbarTextColor = Config.white;
Config.menuBackgroundColor = Config.somewhite;
Config.menuTextColor = Config.overgray;

Config.subtitleFont = {
	fontSize : '16dp',
	fontWeight : 'bold'
};
Config.subtitleBackgroundColor = Config.purple;
Config.subtitleTextColor = Config.white;
Config.subtitleHeight = '32dp';
Config.subtitleBorderRadius = '16dp';

Config.inputBackgroundColor = Config.white;
Config.inputBackgroundSelectedColor = Config.white;
Config.inputBorderColor = Config.hintgray;
Config.inputHintColor = Config.hintgray;
Config.inputTextColor = Config.overgray;
Config.inputFont = {
	fontSize : '14dp',
	fontWeight : 'bold'
};
Config.inputLabelMargin = Config.isAndroid ? '16dp' : '16dp';
Config.inputTextMargin = Config.isAndroid ? '13dp' : '13dp';
Config.inputPickerMargin = Config.isAndroid ? '8dp' : '8dp';
Config.inputHeight = Config.isAndroid ? '40dp' : '40dp';
Config.inputIconSize = Config.isAndroid ? '24dp' : '24dp';
Config.inputIconMargin = Config.isAndroid ? '8dp' : '8dp';

Config.biginputFont = {
	fontSize : '18dp',
	fontWeight : 'bold'
};
Config.biginputLabelMargin = Config.isAndroid ? '16dp' : '16dp';
Config.biginputTextMargin = Config.isAndroid ? '13dp' : '13dp';
Config.biginputPickerMargin = Config.isAndroid ? '8dp' : '8dp';
Config.biginputHeight = Config.isAndroid ? '48dp' : '48dp';
Config.biginputIconSize = Config.isAndroid ? '32dp' : '32dp';
Config.biginputIconMargin = Config.isAndroid ? '8dp' : '8dp';

Config.biggerinputHeight = Config.isAndroid ? '64dp' : '64dp';
Config.biggerinputFont = {
	fontSize : '20dp',
	fontWeight : 'bold'
};

Config.font24 = {
	fontSize : '24dp',
	fontWeight : 'bold'
};

Config.font28 = {
	fontSize : '28dp',
	fontWeight : 'bold'
};

Config.font32 = {
	fontSize : '32dp',
	fontWeight : 'bold'
};

Config.font36 = {
	fontSize : '36dp',
	fontWeight : 'bold'
};

Config.optionsBackground = Config.somewhite;
Config.optionsSelectedBackground = Config.almostwhite;
Config.optionsSeparatorColor = Config.hintgray;
Config.optionsRowHeight = Config.isAndroid ? '80dp' : '80dp';
Config.optionsTitleColor = Config.overgray;
Config.optionsTitleFont = {
	fontSize : '18dp',
	fontWeight : 'bold'
};
Config.optionsMessageColor = Config.somegray;
Config.optionsMessageFont = {
	fontSize : '12dp'
};

Config.buttonTextColor = Config.white;
Config.accent = Config.purple;
Config.success = Config.green;
Config.darksuccess = Config.darkpurple;
Config.warning = Config.yellow;
Config.danger = Config.red;
Config.info = Config.blue;
Config.neutral = Config.somegray;
Config.neutralSelected = Config.lightgray;

Config.bigborderRadius = '16dp';
Config.borderRadius = '8dp';
Config.borderWidth = '1dp';

Config.fileDocs = 'docs';
Config.fileImages = 'images';
Config.fileVideos = 'videos';

Config.mapareaStrokeWidth = Config.isAndroid ? 5 : '2dp';
Config.mapareaStrokeColor = '#0154a0';
Config.mapareaFillColor = '#160154a0';

Config.AppVersion = Titanium.App.getVersion();
Config.ubqti_api_version = '1';
Config.densityScreen = Titanium.Platform.displayCaps.density;

var dev = 'https://entel-mobile-test.ubqti.com/';
var devAlt = 'http://192.168.1.239:5000/';
var prod = 'https://entel-mobile.ubqti.com/';
var dev2 = 'http://ubqti.softllama.com/';
var ws = 'ws://entel-mobile.ubqti.com/';
var wsAlt = 'http://192.168.1.239:5000/';
var wslocal = 'http://192.168.1.52/';

Config.SOCKET_URL = wsAlt;

//Config.DOMAIN_URL= prod;
Config.DOMAIN_URL = wslocal;

//Config.SERVER_BASE_URL = Config.DOMAIN_URL + 'api/mobile/';
Config.SERVER_BASE_URL = Config.DOMAIN_URL + 'proyectos/WS_prueba_slim/skeleton/public/';

Config.DATABASE_NAME = 'mega';

// 0 = dev ; 1 = prod
Config.mode = 0;

if (Config.isAndroid) {
	Config.softInput = Ti.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE;
	Config.hideKeyboard = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS;
	Config.showKeyboard = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
} else {
	Config.softInput = '';
	Config.hideKeyboard = '';
	Config.showKeyboard = '';
}

module.exports = Config;
