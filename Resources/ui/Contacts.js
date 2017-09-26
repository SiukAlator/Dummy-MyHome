var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var xhr = require('/mods/xhr');

var leftButton;

function Contacts(nav) {

	var clicking = false;

	var self;
	var work = [];

	var content = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		layout : 'vertical'
	});

	var contactsContainer;

	if (Config.isAndroid) {

		self = Ti.UI.createWindow({
			title : 'Agenda Cartera',
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
			text : 'Agenda Cartera',
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
			title : 'Agenda Cartera',
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

		var contactsTitleContainer = Ti.UI.createView({
			backgroundColor : Config.subtitleBackgroundColor,
			borderRadius : Config.subtitleBorderRadius,
			height : Config.subtitleHeight,
			width : Ti.UI.SIZE,
			top : '16dp'
		});

		var contactsTitleLabel = Ti.UI.createLabel({
			text : 'CONTACTOS',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : Config.subtitleFont,
			color : Config.subtitleTextColor,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			left : '16dp',
			right : '16dp'
		});

		contactsTitleContainer.add(contactsTitleLabel);

		contactsContainer = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			top : '8dp',
			layout : 'vertical'
		});

		var contactsIndicator = Ti.UI.createActivityIndicator({
			style : Config.isAndroid ? Ti.UI.ActivityIndicatorStyle.BIG_DARK : Ti.UI.ActivityIndicatorStyle.DARK,
			height : '120dp',
			width : '120dp'
		});

		work.push(contactsIndicator);
		contactsContainer.add(contactsIndicator);

		scroll.add(contactsTitleContainer);
		scroll.add(contactsContainer);

		content.add(scroll);

		self.add(content);

	}

	function addData(data) {

		contactsContainer.removeAllChildren();

		for (var index in data) {

			var box = Ti.UI.createView({
				backgroundColor : Config.containerBackgroundColor,
				borderRadius : Config.bigborderRadius,
				top : '8dp',
				left : '16dp',
				right : '16dp',
				bottom : '0dp',
				height : Config.biggerinputHeight,
				width : Ti.UI.FILL,
				rippleColor : Config.accent,
				callback : openContact,
				params : data[index],
				finish : finish
			});

			box.addEventListener('click', function(e) {
				if (clicking == false) {
					clicking = true;
					ripple.effect(e);
				}
			});

			var pic = Ti.UI.createImageView({
				borderRadius : '24dp',
				borderWidth : '1dp',
				borderColor : Config.hintgray,
				image : data[index].pic,
				height : '48dp',
				width : '48dp',
				left : '8dp',
				touchEnabled : false
			});

			var company = Ti.UI.createLabel({
				text : data[index].company_name,
				font : Config.inputFont,
				color : Config.inputTextColor,
				height : 'auto',
				width : 'auto',
				left : '64dp',
				top : '8dp',
				touchEnabled : false
			});

			var name = Ti.UI.createLabel({
				text : data[index].name,
				font : Config.inputFont,
				color : Config.accent,
				height : 'auto',
				width : 'auto',
				left : '64dp',
				touchEnabled : false
			});

			var position = Ti.UI.createLabel({
				text : data[index].position,
				font : Config.inputFont,
				color : Config.accent,
				height : 'auto',
				width : 'auto',
				left : '64dp',
				bottom : '8dp',
				touchEnabled : false
			});

			var arrow = Ti.UI.createImageView({
				image : '/images/ic_navigate_next.png',
				height : '32dp',
				width : '32dp',
				right : '4dp',
				opacity : 0.6,
				touchEnabled : false
			});

			box.add(pic);
			box.add(company);
			box.add(name);
			box.add(position);
			box.add(arrow);

			contactsContainer.add(box);

		}

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
		xhr.getContacts(gotData);
	}

	function openContact(contact) {
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

module.exports = Contacts;
