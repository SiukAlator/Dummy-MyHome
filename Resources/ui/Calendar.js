var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var xhr = require('/mods/xhr');
var moment = require('/libs/moment');
moment.locale('es');

var fullW = Ti.Platform.displayCaps.getPlatformWidth();
if (Config.isAndroid) {
	fullW = fullW / Ti.Platform.displayCaps.getLogicalDensityFactor();
}
fullW = fullW - 72;
var fullWdp = fullW + 'dp';

var leftButton;

var googleLogin;
var GoogleAuth = require('/libs/googleAuth');
var google = new GoogleAuth({
	clientId : '237053829888-6p0rjc7qqmknpm05pj913j71maks9eg4.apps.googleusercontent.com',
	clientSecret : 'Hvkb0as0I-1guAVOYryGueSI',
	propertyName : 'googleToken',
	scope : ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.readonly'],
	loginHint : ''
});

google.deAuthorize();

function Calendar(nav) {

	var clicking = false;

	var self;
	var work = [];

	var content = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		layout : 'vertical'
	});

	var monthTitleLabel;
	var monthContainer;
	var listContainer;

	var dateSelected;
	var day;
	var month;
	var year;
	var daysInMonth;
	var firstDayOfWeek;

	var currentDays = {};

	var calendarId;

	if (Config.isAndroid) {

		self = Ti.UI.createWindow({
			title : 'Calendario',
			navBarHidden : false,
			exitOnClose : false,
			windowSoftInputMode : Config.softInput,
			backgroundColor : Config.backgroundColor,
			barColor : Config.actionbarBackgroundColor,
			navTintColor : Config.titleButtonColor,
			orientationModes : Config.orientation,
			titleAttributes : {
				color : Config.titleTextColor
			}
		});

		var barHeight = '56dp';
		var barMargin = '60dp';

		var actionBar = Ti.UI.createView({
			top : 0,
			height : barHeight,
			width : Ti.UI.FILL,
			backgroundColor : Config.actionbarBackgroundColor
		});

		leftButton = Ti.UI.createView({
			left : '4dp',
			borderRadius : '20dp',
			height : '40dp',
			width : '40dp',
			backgroundImage : '/images/ic_navigate_before_w.png',
			rippleColor : Config.white,
			callback : close,
			finish : finish
		});

		leftButton.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				ripple.round(e);
			}
		});

		var centerLabel = Ti.UI.createLabel({
			text : 'Calendario',
			font : {
				fontSize : '20dp'
			},
			color : Config.titleTextColor,
			left : barMargin
		});

		actionBar.add(leftButton);
		actionBar.add(centerLabel);

		content.add(actionBar);

	} else {

		leftButton = Ti.UI.createButton({
			backgroundImage : '/images/ic_navigate_before_w.png',
			height : 'auto',
			width : 'auto'
		});
		leftButton.addEventListener('click', function() {
			if (clicking == false) {
				close();
			}
		});

		self = Ti.UI.createWindow({
			title : 'Calendario',
			navBarHidden : false,
			exitOnClose : false,
			leftNavButtons : [leftButton],
			windowSoftInputMode : Config.softInput,
			backgroundColor : Config.backgroundColor,
			barColor : Config.actionbarBackgroundColor,
			navTintColor : Config.titleButtonColor,
			orientationModes : Config.orientation,
			titleAttributes : {
				color : Config.titleTextColor
			}
		});

	}

	var barShadow = Ti.UI.createView({
		backgroundColor : Config.shadowColor,
		top : '0dp',
		height : Config.shadowHeight,
		width : Ti.UI.FILL
	});

	content.add(barShadow);

	function construct() {

		var scroll = Ti.UI.createScrollView({
			showVerticalScrollIndicator : true,
			width : Ti.UI.FILL,
			top : '0dp',
			bottom : '0dp',
			layout : 'vertical',
			scrollType : 'vertical'
		});

		var monthControllerContainer = Ti.UI.createView({
			height : Config.subtitleHeight,
			width : Ti.UI.SIZE,
			top : '16dp',
			layout : 'horizontal'
		});

		var arrowL = Ti.UI.createImageView({
			image : '/images/ic_navigate_before.png',
			height : '32dp',
			width : '32dp',
			right : '8dp',
			opacity : 0.6
		});

		arrowL.addEventListener('click', function(e) {
			dateSelected = moment(dateSelected).subtract(1, 'months');
			drawMonth();
		});

		var arrowR = Ti.UI.createImageView({
			image : '/images/ic_navigate_next.png',
			height : '32dp',
			width : '32dp',
			left : '8dp',
			opacity : 0.6
		});

		arrowR.addEventListener('click', function(e) {
			dateSelected = moment(dateSelected).add(1, 'months');
			drawMonth();
		});

		var monthTitleContainer = Ti.UI.createView({
			backgroundColor : Config.subtitleBackgroundColor,
			borderRadius : Config.subtitleBorderRadius,
			height : Config.subtitleHeight,
			width : Ti.UI.SIZE
		});

		monthTitleLabel = Ti.UI.createLabel({
			text : '',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : Config.subtitleFont,
			color : Config.subtitleTextColor,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			left : '16dp',
			right : '16dp'
		});

		monthTitleContainer.add(monthTitleLabel);

		monthControllerContainer.add(arrowL);
		monthControllerContainer.add(monthTitleContainer);
		monthControllerContainer.add(arrowR);

		var monthBox = Ti.UI.createView({
			backgroundColor : Config.containerBackgroundColor,
			borderRadius : Config.bigborderRadius,
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			top : '8dp',
			left : '16dp',
			right : '16dp'
		});

		monthContainer = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			top : '16dp',
			left : '16dp',
			right : '16dp',
			bottom : '8dp',
			layout : 'vertical'
		});

		var monthWork = Ti.UI.createView({
			height : '96dp',
			width : '96dp'
		});

		var monthMask = Ti.UI.createView({
			borderRadius : Config.bigborderRadius,
			backgroundColor : Config.black,
			opacity : 0.2,
			height : Ti.UI.FILL,
			width : Ti.UI.FILL
		});

		var monthIndicator = Ti.UI.createActivityIndicator({
			style : Config.isAndroid ? Ti.UI.ActivityIndicatorStyle.BIG_DARK : Ti.UI.ActivityIndicatorStyle.DARK,
			height : '80dp',
			width : '80dp'
		});
		monthIndicator.show();
		monthWork.add(monthMask);
		monthWork.add(monthIndicator);
		monthWork.hide();

		work.push(monthWork);

		monthBox.add(monthContainer);
		monthBox.add(monthWork);

		listContainer = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			top : '8dp',
			bottom : '16dp',
			layout : 'vertical'
		});

		googleLogin = Ti.UI.createView({
			height : '48dp',
			width : Ti.UI.FILL,
			top : '8dp',
			left : '16dp',
			right : '16dp',
			bottom : '24dp',
			borderColor : Config.lightgray,
			borderRadius : Config.borderRadius,
			backgroundColor : '#FFFFFF',
			visible : false
		});
		var googleLogo = Ti.UI.createImageView({
			image : '/images/google.png',
			height : '36dp',
			width : '36dp',
			left : '6dp',
			touchEnabled : false
		});
		var googleLabel = Ti.UI.createLabel({
			text : 'Entra con Google',
			font : {
				fontSize : '18dp'
			},
			color : '#A0A0A0',
			left : '48dp',
			right : '6dp',
			height : 'auto',
			width : Ti.UI.FILL,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			touchEnabled : false
		});
		var googleClick = Ti.UI.createView({
			height : Ti.UI.FILL,
			width : Ti.UI.FILL,
			backgroundColor : Config.black,
			opacity : 0.0,
			touchEnabled : false
		});
		googleLogin.addEventListener('click', function(e) {
			google.authorize(google.login);
		});
		googleLogin.addEventListener('touchstart', function(e) {
			googleClick.opacity = 0.3;
		});
		googleLogin.addEventListener('touchend', function(e) {
			googleClick.opacity = 0.0;
		});
		googleLogin.addEventListener('touchcancel', function(e) {
			googleClick.opacity = 0.0;
		});
		googleLogin.add(googleLogo);
		googleLogin.add(googleLabel);
		googleLogin.add(googleClick);

		scroll.add(monthControllerContainer);
		scroll.add(monthBox);
		scroll.add(listContainer);
		scroll.add(googleLogin);

		content.add(scroll);

		self.add(content);

	}

	function drawMonth() {

		for (var index in work) {
			work[index].show();
		}

		currentDays = {};
		day = moment(dateSelected).format('D');
		month = moment(dateSelected).format('MM');
		year = moment(dateSelected).format('YYYY');
		daysInMonth = moment(dateSelected).daysInMonth();
		firstDayOfWeek = moment(moment(dateSelected).format('YYYY-MM-' + 01)).weekday();

		monthTitleLabel.text = moment(dateSelected).format('MMM / YY').toString().toUpperCase();

		var currentSlot = 0;
		var dayCount = 0;

		var numberOfWeeks = Math.ceil((firstDayOfWeek + daysInMonth) / 7);

		monthContainer.removeAllChildren();
		listContainer.removeAllChildren();

		for (var i = 0; i < numberOfWeeks; i++) {

			var newweek = Ti.UI.createView({
				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE,
				layout : 'horizontal'
			});

			for (var j = 0; j < 7; j++) {
				var newday = Ti.UI.createView({
					height : fullW / 7 + 'dp',
					width : fullW / 7 + 'dp'
				});

				if (currentSlot >= firstDayOfWeek && dayCount < daysInMonth) {
					dayCount++;
					var newdayLabel = Ti.UI.createLabel({
						text : dayCount,
						textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
						font : Config.inputFont,
						color : Config.inputTextColor,
						height : Ti.UI.SIZE,
						width : Ti.UI.SIZE,
						touchEnabled : false,
						zIndex : 999
					});
					newday.label = newdayLabel;
					newday.add(newdayLabel);

					currentDays[dayCount + '/' + month] = newday;
				}

				newweek.add(newday);

				if (j < 6) {
					var newhsep = Ti.UI.createView({
						backgroundColor : Config.hintgray,
						height : fullW / 7 + 'dp',
						width : '1dp'
					});
					newweek.add(newhsep);
				}

				currentSlot++;

			}

			monthContainer.add(newweek);

			if (i < numberOfWeeks - 1) {
				var newvsep = Ti.UI.createView({
					backgroundColor : Config.hintgray,
					height : '1dp',
					width : (fullW + 6) + 'dp'
				});
				monthContainer.add(newvsep);
			}

		}

		//xhr.getCalendarEvents(gotData, moment(dateSelected).format('MM/YYYY'));
		google.eventsList();

	}

	function addData(data) {

		for (var index in data) {

			var from = moment(data[index].from).locale(false).format('D/MM');

			var eventBox = Ti.UI.createView({
				backgroundColor : data[index].color,
				borderRadius : Config.borderRadius,
				height : Ti.UI.FILL,
				width : Ti.UI.FILL,
				top : '4dp',
				left : '4dp',
				right : '4dp',
				bottom : '4dp',
				zIndex : 1
			});

			currentDays[from].label.color = Config.white;
			currentDays[from].add(eventBox);

			var listBox = Ti.UI.createView({
				backgroundColor : Config.containerBackgroundColor,
				borderRadius : Config.bigborderRadius,
				top : '8dp',
				left : '16dp',
				right : '16dp',
				bottom : '0dp',
				height : Config.biginputHeight,
				width : Ti.UI.FILL
			});

			var colorIco = Ti.UI.createView({
				backgroundColor : data[index].color,
				borderRadius : '8dp',
				left : '16dp',
				height : '16dp',
				width : '16dp',
				touchEnabled : false
			});

			var title = Ti.UI.createLabel({
				text : data[index].title,
				font : Config.inputFont,
				color : Config.inputTextColor,
				height : 'auto',
				width : 'auto',
				left : '48dp',
				right : '120dp',
				touchEnabled : false
			});

			var date = Ti.UI.createLabel({
				text : moment(data[index].from).locale(false).format('DD/MMM') + '\n' + moment(data[index].from).locale(false).format('HH:mm') + ' - ' + moment(data[index].to).locale(false).format('HH:mm'),
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				font : Config.inputFont,
				color : Config.accent,
				height : 'auto',
				width : '96dp',
				right : '16dp',
				touchEnabled : false
			});

			listBox.add(colorIco);
			listBox.add(title);
			listBox.add(date);

			listContainer.add(listBox);

		}

	}

	function gotData(result, month_id) {
		if (result == false) {
		} else {
			if (month_id == moment(dateSelected).format('MM/YYYY')) {
				addData(result.response.data);
			}
		}
		if (month_id == moment(dateSelected).format('MM/YYYY')) {
			for (var index in work) {
				work[index].hide();
			}
		}
	}


	google.login = function() {
		var xhrList = Ti.Network.createHTTPClient({
			onload : function(e) {
				Ti.API.log('e');
				Ti.API.log(JSON.stringify(e));
				Ti.API.log('token');
				Ti.API.log(JSON.stringify(google.getAccessToken()));
				googleLogin.hide();

				dateSelected = moment();

				google.calendarList();
			},
			onerror : function(e) {
				google.deAuthorize();
				Ti.API.error('HTTP: ' + JSON.stringify(e));
			},
			timeout : 5000
		});
		xhrList.open("GET", 'https://www.googleapis.com/userinfo/v2/me?access_token=' + google.getAccessToken());
		xhrList.send();
	};

	google.calendarList = function() {
		var xhrList = Ti.Network.createHTTPClient({
			onload : function(e) {
				var data = JSON.parse(this.responseText);

				var optionsDict = {};
				var options = [];
				for (var index in data.items) {
					options.push(data.items[index].summary);
					optionsDict[data.items[index].summary] = data.items[index].id;
				}

				var dialog = Ti.UI.createOptionDialog({
					options : options
				});

				dialog.addEventListener('click', function(evt) {
					if (evt.button != true) {
						calendarId = optionsDict[options[evt.index]];
						drawMonth();
					}
				});

				dialog.show();

			},
			onerror : function(e) {
				google.deAuthorize();
				Ti.API.error('HTTP: ' + JSON.stringify(e));
			},
			timeout : 5000
		});
		xhrList.open("GET", 'https://www.googleapis.com/calendar/v3/users/me/calendarList?access_token=' + google.getAccessToken());
		xhrList.send();
	};

	google.eventsList = function() {
		var thisMonthId = moment(dateSelected).format('MM/YYYY');
		Ti.API.log('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events?access_token=' + google.getAccessToken() + '&orderBy=startTime&singleEvents=true&timeMin=' + moment(dateSelected).format('YYYY-MM-01T00:00:00Z') + '&timeMax=' + moment(dateSelected).format('YYYY-MM-' + daysInMonth + 'T23:59:59Z'));
		var xhrList = Ti.Network.createHTTPClient({
			onload : function(e) {
				var data = JSON.parse(this.responseText);
				var eventos = [];
				for (var index in data.items) {
					eventos.push({
						id : data.items[index].id,
						from : data.items[index].start.dateTime,
						to : data.items[index].end.dateTime,
						title : data.items[index].summary,
						color : '#8e2090'
					});
				}
				var result = {
					response : {
						data : eventos
					}
				};
				Ti.API.log(JSON.stringify(result));
				gotData(result, thisMonthId);
			},
			onerror : function(e) {
				google.deAuthorize();
				Ti.API.error('HTTP: ' + JSON.stringify(e));
			},
			timeout : 5000
		});
		xhrList.open("GET", 'https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events?access_token=' + google.getAccessToken() + '&orderBy=startTime&singleEvents=true&timeMin=' + moment(dateSelected).format('YYYY-MM-01T00:00:00Z') + '&timeMax=' + moment(dateSelected).format('YYYY-MM-' + daysInMonth + 'T23:59:59Z'));
		xhrList.send();
	};

	setTimeout(function(e) {
		google.isAuthorized(function() {
			google.login();
		}, function() {
			googleLogin.show();
		});
	}, 1000);

	function close() {
		self.close();
	}

	function finish() {
		clicking = false;
	}


	self.addEventListener('android:back', function(e) {
		e.cancelBubble = true;
		if (clicking == false) {
			clicking = true;
			ripple.round({
				source : leftButton
			});
		}
	});

	construct();

	if (Config.isAndroid) {
		self.open();
	} else {
		nav.openWindow(self);
	}

}

module.exports = Calendar;
