var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');

function ProjectView(nav, prevWin, project) {

	var clicking = false;

	var self;

	var content = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		layout : 'vertical'
	});

	if (Config.isAndroid) {

		self = Ti.UI.createWindow({
			title : project.name,
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
			text : project.name,
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
			title : project.name,
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

		var partida_1 = Ti.UI.createView({

			width : Ti.UI.FILL,
			left : '0dp',
			layout : 'vertical',
			backgroundColor : Config.red
		});

		var text1 = Ti.UI.createLabel({
			font : Config.inputFont,
			color : Config.inputTextColor,
			height : 'auto',
			width : 'auto',
			left : '16dp',
			right : '45%',
			text : 'asdf',
			touchEnabled : false
		});

		var createButton = Ti.UI.createButton({
			title : '',
			bottom : 10,
			right : 10,
			width : Ti.UI.SIZE,
			height : 50
		});

		createButton.title = "Guardar";
		createButton.addEventListener('click', function(e) {
			prevWin.callHome();
			if (clicking == false) {
				close();
			}
		});

		partida_1.add(text1);
		partida_1.add(createButton);

		content.add(partida_1);

		self.add(content);

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

}

module.exports = ProjectView;
