meovn.controller('AuthController', function($scope, $http, hotkeys, $filter, 
			 toastr, toastrConfig, $firebaseArray, Facebook, $copyToClipboard, webNotification, ngAudio){
			$scope.email = '';
			$scope.password = '';
			var btnSignin = document.getElementById('btnSignin');
			var auth = firebase.auth();

			$scope.signIn = function(e){
				e.preventDefault();
				console.log($scope.email + $scope.password);
				var promise = auth.signInWithEmailAndPassword($scope.email, $scope.password);
				promise.catch(console.log(e.message));
			}

			firebase.auth().onAuthStateChanged(function(firebaseUser){
				if(firebaseUser){
					console.log(firebaseUser);
					window.location = '/';
				}
				else{
					console.log('You are not loged in!');
				}
			});

		});