/* A simple controller to get the year of the manufacturing of the car */
var argument; 
var yearcarController = function (view) {
    return {
        index: function (arg) { 
            argument= arg ; 
            view.render();
        }
    }
}
function submitYCar(name, year) {
    window.location.href = '#maincar/' + name + '/' + year;
}
