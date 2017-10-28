meovn.service('firebaseService', ["$firebaseArray", "$filter", function ($firebaseArray, $filter) { 

	var ref = firebase.database().ref();
    ordersArr = $firebaseArray(ref.child('orders'));
    commentsArr = $firebaseArray(ref.child('comments'));
    sourcesArr = $firebaseArray(ref.child('sources'));
    statusesArr = $firebaseArray(ref.child('statuses'));
    membersArr = $firebaseArray(ref.child('members'));
    packsArr = $firebaseArray(ref.child('packs'));

    var getAllOrders = function(){
		return ordersArr.$loaded();
	};
	var getAllComments = function(){
		return commentsArr.$loaded();
	};
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

	var getOrder = function(id){
		return ordersArr.$getRecord(id);
	}

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
	// ref.child('users').orderByChild('name').equalTo('name').on("value", function(snapshot) {
	//     console.log(snapshot.val());
	//     snapshot.forEach(function(data) {
	//         console.log(data.key);
	//     });
	// });

	var updateOrder = function(order){
		return ordersArr.$save(order);
	};
	var addComment = function(comment){
		return commentsArr.$add(comment);
	};
	var updateComment = function(comment){
		return commentsArr.$save(comment);
	};
	var removeComment = function(comment){
		return commentsArr.$remove(comment);
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

	var init = function(){
		getAllOrders();
		getAllSources();
		getAllPacks();
	};

	return{
		init			: init,
		getAllOrders    : getAllOrders,
		getAllComments	: getAllComments,
		addComment		: addComment,
		updateComment	: updateComment,
		removeComment	: removeComment,
		getOrder    	: getOrder,
		getAllStatuses	: getAllStatuses,
		updateOrder		: updateOrder,
		getAllSources	: getAllSources,
		getAllPacks		: getAllPacks,
		getAllMembers	: getAllMembers,
		getMember		: getMember,
		getMemberByEmail:getMemberByEmail,
	}

}]);