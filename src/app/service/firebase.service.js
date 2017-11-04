meovn.service('firebaseService', ["$firebaseArray", "$filter", function ($firebaseArray, $filter) { 

	var ref = firebase.database().ref();
    // ordersArr = $firebaseArray(ref.child('orders'));
    // commentsArr = $firebaseArray(ref.child('comments'));
    sourcesArr = $firebaseArray(ref.child('sources'));
    statusesArr = $firebaseArray(ref.child('statuses'));
    membersArr = $firebaseArray(ref.child('members'));
    packsArr = $firebaseArray(ref.child('packs'));

 	//  var getAllOrders = function(){
	// 	return ordersArr.$loaded();
	// };
	// var getAllComments = function(){
	// 	return commentsArr.$loaded();
	// };
    var getAllSources = function(){
		return sourcesArr.$loaded();
	};
	var getAllStatuses = function(){
		return statusesArr.$loaded();
	};
	var getAllPacks = function(){
		return packsArr.$loaded();
	};
	var getAllMembers = function(){
		return membersArr.$loaded();
	};

	// var getOrder = function(id){
	// 	return ordersArr.$getRecord(id);
	// }
	

	var getMember = function(id){
		return membersArr.$getRecord(id);
	}
	var getMemberByEmail = function(email){
		membersArr.$loaded().then(function(){
			angular.forEach(membersArr, function(value) {
				if(value.email == email){
					return value;
				}
				return null;
            });
            return null;
		});
		
	}

	var getCommentForOrder = function(order){
		var comments = [];
		ref.child('comments').orderByChild('order_id').equalTo(order.id).once('value', function(snapshot){
			// console.log(snapshot.val());
			angular.forEach(snapshot.val(), function(value, key){
				comments.push(value);
				// console.log(value);
			});
		 	// return res;
		 });
		return comments;
	}
	var updateOrder = function(order){
		 return	ref.child('orders').orderByChild('id').equalTo(order.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.update({
	        		seller_will_call_id : order.seller_will_call_id
	        	});
	    });
	 });
	};
	var updateOrderSellerWillCall = function(order){
		// update_at
		order.updated_at	= Date.now();
		// if seller get this order, we need to store seller id
		var assign_data = {};
		if(order.seller_will_call_id){
			assign_data = {
				'uid' 			: order.seller_will_call_id,
				'assigned_date'	: Date.now(),
				'status_before' : order.status_id,
				// 'status_after' is null that's mean seller not change status
  			};
  			// store to order
  			order.assign_data = assign_data;
		}
		 return	ref.child('orders').orderByChild('id').equalTo(order.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
		 		// append
		 		child.ref.child('assign_data').push(assign_data);
	        	return child.ref.update({
	        		seller_will_call_id : order.seller_will_call_id,
	        		updated_at			: order.updated_at,
	        	});
	    });
	 });
	};
	var updateOrderStatus = function(order){
		// update_at
		order.updated_at	= Date.now();
		return	ref.child('orders').orderByChild('id').equalTo(order.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.update({
	        		status_id : order.status_id,
	        		checked_by : order.checked_by,
	        		checked_at : order.checked_at,
	        		updated_at			: order.updated_at,
	        	});
	        	// find assign_data and update
	        	// if order.seller_will_call_id == null => allow admin or mod change status
	        	if(order.seller_will_call_id){
	        		// seller change
	        		child.ref.child('assign_data').orderByChild('uid').equalTo(order.seller_will_call_id).limitToLast(1)
	        		.once('value', function(ss){
	        			ss.forEach(function(c){
	        				c.ref.update({
	        					'status_after' : order.status_id
	        				});
	        			});
	        		});
	        	}
	        	else{
	        		// admin change
	        		child.ref.child('assign_data').orderByChild('uid').limitToLast(1)
	        		.once('value', function(ss){
	        			ss.forEach(function(c){
	        				c.ref.update({
	        					'status_after' : order.status_id
	        				});
	        			});
	        		});
	        	}
		    });
		 });
	};
	var findOrderById = function(id){
		var orders = [];
		ref.child('requests').orderByChild('id').equalTo(id).once('value', function(snapshot){
			console.log(snapshot.val());
			angular.forEach(snapshot.val(), function(value, key){
				orders.push(value);
			});
		 	// return res;
		 });
		return orders;
	};
	// var addComment = function(comment){
	// 	return commentsArr.$add(comment);
	// };

	var addComment = function(r){
		 var re = ref.child('comments');
		 return re.push(r);
	};

	/*add a mobile number to blocks list*/
	var submitBlockNumber = function(n){
		var re = ref.child('blocks');
		return re.push(n);
	}

	// var updateComment = function(comment){
	// 	return commentsArr.$save(comment);
	// };
	var removeComment = function(comment){
		return	ref.child('comments').orderByChild('id').equalTo(comment.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.remove();
		    });
		 });
	};

	// user manager
	var updateUserName = function(newName){
		var user = firebase.auth().currentUser;
		user.updateProfile({
		  displayName: newName,
		}).then(function() {
			console.log('success');
		  // Update successful.
		}).catch(function(error) {
		  // An error happened.
		  console.log('error');
		});
	}
	var updateUserPassword = function(newPassword){
		var user = firebase.auth().currentUser;
		var newPassword = getASecureRandomPassword();

		user.updatePassword(newPassword).then(function() {
		  // Update successful.
		}).catch(function(error) {
		  // An error happened.
		});
	}
	var updateUserAvatar = function(newAvatarURL){
		var user = firebase.auth().currentUser;
			user.updateProfile({
			  photoURL: newAvatarURL,
			}).then(function() {
				console.log('success');
			  // Update successful.
			}).catch(function(error) {
			  // An error happened.
			  console.log('error');
			});
	}

	// get seller orders for display chart
	var getUserOrders = function(uid, days){
		var res = [];

        var endTime = new Date(); // today
        var startTime = new Date(); // yesterday
        // first we need to get all orders related to this seller within days
        var orderDays = [];

        startTime.setDate(startTime.getDate() - days);
        endTime.setDate(endTime.getDate());
        startTime = startTime.getTime();
        endTime = endTime.getTime();
 		
 		// may be problem when orders is very big       
        ref.child('orders')
        .once('value', function(snap) {
           snap.forEach(function(item){
                // we look in assign_data to detect if order ever assign to this seller
        		item.ref.child('assign_data').orderByChild('uid').equalTo(uid)
        		.once('value', function(ss){
        			// console.log(ss.val());
        			if(ss.val()){
        				ss.ref.orderByChild('assigned_date')
        				.startAt(startTime)
			            .endAt(endTime)
			            .once('value', function(sn) {
			            	orderDays.push(item.val());
			            });
        			}
        		})
           });
           
        });
        // find in orderDays array
        var calledArr = [], successArr = [], failedArr = [], otherArr = [], notCalled = [];
        var dateArr = [];

    	for (var i = 0; i < days; i++) {
    		// first get all orders of this day
	        var d = new Date();
    		d.setDate(d.getDate() - i);
    		// d = d.getTime();
    		var dCalledArr = [], dSuccessArr = [], dFailedArr = [], dOtherArr = [], dNotCalled = [];
    		// get
    		angular.forEach(orderDays, function(v){
    			angular.forEach(v.assign_data, function(a){
    				var dd = new Date(a.assigned_date);
    				// NOTE: NEED TO CHECK DUPLICATE
    				if(dd.getDate() == d.getDate()){
    					if(a.status_after && (a.status_before != a.status_after)){
    						if(dCalledArr.indexOf(v) == -1) dCalledArr.push(v);
    					}
    					if(v.status_id == 6 && a.status_after == 6 && v.checked_by == uid && v.seller_will_call_id == uid){
    						if(dSuccessArr.indexOf(v) == -1) dSuccessArr.push(v);
    					}
    					else if(a.status_after && (v.status_id == 2 || v.status_id == 3 || v.status_id == 7) ){
    						if(dFailedArr.indexOf(v) == -1) dFailedArr.push(v);
    					}
    					else if(!a.status_after && v.status_id == 1 && v.seller_will_call_id == uid){
    						if(dNotCalled.indexOf(v) == -1) dNotCalled.push(v);
    					}
    					else{
    						if(dOtherArr.indexOf(v) == -1 && v.status_id != 6) dOtherArr.push(v);
    					}
    				}
    			});
    		});

    		// date array
    		dateArr.push(d.getDate() + '-' + (d.getMonth()+1));

    		calledArr.push(dCalledArr);
    		successArr.push(dSuccessArr);
    		failedArr.push(dFailedArr);
    		notCalled.push(dNotCalled);
    		otherArr.push(dOtherArr);
    		//
    	}
    	res.push(dateArr);
    	res.push(calledArr);
		res.push(successArr);
		res.push(failedArr);
		res.push(notCalled);
		res.push(otherArr);
    	console.log(res);
    	return res;
    }

    function checkDuplicate(arr, item){
    	var matches = arr.filter(function(d) {
	      return 
	      		 d.buyer_mobile == item.buyer_mobile &&
	      		 d.buyer_name == item.buyer_name
	    });
    }



	return{
		// getAllOrders    : getAllOrders,
		// getAllComments	: getAllComments,
		getCommentForOrder: getCommentForOrder,
		addComment		: addComment,
		// updateComment	: updateComment,
		removeComment	: removeComment,
		// getOrder    	: getOrder,
		findOrderById   : findOrderById,
		getAllStatuses	: getAllStatuses,
		updateOrder		: updateOrder,
		updateOrderStatus: updateOrderStatus,
		updateOrderSellerWillCall: updateOrderSellerWillCall,
		getAllSources	: getAllSources,
		getAllPacks		: getAllPacks,
		getAllMembers	: getAllMembers,
		getMember		: getMember,
		getMemberByEmail:getMemberByEmail,
		submitBlockNumber : submitBlockNumber,
		getUserOrders : getUserOrders ,
	}

}]);