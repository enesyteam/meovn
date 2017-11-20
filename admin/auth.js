var meovnAuth = angular.module('meovnAuth', ['firebase']);

meovnAuth.controller('AuthController',
function($scope, $http, $window, $timeout, $filter, $firebaseArray) {

	var ref = firebase.database().ref();
	membersArr = $firebaseArray(ref.child('members'));

	function getAllMembers(){
		return membersArr.$loaded();
	};

	$scope.email = '';
	$scope.password = '';
	var btnSignin = document.getElementById('btnSignin');
	var auth = firebase.auth();

	$scope.signIn = function(e){
		e.preventDefault();

		// check authientation
      	getAllMembers().then(function(members){
      		angular.forEach(members, function(m){
      			if(m.email == $scope.email){
      				if(m.is_admin != 1 || m.is_mod != 1){
      					$window.location = '/admin/404.html';
      					return;
      				}
      			}
      		});
      	});
		// console.log($scope.email + $scope.password);
		var promise = auth.signInWithEmailAndPassword($scope.email, $scope.password);
		promise.catch(console.log(e.message));
	}
	$scope.firebaseUser = null;
    firebase.auth().onAuthStateChanged(function(user) {
          if (!user) {
              // console.log('Bạn chưa đăng nhập!');
          } else {
          	$scope.firebaseUser = user;
          	$window.location = '/admin/#/dashboard';
          }
      });

});

