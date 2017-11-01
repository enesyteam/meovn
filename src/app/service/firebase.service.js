meovn.service('firebaseService', ["$firebaseArray", "$filter", function ($firebaseArray, $filter) { 

	var ref = firebase.database().ref();
    // ordersArr = $firebaseArray(ref.child('orders'));
    // commentsArr = $firebaseArray(ref.child('comments'));
    sourcesArr = $firebaseArray(ref.child('sources'));
    statusesArr = $firebaseArray(ref.child('statuses'));
    membersArr = $firebaseArray(ref.child('members'));
    packsArr = $firebaseArray(ref.child('packs'));

 //    var getAllOrders = function(){
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
		 return	ref.child('orders').orderByChild('id').equalTo(order.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	return child.ref.update({
	        		seller_will_call_id : order.seller_will_call_id
	        	});
	    });
	 });
	};
	var updateOrderStatus = function(order){
		 return	ref.child('orders').orderByChild('id').equalTo(order.id).once('value', function(snapshot){
		 	snapshot.forEach(function(child) {
	        	child.ref.update({
	        		status_id : order.status_id
	        	});
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
	}

}]);