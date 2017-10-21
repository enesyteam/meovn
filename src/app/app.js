(function () {
  'use strict';

	var meovn = angular.module('meovn', ['cfp.hotkeys', 'ngAnimate', 'toastr', 'firebase', 
		'facebook', 'CopyToClipboard', 'angular-web-notification', 'ngAudio']);
	meovn.config([
	    'FacebookProvider',
	    function(FacebookProvider) {
	     var myAppId = '1085772744867580';
	     
	     // You can set appId with setApp method
	     // FacebookProvider.setAppId('myAppId');
	     
	     /**
	      * After setting appId you need to initialize the module.
	      * You can pass the appId on the init method as a shortcut too.
	      */
	     FacebookProvider.init(myAppId);
	    }
	  ]);

		// old access token: 639041606186502|uaa4AIPe63MOQQWKFlrTW2cZlHY
		meovn.controller('OrdersController', function($scope, $http, hotkeys, $filter, 
			 toastr, toastrConfig, $firebaseArray, Facebook, $copyToClipboard, webNotification, ngAudio){

			$scope.audio = ngAudio.load('assets/sounds/click.mp3');
			 $scope.clickSound = ngAudio.load('assets/sounds/button-2.mp3');
			 $scope.getOrderSound = ngAudio.load('assets/sounds/click.mp3');
			 $scope.releaseOrderSound = ngAudio.load('assets/sounds/button-4.mp3');
			 $scope.popupSound = ngAudio.load('assets/sounds/new-order.mp3');
			
			var access_token = 'EAAPbgSrDvvwBAE83TW0ZCCm83YuFXjaQmyd7UQZC9hHhaumkN8aiscrr0hxvlRZAeVae7HDpY1vv3aIzPZAH3O6QtHipfooGJzZBH1WioeKiUZAZC2pkuUJRoAMNvzh5RtQBHiRzfrG12e7nzYRl4E1h7kTbXRW1VsZD';
			$scope.graphPage = function(pageId) {
				$scope.isPageBusy = true;
		        Facebook.api('/' +pageId + '?access_token=' + access_token, function(response) {
		          /**
		           * Using $scope.$apply since this happens outside angular framework.
		           */

		            $scope.currentPageName = response.name;

		          
		        });
		        // graph page avatar
		        Facebook.api('/' +pageId + '/picture' + '?access_token=' + access_token, function(response) {
		          /**
		           * Using $scope.$apply since this happens outside angular framework.
		           */

		            $scope.currentPageAvatar = response.data.url;

		          
		        }).then(function(){
		        	// console.log('xong');
		        	$scope.isPageBusy = false;
		        });
		      };
		      $scope.userAvatar = null;
		      $scope.userLink = null;
		     $scope.graphUser = function(userId){
		     	// profile Picture
		        Facebook.api('/' + userId +'/picture?height=100&width=100', function(response) {
		          /**
		           * Using $scope.$apply since this happens outside angular framework.
		           */
		          	$scope.userAvatar = response.data.url;
		        });
		     }

		     $scope.newAvatar = null;
		     $scope.graphUserAvatar = function(userId){
		     	// profile Picture
		        Facebook.api('/' + userId +'/picture?height=100&width=100', function(response) {
		        	if(!response || response.error){
		        		alert('error!');
		        	}
			       $scope.newAvatar = response.data.url;
		        });
		     }

		     
			$scope.graphPost = function(pageId, postId) {
				$scope.isPageBusy = true;
		        Facebook.api('/' +pageId + '_' + postId + '?access_token=' + access_token, function(response) {
		          
		          /**
		           * Using $scope.$apply since this happens outside angular framework.
		           */

		            $scope.fbContent = response;
	
		          
		        }).then(function(){
		        	// console.log('xong');
		        	$scope.isPageBusy = false;
		        });
		        // graph post photos
		        Facebook.api('/' +pageId + '_' + postId + '/attachments' + '?access_token=' + access_token, function(response) {
		          /**
		           * Using $scope.$apply since this happens outside angular framework.
		           */
		          	$scope.fbPhotos = [];
		          	for (var i = 0; i < response.data[0].subattachments.data.length - 1; i++) {
		          		$scope.fbPhotos.push(response.data[0].subattachments.data[i].media.image.src);
		          	}

		          
		        }).then(function(){
		        	// console.log('xong');
		        	$scope.isPageBusy = false;
		        });
		      };

		      // store all buyers avatars
		      $scope.buyersAvatar = [];
		      $scope.graphAllBuyersAvatar = function(){
		      	angular.forEach($scope.orders, function(value, key){
		      		console.log(value.fbId);
		      		Facebook.api('/' + value.fbId +'/picture?height=100&width=100', function(response) {
			          /**
			           * Using $scope.$apply since this happens outside angular framework.
			           */
			          	 $scope.$apply(function(){
			          	 	if(value.fbId){
			          	 		$scope.buyersAvatar.push({
					          	 	'fbId': value.fbId,
					          	 	'avatar': response.data.url
					          	 });
			          	 	}
			          	 	
			          	 });
			        });
		      	});

		        // console.log($scope.buyersAvatar);
		     }
		     $scope.getBuyerAvatar = function(order){
		     	return $scope.buyersAvatar.filter(function(m){
		     			// console.log(m);
			          return m.fbid == order.fbid;
			        })[0];
		     }

				// CREATE A FIREBASE REFERENCE
			    // var fOrdersRef = new Firebase('https://meoorder.firebaseio.com');
			    // var fCommentsRef = new Firebase('https://meoorder.firebaseio.com');

			    var ref = firebase.database().ref();
			    $scope.orders = $firebaseArray(ref.child('orders'));
			    $scope.comments = $firebaseArray(ref.child('comments'));
			    $scope.sources = $firebaseArray(ref.child('sources'));
			    $scope.statuses = $firebaseArray(ref.child('statuses'));
			    $scope.sellers = $firebaseArray(ref.child('members'));
			    $scope.packs = $firebaseArray(ref.child('packs'));

			    // GET TODOS AS AN ARRAY
			    // $scope.orders = $firebaseArray(fOrdersRef.child('orders'));
			    // test
			    // sync down from server
				 function snapshotToArray(snapshot) {
				    var returnArr = [];
				    snapshot.forEach(function(childSnapshot) {
				        var item = childSnapshot.val();
				        item.key = childSnapshot.key;
				        returnArr.push(item);
				    });

				    return returnArr;
				};

				//sync
				firebase.database().ref('orders').on('value', function(snapshot) {
				   // all records after the last continue to invoke this function
				   // console.log(snapshot.name(), snapshot.val());
				   console.log(snapshot.val());
				});

			    // GET TODOS AS AN ARRAY
			    // $scope.orders = $firebaseArray(fOrdersRef.child('orders'));
			    $scope.orders.$loaded()
				    .then(function(orders){
				    	$scope.graphAllBuyersAvatar();
				    	// $scope.orders = orders;
				    	$scope.isAsideLoading = false;
				    	firebase.database().ref('orders').limitToLast(1).on('child_added', function(snapshot) {
						   // all records after the last continue to invoke this function
						   // console.log(snapshot.name(), snapshot.val());
						   $scope.showNotify(snapshot.val());
						});
						console.log($scope.buyersAvatar);
				    });

				$scope.defaultToastrConfig = angular.copy(toastrConfig);
    			$scope.alertTypes = ['success', 'error', 'info', 'warning'];

				$scope.showSearchbox = true;
				$scope.isSeaching = false;
				$scope.searchText = '';
				$scope.isPageBusy = false;
				$scope.isAsideLoading = true;
				$scope.isPostingComment = false;
				$scope.activeStatus = null;
				$scope.date = new Date();

				$scope.fbContent = null;
				$scope.fbPhotos = [];
				$scope.currentPageName = '';
				$scope.currentPageAvatar = '';

				$scope.dateRange = {};
				$scope.dateRange.startDate = new Date();
				$scope.dateRange.endDate = new Date();
				$scope.isPostExpanded = false;

				$scope.child = {};

				

				$scope.newDate =function(dateString){
				 return	new Date(dateString);
				}
				$scope.toggleExpandPost = function(){
					$scope.isPostExpanded = !$scope.isPostExpanded;
					// console.log($scope.isPostExpanded);
				}

				$scope.currentUser = null;
				function getCurrentUser(){
				 // 	$http.get('/v3/currentLogedinUser').then(function(data){
				 // 		$scope.currentUser = data;
					// });
				}
				getCurrentUser();

				// firebase.database().ref().child('orders').on("child_added", function(snapshot, prevChildKey) {
				//   var newPost = snapshot.val();
				//   console.log("Add" + snapshot.val() + '||' + prevChildKey);
				//   $scope.showNotify(snapshot.val());
				// });

				// Order statuses list
				// $scope.ordersStatuses = [];
				// var url = 'v3/orderStatuses';
				// $http.get(url).then(function(data){
				// 	for (var i = 0; i < data.length; i++) {
				// 		$scope.ordersStatuses.push(data[i]);
				// 	}
				// });
				// Order statuses for filter
				// $scope.ordersStatusesForFilter = [];
				// var url = 'v3/orderStatusesForFilter';
				// $http.get(url).then(function(data){
				// 	for (var i = 0; i < data.length; i++) {
				// 		$scope.ordersStatusesForFilter.push(data[i]);
				// 	}
				// });

				$scope.isShowAll = false;
				$scope.getOrders = function($event, attrs){
					
					$scope.isAsideLoading = true;
					var url = '/v3/getOrders';
					$http.get(url).then(function(data){
						$scope.showMyOrders = false;
						$scope.activeStatus = null;
						$scope.isShowAll = true;
						// $scope.orders = $firebaseArray(fOrdersRef);
						for (var i =  0; i < data.length; i++) {
								// $scope.orders.$add(data[i]);
								fOrdersRef.child('orders').push({
									'buyer_mobile' : data[i].buyer_mobile ,
									'buyer_name' : data[i].buyer_name ,
									'created_at' : data[i].created_at ,
									'id' : data[i].id ,
									'lock' : data[i].lock ,
									'order_source_id' : data[i].order_source_id ,
									'product_pack_id' : data[i].product_pack_id ,
									'seller_will_call_id' : data[i].seller_will_call_id || null,
									'status_id' : data[i].status_id ,
									'sticky' : data[i].sticky 
								});
							}
							$scope.orders.page++;
							$scope.isAsideLoading = false;

							// if orders.items not null => active first item
							if($scope.orders.length > 0){
							     // active first item
							     $scope.active($scope.orders[0]);
							}
					});
				};
				$scope.testPusher = function(){
					// pusher.trigger('my-channel', 'new-comment', item);
				}

				// infinitive scroll
				$scope.isLoadingMore = false;
				$scope.loadMoreRecords = function (){
					return false;
					if(!$scope.orders) return;
					$scope.isLoadingMore = true;
					if($scope.showMyOrders){
						var url = '/v3/getMyOrders/?page=' + $scope.orders.page;
					}
					else if(!$scope.activeStatus){
						var url = '/v3/getOrders/?page=' + $scope.orders.page;
					}
					else{
						var url = 'v3/getOrdersByStatus/' + $scope.activeStatus.id + '?page=' + $scope.orders.page;
					}
					$http.get(url).then(function(data){

						if(data.length == 0) {
							$scope.isLoadingMore = false;
							return;
						}
						console.log(url);
						for (var i =  0; i < data.length; i++) {
								$scope.orders.$add(data[i]);
							}
							$scope.orders.page++;
							$scope.isLoadingMore = false;
					});
				}
				$scope.showAlert = function(title, content, alertType){
					var option = {
				      autoDismiss: false,
				      positionClass: 'toast-bottom-center',
				      type: alertType,
				      timeOut: '3000',
				      extendedTimeOut: '2000',
				      allowHtml: false,
				      closeButton: true,
				      tapToDismiss: true,
				      progressBar: false,
				      newestOnTop: true,
				      maxOpened: 0,
				      preventDuplicates: false,
				      preventOpenDuplicates: false,
				      title: title,
				      msg: content
					}
					// console.log($scope.defaultToastrConfig);
					angular.extend($scope.defaultToastrConfig, option);

					toastr[option.type](option.msg, option.title, $scope.defaultToastrConfig);
				}
				$scope.$on('$destroy', function iVeBeenDismissed() {
			      angular.extend(toastrConfig, $scope.defaultToastrConfig);
			    })
				// $scope.loadMoreRecords();
				$scope.showMyOrders = false;
				$scope.toggleShowMyOrders = function(){
					$scope.showMyOrders = !$scope.showMyOrders;
				}
				$scope.getMyOrders = function(){
					$scope.isShowAll = false;
					$scope.isAsideLoading = true;
					var url = 'v3/getMyOrders/' + '?page=' + 1;
					$http.get(url).then(function(data){
						$scope.showMyOrders = true;
						$scope.activeStatus = null;
						$scope.orders = $firebaseArray(fOrdersRef);
						for (var i =  0; i < data.length; i++) {
								$scope.orders.$add(data[i]);
							}
							$scope.orders.page++;
							$scope.isAsideLoading = false;

							// if orders.items not null => active first item
							if($scope.orders.length > 0){
							     // active first item
							     $scope.active($scope.orders[0]);
							}
						});
				}

				$scope.getOrderByUid = function(id){
			        return $scope.orders.filter(function(m){
			          return m.id == id;
			        })[0];
			      },

				$scope.addToFavourite = function(event, $order){
					event.stopPropagation();
					if($order.seller_will_call_id){
							$scope.showAlert('', 'Oops! This Order has belonged to ' + $scope.findUser($order.seller_will_call_id).last_name, 'error');
						}
						else{
							$order.seller_will_call_id = CURRENT_USER_ID;
				          	$scope.orders.$save($order);
				          	$scope.getOrderSound.play();
						}
				}

				

				// $scope.currentUser = null;

				$scope.userCanReleaseOrChangeStatus = function(order){
					return ($scope.currentUser.is_admin == 1) || ($scope.currentUser.id == order.seller_will_call_id);
				}
				$scope.releaseOrder = function(event, order){
					event.stopPropagation();
					if(!$scope.userCanReleaseOrChangeStatus){
						return false;
					}
					order.seller_will_call_id = null;
		          	$scope.orders.$save(order);
		          	$scope.releaseOrderSound.play();
				}
				$scope.resetSearch = function(){
					$scope.searchText = '';
				};

				$scope.toggleShowAll = function(){
					// $scope.isShowAll = !$scope.isShowAll;
					$scope.activeStatus = null;
					$scope.showMyOrders = false;
					$scope.searchText = '';
				}

				$scope.toggleActiveStatus =function(status){
					if($scope.activeStatus != status){
						$scope.activeStatus = status;
					}
					else{
						$scope.activeStatus = null;
					}
					
				}
				$scope.GetOrdersByStatus = function(status){
					$scope.isShowAll = false;
					$scope.isAsideLoading = true;
					var url = 'v3/getOrdersByStatus/' + status.id + '?page=' + 1;
					$http.get(url).then(function(data){
						// $scope.activeStatus = status;
						$scope.showMyOrders = false;
						$scope.orders = $firebaseArray(fOrdersRef);
						for (var i =  0; i < data.length; i++) {
								$scope.orders.$add(data[i]);
							}
							$scope.orders.page++;
							$scope.isAsideLoading = false;

							// if orders.items not null => active first item
							if($scope.orders.length > 0){
							     // active first item
							     $scope.active($scope.orders[0]);
							}
						});
				}

				$scope.getPageIdFromOrder = function(order){
					var found = $filter('filter')($scope.sources, {id: order.order_source_id}, true);
			         if (found.length) {
			             return found[0].page_id;
			         } else {
			             return null;
			         }
				}
				$scope.getPostIdFromOrder = function(order){
					var found = $filter('filter')($scope.packs, {id: order.product_pack_id}, true);
			         if (found.length) {
			             return found[0].post_id;
			         } else {
			             return null;
			         }
				}

				// Select Order from List
				$scope.active = function(order, $event){
					$scope.isPageBusy = true;
					$scope.clickSound.play();
					$scope.isPostExpanded = false;
					$scope.graphUser(order.fbId);
					// console.log($scope.graphUserAvatar(order.fbId));
					// only for test
					$scope.fbContent = [];
					$scope.fbContent.message = 'Fetching Post content from Facebook...';
					$scope.fbPhotos = [];
					$scope.currentPageName = 'Fetching Page name from Facebook...';
					$scope.currentPageAvatar = '';

					$scope.orders.active = order;
					$scope.graphPage($scope.getPageIdFromOrder(order));
					$scope.graphPost($scope.getPageIdFromOrder(order), $scope.getPostIdFromOrder(order));
					// $scope.fbContent = $scope.graphPost('262405144260528', '292495281251514');
				}

				// get all comment for an Order
				$scope.getComments = function(order){
					var commentUrl = '/v3/getComments/' + order.id;
					$scope.isPageBusy = true;
					$http.get(commentUrl).then(function(data){
						// $scope.commentList = $firebaseArray(fCommentsRef);
						if(data.length > 0){
							
						   for (var i = 0; i < data.length; i++) {
   								var user = $scope.findUser(data[i].user_id);

						   		var	$commentItem = {
									'id' : data[i].id,
									'content' : data[i].content,
									'created_at' : data[i].created_at,
									'type' : data[i].type,
									'status_id' : data[i].status_id,
									'user'			: user
								};
								// $scope.commentList.$add($commentItem);
						   }
						}
						$scope.isPageBusy = false;
					});
				}

				// get all active users
				// $scope.users = [];
				// var url = 'v3/getUsers';
				// $http.get(url).then(function(data){
				// 	for (var i = 0; i < data.length; i++) {
				// 		$scope.users.push(data[i]);
				// 	}
				// });

				// find an user with id
				$scope.findUser = function(id) {
				     var found = $filter('filter')($scope.users, {id: id}, true);
				     if (found.length) {
				         return found[0];
				     } else {
				         return null;
				     }
				 }

				// get status by id
				 $scope.getStatusById = function(statusId){
				 	var found = $filter('filter')($scope.ordersStatuses, {id: statusId}, true);
				     if (found.length) {
				         return found[0];
				     } else {
				         return null;
				     }
				 }

				// get order status for an Order
				$scope.getOrderStatusForOrder = function(order){
					if(!order) return;
					for (var i =0; i < $scope.ordersStatuses.length; i++) {
						if(order.status_id == $scope.ordersStatuses[i].id){
							return $scope.ordersStatuses[i].display_type;
						}						
					}
				}

				$scope.filterOrdersByStatus = function(status){
					firebase.database().ref().child('orders').orderByChild("status_id").equalTo(status.id).once("value", function(data) {
					   console.log('status id: ' + status.id);
					   data.forEach(function(item) {
					        var itemVal = item.val();
					        console.log(itemVal);
					    });
					});
				}

				// object to hold all the data for the new comment form
				$scope.commentData = {};

				// loading variable to show the spinning loading icon
				$scope.loading = false;
				$scope.submitComment = function(order) {
					if(!$scope.commentData.content){
						return false;
					}
					
					var newCommentKey = firebase.database().ref().child('comments').push().key;
					var	$commentItem = {
						'id' : newCommentKey,
						'order_id': order.id,
						'content' : $scope.commentData.content,
						'created_at' : Date.now(),
						'type' : 0,
						'status_id' : 0,
						'user'			: $scope.findUser(CURRENT_USER_ID),
					};
					firebase.database().ref().child('comments').push($commentItem);
					$scope.commentData = {};
				}
				// save comment to database
				$scope.saveComment = function(commentData, id){
					return $http({
						method: 'POST',
						url: '/v3/comments/post/' + id,
						headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
						data: $.param(commentData)
					});
				};

				// remove item from Comment List
				$scope.removeComment = function(item) { 
				  var index = $scope.commentList.indexOf(item);
				  $scope.commentList.splice(index, 1);     
				}

				// find comment by id in Comment List
				 $scope.getCommentById = function(id){
				 	var found = $filter('filter')($scope.commentList, {id: id}, true);
				     if (found.length) {
				         return found[0];
				     } else {
				         return null;
				     }
				 }


				// get delete comment
				$scope.getDeleteComment = function(id){
					return $http.delete('v3/deleteComment/' + id);
				}
				// destroy comment
				$scope.deleteComment = function(comment) {
					if(comment.id == undefined) return;
					$scope.comments.$remove(comment);
				};

				// get change order status
				$scope.changeStatus = function(order, statusId){
					if(!order) { return false;};
					var url = 'v3/changeOrderStatus/' + order.id + '/' + statusId;
					return $http.post(url,{
						method: 'POST',
						headers: { 'Content-Type' : 'application/json', 'Accept' : 'application/json' },
					});
				}

				// update order status
				$scope.updateStatus = function(order, $event, status){
					$scope.clickSound.play();
					if(!$scope.userCanReleaseOrChangeStatus(order)){
						$scope.showAlert('', 'Oops! Not allowed to change the order status of others.', 'error');
						return false;
					}
					// if(order.status_id == status.id || !status) return;
					// $scope.isPageBusy = true;
					var val = angular.element($event.target).attr("data-status-id");
					order.status_id = val;
					$scope.orders.$save(order);	
					$scope.orders.active = order;

					var newCommentKey = firebase.database().ref().child('comments').push().key;
					var	$commentItem = {
						'id' : newCommentKey,
						'order_id': order.id,
						'content' : '',
						'created_at' : Date.now(),
						'type' : 1,
						'status_id' : status.id,
						'user'			: $scope.findUser(CURRENT_USER_ID),
					};
					firebase.database().ref().child('comments').push($commentItem);
					$scope.commentData = {};
				}

				// Quick update status for active order
				$scope.quickUpdateStatus = function(statusId){
					if(!$scope.orders.active){
						$scope.showAlert('', 'Oops! Please select an Order befor perform this action.', 'error');
						return false;
					}
					$scope.changeStatus($scope.orders.active, statusId).then(function(data){
						// update item in $scope.orders.items collection
						for (var i = $scope.orders.length - 1; i >= 0; i--) {
							if($scope.orders[i].id == $scope.orders.active.id){
								$scope.orders[i].status_id = statusId;
							}
						}
					});					
				}

				// when user change order status, we want to create a comment about this
				// $scope.createStatusComment = function(order, user, status){

				// }
				// save comment to database
				$scope.saveStatusComment = function(commentParams, order){
					if(!order) { return false; };
					var url = '/v3/comments/postStatus/' + order.id;
					return $http.post(url,{
						method: 'POST',
						headers: { 'Content-Type' : 'application/json', 'Accept' : 'application/json' },
						data: commentParams
					});
				};

				$scope.querySearch = {
					text: '',
				}

				$scope.resetSearch = function(){
					$scope.querySearch = {};
                	// $scope.orders.items = $scope.orderListBeforeSearch.orders;
                	// $scope.orders.active = $scope.orderListBeforeSearch.active;
                	// $scope.getOrders();
				};

				$scope.searchQueryChange = function(){
					if(!$scope.querySearch.text || $scope.querySearch.text.length == 0){
						$scope.resetSearch();
					}
				}

				// we want to save Order list before raise search action to reset it
				$scope.orderListBeforeSearch = {
					orders: {},
					active: null
				}
				$scope.toggleShowSearchBox = function(){
					$scope.showSearchbox = !$scope.showSearchbox;
				}

				// ################ Hotkeys
				hotkeys.add({
				    combo: 'shift+c',
				    description: 'Chốt nhanh đơn hàng',
				    callback: function() {
				      $scope.quickUpdateStatus(6);
				    }
				  });
				// hotkeys.add({
				//     combo: 'shift+right',
				//     description: 'Chuyển sang đơn hàng kế tiếp trong danh sách',
				//     callback: function() {
				//     if(!$scope.orders){
				// 		return false;
				// 	}
				// 	else if(!$scope.orders.active){
				// 		$scope.orders.active = $scope.orders[0];
				// 	}
				//       // alert($scope.orders.active.$index);
				//      var currentIdex = $scope.orders.map((item) => { return item.id;}).indexOf($scope.orders.active.id);
				//      if(currentIdex >= $scope.orders.length -1) { return false };
				//      // active next item
				// 	     $scope.orders.active = $scope.orders[currentIdex+1];
				// 		// get comments
				// 		// $scope.getComments($scope.orders.active);
				//     }
				//   });
				// hotkeys.add({
				//     combo: 'shift+left',
				//     description: 'Chuyển sang đơn hàng trước trong danh sách',
				//     callback: function() {
				//     if(!$scope.orders){
				// 		return;
				// 	}
				// 	else if(!$scope.orders.active){
				// 		$scope.orders.active = $scope.orders[0];
				// 	}				    	
				//       // alert($scope.orders.active.$index);
				//      var currentIdex = $scope.orders.map((item) => { return item.id;}).indexOf($scope.orders.active.id);
				//      if(currentIdex == 0) return;
				//      // active next item
				// 	     $scope.orders.active = $scope.orders[currentIdex-1];
				// 		// get comments
				// 		// $scope.getComments($scope.orders.active);
				//     }
				//   });

				hotkeys.add({
				    combo: 'shift+m',
				    description: 'Hiện thông tin cá nhân của tôi',
				    callback: function() {			    	
				    	$scope.child.toggleShowMeExpand();
				    }
				  });

				// Clibboard
				// getClipboard data
				var getClipboardData = function(order){
					var m, n, s, p, st, sl;
					s = getSource(order.order_source_id);
					p = getPack(order.product_pack_id);
					st = getStatus(order.status_id);
					sl = getSeller(order.seller_will_call_id);
					return 'Page:' + '\t\t\t' + s[0].source_name 
							+ '\nGói sp:'  + '\t\t\t' + p[0].short_title + '/' + p[0].price + 'K'
							+ '\nTrạng thái:' + '\t\t' + st[0].name  
							+ '\nNgười gọi:' + '\t\t' + (sl ? sl[0].last_name : 'Chưa có');
				}
				var getSource = function(id){
					if(!id) return null;
					var result = [];
					ref.child('sources').orderByChild('id').equalTo(id).on('value', function(snap) {
						snap.forEach(function(item) {
					        var itemVal = item.val();
					        result.push(itemVal);
					    });
				    });
				    return result;
				};
				var getStatus = function(id){
					console.log(id);
					if(!id) return null;
					var result = [];
					ref.child('statuses').orderByChild('id').equalTo(id).on('value', function(snap) {
						snap.forEach(function(item) {
					        var itemVal = item.val();
					        result.push(itemVal);
					    });
				    });
				    return result;
				};
				var getPack = function(id){
					if(!id) return null;
					var result = [];
					ref.child('packs').orderByChild('id').equalTo(id).on('value', function(snap) {
						snap.forEach(function(item) {
					        var itemVal = item.val();
					        result.push(itemVal);
					    });
				    });
				    return result;
				};

				var getSeller = function(id){
					if(!id) return null;
					var result = [];
					ref.child('members').orderByChild('id').equalTo(id).on('value', function(snap) {
						snap.forEach(function(item) {
					        var itemVal = item.val();
					        result.push(itemVal);
					    });
				    });
				    return result;
				};
				$scope.clibboardCoppyLink = function(e){
					var textToCopy = getClipboardData($scope.orders.active);
					$copyToClipboard.copy(textToCopy).then(function () {
		                $scope.showAlert('', 'Order has been copied. Press Ctrl+V to paste.', 'info');
		            });
				}

				// web notification
				$scope.showNotify = function(order){
					$scope.graphUserAvatar(order.fbId);
					var content = (order && order.buyer_name) ? order.buyer_name + order.buyer_mobile : 'No name';
					 webNotification.showNotification('New Order Notification', {
		                body: content,
		                icon: $scope.newAvatar,
		                onClick: function onNotificationClicked() {
		                    // $scope.orders.active = order;
		                    $scope.active(order, null);
		                },
		                autoClose: 5000 //auto close the notification after 4 seconds (you can manually close it via hide function)
		            }, function onShow(error, hide) {
		                if (error) {
		                    window.alert('Unable to show notification: ' + error.message);
		                } else {
		                    console.log('Notification Shown.');

		                    setTimeout(function hideNotification() {
		                        console.log('Hiding notification....');
		                        hide(); //manually close the notification (you can skip this if you use the autoClose option)
		                    }, 5000);
		                }
		            });
				}

				var init = function () {
				   $scope.getOrders();

				};
				// and fire it after definition
				// init();


		}).directive('myEnter', function () {
		    return function (scope, element, attrs) {
		    	scope.isPageBusy = true;
		        element.bind("keydown keypress", function (event) {
		            if(event.which === 13) {
		                scope.$apply(function (){
		                    scope.$eval(attrs.myEnter);
		                    scope.submitComment(scope.orders.active);
		                    scope.isPageBusy = false;
		                });
		                event.preventDefault();
		            }
		        });
		    };
		}).filter('my_filter', function () {
		  return function (items, scope) {
		    return items.filter(function (item) {
		    	// console.log('filtering...');
		    	// search
		    	if(scope.searchText.length > 0){
		    		return item.buyer_mobile.indexOf(scope.searchText) !== -1 || item.buyer_name.toUpperCase().indexOf(scope.searchText.toUpperCase()) !== -1;
		    	}
		    	// we need to filter orders by created_date
		    	// since we only want to show orders that created_at today or yesterday
		    	var today = Date.now();
		    	var yesterday = Date.now()-1;

		    	if(scope.showMyOrders && scope.activeStatus){
		    		return (item.seller_will_call_id == scope.currentUser.id) 
		    				&& (item.status_id == scope.activeStatus.id);

		    	}
		    	else if(scope.activeStatus){
		    		return item.status_id == scope.activeStatus.id;
		    	}
		    	else if(scope.showMyOrders){
		    		return item.seller_will_call_id == scope.currentUser.id;
		    	}
		    	else{
		    		return item.created_at <= Date.now();
		    	}
		    });
		  };
		});


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

		
})();
