						/* 			RestLib
									Version 0.0.1 alpha
						 */
// Rest facade interface, this is the only point of interaction with the user.
// selector is a string parameter used to select the webservice desired, selector is the key of the RESTCONFIG.service[selector], it is case sensitive!
// data is an optional argument meant to be used if the user wants to send any data with his request.
function Rest(selector, data) {
	// Rest function wraps the RESTRequest "class".
	/* Start of Private scrope of Rest() */
	var _selector;
	var _header;
	var _data;
	var _result;
	var _selectedService;
	// Contains the details of the selected service after testing the 'selector'
	var _callbackStack = [function () {}

	];
	// Empty function to be sure to reserve the first callback (Testing pruposes)
	var _fallback = null;

	// Test the selector and data, if they exist in arguments, they're assigned
	if (selector != undefined)
		_selector = selector;
	if (data != undefined)
		_data = data;

	// Private function selectorTest(selector) used to test if 'selector' does exist in the RESTCONFIG object.
	function selectorTest(selector) {
		if (RESTCONFIG.services[selector]) {
			// If the selector is a valid key for the service, we assign the values.
			_selectedService = {
				method : RESTCONFIG.services[selector].method,
				url : RESTCONFIG.base + '/' + RESTCONFIG.services[selector].url
			}
			return _selectedService;
		} else {
			// If the service key does not refer to anything, null will be returned.
			return null;
		}
	}

	// Private function doCallstack(_event) is used to call the whole stack of instructions assigned in _callbackStack
	// _event is a String optional argument, the value of event is 'success' or 'fail'
	function doCallstack(_event) {
		for (var i = 0; i < _callbackStack.length ; i++) {
			try {
				_callbackStack[i](_event);
			} catch (e) {
				// Just in case of an exception generated by the _callbackStack functions, they will be catched by this fallback.
				if (_fallback) {
					_fallback(_event);
					break;
				}
			}
		};
	}

	/* The class 'RESTRequest', placed in the private scope */
	var RESTRequest = function () {
		/* Start of Private scrope of RESTRequest() */
		// RESTRequest() is a basic class regrouping methods to manipultaite the XMLHttpRequest object.
		// It is able to send requests, convert the send/recived data to JSON and handles the successful requests.
		var _request = null;
		var _JSONObject = null;
		var _subscriber = [];
		// Contains the subscriber interested of the state of RESTRequest instance.
		function init() {
			// The private function init() Tests if the browser supports XMLHttpRequests or not.
			if (window.XMLHttpRequest) {
				_request = new XMLHttpRequest();
			} else if (window.ActiveXObject) {
				_request = new ActiveXObject("Microsoft.XMLHTTP");
			}
		}
		init();
		// init() must be self-executed.

		function toJSON() {
			// The private function toJSON() :
			try {

				_JSONObject = JSON.parse(_request.responseText);
				// Converts the JSON response to an object that will be stored in _JSONObject.
			} catch (e) {
				// Handles the case of a corrupted JSON file or another content.
			}
		}

		// The private function fireEvent(_event) will notify the subscriber in case of a new event.
		function fireEvent(_event) {
		// notifies the subscribers of an event
			for (var i = 0; i < _subscriber.length; i++) {
				_subscriber[i](_event);
			}
		}

		/* End of Private scrope of RESTRequest() */
		return {
			/* Start of Public scrope of RESTRequest() */
			getRequest : function () {
				return _request;
			},
			getJSONObject : function () {
				return _JSONObject;
			},
			processRequest : function (method, url, content) {
				// Requests are called asynchronously, the user can't change the nature of this call.
				_request.onreadystatechange = function () {
					// XMLHttpRequest.onreadystatechange() is personnalized in orded to meet our specific needs.
					if (_request.readyState != 4)
						return;
					if (_request.status != 200){
						if(_request.status != 0) {
							fireEvent('fail');
						// If the request failed, subscribers will be notified with the 'fail' argument.
						return;
					}}
					if (_request.readyState == 4)
						if (_request.status == 200 || _request.status == 0) {
							// It the request succeed :
							toJSON();
							// Convert the response to JSON
							fireEvent('success');
							// Notify the subscribers of the 'success' argument.
						}
				}

				_request.open(method, url, true);
				_request.setRequestHeader("Content-Type", "application/json");
				if(_header){
					_request.setRequestHeader(_header.name, _header.value);
				}
				// If the argument content is defined it will be converted and send.
				if (content == undefined)
					_request.send(null);
				else
					_request.send(JSON.stringify(content));

			},
			subscribe : function (callback) {
				// The Public method subscribe(callback) is for subscribing.
				if (callback && typeof(callback) === "function")
					_subscriber.push(callback);
			}
		
		
			/* End of Public scrope of RESTRequest() */
		}
	}
			/* End of the class RESTRequest() */
	return {
			/* Start of Public scrope of Rest() */
		makeXHRequest : function(method, url, content, callback){
			var request = RESTRequest();
			request.subscribe(callback);
			request.processRequest(method, url, content);
			return request ;
		},
		call : function (_selector_, _data_) {
			// The public function call(_selector_,_data_) is able to make calls to a webservice.
			// The selector will specify the type of service to request.
			// The data argument is optional.
			if (_data_ != undefined)
				_data = _data_;
			// Defining a value of data in the call function will override the ancient data.
			if (_selector_ != undefined) {
				// If the user specifies two selectors like 'Rest('serviceOne').call('serviceTwo')' serviceTwo will be used.
				if (selectorTest(_selector_)) {
					// But before, we test the selector (serviceTwo in our example).
					// If 'serviceTwo' does really exist, it will be used, form used : Rest(_selector).call(_selector_)
					_selector = _selector_;
					var request = RESTRequest();
					request.subscribe(function (event) {
						// Subscribing to the RESTRequest instance and waiting for a an 'event'.
						if (event)
							doCallstack(event);
					});
					request.processRequest(_selectedService.method, _selectedService.url, _data);
				} else {
					// Now if 'serviceTwo' does not exist as a service :
					if (selectorTest(_selector)) {
						// Fortunatly, _selector was already defined, we can still process our request, form used : Rest(_selector).call(incorrect)
						var request = RESTRequest();
						request.subscribe(function (event) {
							// Subscribing to the RESTRequest instance and waiting for a an 'event'.
							if (event)
								doCallstack(event);
						});
						request.processRequest(_selectedService.method, _selectedService.url, _data);
					} else
						// The two defined selectors were not valid, and there is no valid selector stored we can't process !
						console.error('Selector ' + _selector + ' nor ' + _selector_ + ' are existing in the config !');
				}
			} else { 
				// _selector has a value the user made a Rest(_selector).call()
				if (selectorTest(_selector)) { 
					// _selector is a correct service
					var request = RESTRequest();
					request.subscribe(function (event) {
						// Subscribing to the RESTRequest instance and waiting for a an 'event'.
						if (event)
							doCallstack(event);
					});
					request.processRequest(_selectedService.method, _selectedService.url, _data);
				} else
					console.error('Selector ' + _selector + ' does not exist in the config ! '); 
					// The user made a Rest().call() or defined an incorrect selector.
			}
			// Testing pruposes :
			this.then(function (event) {
				_result = request.getJSONObject();
				_data = undefined ;
			}, 0);
		},
		/* Testing pruposes ! */
		// The Public then(callback, index) function is used to queue a set of jobs for the returned RESTRequest instance after the server's response
		// then is supposed to be a private function, it was placed public for testing.
		then : function (callback, index) {
		// The index and the if(index != undefined) are for testing pruposes.
			if (callback && typeof(callback) === "function") {
				if (index != undefined)
					_callbackStack[index] = (callback);
				else
					_callbackStack.push(callback);
			};
			return this;
		},
		// fail(callback) function is also placed here for testing pruposes.
		// fail function is for managing a fallback in case of an exception generated by the then callbacks stack.
		fail : function (callback) {
			if (callback && typeof(callback) === "function") {
				_fallback = callback;
			};
			return this;
		},
		// clearPromises() function is also for testing pruposes, it clears the stack of callbacks queued byt then.
		clearPromises : function () {
			_callbackStack = [function () {}

			];
			_fallback = null;
		},
		// getResult() is a simple getter.
		getResult : function () {
			return _result;
		},
		setCustomHeader: function(header, value) {
			_header = {name: header, value: value};
		}
	
	}
}

function RstView(template, placeHolder) {
	/* Start of the Private scope of RstView */
	var _template  = template ; // HTML #Id of the template to use
	var _placeHolder = placeHolder ; // HTML #Id of the place holder to use
	var _currentData ;
	
	function refreshThisView(content){
		// places the view template in the placeholder
		currentView = doT.template(document.getElementById(_template).text, undefined, _template);
		
			document.getElementById(_placeHolder).innerHTML = currentView(content);
	
		_currentData = content ;
	}
	/* End of the Private Scope of RstView */
	return {
		/* Start of the Public Scope of RstView */
		attachRestObject : function (_object_, fallback){
			// Attach a Rest Object to the View
			// Accepts a fallback function in case of a problem in loading the request
			function browse(_object_) {
				if(typeof _object_ == "object" && _object_.hasOwnProperty('then') && _object_.hasOwnProperty('fail') && 
			    	_object_.hasOwnProperty('getResult')) {
			    	_object_.then(function(event){
						refreshThisView(_object_);
					});
					_object_.fail(fallback);
			    }
			    else {
					for (model in _object_) {
					    if(typeof _object_[model] == "object" && _object_[model].hasOwnProperty('then') && _object_[model].hasOwnProperty('fail') && 
					    	_object_[model].hasOwnProperty('getResult')) {
					    	_object_[model].then(function(event){
								refreshThisView(_object_);
							});
							_object_[model].fail(fallback);
					    }
					    else if(_object_[model].constructor.name == "Array") {
					    	for (var i = 0; i < _object_[model].length; i++) {
								browse(_object_[model][i]);
							};
					    }
					}
				}
			}
			browse(_object_);
			
		},
		render : function (content){
			refreshThisView(content);
		},
		detachRestObject : function(_object_){
			// If we want to detach the view from the object
			_object_.clearPromises();
		},
		destructData : function(){
			_currentData = null ;
		},
		restoreData : function(){
			refreshThisView(_currentData);
		},
		setData : function(_data_){ 
			_currentState.data = _data_ ;
		}
		/* End of the public scope of RstView */
	}
}

function RstRouter(){
	// Router meta-class
	var _routeContent ;
	var _selectedRoute ;

	function compileRegExRoute(route){
	// Gets a route entry in the RST_ROUTE (the route config) and compiles it to a regex
		temp_RegEx = '^' ;
		var args_list = [];
		var arg_Route_Exp = '{([a-zA-Z0-9_]+)}';
		//var j = 0 ;
		var route_components = route.split('/');
		var i = 0 ;
		for (i in route_components){
			if(route_components[i].match(arg_Route_Exp)){
				// the {{argument}} form is detected
				args_list.push(route_components[i].match(arg_Route_Exp)[1]);
				// add an identifier to the argument
				temp_RegEx += '([a-zA-Z0-9-_%+]+)';
			} else {
				temp_RegEx += route_components[i];
			}
			temp_RegEx += '\/';
		}
		temp_RegEx += '$' ;
		temp_RegEx = temp_RegEx.replace('\/$', '$');
		var compiled = {};
		compiled.route = new RegExp(temp_RegEx);
		compiled.args = args_list ;
		return compiled ;
	}

	function createRouteTable(){
		var routeTable = {};
		for (var i in RST_ROUTES){
			routeTable[i] = compileRegExRoute(RST_ROUTES[i].route);
		}
		return routeTable ;
	} var RST_RCOMPILED = createRouteTable();

	function hashChangeHandler(){
		var _routeContent = window.location.hash.replace('#','') ;

		var chosenRoute = {};
		chosenRoute.args = {};
		for(var i in RST_RCOMPILED){
			var matchRoute = _routeContent.match(RST_RCOMPILED[i].route) ;
			if (matchRoute){
				chosenRoute.alias = i ;
				if (RST_RCOMPILED[i].args != 0 ){
					k = 1 ;
					for(j in RST_RCOMPILED[i].args){
						chosenRoute.args[RST_RCOMPILED[i].args[j]] =  matchRoute[k];
						k++;
					}
				}
			}
		}
		if (chosenRoute.alias != undefined)
			doLoadJob(chosenRoute.alias, chosenRoute.args);
		else
			doLoadJob('defaultRoute');
	}
	function appendFile2Doc(content, type, id){
		// appends a file loaded with XHR to the current document.
		var obj = document.createElement( "script" );
		if(document.getElementById(id)) return;
		else{
		obj.id = id;
		// If id is specified, we add an id attribute to the view mostly common with views
		obj.language = "javascript";
		obj.type = type;
		obj.defer = true ;
		obj.text = content ;
		document.body.appendChild(obj);}
	}

	function doLoadJob(routeAlias, args){
	    // function to make necessary loads after findind a route.
		var tempList = (RST_ROUTES[routeAlias].controller).split('/');
		var controllerName = tempList[tempList.length-1].replace('.js','');
		tempList = (RST_ROUTES[routeAlias].view).split('/');
		var viewName = tempList[tempList.length-1].replace('.js','');
		if(window[controllerName]!=undefined){
			var ctrllr = window[controllerName];
			if(RST_ROUTES[routeAlias].view != ''){
				var assVw = RstView(viewName, 'mainViewContent');
				ctrllr(assVw).index(args);
				return;
			}else{
				ctrllr().index(args);
				return;
			}
		}
		requestController = Rest().makeXHRequest('GET', RST_ROUTES[routeAlias].controller, undefined, function(event){
			if (event === 'success'){
				// trying to get the controller name
				
				appendFile2Doc(requestController.getRequest().responseText, 'text/javascript',controllerName);
				if (RST_ROUTES[routeAlias].view != ''){
					// View is defined Do the view load
					requestView = Rest().makeXHRequest('GET', RST_ROUTES[routeAlias].view, undefined, function(event){
						if(event === 'success'){
							appendFile2Doc(requestView.getRequest().responseText, 'text/x-dot-template',viewName);
							var ctrllr = window[controllerName];
							var assVw = RstView(viewName, 'mainViewContent');
							ctrllr(assVw).index(args);
							// place the controller in RST_CONTROLLERS
							// execute controller's index
						} else throw 'Problem during view load with route alias : '+routeAlias+'.';
					});
				}
				else{
					ctrllr().index(args);}
					// exectue controller's index !
			} else throw 'Problem during controller load with route alias : '+routeAlias+'.';
		});
	}

	function loadDefault(){
		if (window.location.hash === "")
			doLoadJob('defaultRoute');
		else
			hashChangeHandler();
	}
	window.onload = loadDefault; //trigger the hashchange !!!
	window.onhashchange = hashChangeHandler;
}RstRouter();

// doT.js
// 2011, Laura Doktorova, https://github.com/olado/doT
// Licensed under the MIT license.

(function() {
	"use strict";

	var doT = {
		version: '1.0.1',
		templateSettings: {
			evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
			interpolate: /\{\{=([\s\S]+?)\}\}/g,
			encode:      /\{\{!([\s\S]+?)\}\}/g,
			use:         /\{\{#([\s\S]+?)\}\}/g,
			useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
			define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
			defineParams:/^\s*([\w$]+):([\s\S]+)/,
			conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
			iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
			varname:	'it',
			strip:		true,
			append:		true,
			selfcontained: false
		},
		template: undefined, //fn, compile template
		compile:  undefined  //fn, for express
	}, global;

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = doT;
	} else if (typeof define === 'function' && define.amd) {
		define(function(){return doT;});
	} else {
		global = (function(){ return this || (0,eval)('this'); }());
		global.doT = doT;
	}

	function encodeHTMLSource() {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },
			matchHTML = /&(?!#?\w+;)|<|>|"|'|\//g;
		return function() {
			return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;
		};
	}
	String.prototype.encodeHTML = encodeHTMLSource();

	var startend = {
		append: { start: "'+(",      end: ")+'",      endencode: "||'').toString().encodeHTML()+'" },
		split:  { start: "';out+=(", end: ");out+='", endencode: "||'').toString().encodeHTML();out+='"}
	}, skip = /$^/;

	function resolveDefs(c, block, def) {
		return ((typeof block === 'string') ? block : block.toString())
		.replace(c.define || skip, function(m, code, assign, value) {
			if (code.indexOf('def.') === 0) {
				code = code.substring(4);
			}
			if (!(code in def)) {
				if (assign === ':') {
					if (c.defineParams) value.replace(c.defineParams, function(m, param, v) {
						def[code] = {arg: param, text: v};
					});
					if (!(code in def)) def[code]= value;
				} else {
					new Function("def", "def['"+code+"']=" + value)(def);
				}
			}
			return '';
		})
		.replace(c.use || skip, function(m, code) {
			if (c.useParams) code = code.replace(c.useParams, function(m, s, d, param) {
				if (def[d] && def[d].arg && param) {
					var rw = (d+":"+param).replace(/'|\\/g, '_');
					def.__exp = def.__exp || {};
					def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
					return s + "def.__exp['"+rw+"']";
				}
			});
			var v = new Function("def", "return " + code)(def);
			return v ? resolveDefs(c, v, def) : v;
		});
	}

	function unescape(code) {
		return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, ' ');
	}

	doT.template = function(tmpl, c, def) {
		c = c || doT.templateSettings;
		var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
			str  = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

		str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g,' ')
					.replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,''): str)
			.replace(/'|\\/g, '\\$&')
			.replace(c.interpolate || skip, function(m, code) {
				return cse.start + unescape(code) + cse.end;
			})
			.replace(c.encode || skip, function(m, code) {
				needhtmlencode = true;
				return cse.start + unescape(code) + cse.endencode;
			})
			.replace(c.conditional || skip, function(m, elsecase, code) {
				return elsecase ?
					(code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
					(code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
			})
			.replace(c.iterate || skip, function(m, iterate, vname, iname) {
				if (!iterate) return "';} } out+='";
				sid+=1; indv=iname || "i"+sid; iterate=unescape(iterate);
				return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
					+vname+"=arr"+sid+"["+indv+"+=1];out+='";
			})
			.replace(c.evaluate || skip, function(m, code) {
				return "';" + unescape(code) + "out+='";
			})
			+ "';return out;")
			.replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r')
			.replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, '')
			.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

		if (needhtmlencode && c.selfcontained) {
			str = "String.prototype.encodeHTML=(" + encodeHTMLSource.toString() + "());" + str;
		}
		try {
			return new Function(c.varname, str);
		} catch (e) {
			if (typeof console !== 'undefined') console.log("Could not create a template function: " + str);
			throw e;
		}
	};

	doT.compile = function(tmpl, def) {
		return doT.template(tmpl, null, def);
	};
}());