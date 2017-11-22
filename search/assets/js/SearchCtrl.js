meovnSearch.controller('SearchController',
    function($scope, $http,$timeout, $filter, firebaseService) {

        firebaseService.getAllPacks().then(function(packs) {
            
            $timeout(function () {
                        $scope.packs = packs;
                        $scope.$apply();
                    }, 10);
        });

        firebaseService.getAllSources().then(function(sources) {
            
             $timeout(function () {
                        $scope.sources = sources;
                        $scope.$apply();
                    }, 10);
        });

        firebaseService.getAllMembers().then(function(members) {
                $timeout(function () {
                        $scope.members = members;
                        $scope.$apply();
                    }, 10);
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



        $scope.findUser = function(id) {
            return $filter("filter")($scope.members, {
                id: id
            })[0];
            
        }
        $scope.findPack = function(id){
            var p = $scope.getPackFromId(id);
            return p ? (p.short_title + '/' + p.price + 'K') : 'Không rõ';
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
                // console.log($scope.successResult);
                // console.log($scope.blocked);
                // console.log($scope.sellers);
                // console.log($scope.sources);
                // console.log($scope.packs);
                
    		});
    	}
    });
