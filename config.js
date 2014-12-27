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
};

var RST_ROUTES = {
	defaultRoute : {
		route : '',
		controller : 'myApp/controllers/defaultController.js',
		view : 'myApp/views/defaultView.html'
	},
	maincar : {
		route : 'maincar/{{myPersonalVariable}}/{{anotherAwesomeVar}}',
		controller : 'myApp/controllers/anotherController.js',
		view : 'myApp/views/anotherView.html'
	},
	detailcar : {
		route : 'detailcar/{{MyVar}}/somePath/{{idsAreCool}}/',
		controller : 'myApp/controllers/myController.js',
		view : 'myApp/views/myView.html'
	}
};
 */

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
};

var RST_ROUTES = {
	defaultRoute : {
		route : '',
		controller : 'myApp/controllers/defaultController.js',
		view : 'myApp/views/defaultView.html'
	},
	maincar : {
		route : 'maincar/{{myPersonalVariable}}/{{anotherAwesomeVar}}',
		controller : 'myApp/controllers/anotherController.js',
		view : 'myApp/views/anotherView.html'
	},
	detailcar : {
		route : 'detailcar/{{MyVar}}/somePath/{{idsAreCool}}/',
		controller : 'myApp/controllers/myController.js',
		view : 'myApp/views/myView.html'
	}
};

