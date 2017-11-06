// 'use strict';
// old access token: 639041606186502|uaa4AIPe63MOQQWKFlrTW2cZlHY
meovn.controller('OrdersController',
    function($scope, $http,$timeout, hotkeys, $filter, $state, $stateParams,
        toastr, toastrConfig, $firebaseArray, Facebook, $copyToClipboard, webNotification, firebaseService, supportService) {

        var access_token = 'EAAPbgSrDvvwBAE83TW0ZCCm83YuFXjaQmyd7UQZC9hHhaumkN8aiscrr0hxvlRZAeVae7HDpY1vv3aIzPZAH3O6QtHipfooGJzZBH1WioeKiUZAZC2pkuUJRoAMNvzh5RtQBHiRzfrG12e7nzYRl4E1h7kTbXRW1VsZD';

        function graphPage(pageId) {
            Facebook.api('/' + pageId + '?access_token=' + access_token, function(response) {
                /**
                 * Using $scope.$apply since this happens outside angular framework.
                 */
                $scope.currentPageName = response.name;
            });
            // graph page avatar
            Facebook.api('/' + pageId + '/picture' + '?access_token=' + access_token, function(response) {
                /**
                 * Using $scope.$apply since this happens outside angular framework.
                 */
                $scope.currentPageAvatar = response.data.url;
            }).then(function() {
                // console.log('xong');
                // $scope.isPageBusy = false;
            });
        };
        $scope.userAvatar = null;
        $scope.userLink = null;

        function graphUser(userId) {
            if(!userId){
                $scope.userAvatar = 'public/images/default-avatar-contact.svg';
                return;
            }
            // profile Picture
            Facebook.api('/' + userId + '/picture?height=100&width=100', function(response) {
                /**
                 * Using $scope.$apply since this happens outside angular framework.
                 */
                $scope.userAvatar = response.data.url;
            });
        }

        $scope.newAvatar = null;
        $scope.graphUserAvatar = function(userId) {
            // profile Picture
            Facebook.api('/' + userId + '/picture?height=100&width=100', function(response) {
                if (!response || response.error) {
                    alert('error!');
                }
            	$scope.newAvatar = response.data.url;
            });
        }


        function graphPost(pageId, postId) {
            if(!postId){
                $scope.fbContent = null;
                $scope.fbPhotos = null;
                return;
            }
            $scope.isPageBusy = true;
            Facebook.api('/' + pageId + '_' + postId + '?access_token=' + access_token, function(response) {

                /**
                 * Using $scope.$apply since this happens outside angular framework.
                 */
                $scope.fbContent = response;
            }).then(function() {
                // graph post photos
                Facebook.api('/' + pageId + '_' + postId + '/attachments' + '?access_token=' + access_token, function(response) {
                    /**
                     * Using $scope.$apply since this happens outside angular framework.
                     */
                    $scope.fbPhotos = [];
                    for (var i = 0; i < response.data[0].subattachments.data.length - 1; i++) {
                        $scope.fbPhotos.push(response.data[0].subattachments.data[i].media.image.src);
                    }
                    // $scope.isPageBusy = null;

                }).then(function() {
                    // console.log('xong');
                    $scope.isPageBusy = null;
                });

            });
            
        };

        var inputs = document.querySelectorAll( '.inputfile' );
        Array.prototype.forEach.call( inputs, function( input )
        {
            var label    = input.nextElementSibling,
                labelVal = label.innerHTML;

            input.addEventListener( 'change', function( e )
            {
                var fileName = '';
                if( this.files && this.files.length > 1 )
                    fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
                else
                    fileName = e.target.value.split( '\\' ).pop();

                if( fileName )
                    label.querySelector( 'span' ).innerHTML = fileName;
                else
                    label.innerHTML = labelVal;
            });
        });

        //upload avatar
        var fileButton = document.getElementById("select-avatar");
        var label  = fileButton.nextElementSibling;
        fileButton.addEventListener('change', function(e){
                var file = e.target.files[0];
                var storageRef = firebase.storage().ref('avatars/' + file.name);

                // Create the file metadata
                var uploadTask = storageRef.put(file);

                // Listen for state changes, errors, and completion of the upload.
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                  function(snapshot) {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log('Upload is ' + progress + '% done');
                    label.querySelector( 'span' ).innerHTML = 'Upload is ' + progress.toFixed(2) + '% done';
                    switch (snapshot.state) {
                      case firebase.storage.TaskState.PAUSED: // or 'paused'
                        // console.log('Upload is paused');
                        break;
                      case firebase.storage.TaskState.RUNNING: // or 'running'
                        // console.log('Upload is running');
                        break;
                    }
                  }, function(error) {

                  // A full list of error codes is available at
                  // https://firebase.google.com/docs/storage/web/handle-errors
                  switch (error.code) {
                    case 'storage/unauthorized':
                      // User doesn't have permission to access the object
                      break;

                    case 'storage/canceled':
                      // User canceled the upload
                      break;

                    case 'storage/unknown':
                      // Unknown error occurred, inspect error.serverResponse
                      break;
                  }
                }, function() {
                  // Upload completed successfully, now we can get the download URL
                  var downloadURL = uploadTask.snapshot.downloadURL;
                  // console.log(downloadURL);
                  $scope.updateFirebaseUser(downloadURL);

                  label.querySelector( 'span' ).innerHTML = 'Select photo...'
                });
            });

        firebaseService.getAllSources().then(function(sources) {
            $scope.sources = sources;
            $scope.isAsideLoading = true;
            firebaseService.getAllPacks().then(function(packs) {
                $scope.packs = packs;
                if ($state.$current.name == 'home.details') {
                    console.log($state);
                    // $scope.pleaseWaitMessage = 'Loading Order details. Please wait...';
                    angular.forEach($scope.orders, function(o, i) {
                      if (o.id === $stateParams.id ) {
                        $scope.active($scope.orders[i]);
                        // return;
                        // $scope.isPageBusy = false;
                      }
                    });

                    
                }
                // $scope.isPageBusy = false;
                $scope.isAsideLoading = false;
            });
        });

        $scope.currentMember = null;
        firebase.auth().onAuthStateChanged(function(firebaseUser) {
            if (!firebaseUser) {
                // console.log('You are not loged in!');
                $state.go('auth');
            } else {
                $scope.firebaseUser = firebase.auth().currentUser;
                firebaseService.getAllMembers().then(function(members) {
		            $scope.sellers = members;

					angular.forEach($scope.sellers, function(value) {
						if(value.email == $scope.firebaseUser.email){
							$scope.currentMember = value;
                            // get requests for current member
                            getRequests($scope.currentMember.id);
						}
					});
		        });
            }
        });

        var ref = firebase.database().ref();

        $scope.orders = [];
        $scope.comments = [];
        $scope.sources = [];
        $scope.statuses = [];
        $scope.sellers = [];
        $scope.packs = [];

        $scope.ordersStatusesForFilter = [];
        $scope.ordersStatuses = [];
        firebaseService.getAllStatuses().then(function(statuses) {
            $scope.statuses = statuses;
            $scope.ordersStatusesForFilter = [];
            angular.forEach($scope.statuses, function(value, key) {
                if (value.active == 1 && value.allow_fillter == 1) {
                    $scope.ordersStatusesForFilter.push(value);
                }
                if (value.active == 1) {
                    $scope.ordersStatuses.push(value);
                }
            });
        });
        $scope.updateFirebaseUser = function(newAvatar) {
            var user = firebase.auth().currentUser;
            // console.log(user);
            user.updateProfile({
                photoURL: newAvatar,
            }).then(function() {
                // console.log('success');
                // console.log(user);
                // Update successful.
                $scope.firebaseUser.photoURL = newAvatar;
            }).catch(function(error) {
                // An error happened.
                console.log('error');
            });
        };

        $scope.showPasswordEditBox = false;
        $scope.toggleShowPasswordEditBox = function(){
            $scope.showPasswordEditBox = !$scope.showPasswordEditBox;
        }
        $scope.hidePasswordEditBox = function(){
            $scope.showPasswordEditBox = false;
        }
        $scope.oldPassword = '';
        $scope.newPassword = '';
        $scope.confirmNewPassword = '';
        $scope.validNewPassword = false;
        $scope.validationNewPassword = function(){
            if($scope.newPassword.length < 8 || $scope.confirmNewPassword < 8 
                || ($scope.newPassword != $scope.confirmNewPassword)){
               $scope.validNewPassword = false; 
            }
            else{
                $scope.validNewPassword = true; 
            }
        }

        $scope.updateFirebaseUserPassword = function(){
            if(!$scope.validNewPassword) return;
            if(!$scope.firebaseUser) return;
            if(!$scope.oldPassword) return;


            var credential = firebase.auth.EmailAuthProvider.credential(
              $scope.firebaseUser.email,
              $scope.oldPassword
            );

            $scope.firebaseUser.reauthenticateWithCredential(credential).then(function() {
              // User re-authenticated => update password.
              $scope.firebaseUser.updatePassword($scope.newPassword).then(function() {
              // Update successful.
              console.log('Password changed successful');
              $scope.signOut();
                }).catch(function(error) {
                    console.log(error);
                  // An error happened.
                  console.log('Error while changing password, please try again!');
                });
            }).catch(function(error) {
              // An error happened.
            });
        }

        function getOrderByID(id) {
            // console.log($scope.orders);
            return $filter("filter")($scope.orders, {
                id: id
            });
        }

        $scope.getSourceFromId = function(id){
            return $filter("filter")($scope.sources, {
                id: id
            })[0];
        }
        $scope.getPackFromId = function(id){
            return $filter("filter")($scope.packs, {
                id: id
            })[0];
        }

        firebase.database().ref('orders').limitToLast(1).on('child_added', function(snapshot) {
            $scope.orders.unshift(snapshot.val());
            
            Facebook.api('/' + snapshot.val().fbId + '/picture?height=100&width=100', function(response) {
                if (!response || response.error) {
                    alert('error!');
                }
                $scope.$apply(function(){
                    $scope.newAvatar = response.data.url;
                });
            });
            showNotify(snapshot.val());
        });

        firebase.database().ref('comments').limitToLast(1).on('child_added', function(snapshot) {

        });

        $scope.defaultToastrConfig = angular.copy(toastrConfig);
        $scope.alertTypes = ['success', 'error', 'info', 'warning'];

        $scope.isSeaching = false;
        $scope.searchText = '';
        $scope.isPageBusy = false;
        $scope.isAsideLoading = true;
        $scope.activeStatus = null;

        $scope.fbContent = null;
        $scope.fbPhotos = [];
        $scope.currentPageName = '';
        $scope.currentPageAvatar = '';

        $scope.isPostExpanded = false;
        $scope.selectedOrder = null;

        $scope.child = {};

        $scope.signOut = function() {
            firebase.auth().signOut();
        }

        $scope.newDate = function(dateString) {
            return new Date(dateString);
        }
        $scope.toggleExpandPost = function() {
            $scope.isPostExpanded = !$scope.isPostExpanded;
        }

        $scope.isShowAll = false;

        $scope.showAlert = function(title, content, alertType) {
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
        $scope.toggleShowMyOrders = function() {
            $scope.showMyOrders = !$scope.showMyOrders;
        }

        $scope.getOrderByUid = function(id) {
                return $scope.orders.filter(function(m) {
                    return m.id == id;
                })[0];
            },

        $scope.addToFavourite = function(event, order) {
            event.stopPropagation();
            if (order.seller_will_call_id) {
                $scope.showAlert('', 'Oops! This Order has belonged to ' + $scope.getSeller(order.seller_will_call_id).last_name, 'error');
            } else {
                order.seller_will_call_id = $scope.currentMember.id;
                firebaseService.updateOrderSellerWillCall(order);
            }
        }

        $scope.userCanReleaseOrChangeStatus = function(order) {
        	if(!$scope.currentMember) return null;
            return ($scope.currentMember.is_admin == 1) || ($scope.currentMember.id == order.seller_will_call_id);
        }
        $scope.releaseOrder = function(event, order) {
            event.stopPropagation();
            if (!$scope.userCanReleaseOrChangeStatus) {
                return false;
            }
            order.seller_will_call_id = null;
            // $scope.orders.$save(order);
            firebaseService.updateOrderSellerWillCall(order);
        }
        $scope.resetSearch = function() {
            $scope.searchText = '';
        };

        $scope.toggleShowAll = function() {
            $scope.activeStatus = null;
            $scope.showMyOrders = false;
            $scope.searchText = '';
        }

        $scope.toggleActiveStatus = function(status) {
            if ($scope.activeStatus != status) {
                $scope.activeStatus = status;
            } else {
                $scope.activeStatus = null;
            }

        }

        function getPageIdFromOrder(order) {
            var found = $filter('filter')($scope.sources, {
                id: order.order_source_id
            }, true);
            if (found.length) {
                return found[0].page_id;
            } else {
                return null;
            }
        }

        function getPostIdFromOrder(order) {
            var found = $filter('filter')($scope.packs, {
                id: order.product_pack_id
            }, true);
            if (found.length) {
                return found[0].post_id;
            } else {
                return null;
            }
        }

        // Select Order from List
        $scope.pleaseWaitMessage = 'Select an order to display';
        function activeOrder(order) {
            if(!order) return;
            // $scope.isPageBusy = true;
            // $scope.clickSound.play();
            $scope.isPostExpanded = false;
            
            graphUser(order.fbId);
            // $scope.fbContent = [];
            // $scope.fbContent.message = '';
            // $scope.fbPhotos = [];
            // $scope.currentPageName = '';
            // $scope.currentPageAvatar = '';
            graphPage(getPageIdFromOrder(order));
            graphPost(getPageIdFromOrder(order), getPostIdFromOrder(order));
            
            $scope.comments = firebaseService.getCommentForOrder(order);
            $scope.selectedOrder = order;
            // $scope.isPageBusy = null;
            // $scope.isAsideLoading = false;
        }
        $scope.active = function(order) {
            activeOrder(order);
        }

        // find an user with id
        $scope.findUser = function(id) {
            var found = $filter('filter')($scope.sellers, {
                id: id
            }, true);
            if (found.length) {
                return found[0];
            } else {
                return null;
            }
        }

        // get status by id
        $scope.getStatusById = function(statusId) {
            var found = $filter('filter')($scope.statuses, {
                id: statusId
            }, true);
            if (found.length) {
                return found[0];
            } else {
                return null;
            }
        }

        // get order status for an Order
        $scope.getOrderStatusForOrder = function(order) {
            if (!order) return;
            for (var i = 0; i < $scope.statuses.length; i++) {
                if (order.status_id == $scope.statuses[i].id) {
                    return $scope.statuses[i].display_type;
                }
            }
        }


        // object to hold all the data for the new comment form
        $scope.commentData = {};

        // loading variable to show the spinning loading icon
        $scope.loading = false;
        $scope.submitComment = function(order) {
            if (!$scope.commentData.content) {
                return false;
            }

            var newCommentKey = firebase.database().ref().child('comments').push().key;
            var $commentItem = {
                'id': newCommentKey,
                'order_id': order.id,
                'content': $scope.commentData.content,
                'created_at': Date.now(),
                'type': 0,
                'status_id': 0,
                'user': $scope.currentMember.id,
            };
            firebaseService.addComment($commentItem);
            $scope.comments.push($commentItem);
            $scope.commentData = {};
        }

        // destroy comment
        $scope.deleteComment = function(comment) {
            if (comment.id == undefined) return;
            firebaseService.removeComment(comment);
            var index = $scope.comments.indexOf(comment);
            $scope.comments.splice(index, 1);
        };

        // update order status
        $scope.updateStatus = function(order, $event, status) {
            if($scope.showCallLaterDialog || $scope.showBlockDialog){
                $scope.showCallLaterDialog = false;
                $scope.showBlockDialog = false;
            }

            if(order.status_id == status.id){
                $scope.showAlert('', 'Oops! Trạng thái không thay đổi, xem xét bổ sung comment.', 'error');
                return false;  
            }
            if (!$scope.userCanReleaseOrChangeStatus(order)) {
                $scope.showAlert('', 'Oops! Thay đổi trạng thái Order không thuộc về bạn?', 'error');
                return false;
            }
            if(status.id == 8){ //block
                $scope.showBlockDialog = true;
                blockStatus = status;
                $scope.blockReason = ''; 
                return;
             }
             else if(status.id == 5){
                showCallater();
                callLaterStatus = status;
                return;
             }
            changeOrderStatus(order, status);
        }
        function changeOrderStatus(order, status){
            order.status_id = status.id;
            
            var newCommentKey = firebase.database().ref().child('comments').push().key;
            var $commentItem = {
                'id': newCommentKey,
                'order_id': order.id,
                'content': '',
                'created_at': Date.now(),
                'type': 1,
                'status_id': status.id,
                'user': $scope.currentMember.id,
            };
            if(status.id == 6){ //chot
                order.checked_by = $scope.currentMember.id;
                order.checked_at = Date.now()
            }
            else{
                order.checked_by = null;
                order.checked_at = null
            }

            firebaseService.updateOrderStatus(order);

            firebaseService.addComment($commentItem);
            $scope.comments.push($commentItem);
            $scope.commentData = {};
        }
        $scope.showBlockDialog = false;
        $scope.hideBlockDialog = function(){
           $scope.showBlockDialog = false; 
        }
        $scope.blockReason = '';

        $scope.showCallLaterDialog = false;
        $scope.hideCallLaterDialog = function(){
           $scope.showCallLaterDialog = false; 
           
        }
        function showCallater(){
            $scope.showCallLaterDialog = true;
        }
        $scope.willCalllLaterMessage = '';
        var callLaterStatus = null;
        $scope.submitCallLater = function(order){
            
            // add new comment
            if ($scope.willCalllLaterMessage.length < 3) {
                return false;
            }
            else{
                changeOrderStatus(order, callLaterStatus);
                var newCommentKey = firebase.database().ref().child('comments').push().key;
                var $commentItem = {
                    'id': newCommentKey,
                    'order_id': order.id,
                    'content': $scope.willCalllLaterMessage,
                    'created_at': Date.now(),
                    'type': 0,
                    'status_id': 0,
                    'user': $scope.currentMember.id,
                };
                firebaseService.addComment($commentItem);
                $scope.comments.push($commentItem);
                $scope.hideCallLaterDialog();  
            }
            
        }

        // ađ to block list
        var blockStatus = null;
        $scope.submitBlockNumber = function(order){
            var newKey = firebase.database().ref().child('blocks').push().key;
            var blockItem = {
                'id': newKey,
                'mobile': order.buyer_mobile,
                'pack_id': order.product_pack_id,
                'created_at': Date.now(),
                'source_id': order.order_source_id,
                'uid': $scope.currentMember.id,
                'reason': $scope.blockReason,
            };
            if($scope.blockReason.length > 3){
                firebaseService.submitBlockNumber(blockItem);
                $scope.showBlockDialog = false;
                changeOrderStatus(order, blockStatus);
                $scope.blockReason = '';
            }
        }

        // Quick update status for active order
        $scope.quickUpdateStatus = function(statusId) {
            if (!$scope.selectedOrder) {
                $scope.showAlert('', 'Oops! Please select an Order befor perform this action.', 'error');
                return false;
            }
            $scope.changeStatus($scope.selectedOrder, statusId).then(function(data) {
                // update item in $scope.orders.items collection
                for (var i = $scope.orders.length - 1; i >= 0; i--) {
                    if ($scope.orders[i].id == $scope.selectedOrder.id) {
                        $scope.orders[i].status_id = statusId;
                    }
                }
            });
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
                $scope.toggleShowMeExpand();
            }
        });

        $scope.showMeExpand = false;
        $scope.toggleShowMeExpand = function(){
			$scope.showMeExpand = !$scope.showMeExpand;
			$scope.initChart();
		}

        hotkeys.add({
            combo: 'esc',
            description: 'Thoát',
            callback: function() {
                $scope.hideAllModals();
            }
        });

        $scope.getSeller = function(id) {
            if (!id) return null;
            var result = [];
            ref.child('members').orderByChild('id').equalTo(id).once('value', function(snap) {
                snap.forEach(function(item) {
                    var itemVal = item.val();
                    result.push(itemVal);
                });
            });
            return result[0];
        };

        $scope.clibboardCoppyLink = function(e) {
            var textToCopy = $state.href($state.current.name, $state.params, {
                absolute: true
            });
            $copyToClipboard.copy(textToCopy).then(function() {
                $scope.showAlert('', 'Order has been copied. Press Ctrl+V to paste.', 'info');
            });
        }

        // web notification
        function showNotify(order) {
            $scope.graphUserAvatar(order.fbId);
            var content = (order && order.buyer_name) ? order.buyer_name + '/' + order.buyer_mobile : 'No name';
            webNotification.showNotification('Newest Order!', {
                body: content,
                icon: $scope.newAvatar,
                onClick: function onNotificationClicked() {
                    // $scope.orders.active = order;
                    // $scope.active(order);
                },
                autoClose: 5000 //auto close the notification after 4 seconds (you can manually close it via hide function)
            }, function onShow(error, hide) {
                if (error) {
                    window.alert('Unable to show notification: ' + error.message);
                } else {
                    // console.log('Notification Shown.');

                    setTimeout(function hideNotification() {
                        // console.log('Hiding notification....');
                        hide(); //manually close the notification (you can skip this if you use the autoClose option)
                    }, 5000);
                }
            });
        }

        // ##########################CHART

        /*Preparing data for chart*/
        var preparingChartData = function(){
        	// count orders called by me:

        }

        /*Define chart*/
        $scope.chartTypes = [
		    {"id": "line", "title": "Line"},
		    {"id": "spline", "title": "Smooth line"},
		    {"id": "area", "title": "Area"},
		    {"id": "areaspline", "title": "Smooth area"},
		    {"id": "column", "title": "Column"},
		    {"id": "bar", "title": "Bar"},
		    {"id": "pie", "title": "Pie"},
		    {"id": "scatter", "title": "Scatter"}
		  ];

		  $scope.dashStyles = [
		    {"id": "Solid", "title": "Solid"},
		    {"id": "ShortDash", "title": "ShortDash"},
		    {"id": "ShortDot", "title": "ShortDot"},
		    {"id": "ShortDashDot", "title": "ShortDashDot"},
		    {"id": "ShortDashDotDot", "title": "ShortDashDotDot"},
		    {"id": "Dot", "title": "Dot"},
		    {"id": "Dash", "title": "Dash"},
		    {"id": "LongDash", "title": "LongDash"},
		    {"id": "DashDot", "title": "DashDot"},
		    {"id": "LongDashDot", "title": "LongDashDot"},
		    {"id": "LongDashDotDot", "title": "LongDashDotDot"}
		  ];

		  

		var chartSeries = [
				  	{"name": "Đã gọi", "data": [0,0,0,0,0,0,0], id: 's1', "dashStyle":"ShortDash","color":"#888","lineWidthPlus":"1", "lineWidth":"1"},
				    {"name": "Đã chốt", "data": [0,0,0,0,0,0,0], color: '#8bbc21', borderColor: '#8bbc21', type: "column", id: 's3'},
				    {"name": "Thất bại", "data": [0,0,0,0,0,0,0], color: 'rgb(170,25,25)', borderColor: 'rgb(170,25,25)', type: "column", id: 's4'},
				    {"name": "Chưa gọi", "data": [0,0,0,0,0,0,0], color: 'rgba(0, 0, 0, .3)', borderColor: 'rgb(38,60,83)', type: "column", id: 's5'},
				    {"name": "Khác", "data": [0,0,0,0,0,0,0], color: 'rgb(72,151,241)', borderColor: 'rgb(72,151,241)', type: "column", id: 's6'}
				  ];

		$scope.chartSeries = [];
		$scope.initChart = function(){
			for (var i = 0; i < chartSeries.length; i++) {
				$scope.chartConfig.series.push(chartSeries[i]);
			}

            // $scope.chartConfig.series[0].data = [70, 15, 56, 82, 49, 65, 88];
            var data = firebaseService.getUserOrders($scope.currentMember.id, 7);
            // assign to seller data
            $scope.sellerData = data;
            // $scope.currentDataDisplay = data[2];
            $scope.toggleActivedDataStatus(1);

            var called = [], success = [], failed = [], notCalled = [], others = [];
            for (var i = 0; i < data[1].length; i++) {
                called.push(data[1][i].length);
                success.push(data[2][i].length);
                failed.push(data[3][i].length);
                notCalled.push(data[4][i].length);
                others.push(data[5][i].length);
            }

            $scope.chartConfig.series[0].data = called;
            $scope.chartConfig.series[1].data = success;
            $scope.chartConfig.series[2].data = failed;
            $scope.chartConfig.series[3].data = notCalled;
            $scope.chartConfig.series[4].data = others;
            $scope.chartConfig.xAxis.categories = data[0];
		}
        $scope.sellerData = [];
        $scope.destroyChart = function(){
            $scope.chartSeries = [];
        }
        $scope.sellerDataStatusItem = {};
        $scope.sellerDataStatuses = [];

        $scope.currentDataDisplay = null;
        function getSellerDataDisplay(s){
            $scope.currentDataDisplay = $scope.sellerData[s];
        }
        $scope.activedDataStatus = 0;
        $scope.toggleActivedDataStatus = function(s){
            $scope.activedDataStatus = s;
            getSellerDataDisplay(s);
        }
        
		$scope.testChangeData = function(){
			$scope.chartConfig.series[0].data = [70, 15, 56, 82, 49, 65, 88];

			var rnd = []
		    for (var i = 0; i < 7; i++) {
		      rnd.push(Math.floor(Math.random() * 20) + 1)
		    }
		    $scope.chartConfig.series[0].data = rnd;
            // getAvailableOrders(2);
		}

        $scope.currentOrder = null;

        function getAvailableOrders(dates){
            if(!dates) dates = 2;
            var endTime = new Date(); // today
            var startTime = new Date(); // yesterday
            startTime.setDate(startTime.getDate() - dates);
            endTime.setDate(endTime.getDate());
            // console.log('get orders from: ' + startTime + ' to ' + endTime);
            startTime = startTime.getTime();
            endTime = endTime.getTime();

            // var res = [];
            ref.child('orders').orderByChild('created_at')
            .startAt(startTime)
            .endAt(endTime)
            .once('value', function(snap) {
               var res = [];
               // res = snap.val();
               snap.forEach(function(item){
                    res.push(item.val());
               });
               // console.log(res);
                $scope.orders = res.reverse();

               // return res;
            });
        }
        
        ref.child('orders')
            .on('child_changed', function(snap) {
                angular.forEach($scope.orders, function(o, i) {
                  if (o.id === snap.val().id ) {
                    $timeout(function () {
                        angular.copy(snap.val(), $scope.orders[i]);
                        $scope.$apply();
                    }, 10);
                    return;
                  }
                });
            });

		 $scope.addSeries = function () {
		    var rnd = []
		    for (var i = 0; i < 10; i++) {
		      rnd.push(Math.floor(Math.random() * 20) + 1)
		    }
		    var sId = '__series' + seriesId++;
		    $scope.chartConfig.series.push({
		      data: rnd,
		      id: sId
		    });
		    // console.log($scope.chartConfig.series);
		  };

		  $scope.chartStack = [
		    {"id": '', "title": "No"},
		    {"id": "normal", "title": "Normal"},
		    {"id": "percent", "title": "Percent"}
		  ];

		  $scope.addPoints = function () {
		    var seriesArray = $scope.chartConfig.series;
		    var rndIdx = Math.floor(Math.random() * seriesArray.length);
		    seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20]);
		  };

		  var seriesId = 0;
		  var yAxisId = 0;
		  var xAxisId = 0;

		$scope.addAxis = function(xy) {
		  /*
		      Adds a Y Axis
		  */
		  var id;
		  var axis;
		  if (xy==='y') {
		    yAxisId += 1;
		    id = yAxisId;
		    axis = 'yAxis';
		  } else {
		    xAxisId += 1;
		    id = xAxisId;
		    axis = 'xAxis';
		  }


		  var rnd = [];
		  for (var i = 0; i < 10; i++) {
		      rnd.push(Math.floor(Math.random() * 20) + 1);
		  }
		  if (!$scope.chartConfig[axis]) {
		    $scope.chartConfig[axis] = [];
		  }
		  $scope.chartConfig[axis].push({
		      min: Math.min.apply(null, rnd),
		      max: Math.max.apply(null, rnd),
		      title: {
		          text: xy + "-Axis" + id.toString()
		      },
		      id: xy + 'Axis_' + id
		  });
		};


		  // $scope.addSeries = function () {
		  //   var rnd = []
		  //   for (var i = 0; i < 10; i++) {
		  //     rnd.push(Math.floor(Math.random() * 20) + 1)
		  //   }
		  //   var sId = '__series' + seriesId++;
		  //   $scope.chartConfig.series.push({
		  //     data: rnd,
		  //     id: sId
		  //   });
		  // };

		  $scope.removeRandomSeries = function () {
		    var seriesArray = $scope.chartConfig.series;
		    var rndIdx = Math.floor(Math.random() * seriesArray.length);
		    seriesArray.splice(rndIdx, 1);
		  };

		  $scope.removeSeries = function (id) {
		    var seriesArray = $scope.chartConfig.series;
		    seriesArray.splice(id, 1);
		  };

		  $scope.toggleHighCharts = function () {
		    this.chartConfig.useHighStocks = !this.chartConfig.useHighStocks;
		  };

		  $scope.replaceAllSeries = function () {
		    var data = [
		      { name: "first", data: [10], id: 'a' },
		      { name: "second", data: [3], id: 'b' },
		      { name: "third", data: [13], id: 'c' }
		    ];

		    	$scope.chartConfig.series = data;
		    
		  };

		  $scope.chartConfig = {

		    chart: {
		      height: 500,
		      width: 600,
		      type: 'line'
		    },
		    plotOptions: {
		      series: {
		        stacking: '',
		         states: {
		                hover: {
		                    lineWidthPlus: 1,
		                    lineWidth: 1
		                }
		            },
		        dataLabels: {
		                enabled: true,
		                crop: false,
		                overflow: 'none',
		                style: {
		                    fontWeight: '300',
		                    color: '#FFFFFF',
		                }
		            }
		      }
		    },
		    series: $scope.chartSeries,
		    title: {
		      text: 'My Data in recent 7 days',
		      style: {
		            color: '#fff',
		            fontWeight: '300',
		            fontSize: '24px'
		        }
		    },
		    yAxis: {
	            gridLineColor: '#393939',
	            labels: {
	            	style: {
	            		color: '#fff'
	            	}
	            }
	        },
	        xAxis: {
	        	categories: ['25/10', '26/10', '27/10', '28/10', '29/10', '30/10', '31/10'],
	            gridLineColor: '#393939',
	            labels: {
	            	style: {
	            		color: '#fff'
	            	}
	            }
	        },
		  }

		  $scope.reflow = function () {
		    $scope.$broadcast('highchartsng.reflow');
		  };


          // quick comment
          $scope.quickComments = ['Khách hẹn gọi lại vào lúc ...h', 
          'Khách yêu cầu gửi ...', 'Khách đang bận, gọi lại sau ...h', 'Khách bận, sáng gọi lại'];
          $scope.selectQuickComment = function(comment){
            if(comment){
                $scope.commentData.content = comment;
                $scope.showQuickComment = false;
            }
          }
          $scope.showQuickComment = false;
          $scope.toggleShowQuickComment = function(){
            $scope.showQuickComment = !$scope.showQuickComment;
          }
          $scope.hideQuickComment = function(){
            $scope.showQuickComment = false;
          }
          $scope.clearCommentData = function(){
            $scope.commentData.content = '';
          }

          // help
          $scope.isShowOverlay = false;
          $scope.isShowHelpPanel = false;
          $scope.showHelpPanel = function(){
            $scope.isShowHelpPanel = true;
            $scope.isShowOverlay = true;
            // console.log($scope.selectedOrder);
          }
          $scope.closeHelpPanel = function(){
            $scope.isShowHelpPanel = false;
            $scope.isShowOverlay = false;
          }
          $scope.hideAllModals = function(){
            if($scope.isShowHelpPanel){
                $scope.closeHelpPanel();
            }
          }

          /*List request for current order*/
          var requestStatuses = {
            pending : '1',
            resolved : '2',
            rejected : '3'
          };
          $scope.requests = [];
          $scope.requestContent = null;
          function validationRequest(requestData){
            if(requestData.content.length < 3){
                return false;
            }
            return true;
          }
          function getRequests(uid){
            $scope.requests = supportService.getUserRequests(uid);
            console.log($scope.requests);
          }
          $scope.submitRequest = function(order){
            if(!order){
                $scope.showAlert('', 'Oops! Vui lòng chọn Order trước khi gửi request.', 'error');
                return;
            }
            var requestData = {
                fromSeller      : $scope.currentMember.id,
                created_at      : Date.now(),
                type            : '1',
                status          : '1',
                order_id        : order.id,
                content         : $scope.requestContent,
                response        : '',
                id              : supportService.getNewRequestId()
              }
            if(validationRequest(requestData)){
                requestData.created_at = Date.now();
                supportService.submitRequest(requestData);
                $scope.requests.push(requestData);
                $scope.requestContent = '';
            }
          }

        $scope.findOrderById = function(id){
            var orders = [];
            orders = firebaseService.findOrderById(id);
            // console.log(orders);
        }


        function init(){
            getAvailableOrders(10);
            // init status for seller page

            var items = [
                {
                    $index    : 1,
                    title : 'Đã gọi',
                    value : 1,
                },
                {
                    $index    : 2,
                    title : 'Đã chốt',
                    value : 2,
                },
                {
                    $index    : 3,
                    title : 'Thất bại',
                    value : 3,
                },
                {
                    $index    : 4,
                    title : 'Chưa gọi',
                    value : 4,
                },
                {
                    $index    : 5,
                    title : 'Trạng thái khác',
                    value : 5,
                },

            ];
            angular.forEach(items, function(v){
                $scope.sellerDataStatuses.push(v);
            });
        }
        // call init()
        init();


    });