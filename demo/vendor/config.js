/*
The configuration file for RestLib.js
This configuration must be full valid and correct,
You have to follow the exact schema,
Please verify your services list.
This is an example keep it as a base schema.

DO NOT : - Change the name of RESTCONFIG, base or services.
- Add a / the end of the base Adress.
- Add a / before the service's url.


DO : - Follow the exact service pattern.
- Add method and url to every service.
- Add all the services that you want.
- Choose any name for your service, it is independent from the url.

EXAMPLE :

var RESTCONFIG = {
base : 'http://www.acme.com:80/any/other/path',
services : {
getArticle : {
method : "GET",
url : "article"
},
myAwesomeService : {
method : "POST",
url : "myService"
}
}
}
retwitbymeService : {
			method : "GET",
			url : "	1.1/account/verify_credentials.json"
		},
		base : 'https://oauth.io/request/twitter'
 */


var RESTCONFIG = {
	base : 'http://www.carqueryapi.com/api/0.3',
	services : {
		maincarService : {
			method : "GET",
			url : ''
		},
		googleService : {
			method : "GET",
			url : ''
		},
		detailcarService : {
			method : "GET",
			url : ''
		}
	}
};

var RST_ROUTES = {
	defaultRoute : {
		route : '',
		controller : 'carqueryapi/controllers/defaultController.js',
		view : 'carqueryapi/views/defaultView.html'
	},
	maincar : {
		route : 'maincar/{{name}}/{{year}}',
		controller : 'carqueryapi/controllers/maincarController.js',
		view : 'carqueryapi/views/maincarView.html'
	},
	detailcar : {
		route : 'detailcar/{{name}}/{{year}}/{{id}}/{{type}}',
		controller : 'carqueryapi/controllers/detailcarController.js',
		view : 'carqueryapi/views/detailcarView.html'
	},
	yearcar: {
	    route: 'yearcar/{{name}}',
	    controller: 'carqueryapi/controllers/yearcarController.js',
	    view: 'carqueryapi/views/yearcarView.html'
	}
};

