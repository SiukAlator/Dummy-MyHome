function async() {
}

async.moment = require('/libs/moment');
async.moment.locale('es');

async.timer = setInterval(function() {
	var data = db.selectASYNCSALES();

	Ti.Geolocation.getCurrentPosition(function(loc) {

		for (index in data.data) {

			if (data.data[index].type == null) {

				db.deleteASYNCSALES(data.data[index].id);

			} else {

				if (loc.success == true) {
					data.data[index].geospatial_data.sent = {
						timestamp : async.moment().valueOf(),
						lon : loc.coords.longitude,
						lat : loc.coords.latitude
					};
				} else {
					data.data[index].geospatial_data.sent = {
						error : true
					};
				}

				xhr.sales(async.callback, data.data[index].id, data.data[index].type, JSON.stringify(data.data[index].values), JSON.stringify(data.data[index].geospatial_data));
			}

		}

	});

}, 20000);

async.callback = function(id, response) {
	if (response.status.code == 200) {
		db.deleteASYNCSALES(id);
	}
};

module.exports = async;
