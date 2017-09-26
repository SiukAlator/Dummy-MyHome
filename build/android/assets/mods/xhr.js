var Config = require('/libs/Config');


exports.login = function(callback, params) {
	if (Config.mode == 0) {
		Ti.API.info('xhr.login->params: ' + JSON.stringify(params));
	}
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			if (Config.mode == 0) {
				Ti.API.info('xhr.login: ' + this.responseText);
			}
			var json = JSON.parse(this.responseText);
			callback(json);
		},
		onerror : function(e) {
			Ti.API.debug(e.error);
			callback(false);
		},
		timeout : 20000
	});
	//client.open('POST', Config.SERVER_BASE_URL + 'login');
	client.open('GET', Config.SERVER_BASE_URL + 'hello/dhhfd');
	client.setRequestHeader('ubqti_api_version', Config.ubqti_api_version);
	client.send(params);
};

exports.getHome = function(callback) {
	var json = {
		response : {
			data : [{
				id : '668c5135-71a5-429f-9990-9eaab55f46f1',
				date : 1479839603000,
				title : 'Reunión Coca Cola',
				isPending : true
			}, {
				id : '9125c832-9675-47fa-9518-8a27e7b5f94b',
				date : 1479666803000,
				title : 'Enviar propuesta entel',
				isPending : false
			}, {
				id : '088c185d-d462-4ce0-9c25-5dad6a7d02c8',
				date : 1479494003000,
				title : 'Seguimiento propuesta claro para Teletón 2016',
				isPending : true
			}]
		}
	};
	setTimeout(function(e) {
		callback(json);
	}, 2000);
};

exports.getContacts = function(callback) {
	var json = {
		response : {
			data : [{
				id : '668c5135-71a5-429f-9990-9eaab55f46f1',
				company_name : 'COCA COLA',
				name : 'Raúl Carreño',
				position : 'Gerente Marketing',
				pic : 'https://randomuser.me/api/portraits/men/44.jpg'
			}, {
				id : '668c5135-71a5-429f-9990-9eaab55f46f1',
				company_name : 'RIPLEY',
				name : 'Marcela Sepúlveda',
				position : 'Gerente Ventas',
				pic : 'https://randomuser.me/api/portraits/women/44.jpg'
			}, {
				id : '668c5135-71a5-429f-9990-9eaab55f46f1',
				company_name : 'ENTEL',
				name : 'Camila Valdebenito',
				position : 'Gerente RR.HH.',
				pic : 'https://randomuser.me/api/portraits/women/40.jpg'
			}]
		}
	};
	setTimeout(function(e) {
		callback(json);
	}, 2000);
};

exports.getProjects = function(callback) {
	var json = {
		response : {
			data : [{
				id : '2f6aa42f-626a-488d-bfd8-214b16010c85',
				name : 'Trazado',
				percentage : '50%',
				medium : 'TV'
			}, {
				id : 'fdde19f9-95f0-44b3-89fc-950e38ad97b0',
				name : 'Yeso',
				percentage : '75%',
				medium : 'WEB'
			}, {
				id : '1d4d6710-1dd4-4fbb-948b-2745f8ad2133',
				name : 'Esquinero',
				percentage : '25%',
				medium : 'TV'
			}]
		}
	};
	setTimeout(function(e) {
		callback(json);
	}, 2000);
};

exports.getOppo = function(callback) {
	var json = {
		response : {
			data : [{
				id : '5f270c91-93f2-4b3e-b474-9b507be8b359',
				date : 1481212800000,
				company_name : 'Coca Cola',
				text : 'Se ha generado una oportunidad en Coca Cola'
			}, {
				id : 'a070ebc3-4e4c-41e6-80c7-62a5cee7c983',
				date : 1481810400000,
				company_name : 'ENTEL',
				text : 'Se ha generado una oportunidad en ENTEL'
			}, {
				id : '9be476f7-eba9-4fb2-82c4-011c13ef9390',
				date : 1482433200000,
				company_name : 'CLARO',
				text : 'Se ha generado una oportunidad en CLARO'
			}]
		}
	};
	setTimeout(function(e) {
		callback(json);
	}, 2000);
};

exports.getCalendarEvents = function(callback, month_id) {
	if (month_id == '12/2016') {
		var json = {
			response : {
				data : [{
					id : '222c7343-f446-40ff-873a-8cb29645525e',
					from : 1481043600000,
					to : 1481050800000,
					title : 'Reunión Señores Papis',
					color : '#8e2090'
				}, {
					id : '86f0d5c5-a266-47b8-8b12-fb2480406392',
					from : 1481893200000,
					to : 1481900400000,
					title : 'Estreno Mucho Lucho',
					color : '#5e5e5e'
				}, {
					id : 'ef4c8dc4-33d8-46fa-abf0-f371dd4b2f87',
					from : 1482328800000,
					to : 1482336000000,
					title : 'Reunión Ámbar',
					color : '#c98e1a'
				}]
			}
		};
	} else {
		var json = {
			response : {
				data : []
			}
		};
	}
	setTimeout(function(e) {
		callback(json, month_id);
	}, 2000);
};
