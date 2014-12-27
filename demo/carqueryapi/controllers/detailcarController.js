/* The Car Details Controller, this controller handles a request to Google Image API plus another request to Car Query API.*/

var argument;
var allquest = {};
var detailcarController = function (view) {
    return {
        index: function (arg) {
            argument = arg;
            var toAttach = {
                request: {},
                google: []
            };
            RESTCONFIG.base = 'http://www.carqueryapi.com/api/0.3';
            RESTCONFIG.services.detailcarService.url = '?&cmd=getModel&model=' + argument.id;
            var request = Rest('detailcarService');
            request.then(function (event) {
                if (event === "success") {
                    if (request.getResult().length == 0) {
                        alert("No cars were found...");
                        window.location.hash = '';
                    }
                } else
                    alert('Oups! Something went wrong! Please retry.');
            });
            request.call();
            RESTCONFIG.base = 'https://ajax.googleapis.com/ajax/services/search';
            RESTCONFIG.services.googleService.url = 'images?v=1.0&q=' + argument.name + '%20' + argument.year + '%20'  + argument.type;
            var googlerequest = Rest('googleService'); 
            googlerequest.then(function (event) {
                if (event === "success"){ 
                  if (request.getResult().length == 0) {
                        alert("No cars were found...");
                        window.location.hash = '';
                    }
                }
                else
                    alert('Oups! Something went wrong! Please retry.');
            });
            googlerequest.call();
            toAttach.google.push(googlerequest);
            toAttach.request = request;
            view.attachRestObject(toAttach);
        }
    }
}