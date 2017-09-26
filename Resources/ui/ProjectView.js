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

		var funnelTitleContainer = Ti.UI.createView({
			backgroundColor : Config.subtitleBackgroundColor,
			borderRadius : Config.subtitleBorderRadius,
			height : Config.subtitleHeight,
			width : Ti.UI.SIZE,
			top : '16dp'
		});

		var funnelTitleLabel = Ti.UI.createLabel({
			text : 'SALES FUNNEL',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : Config.subtitleFont,
			color : Config.subtitleTextColor,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			left : '16dp',
			right : '16dp'
		});

		funnelTitleContainer.add(funnelTitleLabel);

		var funnelContainer = Ti.UI.createView({
			backgroundColor : Config.containerBackgroundColor,
			borderRadius : Config.bigborderRadius,
			top : '8dp',
			left : '16dp',
			right : '16dp',
			bottom : '8dp',
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL
		});

		var opportunityBlock = Ti.UI.createView({
			backgroundColor : Config.green,
			top : '40dp',
			left : '32dp',
			right : '32dp',
			bottom : '8dp',
			height : '48dp',
			width : Ti.UI.FILL
		});

		var opportunityLeftBorder = Ti.UI.createImageView({
			image : '/images/funnel_left.png',
			height : '48dp',
			width : '16dp',
			left : '0dp',
			touchEnabled : false
		});

		var opportunityRightBorder = Ti.UI.createImageView({
			image : '/images/funnel_right.png',
			height : '48dp',
			width : '16dp',
			right : '0dp',
			touchEnabled : false
		});

		var opportunityLabel = Ti.UI.createLabel({
			text : 'OPORTUNIDAD',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : Config.subtitleFont,
			color : Config.subtitleTextColor,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			touchEnabled : false
		});

		opportunityBlock.add(opportunityLeftBorder);
		opportunityBlock.add(opportunityRightBorder);
		opportunityBlock.add(opportunityLabel);

		var proposalBlock = Ti.UI.createView({
			backgroundColor : Config.orange,
			top : '104dp',
			left : '54dp',
			right : '54dp',
			bottom : '8dp',
			height : '48dp',
			width : Ti.UI.FILL
		});

		var proposalLeftBorder = Ti.UI.createImageView({
			image : '/images/funnel_left.png',
			height : '48dp',
			width : '16dp',
			left : '0dp',
			touchEnabled : false
		});

		var proposalRightBorder = Ti.UI.createImageView({
			image : '/images/funnel_right.png',
			height : '48dp',
			width : '16dp',
			right : '0dp',
			touchEnabled : false
		});

		var proposalLabel = Ti.UI.createLabel({
			text : 'PROPUESTA',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : Config.subtitleFont,
			color : Config.subtitleTextColor,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			touchEnabled : false
		});

		proposalBlock.add(proposalLeftBorder);
		proposalBlock.add(proposalRightBorder);
		proposalBlock.add(proposalLabel);

		var saleBlock = Ti.UI.createView({
			backgroundColor : Config.red,
			top : '168dp',
			left : '76dp',
			right : '76dp',
			bottom : '24dp',
			height : '48dp',
			width : Ti.UI.FILL
		});

		var saleLeftBorder = Ti.UI.createImageView({
			image : '/images/funnel_left.png',
			height : '48dp',
			width : '16dp',
			left : '0dp',
			touchEnabled : false
		});

		var saleRightBorder = Ti.UI.createImageView({
			image : '/images/funnel_right.png',
			height : '48dp',
			width : '16dp',
			right : '0dp',
			touchEnabled : false
		});

		var saleLabel = Ti.UI.createLabel({
			text : 'VENTA',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : Config.subtitleFont,
			color : Config.subtitleTextColor,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			touchEnabled : false
		});

		saleBlock.add(saleLeftBorder);
		saleBlock.add(saleRightBorder);
		saleBlock.add(saleLabel);

		funnelContainer.add(opportunityBlock);
		funnelContainer.add(proposalBlock);
		funnelContainer.add(saleBlock);

		scroll.add(funnelTitleContainer);
		scroll.add(funnelContainer);

		content.add(scroll);

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
