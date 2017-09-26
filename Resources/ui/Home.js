var Config = require('/libs/Config');
var ripple = require('/libs/Ripple');
var xhr = require('/mods/xhr');
var moment = require('/libs/moment');
moment.locale('es');

var self;
var nav;
var content;

var work = [];

var myGoalsContainer;

var leftButton;

var clicking;

function Home(drawer) {

	clicking = false;

	content = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		layout : 'vertical'
	});

	if (Config.isAndroid) {

		self = Ti.UI.createView({
			backgroundColor : Config.backgroundColor,
			height : Ti.UI.FILL,
			width : Ti.UI.FILL
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
			backgroundImage : '/images/ic_menu_w.png',
			rippleColor : Config.white,
			callback : openMenu,
			finish : finish
		});

		leftButton.addEventListener('click', function(e) {
			if (clicking == false) {
				clicking = true;
				ripple.round(e);
			}
		});

		var centerLabel = Ti.UI.createLabel({
			text : 'Metas y Tareas',
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
			backgroundImage : '/images/ic_menu_w.png',
			height : 'auto',
			width : 'auto'
		});
		leftButton.addEventListener('click', function() {
			if (clicking == false) {
				openMenu();
			}
		});

		self = Ti.UI.createWindow({
			title : 'Metas y Tareas',
			navBarHidden : false,
			exitOnClose : true,
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
	var scroll;

	function construct() {

		scroll = Ti.UI.createScrollView({
			showVerticalScrollIndicator : true,
			width : Ti.UI.FILL,
			top : '0dp',
			bottom : '0dp',
			layout : 'vertical',
			scrollType : 'vertical'
		});

		var myGoalsTitleContainer = Ti.UI.createView({
			backgroundColor : Config.subtitleBackgroundColor,
			borderRadius : Config.subtitleBorderRadius,
			height : Config.subtitleHeight,
			width : Ti.UI.SIZE
		});

		var myGoalsTitleLabel = Ti.UI.createLabel({
			text : 'MIS TAREAS',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : Config.subtitleFont,
			color : Config.subtitleTextColor,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			left : '16dp',
			right : '16dp'
		});

		myGoalsTitleContainer.add(myGoalsTitleLabel);

		myGoalsContainer = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			top : '8dp',
			layout : 'vertical'
		});

		var myGoalsIndicator = Ti.UI.createActivityIndicator({
			style : Config.isAndroid ? Ti.UI.ActivityIndicatorStyle.BIG_DARK : Ti.UI.ActivityIndicatorStyle.DARK,
			height : '120dp',
			width : '120dp'
		});

		work.push(myGoalsIndicator);
		myGoalsContainer.add(myGoalsIndicator);

		//scroll.add(myGoalsTitleContainer);
		scroll.add(myGoalsContainer);

		content.add(scroll);

		self.add(content);

		if (Config.isAndroid) {
			drawer.setCenterWindow(self);
		} else {
			drawer.nav = nav;
			drawer.setCenterWindow(nav);
		}

		getData();

	}

	function project() {
	}

	var graphic = Titanium.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE
	});

	function createGraphic() {
		var baseCircle = Titanium.UI.createView({
			borderRadius : 150,
			backgroundColor : 'white',
			width : 150,
			height : 150,
			top : 100

		});
		
		var unoPorciento = baseCircle.getWidth() / 100;
		
		var radio = baseCircle.getWidth() / 2;
		
		var lineCircle1 = Titanium.UI.createView({
			borderRadius : 150,
			backgroundColor : 'black',
			width : unoPorciento,
			height : radio,
			top : 0,
			right: radio

		});
		
		var lineCircle = Titanium.UI.createView({
			borderRadius : 150,
			backgroundColor : 'black',
			width : unoPorciento,
			height : radio,
			right : radio/2 + radio/8,
			top: radio/8,
			transform: Ti.UI.create2DMatrix().rotate(45)

		});
		
		var lineCircle2 = Titanium.UI.createView({
			borderRadius : 150,
			backgroundColor : 'black',
			width : unoPorciento,
			height : radio,
			right : radio/2,
			top: radio/2,
			transform: Ti.UI.create2DMatrix().rotate(90)

		});
		
		var lineCircle3 = Titanium.UI.createView({
			borderRadius : 150,
			backgroundColor : 'black',
			width : unoPorciento,
			height : radio,
			right : radio/8 + radio/2,
			top: radio/2 + radio/4,
			transform: Ti.UI.create2DMatrix().rotate(135)

		});
		
		var lineCircle4 = Titanium.UI.createView({
			borderRadius : 150,
			backgroundColor : 'black',
			width : unoPorciento,
			height : radio,
			right : radio,
			top: radio,
			transform: Ti.UI.create2DMatrix().rotate(180)

		});
		baseCircle.add(lineCircle1);
		baseCircle.add(lineCircle);
		baseCircle.add(lineCircle2);
		baseCircle.add(lineCircle3);
		baseCircle.add(lineCircle4);
		graphic.add(baseCircle);
	}

	function addData(data) {

		myGoalsContainer.removeAllChildren();

		var viewArr = [];
		var containerPartida = Ti.UI.createScrollableView({
			showPagingControl : false,
			scrollingEnabled : true,
			height : '100dp'
		});

		var partida_1 = Ti.UI.createView({

			width : Ti.UI.FILL,
			left : '0dp',
			layout : 'vertical',
			backgroundColor : Config.red
		});
		var partida_2 = Ti.UI.createView({

			width : Ti.UI.FILL,
			right : '0dp',
			layout : 'vertical',
			backgroundColor : Config.blue
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

		var text2 = Ti.UI.createLabel({
			font : Config.inputFont,
			color : Config.inputTextColor,
			height : 'auto',
			width : 'auto',
			left : '16dp',
			right : '45%',
			text : 'asdf2',
			touchEnabled : false
		});

		partida_1.add(text1);
		partida_2.add(text2);

		viewArr.push(partida_1);
		viewArr.push(partida_2);
		var flagView = 0;
		containerPartida.views = viewArr;

		containerPartida.addEventListener('scrollend', function(e) {

			if (flagView == 0 && e.currentPage == 1) {
				/*
				 if (Config.isAndroid) {
				 drawer.close();
				 } else {
				 self.close();
				 }
				 */
				myGoalsContainer.removeAllChildren();
				var Window = require('/ui/Detalle');
				project.name = 'Holanda';
				new Window(nav, self, project);

			} else {
				flagView = 0;

			}

		});

		myGoalsContainer.add(containerPartida);

		createGraphic();
		myGoalsContainer.add(graphic);

		/*
		 for (var index in data) {

		 var box = Ti.UI.createView({
		 backgroundColor : Config.containerBackgroundColor,
		 borderRadius : Config.bigborderRadius,
		 top : '8dp',
		 left : '16dp',
		 right : '16dp',
		 bottom : '0dp',
		 height : Config.biginputHeight,
		 width : Ti.UI.FILL,
		 rippleColor : Config.accent,
		 callback : openGoal,
		 params : data[index],
		 finish : finish
		 });

		 box.addEventListener('click', function(e) {
		 if (clicking == false) {
		 clicking = true;
		 ripple.effect(e);
		 }
		 });

		 var title = Ti.UI.createLabel({
		 text : data[index].title,
		 font : Config.inputFont,
		 color : Config.inputTextColor,
		 height : 'auto',
		 width : 'auto',
		 left : '16dp',
		 right : '45%',
		 touchEnabled : false
		 });

		 var date = Ti.UI.createLabel({
		 text : moment(data[index].date).locale(false).format('dddd DD MMMM'),
		 font : Config.inputFont,
		 color : Config.accent,
		 height : 'auto',
		 width : 'auto',
		 left : '60%',
		 right : '32dp',
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

		 box.add(title);
		 box.add(date);
		 box.add(arrow);

		 myGoalsContainer.add(box);

		 }*/

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
			Ti.API.info("ECHO: getData()");
			work[index].show();
		}
		xhr.getHome(gotData);
	}

	function openMenu() {
		drawer.toggleLeftWindow();
	}

	function openGoal(goal) {
		//
	}

	function finish() {
		clicking = false;
	}

	function callHome() {
		var myGoalsIndicator = Ti.UI.createActivityIndicator({
			style : Config.isAndroid ? Ti.UI.ActivityIndicatorStyle.BIG_DARK : Ti.UI.ActivityIndicatorStyle.DARK,
			height : '120dp',
			width : '120dp'
		});
		work.push(myGoalsIndicator);
		myGoalsContainer.add(myGoalsIndicator);
		getData();
	}

	construct();
	self.callHome = callHome;

	return self;

}

module.exports = Home;
