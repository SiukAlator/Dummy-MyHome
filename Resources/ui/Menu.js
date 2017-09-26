var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var NappDrawerModule = require('dk.napp.drawer');

var drawer;
var SideMenu;

var clicking;

function Menu() {

	clicking = false;

	var view;

	var close = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Cerrar', 'Cancelar'],
		message : '¿Seguro que quiere salir?',
		title : 'Cerrar Aplicación'
	});
	close.addEventListener('click', function(e) {
		if (e.index == 0) {
			drawer.close();
		}
	});

	function construct() {

		SideMenu = require('/ui/SideMenu');
		SideMenu = new SideMenu();

		SideMenu.addEventListener('click', function(e) {
			if ('id' in e.source) {
				switch(e.source.index) {
				case 0:
					if (e.source.callback == undefined) {
						e.source.callback = function(e) {
							openHome();
							drawer.toggleLeftWindow();
						};
						e.source.finish = function(e) {
							clicking = false;
						};
					}
					if (clicking == false) {
						clicking = true;
						ripple.effect(e);
					}
					break;
				case 1:
					if (e.source.callback == undefined) {
						e.source.callback = function(e) {
							openCalendar();
							drawer.toggleLeftWindow();
						};
						e.source.finish = function(e) {
							clicking = false;
						};
					}
					if (clicking == false) {
						clicking = true;
						ripple.effect(e);
					}
					break;
				case 2:
					if (e.source.callback == undefined) {
						e.source.callback = function(e) {
							openContacts();
							drawer.toggleLeftWindow();
						};
						e.source.finish = function(e) {
							clicking = false;
						};
					}
					if (clicking == false) {
						clicking = true;
						ripple.effect(e);
					}
					break;
				case 3:
					if (e.source.callback == undefined) {
						e.source.callback = function(e) {
							openProjects();
							drawer.toggleLeftWindow();
						};
						e.source.finish = function(e) {
							clicking = false;
						};
					}
					if (clicking == false) {
						clicking = true;
						ripple.effect(e);
					}
					break;
				case 4:
					if (e.source.callback == undefined) {
						e.source.callback = function(e) {
							openOpportunities();
							drawer.toggleLeftWindow();
						};
						e.source.finish = function(e) {
							clicking = false;
						};
					}
					if (clicking == false) {
						clicking = true;
						ripple.effect(e);
					}
					break;
				case 5:
					openHome();
					if (e.source.callback == undefined) {
						e.source.callback = function(e) {
							openHome();
							drawer.toggleLeftWindow();
						};
						e.source.finish = function(e) {
							clicking = false;
						};
					}
					if (clicking == false) {
						clicking = true;
						ripple.effect(e);
					}
					break;
				case 6:
					openHome();
					if (e.source.callback == undefined) {
						e.source.callback = function(e) {
							openHome();
							drawer.toggleLeftWindow();
						};
						e.source.finish = function(e) {
							clicking = false;
						};
					}
					if (clicking == false) {
						clicking = true;
						ripple.effect(e);
					}
					break;
				case 10:
					openOpciones();
					drawer.toggleLeftWindow();
					break;
				}
			}
		});

		if (Config.isAndroid) {

			view = Ti.UI.createView({
				backgroundColor : Config.backgroundColor,
				height : Ti.UI.FILL,
				width : Ti.UI.FILL
			});

			drawer = NappDrawerModule.createDrawer({
				navBarHidden : false,
				exitOnClose : true,
				fullscreen : false,
				windowSoftInputMode : Config.softInput,
				leftWindow : SideMenu,
				centerWindow : view,
				fading : 0.0,
				parallaxAmount : 0.2,
				shadowWidth : '0dp',
				leftDrawerWidth : '240dp',
				rightDrawerWidth : '240dp',
				animationMode : NappDrawerModule.ANIMATION_NONE,
				closeDrawerGestureMode : NappDrawerModule.CLOSE_MODE_MARGIN,
				openDrawerGestureMode : NappDrawerModule.OPEN_MODE_NONE,
				orientationModes : Config.orientation
			});

		} else {

			view = Ti.UI.createWindow({
				navBarHidden : true,
				exitOnClose : true,
				windowSoftInputMode : Config.softInput,
				backgroundColor : Config.backgroundColor,
				orientationModes : Config.orientation
			});

			drawer = NappDrawerModule.createDrawer({
				navBarHidden : false,
				exitOnClose : true,
				fullscreen : false,
				windowSoftInputMode : Config.softInput,
				leftWindow : SideMenu,
				centerWindow : view,
				fading : 0.0,
				parallaxAmount : 0.2,
				shadowWidth : '0dp',
				leftDrawerWidth : '240dp',
				rightDrawerWidth : '240dp',
				animationMode : NappDrawerModule.ANIMATION_NONE,
				closeDrawerGestureMode : NappDrawerModule.CLOSE_MODE_ALL,
				openDrawerGestureMode : NappDrawerModule.OPEN_MODE_NONE,
				orientationModes : Config.orientation
			});

		}

		drawer.addEventListener('open', function(e) {
			openHome();
		});

		drawer.open();

	}

	function openHome() {
		Config.tracker.addScreenView('dashboard-view');
		clicking = false;
		var Window = require('/ui/Home');
		new Window(drawer);
	}

	function openCalendar() {
		Config.tracker.addScreenView('calendar-view');
		clicking = false;
		var Window = require('/ui/Calendar');
		new Window(drawer.nav);
	}

	function openContacts() {
		Config.tracker.addScreenView('contacts-view');
		clicking = false;
		var Window = require('/ui/Contacts');
		new Window(drawer.nav);
	}

	function openProjects() {
		Config.tracker.addScreenView('projects-view');
		clicking = false;
		var Window = require('/ui/Projects');
		new Window(drawer.nav);
	}

	function openOpportunities() {
		Config.tracker.addScreenView('opportunities-view');
		clicking = false;
		var Window = require('/ui/Opportunities');
		new Window(drawer.nav);
	}

	function openOpciones() {
		clicking = false;
		var Window = require('/ui/Options');
		new Window(drawer);
	}

	function tryGetGeneralTables(json) {

		if (json == false) {
		} else {
			switch(json.status.code) {
			case '200':
				db.dropGENERAL();
				for (index in json.response.data) {
					var generalData = json.response.data[index];
					db.insertGENERAL(generalData);
				}
				break;
			}
		}

	}

	construct();

	drawer.addEventListener('android:back', function(e) {
		e.cancelBubble = true;
		if (clicking == false) {
			if (drawer.isAnyWindowOpen()) {
				if (drawer.isLeftWindowOpen()) {
					drawer.toggleLeftWindow();
				}
				if (drawer.isRightWindowOpen()) {
					drawer.toggleRightWindow();
				}
			} else {
				close.show();
			}
		}
	});

	Config.drawer = drawer;

}

module.exports = Menu;
