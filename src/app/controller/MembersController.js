// user controller
		meovn.controller('MembersController', function($scope, $http, $filter,  $window){
			$scope.showPasswordEditBox = false;
			$scope.showMeExpand = false;

			var parentScope = $scope.$parent;
			parentScope.child = $scope;

			$scope.toggleShowPasswordEditBox = function(){
				$scope.showPasswordEditBox = !$scope.showPasswordEditBox;
			}
			$scope.toggleShowMeExpand = function(){
				$scope.showMeExpand = !$scope.showMeExpand;
			}

			$scope.submitPassword = function(user, $event) {
				$scope.changePassword(user, $event).then(function(data){
					$scope.showPasswordEditBox = false;
						$window.location.href = '/logout';
					});		
			};

			$scope.changePassword = function(user, $event){
				if(!user) return;
				var newPassword = $('input.newPassword').val();
				if(newPassword.length < 8){
					alert("Nhập mật khẩu tổi thiểu 8 ký tự!");
					return;
				}
				var url = 'v3/changePassword/' + user.id;
				return $http.post(url,{
					method: 'POST',
					headers: { 'Content-Type' : 'application/json', 'Accept' : 'application/json' },
					data: newPassword
				});

				$event.preventDefault();
			}
		});