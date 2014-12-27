var argument;

var maincarController = function (view) {
  return {
    index: function (arg) {
      argument = arg;
      RESTCONFIG.base = 'http://www.carqueryapi.com/api/0.3';
      RESTCONFIG.services.maincarService.url = '?&cmd=getTrims&keyword=' + argument.year + '%20' + argument.name;
      var request = Rest('maincarService');
      request.then(function (event) {
          if (event === "success") {
            console.log("Success :)");
          } else
              alert('Oups! Something went wrong! Please retry.');
      });
      request.call();
      view.attachRestObject(request);  
   }
  }
}
function showDetails(name,type,id,model){
  window.location.href='#detailcar/'+name.replace(' ','%20')+'/'+type+'/'+id+'/'+model ;     
}