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
  };
});

starter.controller('DashCtrl', function($scope, $state)
{
  console.log("in dash ctrl\n");

  $scope.toAccountState = function () {

    $state.go("tab.account");
  };
  $scope.toSearchState = function () {

    $state.go("tab.search");
  };
  $scope.toBlogState = function () {

    $state.go("tab.blog");
  };
  $scope.toChatRoomState = function () {

    $state.go("tab.chats");
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
