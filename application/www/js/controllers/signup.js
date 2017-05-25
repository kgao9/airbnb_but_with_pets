var starter = angular.module('starter.controllers', []);

starter.controller('SignupCtrl', function($scope, $ionicLoading, $state, $ionicHistory, $rootScope) {
  $scope.email="";
  $scope.password="";
  $scope.firstName="";
  $scope.lastName="";
  $scope.phone="";
  $scope.location="";
  $scope.pets="";
  $scope.photo="";

  $scope.signup = function() {
    return firebase.auth().createUserWithEmailAndPassword($scope.email,$scope.password).then(function(err){
      //No website does this either!!!	    
      $ionicLoading.show({template:'Created New User! Logging in',noBackdrop:true,duration:2000});

      var current_user = firebase.auth().currentUser;

      //we want to store all their posts and messages	    
      $rootScope.current_user = current_user;
      $rootScope.myPosts = [];	     

      //We want the user to have access to their firstName, lastName, location
      // their pets and their phone
      // We also want them to have a list of posts they made and the messages they sent 	     
      userObj = {};
      userObj.firstName = $scope.firstName;
      userObj.lastName = $scope.lastName;
      userObj.location = $scope.location;
      userObj.pets = $scope.pets;
      userObj.phone = $scope.phone;

      //hack
      //This is so fields exist in DB 	    
      userObj.posts = '';
      userObj.messages = '';	    

      //we stash this in rootScope	    
      $rootScope.userInfo = userObj;	    

      var ref = firebase.database().ref('/guests');
      ref.child(current_user.uid).set(userObj);

       //set them to what they are supposed to be: empty lists	    
       userObj.posts = [];
       userObj.messages = [];	    
      //push userObj	    


      $state.go("dash");
    }).catch(function(error){
      var errorCode=error.code;
      var errorMessage=error.message;
      console.log(errorMessage);

      //which website has this?	    
      $ionicLoading.show({template:'Fail to Create New User! Try again!',noBackdrop:true,duration:2000});
    });
  }
});