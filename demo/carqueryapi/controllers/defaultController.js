/* This is the default Controller, the router will load it at the start of the app,
This default controller is also displayed in case of a bad request in the route. You can use it to handle routes errors */

var defaultController = function(view){
  return {
    index: function () { // Use index function at your profit like jQuery's Document ready, the router will execute this function when all is up and ready.
      view.render();       
    }
  }
}
/* You can also define your own functions! A controller is supposed to have all the functions it will need in this view */
function submitCar(name,year){
  if (year===undefined)
  { 
    window.location.href= '#yearcar/'+name ; }
 else 
      window.location.href = '#maincar/'+name +'/'+year;
}
   



      
 
	