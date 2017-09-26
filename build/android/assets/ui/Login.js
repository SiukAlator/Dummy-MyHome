var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var xhr = require('/mods/xhr');
var db = require('/mods/db');

var GoogleAuth = require('/libs/googleAuth');
var google = new GoogleAuth({
	clientId : '237053829888-6p0rjc7qqmknpm05pj913j71maks9eg4.apps.googleusercontent.com',
	clientSecret : 'Hvkb0as0I-1guAVOYryGueSI',
	propertyName : 'googleToken',
	scope : ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.readonly'],
	loginHint : ''
});

function Login() {

	db.dropGENERAL();

	var clicking = false;

	var self = Ti.UI.createWindow({
		title : 'Login',
		navBarHidden : false,
		exitOnClose : true,
		windowSoftInputMode : Config.softInput,
		backgroundColor : Config.backgroundColor,
		barColor : Config.actionbarBackgroundColor,
		navTintColor : Config.titleButtonColor,
		orientationModes : Config.orientation,
		titleAttributes : {
			color : Config.titleTextColor
		}
	});

	var work = [];

	var nav;

	var content = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		layout : 'vertical'
	});

	var googleLogin;
	var scrollableView;

	var work1 = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		zindex : 999
	});

	var mask1 = Ti.UI.createView({
		backgroundColor : Config.black,
		opacity : 0.6,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL
	});

	var indicator1 = Ti.UI.createActivityIndicator({
		style : Config.isAndroid ? Ti.UI.ActivityIndicatorStyle.BIG_DARK : Ti.UI.ActivityIndicatorStyle.DARK,
		height : '120dp',
		width : '120dp'
	});
	indicator1.show();

	work1.add(mask1);
	work1.add(indicator1);
	work1.hide();

	var work2 = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		zindex : 999
	});

	var mask2 = Ti.UI.createView({
		backgroundColor : Config.black,
		opacity : 0.6,
		height : Ti.UI.FILL,
		width : Ti.UI.FILL
	});

	var indicator2 = Ti.UI.createActivityIndicator({
		style : Config.isAndroid ? Ti.UI.ActivityIndicatorStyle.BIG_DARK : Ti.UI.ActivityIndicatorStyle.DARK,
		height : '120dp',
		width : '120dp'
	});
	indicator2.show();

	work2.add(mask2);
	work2.add(indicator2);
	work2.hide();

	work.push(work1);
	work.push(work2);

	if (Config.isAndroid) {

		var barHeight = '56dp';
		var barMargin = '8dp';

		var actionBar = Ti.UI.createView({
			top : 0,
			height : barHeight,
			width : Ti.UI.FILL,
			backgroundColor : Config.actionbarBackgroundColor
		});

		var centerLabel = Ti.UI.createLabel({
			text : 'Login',
			font : {
				fontSize : '20dp'
			},
			color : Config.titleTextColor,
			left : barMargin
		});

		actionBar.add(centerLabel);

		content.add(actionBar);

	} else {

		nav = Ti.UI.iOS.createNavigationWindow({
			window : self
		});

	}

	var barShadow = Ti.UI.createView({
		backgroundColor : Config.shadowColor,
		top : '0dp',
		height : Config.shadowHeight,
		width : Ti.UI.FILL
	});

	content.add(barShadow);
	var passInput = Ti.UI.createTextField();
	var userInput = Ti.UI.createTextField();

	function construct() {

		var view1 = Ti.UI.createView({
			height : Ti.UI.FILL,
			width : Ti.UI.FILL
		});

		var scroll1 = Ti.UI.createScrollView({
			showVerticalScrollIndicator : true,
			width : Ti.UI.FILL,
			top : '0dp',
			bottom : '0dp',
			scrollType : 'vertical'
		});

		var allElements = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL
		});

		var box = Ti.UI.createView({
			backgroundColor : Config.containerBackgroundColor,
			borderRadius : Config.bigborderRadius,
			top : '16dp',
			left : '16dp',
			right : '16dp',
			bottom : '32dp',
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			layout : 'vertical'
		});

		var pic = Ti.UI.createImageView({
			image : '/images/logo_login.png',
			height : '120dp',
			width : 'auto',
			top : '32dp',
			bottom : '24dp',
			touchEnabled : false
		});

		var separator = Ti.UI.createView({
			height : '2dp',
			width : Ti.UI.FILL,
			backgroundColor : Config.backgroundColor
		});

		var userLabel = Ti.UI.createLabel({
			text : 'Usuario',
			font : Config.subtitleFont,
			color : Config.containerTextColor,
			height : 'auto',
			width : Ti.UI.FILL,
			top : '24dp',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled : false
		});

		userInput = Ti.UI.createTextField({
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			color : '#336699',
			top : 2,
			width : 250,
			height : 60
		});

		var passLabel = Ti.UI.createLabel({
			text : 'Contraseña',
			font : Config.subtitleFont,
			color : Config.containerTextColor,
			height : 'auto',
			width : Ti.UI.FILL,
			top : '24dp',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled : false
		});

		passInput = Ti.UI.createTextField({
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			color : '#336699',
			top : 2,
			width : 250,
			height : 60
		});

		var buttonLogin = Ti.UI.createView({
			backgroundImage : '/images/google_login.png',
			height : '96dp',
			width : '96dp',
			top : '8dp',
			bottom : '32dp',
			rippleColor : Config.googleBlue,
			callback : authorize,
			finish : finish
		});

		buttonLogin.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				ripple.effect(e);
			}
		});

		box.add(pic);
		box.add(separator);
		box.add(userLabel);
		box.add(userInput);
		box.add(passLabel);
		box.add(passInput);
		box.add(buttonLogin);

		allElements.add(box);

		scroll1.add(allElements);

		view1.add(scroll1);
		view1.add(work1);

		var view2 = Ti.UI.createView({
			height : Ti.UI.FILL,
			width : Ti.UI.FILL
		});

		var scroll2 = Ti.UI.createScrollView({
			showVerticalScrollIndicator : true,
			width : Ti.UI.FILL,
			top : '0dp',
			bottom : '0dp',
			layout : 'vertical',
			scrollType : 'vertical'
		});

		var registerTitleContainer = Ti.UI.createView({
			backgroundColor : Config.subtitleBackgroundColor,
			borderRadius : Config.subtitleBorderRadius,
			height : Config.subtitleHeight,
			width : Ti.UI.SIZE,
			top : '16dp'
		});

		var registerTitleLabel = Ti.UI.createLabel({
			text : 'INGRESA TUS DATOS',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : Config.subtitleFont,
			color : Config.subtitleTextColor,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			left : '16dp',
			right : '16dp'
		});

		registerTitleContainer.add(registerTitleLabel);

		scroll2.add(registerTitleContainer);

		view2.add(scroll2);
		view2.add(work2);

		scrollableView = Ti.UI.createScrollableView({
			cacheSize : 15,
			views : [view1, view2],
			scrollingEnabled : false,
			pagingControlColor : 'transparent',
			width : Ti.UI.FILL,
			top : '0dp',
			bottom : '0dp'
		});

		content.add(scrollableView);

		self.add(content);

	}

	function checkExists(mail) {
		xhr.exists(existsResponse, mail);
	}

	function existsResponse(result) {

		if (result == false) {

			for (var w in work) {
				work[w].hide();
			}

			var dialog = Ti.UI.createAlertDialog({
				title : 'Revise su conexión a Internet',
				message : 'no hemos podido comunicarnos con el servidor, por favor compruebe que está conectado a internet.',
				ok : 'OK'
			});
			dialog.show();

		} else {

			switch(result.status.code) {

			case '200':
				xhr.login(loginResponse, Ti.App.Properties.getObject('google_auth', null).mail);
				break;

			case '404':

				if (result.response.data.valid_domain == false) {
					for (var w in work) {
						work[w].hide();
					}

					var dialog = Ti.UI.createAlertDialog({
						title : 'Correo no válido para usar esta aplicación',
						message : 'inténtelo utilizando un correo de mega'
					});
					dialog.show();

				} else {

					for (var w in work) {
						work[w].hide();
					}

					scrollableView.moveNext();

				}
				break;

			case '500':

				for (var w in work) {
					work[w].hide();
				}

				var dialog = Ti.UI.createAlertDialog({
					title : 'Error interno',
					message : 'por favor inténtelo nuevamente en unos minutos o contáctese con el administrador del sistema.',
					ok : 'CERRAR'
				});
				dialog.show();
				break;

			default:

				for (var w in work) {
					work[w].hide();
				}

				var dialog = Ti.UI.createAlertDialog({
					title : 'Error inesperado',
					message : 'por favor inténtelo nuevamente en unos minutos o contáctese con el administrador del sistema.',
					ok : 'CERRAR'
				});
				dialog.show();
				break;

			}

		}

	}

	function loginResponse(result) {

		if (result == false) {

			for (var w in work) {
				work[w].hide();
			}

			var dialog = Ti.UI.createAlertDialog({
				title : 'Revise su conexión a Internet',
				message : 'no hemos podido comunicarnos con el servidor, por favor compruebe que está conectado a internet.',
				ok : 'OK'
			});
			dialog.show();

		} else {

			switch(result.status.code) {

			case '200':
				Ti.App.Properties.setObject('me', result.response.data);
				xhr.generaltables(tryGetGeneralTables);
				break;

			case '500':

				for (var w in work) {
					work[w].hide();
				}

				var dialog = Ti.UI.createAlertDialog({
					title : 'Error interno',
					message : 'por favor inténtelo nuevamente en unos minutos o contáctese con el administrador del sistema.',
					ok : 'CERRAR'
				});
				dialog.show();
				break;

			default:

				for (var w in work) {
					work[w].hide();
				}

				var dialog = Ti.UI.createAlertDialog({
					title : 'Error inesperado',
					message : 'por favor inténtelo nuevamente en unos minutos o contáctese con el administrador del sistema.',
					ok : 'CERRAR'
				});
				dialog.show();
				break;

			}

		}

	}

	function tryGetGeneralTables(result) {

		if (result == false) {
			for (var w in work) {
				work[w].hide();
			}
			var dialog = Ti.UI.createAlertDialog({
				title : 'Error interno',
				message : 'por favor inténtelo nuevamente en unos minutos o contáctese con el administrador del sistema.',
				ok : 'CERRAR'
			});
			dialog.show();
		} else {
			switch(result.status.code) {
			case '200':
				for (index in result.response.data) {
					var generalData = result.response.data[index];
					db.insertGENERAL(generalData);
				}

				var Window = require('/ui/Menu');
				new Window();

				for (var w in work) {
					work[w].hide();
				}
				break;
			case '401':
				for (var w in work) {
					work[w].hide();
				}
				var dialog = Ti.UI.createAlertDialog({
					title : 'Dispositivo no autorizado',
					message : 'si las credenciales ingresadas son correctas por favor contáctese con el administrador del sistema.',
					ok : 'CERRAR'
				});
				dialog.show();
				break;
			case '500':
				for (var w in work) {
					work[w].hide();
				}
				var dialog = Ti.UI.createAlertDialog({
					title : 'Error interno',
					message : 'por favor inténtelo nuevamente en unos minutos o contáctese con el administrador del sistema.',
					ok : 'CERRAR'
				});
				dialog.show();
				break;
			default:
				for (var w in work) {
					work[w].hide();
				}
				var dialog = Ti.UI.createAlertDialog({
					title : 'Error inesperado',
					message : 'por favor inténtelo nuevamente en unos minutos o contáctese con el administrador del sistema.',
					ok : 'CERRAR'
				});
				dialog.show();
				break;
			}
		}
	}


	google.login = function() {
		for (var w in work) {
			work[w].show();
		}

		var xhrProfile = Ti.Network.createHTTPClient({
			onload : function(e) {
				var json = JSON.parse(e.source.responseText);
				var gauth = {
					mail : json.email,
					token : google.getAccessToken()
				};
				Ti.App.Properties.setObject('google_auth', gauth);
				checkExists(json.email);
			},
			onerror : function(e) {
				google.deAuthorize();
				Ti.API.error('HTTP: ' + JSON.stringify(e));
				for (var w in work) {
					work[w].hide();
				}
			},
			timeout : 10000
		});
		xhrProfile.open("GET", 'https://www.googleapis.com/userinfo/v2/me?access_token=' + google.getAccessToken());
		xhrProfile.send();
	};

	function authorize() {
		var params = {
			email : userInput.value,
			password : passInput.value
		};
		xhr.login(loginResponse, params);
	}

	function finish() {
		clicking = false;
	}

	construct();

	Config.tracker.addScreenView('login-view');

	if (Config.isAndroid) {
		self.open();
	} else {
		nav.open();
	}

}

module.exports = Login;
