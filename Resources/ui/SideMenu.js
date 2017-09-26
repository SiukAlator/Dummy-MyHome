var Config = require('/libs/Config');

var topLabels = ['METAS Y TAREAS', 'CALENDARIO', 'AGENDA CARTERA', 'PROYECTOS', 'ALERTAS DE NEGOCIO', 'MI EQUIPO', 'MENSAJERIA'];
var topImages = [];
var bottomLabels = ['CERRAR SESIÓN'];
var bottomImages = ['/images/ic_close_w.png'];

function SideMenu() {

	var self;
	var topTable;

	function construct() {

		var me = Ti.App.Properties.getObject('me', new Object);

		var user_job;

		if (me.user_type == 'USER') {
			user_job = 'Vendedor';
		} else {
			user_job = 'Supervisor';
		}

		var topRows = new Array();
		var bottomRows = new Array();

		if (Config.isAndroid) {
			self = Ti.UI.createView({
				height : Ti.UI.FILL,
				width : Ti.UI.FILL,
				backgroundColor : Config.sidemenuBackgroundColor
			});
		} else {
			self = Ti.UI.createWindow({
				height : Ti.UI.FILL,
				width : Ti.UI.FILL,
				backgroundColor : Config.sidemenuBackgroundColor,
				orientationModes : Config.orientation
			});
		}

		var barShadow = Ti.UI.createView({
			backgroundColor : Config.shadowColor,
			top : '0dp',
			height : '8dp',
			width : Ti.UI.FILL
		});

		var headerContainer = Ti.UI.createView({
			borderRadius : Config.borderRadius,
			height : '120dp',
			width : Ti.UI.FILL,
			top : '20dp',
			left : '16dp',
			right : '16dp'
		});

		var headerTopBackground = Ti.UI.createView({
			backgroundColor : Config.darkpurple,
			borderRadius : Config.borderRadius,
			height : '50dp',
			width : Ti.UI.FILL,
			top : '40dp'
		});

		var headerBotBackground = Ti.UI.createView({
			backgroundColor : Config.darkerpurple,
			height : '40dp',
			width : Ti.UI.FILL,
			bottom : '0dp'
		});

		var name = Ti.UI.createLabel({
			text : 'UBQTi' + ' ' + 'Team',
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.sidemenuTextColor,
			height : 'auto',
			width : 'auto',
			left : '16dp',
			bottom : '44dp',
		});

		var position = Ti.UI.createLabel({
			text : user_job,
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			color : Config.sidemenuTextColor,
			height : 'auto',
			width : 'auto',
			left : '16dp',
			top : '84dp'
		});

		var pic = Ti.UI.createImageView({
			borderRadius : '25dp',
			borderWidth : '1dp',
			borderColor : Config.hintgray,
			image : '/images/ubqti.png',
			height : '50dp',
			width : '50dp',
			top : '0dp'
		});

		headerContainer.add(headerTopBackground);
		headerContainer.add(headerBotBackground);
		headerContainer.add(name);
		headerContainer.add(position);
		headerContainer.add(pic);

		topTable = Ti.UI.createView({
			top : '150dp',
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			backgroundColor : Config.sidemenuBackgroundColor,
			layout : 'vertical'
		});

		for (var i = 0; i < topLabels.length; i++) {

			var rowBox = Ti.UI.createView({
				backgroundColor : Config.sidemenuBoxesColor,
				borderRadius : Config.borderRadius,
				height : '40dp',
				width : Ti.UI.FILL,
				top : '4dp',
				left : '16dp',
				right : '16dp',
				bottom : '4dp',
				id : topLabels[i],
				index : i,
				rippleColor : Config.white
			});

			var label = Ti.UI.createLabel({
				text : topLabels[i],
				font : {
					fontSize : '12dp',
					fontWeight : 'bold'
				},
				color : Config.sidemenuTextColor,
				height : 'auto',
				width : 'auto',
				left : '16dp',
				right : '16dp',
				touchEnabled : false
			});

			rowBox.add(label);

			topTable.add(rowBox);

		}

		for (var i = 0; i < bottomLabels.length; i++) {

			var row = Ti.UI.createTableViewRow({
				backgroundColor : Config.sidemenuBackgroundColor,
				height : '48dp',
				id : bottomLabels[i],
				index : i + 10
			});

			var image = Ti.UI.createImageView({
				image : bottomImages[i],
				height : '24dp',
				width : '24dp',
				left : '12dp'
			});

			var label = Ti.UI.createLabel({
				text : bottomLabels[i],
				font : {
					fontSize : '18dp'
				},
				color : Config.sidemenuTextColor,
				height : 'auto',
				width : 'auto',
				left : '48dp'
			});

			row.add(image);
			row.add(label);
			bottomRows.push(row);

			if (i < bottomLabels.length - 1) {
				var separator = Ti.UI.createTableViewRow({
					height : '1dp',
					backgroundColor : Config.lightgray
				});
				bottomRows.push(separator);
			}

		}

		var bottomTable;
		if (Config.isAndroid) {
			bottomTable = Ti.UI.createTableView({
				bottom : '32dp',
				height : Ti.UI.SIZE,
				width : Ti.UI.FILL,
				backgroundColor : Config.sidemenuBackgroundColor
			});
		} else {
			bottomTable = Ti.UI.createTableView({
				bottom : '32dp',
				height : Ti.UI.SIZE,
				width : Ti.UI.FILL,
				backgroundColor : Config.sidemenuBackgroundColor,
				scrollable : false,
				separatorStyle : Ti.UI.iPhone.TableViewSeparatorStyle.NONE
			});
		}
		bottomTable.setData(bottomRows);

		self.add(barShadow);
		self.add(headerContainer);
		self.add(topTable);
		self.add(bottomTable);

	}

	construct();
	return self;
}

module.exports = SideMenu;
