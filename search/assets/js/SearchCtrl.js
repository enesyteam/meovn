meovnSearch.controller('SearchController',
    function($scope, $http,$timeout, $filter, firebaseService) {

        firebaseService.getAllPacks().then(function(packs) {
            $scope.packs = packs;
        });

        firebaseService.getAllSources().then(function(sources) {
            $scope.sources = sources;
        });

        
        $scope.getPackFromId = function(id){
            return $filter("filter")($scope.packs, {
                id: id
            })[0];
        }

        $scope.getSourceFromId = function(id){
            return $filter("filter")($scope.sources, {
                id: id
            })[0];
        }

    	$scope.query = '';
    	$scope.successResult = null;
    	$scope.blocked = null;
    	$scope.isSearching = false;
        $scope.searchNote = '';
    	$scope.searchOrder = function(e){
    		e.preventDefault();
    		if($scope.query.length == 0) return;
    		$scope.isSearching = true;
    		$scope.successResult = [];
    		firebaseService.getOldOrderHistory($scope.query).then(function(snap){
                $scope.searchNote = 'Searching ' + $scope.query + ' in: Success Orders data from ver.2';
    			snap.forEach(function(child) {
                    $scope.successResult.push(child.val());
                    
                });
                // get new data from 3.0
                $scope.searchNote = 'Searching ' + $scope.query + ' in: Success Orders data from ver.3';
                firebaseService.getOrderHistory($scope.query).then(function(snap){
    			snap.forEach(function(child) {
    				if(child.val().status_id == 6)
                    $scope.successResult.push(child.val());
	                    
	                });

                    $scope.blocked = [];
                    $scope.searchNote = 'Searching ' + $scope.query + ' in: Blacklist data';
    				firebaseService.getBlockedNumber($scope.query).then(function(snap){
    					snap.forEach(function(child) {
    						$scope.blocked.push(child.val());
    					});

    					$scope.isSearching = false;
                		$scope.$apply();
    				});
    			
	    		});

                
    		});
    	}
    });
