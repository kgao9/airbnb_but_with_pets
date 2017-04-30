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
      $ionicLoading.show({template:'Created New User!',noBackdrop:true,duration:2000});
    }).catch(function(error){
      var errorCode=error.code;
      var errorMessage=error.message;
      $ionicLoading.show({template:'Fail to Create New User! Try again!',noBackdrop:true,duration:2000});
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

  $scope.createNewpassword= function(email){

    //
   // console.log(email);
    return firebase.auth().sendPasswordResetEmail($scope.email).then(function(){
      $ionicLoading.show({template:'Check your email to reset password',noBackdrop:true,duration:2000});
    }).catch(function(error){
      var errorCode=error.code;
      var errorMessage=error.message;
      $ionicLoading.show({template:'No user`s information has linked to this email',noBackdrop:true,duration:2000});
    });
  };

  // TODO: attempt login
  $scope.attemptLogin = function(){
    console.log("Attempting Login with Email:"+$scope.email+"|password:"+$scope.password);

    $scope.login($scope.email,$scope.password).then(function(){
      //Check if current User is set(we were succesfully able to login)
      var current_user = firebase.auth().currentUser;

      if(!current_user){
        //Show modal with description of events
        $ionicLoading.show({template:'Fail to Login! Check credentials,check connection or Create user',noBackdrop:true, duration:2000});
        // TODO: unsuccessful login
      } else{
        //If successful login,then current User is set and display event modal
        //Show modal with description of events
        $ionicLoading.show({template:'Successfully Login with Existing User!',noBackdrop:true,duration:2000});
        // TODO: successful login
        $state.go("dash");
        // $scope.logoutButton.username=firebase.auth().currentUser.email;
        // $scope.logoutButton.visibility='visible';
      }
    });
  };

});

starter.controller('passwordCtrl', function($scope, $ionicLoading, $state, $ionicHistory, $rootScope) {
 // newPassword = Request["newPassword"];
 //   confirmPassword = Request["confirmPassword"];
  //  token = Request["token"];

    // returnValue = ResetPassword(token, newPassword);



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
      ionicLoading.show( {template: 'Logout Unsuccessful! ', noBackdrop: true, duration:2000 });
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
  console.log("in BlogCtrl")
  $scope.settings = {
    enableFriends: true
  };

   // retrieve curr user
  var current_user = firebase.auth().currentUser;
  console.log("curr user:" + current_user);
  console.log("curr user email:" + current_user.email);
  // search in database find same id


  var myPosts = [];
  var post = {};
  var numMyPosts = 0;
  var ref = firebase.database().ref("posts");

  var userID;

  ref.orderByChild("id").equalTo(current_user.email).on("value", function(snapshot) {
    console.log(snapshot.val());
    $scope.noPost = false;  // not display
    snapshot.forEach(function(data) {
        //post.id = data.val().id;
        post.city = data.val().city;
        post.state = data.val().state;

        post.startDate = data.val().startDate;
        post.endDate = data.val().endDate;
        post.userIdentity = data.val().purpose;
        post.pet = data.val().typePet;

        post.message = data.val().message;
        console.log("post.message " + post.message);

        myPosts[numMyPosts] = post;
        numMyPosts++;
    });

  });


  console.log("numMyPosts" + numMyPosts);
  $scope.myPosts = myPosts;
  $scope.numPosts = numMyPosts;



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
    // post.purpose="nothing";
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
      $ionicLoading.show({ template: 'Post cannot be added to firebase! Please fill in all information', noBackdrop: true, duration: 2000 });
      post="";
    //  console.log(post);
    }
    else {
      $scope.addPostToFirebase(post);
      $ionicLoading.show({template: 'Post has been added to firebase!', noBackdrop: true, duration: 2000});
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
  $scope.selectUsers = $stateParams.userIdentity

  $scope.selectPets = $stateParams.pet;

  $scope.errorMessage = ""

  console.log($scope.selectUsers);
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
    if (!$scope.city) {
        $scope.errorMessage = "You must enter a city";
        return
    }

    $state.go('searchResult', {
      'city' : $scope.city,

      'state' : $scope.state,

     'userIdentity' : $scope.userIdentity,

       'pet' : $scope.selectPets
    });
  };


});


starter.controller('SearchResultCtrl', function($scope, $stateParams, $state) {
  console.log("**** Search Result Ctrl *****");
  console.log($stateParams.userIdentity);
  console.log($stateParams.pet);

  var selectedPosts = [];
  var post = {};
  var numPosts = 0;

  var ref = firebase.database().ref("posts");
//  ref.orderByChild("typePet/Cats").equalTo($stateParams.pet.Cats)
//  .orderByChild("typePet/Dogs").equalTo($stateParams.pet.Dogs)
//  .orderByChild("typePet/Fish").equalTo($stateParams.pet.Fish)
//  .on("value", function(snapshot) {
//    console.log(snapshot)
//  })


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
        post.userIdentity = data.val().purpose;
        post.pet = data.val().typePet;

        selectedPosts[numPosts] = post;
        numPosts++;
      }
    });

        // user enter info about user identity and pet
        if (!emptyInputIdentity($stateParams.userIdentity) && !emptyInputPet($stateParams.pet)) {
            console.log("enter 1");
            console.log("test here:");
            for (var i=selectedPosts.length-1; i>=0; i--) {
                var currPost = selectedPosts[i];
                if (!samePet($stateParams.pet, currPost.pet) ||
                    !sameIdentity($stateParams.userIdentity, currPost.userIdentity)) {
                    // if found mismatch, remove
                    selectedPosts.splice(i, 1);
                    numPosts--;
                }
            }
        }
        // user enter nothing about pet but enter something about purpose
        else if ( !emptyInputIdentity($stateParams.userIdentity) && emptyInputPet($stateParams.pet) ) {
            console.log("enter 2");
            for (var i=selectedPosts.length-1; i>=0; i--) {
                var currPost = selectedPosts[i];
                if (!sameIdentity($stateParams.userIdentity, currPost.userIdentity)) {
                     console.log('nothing pet, something user');
                     selectedPosts.splice(i, 1);
                     numPosts--;
                }
            }
        }

        // user enter nothing about user identity but something about pet
        else if ( emptyInputIdentity($stateParams.userIdentity) && !emptyInputPet($stateParams.pet) ) {
            console.log("enter 3");
            for (var i=selectedPosts.length-1; i>=0; i--) {
                var currPost = selectedPosts[i];
                // if found pet info mismatch, remove
                if (!samePet($stateParams.pet, currPost.pet)) {
                    selectedPosts.splice(i, 1);
                    numPosts--;
                }
            }
        } else {
            console.log("enter 4");
        }


  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


  //console.log('first selected: ' + selectedPosts[0]);
  if (numPosts < 1) {
    $scope.foundNothing = true;
  } else {
    $scope.foundNothing = false;
  }


  function lowercaseEqual(a, b) {
    if(a==null || b==null) return false;
    if(a.toLowerCase() == b.toLowerCase()) return true;
    else return false;
  }

 function samePet(user, database){
    if (user.Dogs == database.Dogs && user.Cats == database.Cats && user.Fish == database.Fish) return true;
    return false;
 }

 function sameIdentity(user, database) {
    if (user.Sitter == database.Sitter && user.Owner == database.Owner) return true;
    return false;
 }

 function emptyInputPet(user) {
    if (user.Dogs==false && user.Cats==false && user.Fish==false) return true;
    return false;
 }

 function emptyInputIdentity(user) {
    if(user.Sitter==false && user.Owner==false) return true;
    return false;
 }

  // assign to frontend
  $scope.posts = selectedPosts;

});





starter.controller('AccountCtrl', function($scope, $ionicModal, $ionicLoading, $state) {
  init();
  // test
  console.log($scope.firstName)


  //Constructing the database
  $scope.addGuestToFirebase = function (completion) {
    //var user = firebase.auth().currentUser;
    var updateInfo = function () {
      // var id = firebase.auth().currentUser.email
      // id = id.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
      var id = firebase.auth().currentUser.uid;
      console.log("curren user uid: " + id)

      var params = {
        id: id,
        firstName: $scope.firstName,
        lastName: $scope.lastName,
        email: $scope.email,
        phone: $scope.phone,
        photo: $scope.photo,

        city: $scope.city
        //state:$scope.state
        //pets:$scope.pets;
      }
      // firebase.database().ref('/guests').push().set(params);
      firebase.database().ref('/guests').child(id).set(params);
    }

    // if user wants to upload photo
    if ($scope.newPhoto) {
      var photoRef = firebase.storage().ref().child($scope.newPhoto.name)
      photoRef.put($scope.newPhoto).then(function (snapshot) {
        // debugger
        var url = snapshot.downloadURL
        $scope.photo = url  // photoUrl
        updateInfo()
        completion()    // check if user enters city
      })
    } else {    // if user doesn't want to upload photo
      updateInfo()
      completion()
    }
    console.log("guest added to Firebase");
  };


  function init() {
    var user = firebase.auth().currentUser; // retrieve curr user
    // console.log("retrieve user")
    // console.log(user)
    if (user != null) {
      var firstName, lastName, email, photoUrl, uid;
      var uid = firebase.auth().currentUser.uid;
      // console.log(uid)
      email = user.email;

      // retrieve firstname, lastname, phone, city, state, pet, avatar
      var ref = firebase.database().ref('guests');
      console.log("inside retriever() " + uid)

      ref.orderByChild('id').equalTo(uid).once("value", function (snapshot) {
        //       console.log(snapshot.val())
        //      console.log(uid)

        console.log(firebase.auth().currentUser.getKey());

        //user.firstName = snapshot.val().firstName;
        //user.lastName = snapshot.val().lastName;
        //user.phone = snapshot.val().phone;
        // console.log(snapshot.valueOf())
        // user.city = snapshot.val()
      });

      // apply to user's view
      $scope.firstName = firstName;
      $scope.lastName = lastName;
      $scope.email = email;
      console.log(firstName)
    } else {
      $state.go('login');
    }

  };

  // retrieve user info
  var retrieveUserInfo = function (uid) {

    return userInfo
  }


//  $scope.init = function() {
//    $scope.apply();
//  };

  // $scope.init();

  $scope.photoSelected = function (files) {
    $scope.newPhoto = files[0]
    //console.log($scope.newPhoto)
  }

  // button function
  $scope.editUserProfile = function () {
    //console.log($scope.photo)

    //$scope.listOfPeople[user.id] = user;
    $scope.addGuestToFirebase(function () {
      $ionicLoading.show({template: 'Person has been added to firebase!', noBackdrop: true, duration: 2000});
      $state.go("dash"); // go back to home page
    });
  }
});
