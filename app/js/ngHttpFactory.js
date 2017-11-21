angular.module('drawingApp')
.factory('HttpFactory',['$q','$http',function($q,$http){
	var get_file = function(){
		var deferred = $q.defer();
		$http.get('/rest/getFile').then(function(result){
			deferred.resolve(result);
		});
		return deferred.promise;
	}
	var write_file = function(fileData){
		console.log(fileData);
		var deferred = $q.defer();
		$http.post('/rest/writeFile',
					{'filebody':fileData} )
		.then(function(result){
			deferred.resolve(result);
		});
		return deferred.promise;
	}
	return {
		get_file 	: get_file,
		write_file 	: write_file
	}
}])