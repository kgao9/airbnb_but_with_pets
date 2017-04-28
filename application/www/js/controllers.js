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
     }, (function(error) {$rootScope.all_posts; }));

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


  // TODO: signin function - done
  $scope.createUser = function(email, password) {
      return firebase.auth().createUserWithEmailAndPassword(email,password).then(function(){
          $ionicLoading.show({template:'Created New User!',noBackdrop:true,duration:2000});
      }).catch(function(error){
          var errorCode=error.code;
          var errorMessage=error.message;
          $ionicLoading.show({template:'Fail to Create New User! Try again!',noBackdrop:true,duration:2000});
      });
  };

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
	var ref = firebase.database().ref('/guests/' + $rootScope.current_user.uid);
	
	ref.on("value", function(user_obj){                   
		    $rootScope.userInfo = user_obj.val();
	        }, (function(error) {$rootScope.userInfo = {}; }));

	//go to dash board
        $state.go("dash");
      }
    });
  };

});

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

      //We want the user to have access to their firstName, lastName, location
      // their pets and their phone
      // We also want them to have a list of posts they made and the messages they sent 	     
      userObj = {};
      userObj.firstName = $scope.firstName;
      userObj.lastName = $scope.lastName;
      userObj.location = $scope.location;
      userObj.pets = $scope.pets;
      userObj.phone = $scope.phone;
      userObj.posts = [];
      userObj.messages = [];	    

      //we stash this in rootScope	    
      $rootScope.userInfo = userObj;	    

      var ref = firebase.database().ref('/guests');
      ref.child(current_user.uid).set(userObj);
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

starter.controller('DashCtrl', function($scope, $state, $rootScope) {
  //what is this? user is always null and why do you need stateParams? What the hell?	

  //you don't even do anything with the current user or state params?!?!?
  //Why is it being passed in?	
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
        //console.log("sign out user! ");
        // $ionicLoading.show( {template: 'Logout Successful! ', noBackdrop: true, duration:2000 });
        $state.go("login");
    },function(error){
        console.error('Sign out Error: ' + error);
        ionicLoading.show( {template: 'Logout Unsuccessful! ', noBackdrop: true, duration:2000 });
    });
  };

});


starter.controller('ChatsCtrl', function($scope, Chats, $state) {
  // This looks copy and pasted
  // Also, they mentioned this in class
  // wait, did I write this haha
  // Probably, I was doing this at 12 AM :p 

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  console.log("chats controller");

  //This was me trying to find the user's email and I couldn't
  //chats needs a lot of refactoring	
  console.log($scope);

  $scope.viewChat = function(chat) {
	  console.log(chat);
	  $state.go('chat-detail', chat);
  };

  var ref = firebase.database().ref('/messages_for_table');
  var chats = [];

  $scope.email = firebase.auth().currentUser.email;

  $scope.uid = $scope.email.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
  $scope.uid = $scope.uid.replace("_", '');

  ref.on("value", function(messages)
	  {
		  message_obj = messages.val();

		  user_msg_objs = message_obj[$scope.uid];

		  for(var user_name in user_msg_objs)
		  {
			  var chat_obj = {};

			  console.log(user_msg_objs);
			  console.log(user_name);
			  console.log(user_msg_objs[user_name]);

			  //not a property of object #skip
			  //if (!user_msg_objs[user_name].hasOwnProperty(user_name))
				//  continue;

			  var user_msg_obj = user_msg_objs[user_name];

			  chat_obj.face = 'img/ben.png';
			  chat_obj.name = user_name;
			  chat_obj.lastText = user_msg_obj.lastText;
			  chat_obj.id = user_msg_obj.id;
			  chats.push(chat_obj);
		  }

	          $scope.chats = chats;

	  },

	          function (errorObject)
	  {
		  console.log("The read failed: " + errorObject.code);
	  });

});

starter.controller('ChatDetailCtrl', function($scope, $stateParams) {
  $scope.sendMsg = function () {
      var msg = document.getElementById("msg").value;

      msgObj = {};
      msgObj.From = $scope.uid;
      msgObj.To = $stateParams.name;
      msgObj.Msg = msg;

      var nest = {};

      nest[Date.now()] = msgObj;

      var secondNest = {};
      secondNest[$stateParams.name] = nest;

      //var db_msg_obj = {};
      //db_msg_obj[$scope.uid] = secondNest;	  
      var ref = firebase.database().ref('/all_messages');
      ref.child($scope.uid).set(secondNest);
      console.log("msg sent");

      //TODO
      // Definitely need to update message table with last msg field
      // need to do that after chat add button is completed
  };

  $scope.name = $stateParams.name;

  var ref = firebase.database().ref('/all_messages');
  $scope.email = firebase.auth().currentUser.email;

  $scope.uid = $scope.email.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
  $scope.uid = $scope.uid.replace("_", '');

  ref.on("value", function(messages)           {
      message_obj = messages.val();
      console.log(message_obj);
      $scope.chats = message_obj[$scope.uid][$scope.name];
  });
});




starter.controller('BlogCtrl', function($scope, $state, $rootScope) {
  //why is this here? Friends? Why are you thinking that far ahead? Makes 0 sense	
  $scope.settings = {
    enableFriends: true
  };

  $scope.posts = [];

  //for each post in posts
  //if they belong to the user, add them	

  $scope.newPost = function() {
      $state.go('newPost');
  };
});

starter.controller('NewPostCtrl',function($scope, $ionicModal, $ionicLoading, $state, $rootScope){
   //why is this not just one object?	
   //$scope.id ="";
   //$scope.purpose = "";
   //$scope.typePet = "";
   //$scope.city = "";
   //$scope.state = "";
   //$scope.startDate = "";
   //$scope.endDate = "";
   //$scope.message = "";
   //$scope.active = "";

   $scope.post = {};
   //$scope.post.uid = $rootScope.current_user.uid;
   $scope.post.city = '';
   $scope.post.state = '';
   $scope.post.startDate = '';
   $scope.post.endDate = '';
   $scope.post.message = '';	

  //enums	 
  $scope.petTypes = [
    {text: 'Dogs'},
    {text: 'Cats'},
    {text: 'Fish'}
  ];
  $scope.userTypes = [
    {text: 'Sitter'},
    {text: 'Owner'}
  ];

  //these are set when user selects them
  //could use enabled, but seeing as how we're going to access them
  //anyway, kind of pointless
  //Yeah, this is probably best	
  $scope.post.purpose = {};
  $scope.post.petTypes = {};

  //if it's a list - then WHY DO YOU HAVE IT AS A JSON ANGRY FACE	
  //$scope.listOfPost = {};
  //post database
  $scope.addPostToFirebase = function() {
    var post_id = firebase.database().ref('/posts').push().set($scope.post);
    $rootScope.posts.push(post_id);
    $rootScope.userInfo.posts.push(post_id);
    console.log($rootScope.userInfo);
    console.log($rootScope.posts);	   
    $rootScope.posts.push(post_id);

    //need to think about how best to update user table	  
    var ref = firebase.database().ref('/guests');       
    ref.child(current_user.uid).set($rootScope.userInfo);
    	  

    console.log("posts added to Firebase");
  };

  //added to database list	


  $scope.editPostInfo = function () {
    var post = {};
    console.log($scope.post);	  

    console.log($rootScope.current_user);

    $scope.post.email = $rootScope.current_user.email;	  
    $scope.post.active = document.getElementById("active").checked;
    $scope.post.uid = $rootScope.current_user.uid;

    //ok I think I get what you guys were trying to do...
    //but the design needs more work	  
    // email is unique id
    //post.uid = $rootScope.currentUser.uid;
    // firebase.database().ref().child('posts').push().key;
    //post.purpose = $scope.selectUsers;
    //post.typePet= $scope.selectPets;
    //post.city = $scope.city;
    //post.state = $scope.state;
    // var button = FindViewById<ImageButton> (Resource.Id.myButton);
   // post.startDate = $scope.startDate;
    //post.endDate = $scope.endDate;
    //post.message = $scope.message;

    //inconsistent	  
    //active
    //post.active =  document.getElementById("active").checked;
    //$scope.listOfPost[post.id] = post;
    $scope.addPostToFirebase();
    $ionicLoading.show({ template: 'Post has been added to firebase!', noBackdrop: true, duration: 2000 });
    //$state.go("dash"); // go back to home page

  };
  $scope.getLocation = function () {
    $state.go("gps");
  }
  // not saving post, go back to post page
  $scope.cancel = function() {
    $state.go('blog');
  };

});
starter.controller("SearchCtrl",function($scope, $ionicModal, $ionicLoading, $state) {
  var myUserId = firebase.auth().currentUser.email;
  console.log(myUserId);

  //functions to implement:
  // function findPosts:
  // input list of posts
  // input postObj with user input 
  // logic:
	// for each post in post,
		// if post matches all of user input
	        // push post to returnlist
	// return return list
	// how do we know if a post matches user input
	// if user input isn't "" and it has the same value
	// That way, users aren't forced to enter in everything

  //so what does user input look like?
	//Looks like
	//{
	//    list of valid pets
	//    city
	//    location
	//    owner type
	//}	

  //huh? WTH?	
  // Find all dinosaurs whose height is exactly 25 meters.

  $scope.listPets = [
    {text: 'Dogs'},
    {text: 'Cats'},
    {text: 'Fish'}
  ];
  $scope.listUsers = [
    {text: 'Sitter'},
    {text: 'Owner'}
  ];
  $scope.selectUsers = {};
  $scope.selectPets = {};
  $scope.showUsers=function(){
    console.log($scope.selectUsers);
  };
  $scope.showPets=function(){
    console.log($scope.selectPets);
  };
  $scope.Search=function () {
    //if active equals to true
    var ref = firebase.database().ref("posts");
    console.log(ref);
    var ref = firebase.database().ref("/posts");
    ref.orderByChild("active").equalTo("true").on("child_added", function(snapshot) {
      console.log(snapshot.key);
    });

    ref.orderByChild("id").equalTo("kitten@petbnb.com").on("child_added", function(snapshot) {
      var allSelected = snapshot.key;
    });
    console.log(allSelected);
    //Search State
    var userState = $scope.state;
      allSelected.orderByChild("state").equalTo(userState).on("child_added", function(snapshot) {
        var stateSelected = snapshot.key;
      });
    console.log(stateSelected);
    //Search City
    var userCity = $scope.city;
    stateSelected.orderByChild("city").equalTo(userCity).on("child_added", function(snapshot) {
      var citySelected = snapshot.key;
    });
    console.log(citySelected);
    //Search Type
    var userType = $scope.purpose;
    citySelected.orderByChild("purpose").equalTo(userType).on("child_added", function(snapshot) {
      var finalSelected = snapshot.key;
    });
    console.log(finalSelected);
  }







});
starter.controller('AccountCtrl', function($scope, $ionicModal, $ionicLoading, $state) {

  //name's fine but WTH is this?
  //no website does this	
  $scope.firstName = "Puppy";
  $scope.lastName = "Dog";
  $scope.phone = "123456";
  $scope.email = "puppy_dog@petbnb.com";
  $scope.city = "Madison";
  $scope.state = "WI";
  $scope.pets = "Dog";
  $scope.photo = "";

  $scope.listOfPeople = {};

//Huh? We are updating the DB	
//Constructing the database
  $scope.addGuestToFirebase = function(user) {
      firebase.database().ref('/guests').push().set({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone : user.phone,
    });
    console.log("guest added to Firebase");
  };


  //THis is what I'm trying to avoid
  $scope.retrieveGuestsFromFirebase = function() {
    var user = firebase.auth().currentUser; // retrieve curr user
    if (!firebase.auth().currentUser)
    {
      //Probably never gonna happen since user must have signed in or signed up before
      $ionicLoading.show({ template: 'Please login to Firebase first!', noBackdrop: true, duration: 2000 });
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
      $ionicLoading.show({ template: 'Guests formal information has been retrieved from firebase', noBackdrop: true, duration: 2000 });
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

    //TODO WTF
    user.id = user.id.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
    user.firstName = $scope.firstName;
    user.lastName = $scope.lastName;
    user.phone = $scope.phone;
    user.email = $scope.email;
    user.city = $scope.city;
    user.state = $scope.state;
    user.pets = $scope.pets;
    user.photo=$scope.photo;
    // var button = FindViewById<ImageButton> (Resource.Id.myButton);
    $scope.listOfPeople[user.id] = user;
    $scope.addGuestToFirebase(user);

    //person 	  
    $ionicLoading.show({ template: 'Person has been added to firebase!', noBackdrop: true, duration: 2000 });
    $state.go("dash"); // go back to home page
  };

});

