var starter = angular.module('starter.controllers', []);

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

  $scope.myPosts = $rootScope.myPosts;
  $scope.numPosts = $scope.myPosts.length;
  
  if($scope.numposts == 0)
	$scope.noPost = true;

  else
	$scope.noPost = false;	

  //for each post in posts
  //if they belong to the user, add them	

  $scope.newPost = function() {
      $state.go('newPost');
  };
});

starter.controller('NewPostCtrl',function($scope, $ionicModal, $ionicLoading, $state, $rootScope){

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
    var post_id = firebase.database().ref('/posts').push()//.set($scope.post);
    post_id.set($scope.post);	  

    $rootScope.posts[post_id.key] = $scope.post;

    console.log($rootScope.userInfo);	  

    $rootScope.userInfo.posts.push(post_id.key);
    $rootScope.myPosts.push($scope.post);

    console.log($rootScope.posts);
    console.log($rootScope.userInfo);
    console.log($rootScope.myPosts);	  

    //need to think about how best to update user table	  
    var ref = firebase.database().ref('/guests');       
    ref.child($rootScope.current_user.uid).set($rootScope.userInfo);
    	  

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
    $state.go("blog"); // go back to home page

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
  //var myUserId = firebase.auth().currentUser.email;
  //console.log(myUserId);
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
  $scope.selectUsers = {'Sitter': false, 'Owner': false};

  $scope.selectPets = {'Dogs': false, 'Cats': false, 'Fish': false};

  $scope.errorMessage = ""

  $scope.showUsers=function(){
    // var userString = JSON.stringify($scope.selectUsers)
    // console.log(userString);
    // var userIdentity = JSON.parse(userString)
    //$stateParams.userIdentity = $scope.selectUsers;
     //console.log($scope.selectUsers);
     //console.log($scope.selectUsers.text);
     console.log($scope.selectUsers)
  };

  $scope.showPets=function(){
   // console.log($scope.selectPets);
    // var petString = JSON.stringify($scope.selectPets);
    //$stateParams.pet = $scope.selectPets;
    console.log($scope.selectPets)
  };

  $scope.Search=function () {
    // pass to search result page
    //if (!$scope.city) {
      //  $scope.errorMessage = "You must enter a city";
        //return
    //}

    console.log($scope.selectPets);

    $state.go('searchResult', {
      'city' : $scope.city,

      'state' : $scope.state,

       'pet' : $scope.selectPets,

       'userIdentity' : $scope.selectUsers
    });
  };


});


starter.controller('SearchResultCtrl', function($scope, $stateParams, $state, $rootScope) {
  console.log("**** Search Result Ctrl *****");
  console.log($stateParams.pet);
  console.log($stateParams.state);
  console.log($stateParams.city);
  console.log($stateParams.userIdentity);
  
  $scope.lettersDifferent = function (string1, string2) {
      string1 = string1.toUpperCase();
      string2 = string2.toUpperCase();
      //different length, just assume no match
      if(string1.length != string2.length)
          return 1;

      var diff_count = 0;
      var i;
      for(i = 0; i < string1.length; i++)
      {
          if(string1.charAt(i) != string2.charAt(i))
              diff_count++;
      }

      return diff_count/string1.length;  
  }

  var selectedPosts = [];

  console.log($rootScope.posts);

  for(post_id in $rootScope.posts)
  {
      var post = $rootScope.posts[post_id];
      console.log(post);
      if(post.uid == $rootScope.current_user.uid)
          continue;

      var number = 0;
      //var petTypes = post.pets.keys();

      //filter on userType
      for(userType in post.purpose)
      {
         if(post.purpose[userType] == true && $stateParams.userIdentity[userType] == true)
         {
             number += 300; 
         }
      }  

      //filter on petType
      for(petType in post.pets)
      {
         console.log("pet type", petType);
         console.log("post.petType", post.pets[petType]);
         console.log("stateParams.pet[petType]", $stateParams.pet[petType]);

         if(post.pets[petType] == true && $stateParams.pet[petType] == true)
         {
             number += 300; 
         }
      }  

      //filter on state
      if($scope.lettersDifferent(post.state, $stateParams.state) <= 0.25)
      {
          number += 300;
      }  
      
      //filter on city
      if($scope.lettersDifferent(post.city, $stateParams.city) <= 0.25)
      {
        number += 300;
      }  

      post.search_number = number;

      if(number >= 300)
        selectedPosts.push(post);
  }  

  $scope.posts = selectedPosts;
  $scope.numPosts = selectedPosts.length;  

  console.log($scope.posts);

  $scope.posts.sort(function(a,b) { return a.search_number - b.search_number });

  console.log($scope.posts); 

  //what's left? sort by selectedPosts.postnumber

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

