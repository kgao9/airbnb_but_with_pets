var starter = angular.module('starter.controllers', []);

starter.controller('LoginCtrl', function($scope, $ionicLoading, $state, $ionicHistory, $rootScope) 
{
     //so, why here?
     //that way, we don't have to access db in sign up, posts, or search
     //so why not here?
     //subtle race condition with search
     //if user adds posts in posts, and some other user are in search
     //they won't see that post unless they relogin
     //We're going to ignore that because we want faster performance	
     ref = firebase.database().ref('/posts');          
     ref.on("value", function(all_posts){                 
	     $rootScope.posts = all_posts.val();         
     }, (function(error) {$rootScope.posts = {};}));

    	

    $scope.email = "";//"kitten@petbnb.com";
    $scope.password = "";//"123456";

    // when user logs out and reaches login page, clear all history
    //TODO - should probably clear rootScope too
    $scope.$on('$ionicView.enter', function(ev) {
        if(ev.targetScope !== $scope)
        {
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
            $rootScope.current_user = {};
            $rootScope.userInfo = {}; 
        }
    });


  //There's login and attempt Login
  //which do I use? Makes no sense
  // one of these need to go - probably this one  	
  $scope.login = function(email, password) {
      return firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
      });
  };

  //when signup button is pressed, we go to this function
  //route user to the sign up page	 
  $scope.attemptCreateUser = function(){
    $state.go("signup");
  };

  //user attempts to login
  //if successful, we store user and its info in rootScope
  //if not, we display a fail to login message
  $scope.attemptLogin = function(){
    $scope.login($scope.email,$scope.password).then(function(){
      //Check if current User is set(we were succesfully able to login)
      $rootScope.current_user = firebase.auth().currentUser;

      if(!$rootScope.current_user){
        //Show modal with description of events
	//line is too long, hard to read
	//80 char long standard
	//Message is weird - no other site does this - failed to login should appear under login button instead 
        $ionicLoading.show({template:'Fail to Login! Check credentials,check connection or Create a new user',noBackdrop:true, duration:2000});

      } else{
        //If successful login,then current User is set and display event modal
        //Show modal with description of events
	//Why? user can tell when it goes to the dashboard
	//No other site does this
        //$ionicLoading.show({template:'Successfully Login with Existing User!',noBackdrop:true,duration:2000});
	
        // search in database find same id
        $rootScope.myPosts = [];   
	var ref = firebase.database().ref("posts");
        ref.orderByChild("uid").equalTo($rootScope.current_user.uid).on("value", function(all_post_obj) {   
	    console.log(all_post_obj)  	
            // not display     
	    all_post_obj.forEach(function(data) {
		    console.log(data);
	            data = data.val();
	            $rootScope.myPosts.push(data);
	              });

            console.log($rootScope.myPosts);		
            }), function(error) {};		

	ref = firebase.database().ref('/guests/' + $rootScope.current_user.uid);      
	ref.on("value", function(user_obj){                   
		    $rootScope.userInfo = user_obj.val();

		    console.log($rootScope.userInfo);

		    if($rootScope.userInfo.posts == '')
			$rootScope.userInfo.posts = [];

		    if($rootScope.userInfo.messages == '')
			$rootScope.userInfo.messages = [];

		    console.log("here");
	        }, (function(error) {$rootScope.userInfo = {}; console.log("here")}));

	//go to dash board
        $state.go("dash");
      }
    });
  };

});