var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var xhr = require('/mods/xhr');
var moment = require('/libs/moment');
moment.locale('es');

var leftButton;

function Opportunities(nav) {

	var clicking = false;

	var self;
	var work = [];

	var content = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		layout : 'vertical'
	});

	var oppoContainer;

	if (Config.isAndroid) {

		self = Ti.UI.createWindow({
			title : 'Alertas de Negocio',
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
			text : 'Alertas de Negocio',
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
			title : 'Alertas de Negocio',
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

		var oppoTitleContainer = Ti.UI.createView({
			backgroundColor : Config.subtitleBackgroundColor,
			borderRadius : Config.subtitleBorderRadius,
			height : Config.subtitleHeight,
			width : Ti.UI.SIZE,
			top : '16dp'
		});

		var oppoTitleLabel = Ti.UI.createLabel({
			text : 'HOY',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : Config.subtitleFont,
			color : Config.subtitleTextColor,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			left : '16dp',
			right : '16dp'
		});

		oppoTitleContainer.add(oppoTitleLabel);

		oppoContainer = Ti.UI.createView({
			backgroundColor : Config.containerBackgroundColor,
			borderRadius : Config.bigborderRadius,
			top : '8dp',
			left : '16dp',
			right : '16dp',
			bottom : '16dp',
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			layout : 'vertical'
		});

		var oppoIndicator = Ti.UI.createActivityIndicator({
			style : Config.isAndroid ? Ti.UI.ActivityIndicatorStyle.BIG_DARK : Ti.UI.ActivityIndicatorStyle.DARK,
			height : '120dp',
			width : '120dp'
		});

		work.push(oppoIndicator);
		oppoContainer.add(oppoIndicator);

		scroll.add(oppoTitleContainer);
		scroll.add(oppoContainer);

		content.add(scroll);

		self.add(content);

	}

	function addData(data) {

		oppoContainer.removeAllChildren();

		for (var index in data) {

			var box = Ti.UI.createView({
				backgroundColor : Config.almostwhite,
				borderRadius : Config.bigborderRadius,
				top : '16dp',
				left : '16dp',
				right : '16dp',
				bottom : '0dp',
				height : Ti.UI.SIZE,
				width : Ti.UI.FILL,
				rippleColor : Config.accent,
				callback : openOpportunity,
				params : data[index],
				finish : finish
			});

			box.addEventListener('click', function(e) {
				if (clicking == false) {
					clicking = true;
					ripple.effect(e);
				}
			});

			var date = Ti.UI.createLabel({
				text : moment(data[index].date).locale(false).format('D MMMM - HH:mm - ') + data[index].company_name,
				font : Config.inputFont,
				color : Config.accent,
				height : 'auto',
				width : 'auto',
				top : '4dp',
				left : '16dp',
				right : '16dp',
				touchEnabled : false
			});

			var text = Ti.UI.createLabel({
				text : data[index].text,
				font : Config.inputFont,
				color : Config.inputTextColor,
				height : 'auto',
				width : 'auto',
				top : '24dp',
				left : '16dp',
				right : '16dp',
				bottom : '4dp',
				touchEnabled : false
			});

			box.add(date);
			box.add(text);

			oppoContainer.add(box);

		}

		var botmargin = Ti.UI.createView({
			height : '16dp',
			width : Ti.UI.FILL
		});

		oppoContainer.add(botmargin);

	}

	function gotData(result) {
		if (result == false) {
		} else {
			addData(result.response.data);
		}
		for (var index in work) {
			work[index].hide();
		}
	}

	function getData() {
		for (var index in work) {
			work[index].show();
		}
		xhr.getOppo(gotData);
	}

	function openOpportunity(opportunity) {
		//
	}

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

	getData();

}

module.exports = Opportunities;
