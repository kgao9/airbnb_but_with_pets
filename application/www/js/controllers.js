<<<<<<< HEAD
<<<<<<< HEAD
var starter = angular.module('starter.controllers', [])

starter.controller('DashCtrl', function($scope, $state)
{
=======
=======
>>>>>>> f5c989789da70c4081c34ed64f9cfa7fc5f976a2
var starter = angular.module('starter.controllers', []);

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

<<<<<<< HEAD
>>>>>>> 115fe4612f3015184b923ffbc7963eb0c651e245
=======
>>>>>>> f5c989789da70c4081c34ed64f9cfa7fc5f976a2
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
<<<<<<< HEAD
<<<<<<< HEAD
})
=======
});
>>>>>>> 115fe4612f3015184b923ffbc7963eb0c651e245
=======

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
>>>>>>> f5c989789da70c4081c34ed64f9cfa7fc5f976a2


starter.controller('ChatsCtrl', function($scope, Chats, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

<<<<<<< HEAD
<<<<<<< HEAD
=======
  console.log("chats controler");

>>>>>>> 115fe4612f3015184b923ffbc7963eb0c651e245
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
<<<<<<< HEAD
})

starter.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})
=======
});

starter.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
=======
  console.log("chats controller");
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
		  
		  console.log($scope.uid);
		  console.log(message_obj);
                  console.log(message_obj[$scope.uid]);

		  user_msg_objs = message_obj[$scope.uid];

		  for(var user_name in user_msg_objs) 
		  { 
			  //TODO
			  //refactor given the fact that firebase hands out a key for a nest 
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

			  console.log(chats);
		  }

	          $scope.chats = chats; 
		     	  
	  }, 
	  
	          function (errorObject) 
	  {   
		  console.log("The read failed: " + errorObject.code); 
	  });	

  //console.log(chats);

  //$scope.chats = Chats.all();
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
      
      var db_msg_obj = {};
      db_msg_obj[$scope.uid] = secondNest;

      var ref = firebase.database().ref('/all_messages');	  
      ref.push().set(db_msg_obj);
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




starter.controller('BlogCtrl', function($scope, $state) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.newPost = function() {
      $state.go('newPost');
  };
>>>>>>> f5c989789da70c4081c34ed64f9cfa7fc5f976a2
});
>>>>>>> 115fe4612f3015184b923ffbc7963eb0c651e245

<<<<<<< HEAD
starter.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
<<<<<<< HEAD
})

starter.controller('SearchCtrl', function($scope) {
    $scope.settings = {
      enableFriends: true
    };
})


starter.controller('BlogCtrl', function($scope) {
    $scope.settings = {
      enableFriends: true
    };
})

starter.controller('LoginCtrl', function($scope, $state)
{
  $scope.toHomeState = function () {

    $state.go("tab.dash");
  };
})
// The start of the single controller that we will be using for this lab
// It is called "mainCtrl" and is connected to the Angular module "starter"
starter.controller('SignupCtrl', function($scope, $ionicModal, $ionicLoading,$window) {
  $scope.firstName = ""; // Create first name string variable on controller $scope
  $scope.lastName = ""; // Create last name string variable on controller $scope
  $scope.phoneNumber = ""; // Create phone number string variable on controller $scope
  $scope.email = ""; // Create email string variable on controller $scope
  $scope.country = ""  // Create country string variable on controller $scope
  $scope.city = ""  // Create city string variable on controller $scope
  $scope.userid = ""  // Create userid string variable on controller $scope
  $scope.password = ""  // Create password string variable on controller $scope
  $scope.pets = ""  // Create pets string variable on controller $scope
  $scope.listOfPeople = {}; // Create list of people dictionary variable on controller $scope


  $scope.onSubmit = function () { // Create onSubmit function
    // This function will be run every time the submit button is pressed


    // Create a variable that is an empty dictionary called "person"
    // It will hold the persons attributes such as first name, last name, etc
    var person = {};

    // Create an ID variable by appending all the variables that define a person (listed above) as a string
    // What this does is create a unique identifier for each person by using all the persons attributes to generate a
    // unique string
    person.id = $scope.firstName+$scope.lastName+$scope.phoneNumber+$scope.email + $scope.country + $scope.city +$scope.userid
      +$scope.password;

    /* Insert your code for the following variables below */
    person.firstName = $scope.firstName;
    person.lastName = $scope.lastName;
    person.phoneNumber = $scope.phoneNumber;
    person.email = $scope.email ;
    person.country = $scope.country ;
    person.city = $scope.city ;
    person.userid = $scope.userid ;
    person.password = $scope.password ;
    person.pets = $scope.pets ;


    // Now, add the person variable you added attributes to above to the "listOfPeople" dictionary
    /* HINT: Use the person variables ID as the "key" value to the dictionary */
    /* YOUR CODE HERE; 1 line */

    // This function call displays a popover that says "Person Added!"
    // It is run every time someone presses the submit button and the onSubmit function runs, as it is nested within the
    // onSubmit function
    $ionicLoading.show({ template: 'Person Added!', noBackdrop: true, duration: 1000 });
=======
starter.controller('NewPostCtrl',function($scope, $ionicModal, $ionicLoading, $state){
   $scope.id ="";
   $scope.purpose = "";
   $scope.typePet = "";
   $scope.city = "";
   $scope.state = "";
   $scope.startDate = "";
   $scope.endDate = "";
   $scope.message = "";
   $scope.active = "";
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


  $scope.listOfPost = {};
  //post database
  $scope.addPostToFirebase = function(post) {

    firebase.database().ref('/posts').push().set({
      id: post.id,
      purpose: post.purpose,
      typePet: post.typePet,
      city: post.city,
      state:post.state,
      startDate: post.startDate,
      endDate: post.endDate,
      message: post.message,
      active: post.active,
    });
    console.log("posts added to Firebase");
  };


  $scope.editPostInfo = function () {
    var post = {};
    // email is unique id
    post.id = firebase.auth().currentUser.email;
    // firebase.database().ref().child('posts').push().key;
    console.log(post.id);
    post.purpose =$scope.selectUsers;
    post.typePet= $scope.selectPets;
    post.city = $scope.city;
    post.state = $scope.state;
    // var button = FindViewById<ImageButton> (Resource.Id.myButton);
    post.startDate = $scope.startDate;
    post.endDate = $scope.endDate;
    post.message = $scope.message;
    //active
    post.active =  document.getElementById("active").checked;
    $scope.listOfPost[post.id] = post;
    $scope.addPostToFirebase(post);
    $ionicLoading.show({ template: 'Post has been added to firebase!', noBackdrop: true, duration: 1000 });
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
>>>>>>> f5c989789da70c4081c34ed64f9cfa7fc5f976a2
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
  $scope.firstName = "Puppy";
  $scope.lastName = "Dog";
  $scope.phone = "123456";
  $scope.email = "puppy_dog@petbnb.com";
  $scope.city = "Madison";
  $scope.state = "WI";
  $scope.pets = "Dog";
  $scope.photo = "";

  $scope.listOfPeople = {};

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
    $ionicLoading.show({ template: 'Person has been added to firebase!', noBackdrop: true, duration: 1000 });
    $state.go("dash"); // go back to home page
  };

});

<<<<<<< HEAD
=======
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
>>>>>>> 115fe4612f3015184b923ffbc7963eb0c651e245
=======
>>>>>>> f5c989789da70c4081c34ed64f9cfa7fc5f976a2
