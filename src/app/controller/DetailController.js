meovn.controller('DetailController',
    function($scope, $rootScope, $http,$timeout, hotkeys, $filter, $state, $stateParams,
        toastr, toastrConfig, $firebaseArray, Facebook, $copyToClipboard, webNotification, firebaseService, supportService,
        days) {
    	// console.log($stateParams.id);
    	// $scope.willCalllLaterMessage = 'sdfdd';
    	$rootScope.willCalllLaterMessage = '';
    	$rootScope.blockReason = '';
    });