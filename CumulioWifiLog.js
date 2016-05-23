var Promise = require("bluebird");
var Cumulio = require('cumulio');
var PythonShell = require('python-shell');

var client = new Cumulio({
	api_key: 'YOUR API KEY', // Your Cumul.io API key
	api_token: 'YOUR API TOKEN' // Your Cumul.io API token
});

var datasetID; //= 'YOUR EXISTING DATASET'; // Your existing dataset UUID on Cumul.io
var interval = 5*60*1000; // 5 Minutes

var columns = [
	{EN: 'BSSID (Basic service set identifier)', NL: 'BSSID (Basisstation ID)', type:'hierarchy'},
	{EN: 'Name', NL: 'Naam', type:'hierarchy'},
	{EN: 'Discovered on', NL: 'Moment van detectie', type:'hierarchy'},
	{EN: 'Signal strength', NL: 'Signaalsterkte', type:'hierarchy'},
	{EN: 'Encryption', NL: 'Encryptie', type:'hierarchy'},
	{EN: 'Mode', NL: 'Modus', type:'hierarchy'},
	{EN: 'Channel', NL: 'Kanaal', type:'hierarchy'}
]

if (datasetID) {
	AddData();
	setInterval(AddData, interval);
}
else {
	client.create('securable',{
		name: {
			en: 'Wifi statistics',
			nl: 'Wifi-statistieken'},
		description: {
			en: 'Keeps a log of available wifi networks around using a Raspberry Pi.',
			nl: 'Houdt een log bij van beschikbare wifi-netwerken met behulp van een Raspberry Pi.'},
		type: 'dataset'
	})
	.then(function(dataset) {
		columns.forEach(function(column,i) {
			datasetID = dataset.id;

			client.create('column',{
				name: {
					en: column.EN,
					nl: column.NL
				},
				type: column.type,
				informat: column.type,
				order: i,
				color: '#45DE25'
			},
			[{
				role: 'Securable',
				id: dataset.id
			}]);
		})
	})
	.then(function() {
		console.log("Dataset created: ", datasetID);
		AddData();
		setInterval(AddData, interval);
	});
}

function AddData() {
	PythonShell.run('JSONWifiLog.py', function (err,results) {
		if (err) throw err;
		var networks = JSON.parse(results[0]);
		var rows = [];
		for (var i = 0; i < networks.length; i++) {
			var row = [];
			row.push(networks[i].bssid);
			row.push(networks[i].name);
			row.push(networks[i].discovertime);
			row.push(networks[i].strength);
			row.push(networks[i].encryption);
			row.push(networks[i].mode);
			row.push(networks[i].channel);
			rows.push(row);
		}
		console.log("Networks found: " + rows.length);
		client.create('data',{
				securable_id: datasetID,
				data: rows
			})
			.then(function() {
				console.log('Data added!');
			})
			.catch(function(error) {
				console.error('API error:', error);
			});
	});
}
