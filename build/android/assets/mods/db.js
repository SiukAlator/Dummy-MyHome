var Config = require('/libs/Config');

exports.checkDB = function() {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	db.execute('CREATE TABLE IF NOT EXISTS general (id INTEGER PRIMARY KEY, code TEXT, name TEXT, json_values TEXT);');

	db.close();
};

exports.dropGENERAL = function() {
	var db = Ti.Database.open(Config.DATABASE_NAME);
	db.execute('DROP TABLE IF EXISTS general');
	db.execute('CREATE TABLE IF NOT EXISTS general (id INTEGER PRIMARY KEY, code TEXT, name TEXT, json_values TEXT);');
	db.close();
};

exports.selectGENERAL = function(code) {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	var element;

	var res = db.execute('SELECT id, code, name, json_values FROM general WHERE code = ?', code);
	while (res.isValidRow()) {
		element = {
			id : res.fieldByName('id'),
			code : res.fieldByName('code'),
			name : res.fieldByName('name'),
			values : JSON.parse(res.fieldByName('json_values'))
		};
		res.next();
	}

	res.close();
	db.close();

	if (Config.mode == 0) {
		Ti.API.info('db.selectGENERAL: ' + JSON.stringify(element));
	}

	return element;
};

exports.insertGENERAL = function(params) {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	if (Config.mode == 0) {
		Ti.API.info('db.insertGENERAL: ' + JSON.stringify(params));
	}

	db.execute('INSERT INTO general (code, name, json_values) VALUES (?,?,?)', params['code'], params['name'], JSON.stringify(params['values']));

	db.close();
};

exports.updateGENERAL = function(params) {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	if (Config.mode == 0) {
		Ti.API.info('db.updateGENERAL: ' + JSON.stringify(params));
	}

	db.execute('UPDATE general SET code = ?, name = ?, json_values = ? WHERE code = ?', params['code'], params['name'], JSON.stringify(params['values']), params['code']);

	db.close();
};

exports.deleteGENERAL = function(code) {
	var db = Ti.Database.open(Config.DATABASE_NAME);

	if (Config.mode == 0) {
		Ti.API.info('db.deleteGENERAL: ' + JSON.stringify(code));
	}

	db.execute('DELETE FROM general WHERE code = ?', code);

	db.close();
};
