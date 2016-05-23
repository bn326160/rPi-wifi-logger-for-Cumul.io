# rPi wifi logger for Cumul.io
Creates a dataset on Cumul.io, scans the area for wifi networks and pushed that data to Cumul.io

## Requirements
* Python
* Node.js

### Aptitude
* python-pip
* python-dev
* build-essential
* nodejs
* wicd
* python-wicd
* python-gobject
* python-dbus

#### Installation
```sudo apt-get update && sudo apt-get install python-pip python-dev build-essential nodejs wicd python-wicd python-gobject python-dbus```

### Npm
* bluebird
* python-shell
* cumulio

#### Installation
```npm install bluebird python-shell cumulio```

## Based on
* [wconfig.py](https://github.com/webnull-archived-projects/wconfig/blob/master/wconfig.py)

## Usage
### CumulioWifiLog.js
```
var client = new Cumulio({
	api_key: '',
	api_token: ''
});

var datasetID;
var interval = 5*60*1000; // 5 Minutes
```

Enter your Cumul.io credentials. If you already have an existing dataset, enter it's UUID in the datasetID var. Scan interval is configurable.