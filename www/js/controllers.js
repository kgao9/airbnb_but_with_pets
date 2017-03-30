var starter = angular.module('starter.controllers', []);
/*
 starter.controller('LoginCtrl', function($scope, $state)
 {
 $scope.toHomeState = function ()
 {
 $state.go("tab.dash");
 };
 $scope.toLoginState = function ()
 {
 $state.go("tab.login");
 };
 })
 */

starter.controller('LoginCtrl', function($scope, $ionicLoading, $state, $ionicHistory, $rootScope) {
  $scope.email = "kitten@petbnb.com";
  $scope.password = "123456";

  // when user logs out and reaches login page, clear all history
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope){
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
    }
  });


  // TODO: signin function - done
  $scope.createUser = function(email, password) {
    return firebase.auth().createUserWithEmailAndPassword(email,password).then(function(){
      $ionicLoading.show({template:'Created New User!',noBackdrop:true,duration:1000});
    }).catch(function(error){
      var errorCode=error.code;
      var errorMessage=error.message;
      $ionicLoading.show({template:'Fail to Create New User! Try again!',noBackdrop:true,duration:1000});
    });
  };

  // TODO: login function - not yet
  $scope.login = function(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  };

  $scope.attemptCreateUser = function(){
    $scope.createUser($scope.email,$scope.password);
  };
  // TODO: attempt login
  $scope.attemptLogin = function(){
    console.log("Attempting Login with Email:"+$scope.email+"|password:"+$scope.password);

    $scope.login($scope.email,$scope.password).then(function(){
      //Check if current User is set(we were succesfully able to login)
      var current_user = firebase.auth().currentUser;

      if(!current_user){
        //Show modal with description of events
        $ionicLoading.show({template:'Fail to Login! Check credentials,check connection or Create user',noBackdrop:true, duration:1000});
        // TODO: unsuccessful login
      } else{
        //If successful login,then current User is set and display event modal
        //Show modal with description of events
        $ionicLoading.show({template:'Successfully Login with Existing User!',noBackdrop:true,duration:1000});
        // TODO: successful login
        $state.go("dash");
        // $scope.logoutButton.username=firebase.auth().currentUser.email;
        // $scope.logoutButton.visibility='visible';
      }
    });
  };

});

starter.controller('DashCtrl', function($scope, $state, $stateParams) {
  console.log("in dash ctrl\n");
  if ($stateParams.user == null ) console.log("user email info is null")
  else console.log("user email" + user.email);

  $scope.toAccountState = function () {
    $state.go("account");
  };
  $scope.toSearchState = function () {

    $state.go("search");
  };
  $scope.toBlogState = function () {

    $state.go("blog");
  };
  $scope.toChatRoomState = function () {

    $state.go("chats");
  };

  $scope.attemptLogout = function() {

    firebase.auth().signOut().then(function() {
        console.log("sign out user! ");
        // $ionicLoading.show( {template: 'Logout Successful! ', noBackdrop: true, duration:1000 });
        $state.go("login");
    },function(error){
        console.error('Sign out Error: ' + error);
        ionicLoading.show( {template: 'Logout Unsuccessful! ', noBackdrop: true, duration:1000 });
    });
  };

});


starter.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  console.log("chats controler");

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
});

starter.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
});

starter.controller('SearchCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});


starter.controller('BlogCtrl', function($scope, $state) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.newPost = function() {
      $state.go('newPost');
  };
});

starter.controller('NewPostCtrl', function($scope, $state) {
  $scope.settings = {
    enableFriends: true
  };

  // not saving post, go back to post page
  $scope.cancel = function() {
    $state.go('blog');
  };

  $scope.submit = function() {
    // TODO: save post info to firebase

    // then go back to posts
    $state.go('blog');

  };

});

starter.controller('AccountCtrl', function($scope, $ionicModal, $ionicLoading, $state) {
  $scope.firstName = "Puppy";
  $scope.lastName = "Dog";
  $scope.phone = "123456";
  $scope.email = "puppy_dog@petbnb.com";
  $scope.location = "Madison";
  $scope.pets = "Dog";
  $scope.photo = "";

  $scope.listOfPeople = {};

//Constructing the database
  $scope.addGuestToFirebase = function(user) {
    // firebase.database().ref('/guests/' + user.id).set({
    firebase.database().ref('/guests/' + user.id).set({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone : user.phone,
    });
    console.log("guest added to Firebase");
  };

  $scope.retrieveGuestsFromFirebase = function() {
    var user = firebase.auth().currentUser; // retrieve curr user
    if (!firebase.auth().currentUser)
    {
      //Probably never gonna happen since user must have signed in or signed up before
      $ionicLoading.show({ template: 'Please login to Firebase first!', noBackdrop: true, duration: 1000 });
      console.log("not login");
      $state.go("login");
      return;
    }
    // TEST: successfully login
    console.log("yes, log in");
    console.log("current user is: " + user.email);

    firebase.database().ref('/guests/').once('value').then(function(snapshot) {
      var firstName = snapshot.val().firstName;
      var lastName = snapshot.val().lastName;
      console.log();
      if (snapshot.val() != null) $scope.listOfPeople = snapshot.val();
      $ionicLoading.show({ template: 'Guests formal information has been retrieved from firebase', noBackdrop: true, duration: 1000 });
      // $scope.apply();
      $scope.email=user.email;

    });
    // apply info on page

  };

  $scope.init = function() {
    $scope.retrieveGuestsFromFirebase();
  };

  $scope.init();

  $scope.editUserProfile = function () {
    var user = {};
    // email is unique id
    user.id = firebase.auth().currentUser.email;
    user.id = user.id.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
    user.firstName = $scope.firstName;
    user.lastName = $scope.lastName;
    user.phone = $scope.phone;
    user.email = $scope.email;
    user.location = $scope.location;
    user.pets = $scope.pets;
    user.photo=$scope.photo;
    // var button = FindViewById<ImageButton> (Resource.Id.myButton);
    $scope.listOfPeople[user.id] = user;
    $scope.addGuestToFirebase(user);
    $ionicLoading.show({ template: 'Person has been added to firebase!', noBackdrop: true, duration: 1000 });
    $state.go("dash"); // go back to home page
  };
});

