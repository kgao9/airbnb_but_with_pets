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

starter.controller('LoginCtrl', function($scope, $ionicLoading, $state) {
  // $scope.user = {};
  console.log("here")
  $scope.email = "kitten@petbnb.com";
  $scope.password = "123456";

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
    $state.go("dash");
  };
  // TODO: attempt login - not yet
  $scope.attemptLogin = function(){
    console.log("Attempting Login with Email:"+$scope.email+"|password:"+$scope.password);

    $scope.login($scope.email,$scope.password).then(function(){
      //CheckifcurrentUserisset(weweresuccesfullyabletologin)
      if(!firebase.auth().currentUser){
        //Showmodalwithdescriptionofevents
        $ionicLoading.show({template:'Fail to Login! Check credentials,check connection or Create user',noBackdrop:true, duration:1000});
        // TODO: unsuccessful login
      } else{
        //If successful login,thencurrentUserissetanddisplayeventmodal
        //Showmodalwithdescriptionofevents
        $ionicLoading.show({template:'Successfully Login with Existing User!',noBackdrop:true,duration:1000});
        // TODO: successful login
        // $scope.logoutButton.username=firebase.auth().currentUser.email;
        // $scope.logoutButton.visibility='visible';
      }
    });
    $state.go("dash");
  };
});

starter.controller('DashCtrl', function($scope, $state)
{
  console.log("in dash ctrl\n");

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

starter.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

starter.controller('SearchCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});


starter.controller('BlogCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

starter.controller('AccountCtrl', function($scope, $ionicModal, $ionicLoading) {
  $scope.firstName = "";
  $scope.lastName = "";
  $scope.phone = "";
  $scope.email = "";
  $scope.location = "";
  $scope.pets = "";
  $scope.photo = "";
  $scope.listOfPeople = {};

//Constructing the database
  $scope.addGuestToFirebase = function(person) {
    firebase.database().ref('/guests/' + person.id).set({
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
    //  email: person.email,
      phone : person.phone,
      location: person.location,
      pets: person.pets,
      photo: person.photo
    });
    console.log("guest added to Firebase");
  };

  $scope.retrieveGuestsFromFirebase = function() {
    var user = firebase.auth().currentUser;
    if (user) {
      console.log("yes")
      console.log(user.email)
    }else{
      console.log("no")
    }
    if (!firebase.auth().currentUser)
    {
      //Probably never gonna happen since user must have signed in or signed up before
      $ionicLoading.show({ template: 'Please login to Firebase first!', noBackdrop: true, duration: 1000 });
      return;
    }
    firebase.database().ref('/guests/').once('value').then(function(snapshot) {
      //var username = snapshot.val().username;
      if (snapshot.val() != null) $scope.listOfPeople = snapshot.val();
      $ionicLoading.show({ template: 'Guests formal informatio has been retrieved from firebase', noBackdrop: true, duration: 1000 });
   //   $scope.apply();
      $scope.email=user.email;
    });
  };

  $scope.init = function() {
    $scope.retrieveGuestsFromFirebase();
  };

  $scope.init();

  $scope.onSubmit = function () {
    var person = {};
    person.id = $scope.firstName+$scope.lastName+$scope.phone+$scope.email;
    person.id = person.id.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
    person.firstName = $scope.firstName;
    person.lastName = $scope.lastName;
    person.phone = $scope.phone;
  //  person.email = $scope.email;
    person.location=$scope.location;
    person.pets=$scope.pets;
    person.photo=$scope.photo;
   // var button = FindViewById<ImageButton> (Resource.Id.myButton);
    $scope.listOfPeople[$scope.firstName+$scope.lastName+$scope.phone+$scope.location+$scope.pets+$scope.photo] = person;
    $scope.addGuestToFirebase(person);
    $ionicLoading.show({ template: 'Person has been added to firebase!', noBackdrop: true, duration: 1000 });
  };
});

