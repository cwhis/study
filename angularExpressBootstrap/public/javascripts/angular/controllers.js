'use strict';
app.controller('WelcomeCtrl',function($scope){
    $scope.username = 'Conan_Z';
}).controller('homeCtrl',function($scope,$http){
	$http.get('views/lists.json').success(function(data){
		$scope.lists = data;
	});
})
