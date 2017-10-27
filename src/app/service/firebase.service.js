meovn.service('firebaseService', ["$firebaseArray", "$filter", function ($firebaseArray, $filter) { 

	var ref = firebase.database().ref();
    ordersArr = $firebaseArray(ref.child('orders'));
    commentsArr = $firebaseArray(ref.child('comments'));
    sourcesArr = $firebaseArray(ref.child('sources'));
    statusesArr = $firebaseArray(ref.child('statuses'));
    sellersArr = $firebaseArray(ref.child('members'));
    packsArr = $firebaseArray(ref.child('packs'));

    var getAllOrders = function(){
		return ordersArr.$loaded();
	};
    var getAllSources = function(){
		return sourcesArr.$loaded();
	};
	var getAllPacks = function(){
		return packsArr.$loaded();
	};

	var getOrder = function(id){
		return ordersArr.$getRecord(id);
	}

	var updateOrder = function(order){
		return ordersArr.$save(order);
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
		getOrder    	: getOrder,
		updateOrder		: updateOrder,
		getAllSources	: getAllSources,
		getAllPacks		: getAllPacks,
	}

}]);