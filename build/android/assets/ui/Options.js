var Config = require('/libs/Config');

var leftButton;

function Options(drawer) {

	var draw = drawer;

	var tableData = [];
	var table = Ti.UI.createTableView({
		backgroundColor : Config.optionsBackground,
		separatorColor : Config.optionsBackground,
	});
	var tableContainer = Ti.UI.createView({
		top : '16dp',
		height : Ti.UI.FILL,
		width : Ti.UI.FILL
	});
	tableContainer.add(table);

	var self;
	var nav;

	var content = Ti.UI.createView({
		height : Ti.UI.FILL,
		width : Ti.UI.FILL,
		layout : 'vertical'
	});

	if (Config.isAndroid) {

		self = Ti.UI.createView({
			backgroundColor : Config.optionsBackground,
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

		leftButton = Ti.UI.createButton({
			left : '4dp',
			height : '40dp',
			width : '40dp',
			backgroundImage : '/images/ic_menu_w.png'
		});
		leftButton.addEventListener('click', function() {
			draw.toggleLeftWindow();
		});

		var centerLabel = Ti.UI.createLabel({
			text : 'Opciones',
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
			draw.toggleLeftWindow();
		});

		self = Ti.UI.createWindow({
			title : 'Opciones',
			navBarHidden : false,
			exitOnClose : true,
			leftNavButtons : [leftButton],
			windowSoftInputMode : Config.softInput,
			backgroundColor : Config.optionsBackground,
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

	function construct() {

		content.add(tableContainer);

		self.add(content);

		if (Config.isAndroid) {
			draw.setCenterWindow(self);
		} else {
			draw.setCenterWindow(nav);
		}

	}

	function buildOptions() {

		var data = [{
			field_type : 'button',
			title : 'Cerrar Sesión',
			message : '',
			icon : 'ic_close.png',
			identifier : 'exitapp',
			callback : 'exit'
		}];

		tableData = [];

		var leadingRow = Ti.UI.createTableViewRow({
			height : '1dp',
			color : Config.optionsSeparatorColor,
			backgroundColor : Config.optionsSeparatorColor,
			backgroundSelectedColor : Config.optionsBackground,
			left : '16dp',
			right : '16dp'
		});

		tableData.push(leadingRow);

		for (index in data) {

			var row;
			if (Config.isAndroid) {
				row = Ti.UI.createTableViewRow({
					height : Ti.UI.SIZE,
					backgroundColor : Config.optionsBackground,
					backgroundSelectedColor : Config.optionsBackground
				});
			} else {
				row = Ti.UI.createTableViewRow({
					selectionStyle : Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
					height : Ti.UI.SIZE,
					backgroundColor : Config.optionsBackground,
					backgroundSelectedColor : Config.optionsBackground
				});
			}

			var box = Ti.UI.createView({
				id : data[index].identifier,
				backgroundColor : Config.optionsBackground,
				backgroundSelectedColor : Config.optionsSelectedBackground,
				height : Config.optionsRowHeight,
				width : Ti.UI.FILL
			});

			var icon = Ti.UI.createImageView({
				image : '/images/' + data[index].icon,
				height : Config.biginputIconSize,
				width : Config.biginputIconSize,
				left : '16dp',
				opacity : 0.4,
				touchEnabled : false
			});

			var textContainer = Ti.UI.createView({
				left : '72dp',
				right : '72dp',
				height : Ti.UI.SIZE,
				width : Ti.UI.FILL,
				layout : 'vertical',
				touchEnabled : false
			});

			var titleLabel = Ti.UI.createLabel({
				text : data[index].title,
				font : Config.optionsTitleFont,
				color : Config.optionsTitleColor,
				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE,
				left : '0dp',
				touchEnabled : false
			});

			var messageLabel = Ti.UI.createLabel({
				text : data[index].message,
				font : Config.optionsMessageFont,
				color : Config.optionsMessageColor,
				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE,
				left : '0dp',
				touchEnabled : false
			});

			var rowSwitch = Ti.UI.createSwitch({
				value : false,
				right : '8dp',
				bubbleParent : false
			});

			rowSwitch.callback = data[index].callback;
			box.callback = data[index].callback;

			box.add(icon);

			textContainer.add(titleLabel);
			if (data[index].message != '') {
				textContainer.add(messageLabel);
			}

			box.add(textContainer);

			if (data[index].field_type == 'switch') {
				box.add(rowSwitch);
				box.rowSwitch = rowSwitch;
			} else {
				box.rowSwitch = null;
			}

			row.add(box);

			tableData.push(row);

			box.addEventListener('click', function(e) {
				if (this.rowSwitch != null) {
					if (this.rowSwitch.value == true) {
						this.rowSwitch.value = false;
					} else {
						this.rowSwitch.value = true;
					}
				}
				self[this.callback](this.rowSwitch);
			});

			rowSwitch.addEventListener('click', function(e) {
				self[this.callback](this);
			});

			var separatorRow = Ti.UI.createTableViewRow({
				height : '1dp',
				color : Config.optionsSeparatorColor,
				backgroundColor : Config.optionsSeparatorColor,
				backgroundSelectedColor : Config.optionsBackground,
				left : '16dp',
				right : '16dp'
			});

			tableData.push(separatorRow);

		}

		table.setData(tableData);

	}

	function exit(rowSwitch) {
		var close = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Cerrar', 'Cancelar'],
			message : '¿Seguro que quiere cerrar su sesión y salir?',
			title : 'Cerrar Sesión'
		});
		close.addEventListener('click', function(e) {
			if (e.index == 0) {
				Ti.App.Properties.setObject('google_auth', null);
				Ti.App.Properties.setObject('me', null);
				// var Window = require('/ui/Login');
				// new Window();
				// Config.drawer.close();
				// Ti.App._restart();
				if (Config.isAndroid) {
					Config.drawer.close();
				} else {
					Config.drawer.close();
				}
			}
		});
		close.show();
	}

	self['exit'] = exit;

	construct();
	buildOptions();

	return self;
}

module.exports = Options;
