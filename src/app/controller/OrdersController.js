// old access token: 639041606186502|uaa4AIPe63MOQQWKFlrTW2cZlHY
meovn.controller('OrdersController',
    function($scope, $http, hotkeys, $filter, $state, $stateParams,
        toastr, toastrConfig, $firebaseArray, Facebook, $copyToClipboard, webNotification, ngAudio, firebaseService) {

        var CURRENT_USER_ID = 73;

        $scope.audio = ngAudio.load('assets/sounds/click.mp3');
        $scope.clickSound = ngAudio.load('assets/sounds/button-2.mp3');
        $scope.getOrderSound = ngAudio.load('assets/sounds/click.mp3');
        $scope.releaseOrderSound = ngAudio.load('assets/sounds/button-4.mp3');
        $scope.popupSound = ngAudio.load('assets/sounds/new-order.mp3');

        var access_token = 'EAAPbgSrDvvwBAE83TW0ZCCm83YuFXjaQmyd7UQZC9hHhaumkN8aiscrr0hxvlRZAeVae7HDpY1vv3aIzPZAH3O6QtHipfooGJzZBH1WioeKiUZAZC2pkuUJRoAMNvzh5RtQBHiRzfrG12e7nzYRl4E1h7kTbXRW1VsZD';

        function graphPage(pageId) {
            $scope.isPageBusy = true;
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
                $scope.isPageBusy = false;
            });
        };
        $scope.userAvatar = null;
        $scope.userLink = null;

        function graphUser(userId) {
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
            $scope.isPageBusy = true;
            Facebook.api('/' + pageId + '_' + postId + '?access_token=' + access_token, function(response) {

                /**
                 * Using $scope.$apply since this happens outside angular framework.
                 */

                $scope.fbContent = response;


            }).then(function() {
                // console.log('xong');
                $scope.isPageBusy = false;
            });
            // graph post photos
            Facebook.api('/' + pageId + '_' + postId + '/attachments' + '?access_token=' + access_token, function(response) {
                /**
                 * Using $scope.$apply since this happens outside angular framework.
                 */
                $scope.fbPhotos = [];
                for (var i = 0; i < response.data[0].subattachments.data.length - 1; i++) {
                    $scope.fbPhotos.push(response.data[0].subattachments.data[i].media.image.src);
                }


            }).then(function() {
                // console.log('xong');
                $scope.isPageBusy = false;
            });
        };

        // store all buyers avatars
        $scope.buyersAvatar = [];

        firebaseService.getAllOrders().then(function(orders) {
            $scope.orders = orders;
            

            // $scope.buyersAvatar = [];
            // angular.forEach(orders, function(value, key) {
            //     Facebook.api('/' + value.fbId + '/picture?height=100&width=100', function(response) {
            //         if (value.fbId) {
            //             $scope.buyersAvatar.push({
            //                 'fbId': value.fbId,
            //                 'avatar': response.data.url
            //             });
            //         }
            //     });
            // });


            firebaseService.getAllSources().then(function(sources) {
                $scope.sources = sources;
                firebaseService.getAllPacks().then(function(packs) {
                    $scope.packs = packs;
                    if ($state.current.name == 'home.details') {
                        $scope.pleaseWaitMessage = 'Loading Order details. Please wait...';
                        activeOrder(firebaseService.getOrder($stateParams.id));
                        $scope.isPageBusy = false;
                    }

                    $scope.isAsideLoading = false;
                });
            });
        });

        $scope.currentMember = null;
        firebase.auth().onAuthStateChanged(function(firebaseUser) {
            if (!firebaseUser) {
                // console.log('You are not loged in!');
                window.location = '/#/auth';
                return;
            } else {
                $scope.firebaseUser = firebase.auth().currentUser;

                // $scope.$apply(function() {
                //     firebaseService.getMemberByEmail($scope.firebaseUser.email);
                // });
                // firebaseService.getMemberByEmail(firebase.auth().currentUser.email);
               
                // window.location = '/';
                // console.log($scope.currentMember);
            }
        });

        var ref = firebase.database().ref();

        $scope.orders = [];
        $scope.comments = [];
        $scope.sources = [];
        $scope.statuses = [];
        $scope.sellers = [];
        $scope.packs = [];



        firebaseService.getAllMembers().then(function(members) {
            $scope.sellers = members;

			angular.forEach($scope.sellers, function(value) {
				if(value.email == $scope.firebaseUser.email){
					$scope.currentMember = value;
				}
			})
			console.log($scope.currentMember);

        });
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
        firebaseService.getAllComments().then(function(comments) {
            $scope.comments = comments;
        });
        // $scope.firebaseUser = firebase.auth().currentUser;
        // var email = firebaseService.getMemberByEmail(firebase.auth().currentUser.email);
        // 		alert(email);
        $scope.updateFirebaseUser = function(newAvatar, newName) {
            var user = firebase.auth().currentUser;
            // console.log(user);
            user.updateProfile({
                displayName: newName,
                photoURL: newAvatar,
            }).then(function() {
                console.log('success');
                console.log(user);
                // Update successful.
            }).catch(function(error) {
                // An error happened.
                console.log('error');
            });
        };


        function getOrderByID(id) {
            console.log($scope.orders);
            return $filter("filter")($scope.orders, {
                id: id
            });
        }
        firebase.database().ref('orders').limitToLast(1).on('child_added', function(snapshot) {
            $scope.showNotify(snapshot.val());
            Facebook.api('/' + snapshot.val().fbId + '/picture?height=100&width=100', function(response) {
                if (!response || response.error) {
                    alert('error!');
                }
                $scope.$apply(function() {
                    $scope.newAvatar = response.data.url;
                });
            });
        });

        $scope.getBuyerAvatar = function(order) {
            var newTemp = $filter("filter")($scope.buyersAvatar, {
                fbId: order.fbId
            });
            return newTemp.avatar;
        }
        $scope.defaultToastrConfig = angular.copy(toastrConfig);
        $scope.alertTypes = ['success', 'error', 'info', 'warning'];

        $scope.showSearchbox = true;
        $scope.isSeaching = false;
        $scope.searchText = '';
        $scope.isPageBusy = true;
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

        $scope.currentUser = null;
        var getCurrentUser = function() {
            var result = [];
            ref.child('members').orderByChild('id').equalTo(CURRENT_USER_ID).once('value', function(snap) {
                snap.forEach(function(item) {
                    var itemVal = item.val();
                    result.push(itemVal);
                });
            });
            $scope.currentUser = result;
        }
        getCurrentUser();

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

        $scope.addToFavourite = function(event, $order) {
            event.stopPropagation();
            if ($order.seller_will_call_id) {
                $scope.showAlert('', 'Oops! This Order has belonged to ' + $scope.getSeller($order.seller_will_call_id).last_name, 'error');
            } else {
                $order.seller_will_call_id = $scope.currentMember.id;
                firebaseService.updateOrder($order).then(function(response) {
                    // console.log(response);
                }, function(err) {
                    $scope.showAlert('', 'Oops! ' + err, 'error');
                });
                // $scope.orders.$save($order);
                $scope.getOrderSound.play();
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
            firebaseService.updateOrder(order).then(function(response) {}, function(err) {
                $scope.showAlert('', 'Oops! ' + err, 'error');
            });
            $scope.releaseOrderSound.play();
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
            $scope.isPageBusy = true;
            $scope.clickSound.play();
            $scope.isPostExpanded = false;
            graphUser(order.fbId);
            $scope.fbContent = [];
            $scope.fbContent.message = '';
            $scope.fbPhotos = [];
            $scope.currentPageName = '';
            $scope.currentPageAvatar = '';
            graphPage(getPageIdFromOrder(order));
            graphPost(getPageIdFromOrder(order), getPostIdFromOrder(order));
            $scope.selectedOrder = order;

        }
        $scope.active = function(order) {
        	$scope.pleaseWaitMessage = 'Please wait...';
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

        $scope.filterOrdersByStatus = function(status) {
            firebase.database().ref().child('orders').orderByChild("status_id").equalTo(status.id).once("value", function(data) {
                // console.log('status id: ' + status.id);
                data.forEach(function(item) {
                    var itemVal = item.val();
                    // console.log(itemVal);
                });
            });
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
                'user': $scope.currentMember,
            };
            // firebase.database().ref().child('comments').push($commentItem);
            firebaseService.addComment($commentItem).then(function(response) {
                // console.log(response);
            }, function(err) {
                $scope.showAlert('', 'Oops! ' + err, 'error');
            });
            $scope.commentData = {};
        }

        // remove item from Comment List
        $scope.removeComment = function(item) {
            var index = $scope.commentList.indexOf(item);
            $scope.commentList.splice(index, 1);
        }

        // find comment by id in Comment List
        $scope.getCommentById = function(id) {
            var found = $filter('filter')($scope.commentList, {
                id: id
            }, true);
            if (found.length) {
                return found[0];
            } else {
                return null;
            }
        }

        // destroy comment
        $scope.deleteComment = function(comment) {
            if (comment.id == undefined) return;
            firebaseService.removeComment(comment).then(function(response) {
                // console.log(response);
            }, function(err) {
                $scope.showAlert('', 'Oops! ' + err, 'error');
            });
        };

        // update order status
        $scope.updateStatus = function(order, $event, status) {
            $scope.clickSound.play();
            if (!$scope.userCanReleaseOrChangeStatus(order)) {
                $scope.showAlert('', 'Oops! Not allowed to change the order status of others.', 'error');
                return false;
            }
            // if(order.status_id == status.id || !status) return;
            // $scope.isPageBusy = true;
            // var val = angular.element($event.target).attr("data-status-id");
            order.status_id = status.id;
            // $scope.orders.$save(order);	
            firebaseService.updateOrder(order).then(function(response) {
                // console.log(response);
            }, function(err) {
                $scope.showAlert('', 'Oops! ' + err, 'error');
            });
            // $scope.orders.active = order;

            var newCommentKey = firebase.database().ref().child('comments').push().key;
            var $commentItem = {
                'id': newCommentKey,
                'order_id': order.id,
                'content': '',
                'created_at': Date.now(),
                'type': 1,
                'status_id': status.id,
                'user': $scope.currentMember,
            };
            // firebase.database().ref().child('comments').push($commentItem);
            firebaseService.addComment($commentItem).then(function(response) {
                // console.log(response);
            }, function(err) {
                $scope.showAlert('', 'Oops! ' + err, 'error');
            });
            $scope.commentData = {};
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

        $scope.toggleShowSearchBox = function() {
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
        var getClipboardData = function(order) {
            var m, n, s, p, st, sl;
            s = getSource(order.order_source_id);
            p = getPack(order.product_pack_id);
            st = getStatus(order.status_id);
            sl = $scope.getSeller(order.seller_will_call_id);
            return 'Page:' + '\t\t\t' + s[0].source_name +
                '\nGói sp:' + '\t\t\t' + p[0].short_title + '/' + p[0].price + 'K' +
                '\nTrạng thái:' + '\t\t' + st[0].name +
                '\nNgười gọi:' + '\t\t' + (sl ? sl[0].last_name : 'Chưa có');
        }
        var getSource = function(id) {
            if (!id) return null;
            var result = [];
            ref.child('sources').orderByChild('id').equalTo(id).on('value', function(snap) {
                snap.forEach(function(item) {
                    var itemVal = item.val();
                    result.push(itemVal);
                });
            });
            return result;
        };
        var getStatus = function(id) {
            // console.log(id);
            if (!id) return null;
            var result = [];
            ref.child('statuses').orderByChild('id').equalTo(id).on('value', function(snap) {
                snap.forEach(function(item) {
                    var itemVal = item.val();
                    result.push(itemVal);
                });
            });
            return result;
        };
        var getPack = function(id) {
            if (!id) return null;
            var result = [];
            ref.child('packs').orderByChild('id').equalTo(id).on('value', function(snap) {
                snap.forEach(function(item) {
                    var itemVal = item.val();
                    result.push(itemVal);
                });
            });
            return result;
        };

        $scope.getSeller = function(id) {
            if (!id) return null;
            var result = [];
            ref.child('members').orderByChild('id').equalTo(id).on('value', function(snap) {
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
        $scope.showNotify = function(order) {
            $scope.graphUserAvatar(order.fbId);
            var content = (order && order.buyer_name) ? order.buyer_name + '/' + order.buyer_mobile : 'No name';
            webNotification.showNotification('Newest Order!', {
                body: content,
                icon: $scope.newAvatar,
                onClick: function onNotificationClicked() {
                    // $scope.orders.active = order;
                    $scope.active(order);
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

        // facebook
        // Define user empty data :/
        $scope.user = {};

        // Defining user logged status
        $scope.logged = false;

        // And some fancy flags to display messages upon user status change
        $scope.byebye = false;
        $scope.salutation = false;

        /**
         * Watch for Facebook to be ready.
         * There's also the event that could be used
         */
        $scope.$watch(
            function() {
                return Facebook.isReady();
            },
            function(newVal) {
                if (newVal)
                    $scope.facebookReady = true;
            }
        );

        var userIsConnected = false;

        Facebook.getLoginStatus(function(response) {
            if (response.status == 'connected') {
                userIsConnected = true;
            }
        });

        /**
         * IntentLogin
         */
        $scope.IntentLogin = function() {
            if (!userIsConnected) {
                $scope.login();
            }
        };

        /**
         * Login
         */
        $scope.login = function() {
            Facebook.login(function(response) {
                if (response.status == 'connected') {
                    $scope.logged = true;
                    // $scope.me();
                }

            });
        };

        /**
         * me 
         */
        $scope.me = function() {
            // $scope.IntentLogin();
            Facebook.api('/me', function(response) {
                /**
                 * Using $scope.$apply since this happens outside angular framework.
                 */
                $scope.$apply(function() {
                    $scope.user = response;
                });

            });
        };
        $scope.myAvatar = '';
        $scope.getMyAvatar = function() {
            $scope.IntentLogin();
            // console.log($scope.user);
            Facebook.api('/' + $scope.user.id + '/picture?height=100&width=100', function(response) {
                /**
                 * Using $scope.$apply since this happens outside angular framework.
                 */
                $scope.$apply(function() {
                    $scope.myAvatar = response.data.url;
                    // console.log($scope.myAvatar);
                    // $scope.updateFirebaseUser($scope.myAvatar, $scope.user.name);
                });
            });
        }

        /**
         * Logout
         */
        $scope.logout = function() {
            Facebook.logout(function() {
                $scope.$apply(function() {
                    $scope.user = {};
                    $scope.logged = false;
                    console.log('logged out');
                });
            });
        }

        /**
         * Taking approach of Events :D
         */
        $scope.$on('Facebook:statusChange', function(ev, data) {
            // console.log('Status: ', data);
            if (data.status == 'connected') {
                $scope.$apply(function() {
                    $scope.salutation = true;
                    $scope.byebye = false;
                });
            } else {
                $scope.$apply(function() {
                    $scope.getMyAvatar();
                    $scope.salutation = false;
                    $scope.byebye = true;

                    // Dismiss byebye message after two seconds
                    $timeout(function() {
                        $scope.byebye = false;
                    }, 2000)
                });
            }

        });

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

		  $scope.chartSeries = [
		  	{"name": "Đã gọi", "data": [80, 115, 46, 72, 39, 55, 80], id: 's1', "dashStyle":"ShortDash","color":"#888","lineWidthPlus":"1", "lineWidth":"1"},
		    {"name": "Đã chốt", "data": [25, 50, 30, 10, 55, 66, 78], color: '#8bbc21', borderColor: '#8bbc21', type: "column", id: 's3'},
		    {"name": "Thất bại", "data": [14, 16, 18, 11, 22, 45, 23], color: 'rgb(170,25,25)', borderColor: 'rgb(170,25,25)', type: "column", id: 's4'},
		    {"name": "Báo xấu", "data": [9, 15, 25, 1, 22, 10, 8], color: 'rgb(38,60,83)', borderColor: 'rgb(38,60,83)', type: "column", id: 's5'},
		    {"name": "Khác", "data": [25, 35, 18, 9, 20, 11, 15], color: 'rgb(72,151,241)', borderColor: 'rgb(72,151,241)', type: "column", id: 's6'}
		  ];

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
		  };

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


    });