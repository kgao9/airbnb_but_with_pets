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


starter.controller('ChatsCtrl', function($scope, Chats, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

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


starter.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
});




starter.controller('BlogCtrl', function($scope, $state) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.newPost = function() {
    $state.go('newPost');
  };
});

starter.controller('NewPostCtrl',function($scope, $ionicModal, $ionicLoading, $state,$stateParams){
  $scope.id ="";
  $scope.purpose = "here is nothing";
  $scope.typePet = "here is nothing";
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
   console.log($stateParams.selectUsers);
  };
  $scope.showPets=function(){
    console.log($stateParams.selectPets);
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
    post.purpose="nothing";
    post.purpose = $scope.selectUsers;
    post.typeset={Cats:false,Dogs: false};
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
    //||post.endDate==null
   // console.log(post.purpose.Sitter)
  //  console.log(post.typePet)
    if((post.purpose.Sitter==false && post.purpose.Owner==false)||(post.typePet.Dogs==false&&post.typePet.Cats==false&&post.typePet.Fish==false)||post.city==""||post.state==""||post.active==""){
      $ionicLoading.show({ template: 'Post cannot be added to firebase! Please fill in all information', noBackdrop: true, duration: 1000 });
      post="";
    //  console.log(post);
    }
    else {
      $scope.addPostToFirebase(post);
      $ionicLoading.show({template: 'Post has been added to firebase!', noBackdrop: true, duration: 1000});
      //$state.go("dash"); // go back to home page
    }
  };
  $scope.getLocation = function () {
    $state.go("gps");
  }
  // not saving post, go back to post page
  $scope.cancel = function() {
    $state.go('blog');
  };

});


starter.controller("SearchCtrl",function($scope, $ionicModal, $ionicLoading, $state, $stateParams) {
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
    // var userString = JSON.stringify($scope.selectUsers)
    // console.log(userString);
    // var userIdentity = JSON.parse(userString)
    $stateParams.userIdentity = $scope.selectUsers;
 //   console.log($scope.selectUsers);
    // console.log($scope.selectUsers.text);
  };

  $scope.showPets=function(){
   // console.log($scope.selectPets);
    // var petString = JSON.stringify($scope.selectPets);
    $stateParams.pet = $scope.selectPets;
  };

  $scope.Search=function () {
    // pass to search result page
    $state.go('searchResult', {
      'city' : $scope.city,

      'state' : $scope.state,

     'userIdentity' : $stateParams.userIdentity,

       'pet' : $stateParams.pet
    });
  };


});


starter.controller('SearchResultCtrl', function($scope, $stateParams, $state) {
  console.log("**** Search Result Ctrl *****");

  var selectedPosts = [];
  var post = {};
  var numPosts = 0;

  var ref = firebase.database().ref("posts");
  ref.orderByChild("endDate").limitToFirst(10).on("value", function(snapshot) {
    console.log(snapshot.key);
    // iterate through all posts
    snapshot.forEach(function (data) {
      // city and state cannot be empty
      if (data.val().active == true && lowercaseEqual($stateParams.city, data.val().city)
        || lowercaseEqual($stateParams.state, data.val().state)) {
        var post = {};
        post.id = data.val().id;
        post.city = data.val().city;
        post.state = data.val().state;
        post.startDate = data.val().startDate;
        post.endDate = data.val().endDate;
        post.message = data.val().message;
        post.purpose = data.val().purpose;
        post.typePet = data.val().typePet;
        selectedPosts[numPosts] = post;
        numPosts++;
      }
    })
    if ($stateParams.userIdentity == null && $stateParams.pet == null) {
      //do nothing
    } else if ($stateParams.userIdentity == null && $stateParams.pet != null) {
      for (post in selectedPosts) {
        var singlePost = selectedPosts[post];
        //console.log(singlePost.purpose);
        //console.log(singlePost.typePet);
        if (!isEquivalent(singlePost.typePet, $stateParams.pet)) {
          //console.log("yes");
          selectedPosts.splice(post);
        }
      }
    } else if ($stateParams.userIdentity != null && $stateParams.pet == null) {
      for (post in selectedPosts) {
        var singlePost = selectedPosts[post];
        //console.log(singlePost.purpose);
        //console.log(singlePost.typePet);
        if (!isEquivalent(singlePost.purpose, $stateParams.userIdentity)) {
          //console.log("yes");
          selectedPosts.splice(post);
        }
      }
    } else {
      console.log($stateParams.userIdentity);
      //  console.log($stateParams.pet);
      // remove all unrelated posts with pets type;
      for (post in selectedPosts) {
        var singlePost = selectedPosts[post];
        console.log(singlePost.purpose);
        //console.log(singlePost.typePet);
        if (!isEquivalent(singlePost.purpose, $stateParams.userIdentity) || !isEquivalent(singlePost.typePet, $stateParams.pet)) {
          //console.log("yes");
          selectedPosts.splice(post);
        }
      }
    }
    console.log(selectedPosts);
    // remove all unrelated posts with owner type

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


  //console.log('first selected: ' + selectedPosts[0]);
  if (selectedPosts.length == 0) {
    $scope.foundNothing = true;
  } else {
    $scope.foundNothing = false;
  }

  function lowercaseEqual(a, b) {
    if(a==null || b==null) return false;
    if(a.toLowerCase() == b.toLowerCase()) return true;
    else return false;
  }


  // a function to determine if two
  function isEquivalent(a, b) {
    // Create arrays of property names
    if (a==null || b==null) return false;

    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

     if (aProps.length != bProps.length) {
       return false;
     }


    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    return true;

  }


  // assign to frontend
  $scope.posts = selectedPosts;

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
