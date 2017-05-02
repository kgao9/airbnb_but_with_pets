var starter = angular.module('starter.controllers', []);

starter.controller('LoginCtrl', function($scope, $stateParams, $ionicLoading, $state, $ionicHistory, $rootScope) {
  $scope.email = "yangyuxue1994@gmail.com";
  $scope.password = "123456";

  // when user logs out and reaches login page, clear all history
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope){
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
    }
  });

  $scope.createUser = function(email, password) {
    return firebase.auth().createUserWithEmailAndPassword(email,password).then(function(){
      $ionicLoading.show({template:'Created New User!',noBackdrop:true,duration:2000});
      // after creating account in auth, also create user in guests databse
      var user = firebase.auth().currentUser;
      var userInfo = $stateParams.user;
      var uid = user.uid;

      userInfo.id = uid;    // update user id
      userInfo.email = user.email;  //update email
      // firebase.database().ref('/guests').push().set({user.uid : userInfo});
      // firebase.database().ref('guests').set({uid:userInfo});
      //console.log(userInfo)
    }).catch(function(error){
      var errorCode=error.code;
      var errorMessage=error.message;
      console.log(errorMessage)
      $ionicLoading.show({template:'Fail to Create New User! Try again!',noBackdrop:true,duration:2000});
    });
  };

  $scope.login = function(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  };

  $scope.attemptCreateUser = function(){
    $scope.createUser($scope.email,$scope.password);
  };

  $scope.attemptLogin = function(){
    console.log("Attempting Login with Email:"+$scope.email+"|password:"+$scope.password);

    $scope.login($scope.email,$scope.password).then(function(){
      //Check if current User is set(we were succesfully able to login)
      var current_user = firebase.auth().currentUser;

      if(!current_user){
        //Show modal with description of events
        $ionicLoading.show({template:'Fail to Login! Check credentials,check connection or Create user',noBackdrop:true, duration:2000});

      } else{
        //If successful login,then current User is set and display event modal
        //Show modal with description of events
        $ionicLoading.show({template:'Successfully Login with Existing User!',noBackdrop:true,duration:2000});
        $state.go("dash");
        // $scope.logoutButton.username=firebase.auth().currentUser.email;
        // $scope.logoutButton.visibility='visible';
      }
    });
  };

  $scope.createNewpassword= function(email){
    return firebase.auth().sendPasswordResetEmail($scope.email).then(function(){
        $ionicLoading.show({template:'Check your email to reset password',noBackdrop:true,duration:2000});
      }).catch(function(error){
            var errorCode=error.code;
            var errorMessage=error.message;
            $ionicLoading.show({template:'No user`s information has linked to this email',noBackdrop:true,duration:2000});
    });
    };


});

starter.controller('DashCtrl', function($scope, $state, $stateParams, $ionicLoading, $ionicHistory, $timeout) {
    // check user status
   var user = firebase.auth().currentUser;
   if(!user) {
    $ionicLoading.show( {template: 'Please Login First! ', noBackdrop: true, duration:2000 });
    $state.go('login');
   }

    // display user profile info
   console.log(user.uid)

   var ref = firebase.database().ref("guests");
   ref.orderByChild('id').equalTo(user.uid).on("value", function(snapshot){
        if (snapshot.val()) {
            $scope.displayUserInfo = true;
            var userDB = Object.values(snapshot.val())[0]; // obtain user infor from firebase
            if (userDB.photo.length < 1){
                $scope.dafaultPhoto = true;
                console.log('user have no photo in db')
            } else {
                $scope.dafaultPhoto = false;
            }
            //debugger
            $scope.user = userDB;
            // console.log(userDB)
        } else {
            $scope.displayUserInfo = false;
            $scope.dafaultPhoto = true;
            console.log('user no personal info')
        }

        // $scope.user.firstName = userDB.firstName;
   });

  // navigation function
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
      // $ionicLoading.show( {template: 'Logout Successful! ', noBackdrop: true, duration:2000 });
      $state.go("login");
      $timeout(function () {
        $ionicHistory.clearCache();
      }, 200)
    },function(error){
      console.error('Sign out Error: ' + error);
      ionicLoading.show( {template: 'Logout Unsuccessful! ', noBackdrop: true, duration:2000 });
    });
  };

});

starter.controller('BlogCtrl', function($scope, $state, $ionicLoading) {
  console.log("in BlogCtrl")
  var user = firebase.auth().currentUser;
  if(!user) {
      $ionicLoading.show( {template: 'Please Login First! ', noBackdrop: true, duration:2000 });
      $state.go('login');
    }

   loadMyPosts(user.uid);




  function loadMyPosts(myid)  {
        // retrieve all posts w/ same id as curr user
        var ref = firebase.database().ref("posts");
        ref.orderByChild("uid").equalTo(myid).on("value", function(snapshot) {
            if(!snapshot.val()){
                console.log('user no post!')
                return
            }
            var myPosts = [];
            var numPosts = 0;
            var post = {};

            snapshot.forEach(function(data){
                var key = data.key;
                console.log(key)
                post = data.val();

                // TODO: how to add key (for later update active in post)
                post.postKey = key;
                console.log(post);
                myPosts[numPosts] = post;
                numPosts++;
            });
            console.log(myPosts)
            $scope.myPosts = myPosts;


              if(myPosts.length>0) {
                $scope.noPost = false;
              } else {
                $scope.noPost = true;
              }


              for (post in myPosts) {
                $scope.purpose = displayPurpose(myPosts[post]).toString();
                $scope.pets = displayPet(myPosts[post]).toString();
              }

        function displayPurpose(post) {
                var purpose=[];
            for (entry in post.purpose) {
       //       console.log("entry" + entry);
        //      console.log("Each entry content" + post.pets[entry]);
        //      console.log("post true false" + entry.text);
              if (post.purpose[entry] == true) {
                purpose.push(entry);
              }
            }
            return purpose;
          };

        function displayPet(post) {
            var pets= [];
            for (entry in post.pets) {
        //      console.log("entry" + entry);
        //      console.log("Each entry content" + post.pets[entry]);
         //     console.log("post true false" + entry.text);
              if (post.pets[entry] == true) {
                pets.push(entry);
              }
            }
         return pets;
          };


        }, function(error){
            console.log(error)
        });
    };

    $scope.disable = function(post) {
        console.log(post.postKey)
        console.log(post.active)
        var postKey = post.postKey;
        var ref = firebase.database().ref("posts");

        ref.orderByChild('postKey').equalTo(postKey).on("value", function(snapshot){
            console.log('post in db w/ same key '+snapshot.val())
            //ref.child('active').set(post.active).then(function(){
            firebase.database().ref("posts/"+postKey).child("active").set(post.active).then(function(){
                $ionicLoading.show({template: 'Successfully Update Your Post Status!', noBackdrop: true, duration: 2000});
            }).catch(function(error){
                var errorCode=error.code;
                var errorMessage=error.message;
                $ionicLoading.show({template:'Fails to Update Your Post Status!',noBackdrop:true,duration:2000});
            });
        });

     };

     $scope.deletePost = function (post) {
        var postKey = post.postKey;
        var ref = firebase.database().ref("posts/"+postKey);
        alert()
        ref.remove(function(error){
            alert(error ? "Oh oh!" : "Success!")
        }).then(function(){
            $ionicLoading.show({template: 'Successfully Remove the Post!', noBackdrop: true, duration: 2000});
        });
     };

      $scope.newPost = function() {
        $state.go('newPost');
      };
});

starter.controller('NewPostCtrl',function($scope, $ionicModal, $ionicLoading, $state,$stateParams, $window) {
  var user = firebase.auth().currentUser;
  if (!user) {
    $ionicLoading.show({template: 'Please login to Firebase first!', noBackdrop: true, duration: 2000});
    $state.go('login');
  }

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
  $scope.showUsers = function () {
    //console.log($scope.selectUsers);
  };
  $scope.showPets = function () {
    //console.log($scope.selectPets);
  };


  $scope.addPostToFirebase = function (post) {

    var params = {
        uid: post.uid,
        purpose: post.purpose,
        pets: post.pets,
        city: post.city,
        state: post.state,
        startDate: post.startDate,
        endDate: post.endDate,
        message: post.message,
        active: post.active
    }

    firebase.database().ref('/posts').push(params).then(function(){
          $ionicLoading.show({template:'Post has been upload! ',noBackdrop:true, duration:2000});
         }).then(function(){
            $state.go("blog");
           }).catch(function(error){
            var errorCode=error.code;
            var errorMessage=error.message;
            $ionicLoading.show({template:'Fails to upload post!',noBackdrop:true,duration:2000});
          });
        };




  $scope.editPostInfo = function () {
    var post = {};

    post.uid = firebase.auth().currentUser.uid;
    post.purpose = $scope.selectUsers;
    post.startDate = $scope.startDate;
    post.endDate = $scope.endDate;
    post.pets = $scope.selectPets;
    post.city = $scope.city;
    post.state = $scope.state;
    // var button = FindViewById<ImageButton> (Resource.Id.myButton);
    post.startDate = $scope.startDate;
    post.endDate = $scope.endDate;
    post.message = $scope.message;
    post.active = true;


    if (post.startDate > post.endDate) {
      window.alert('Your start date exceeds your start date');
    } else {
      post.startDate = $scope.startDate.toString().slice(0, 15);
      post.endDate = $scope.endDate.toString().slice(0, 15);
      // check user enter
      var petSelected = post.pets.Dogs == true || post.pets.Cats == true || post.pets.Fish == true;
      var purposeSelected = post.purpose.Sitter == true || post.purpose.Owner == true;
      var validLocation = post.city != "" || post.state != "";
      if (petSelected && purposeSelected && validLocation) {
        console.log('valid post inputs')
        $scope.addPostToFirebase(post);
      } else {
        window.alert('Please Check your enter!');
      }
    }
  }
    $scope.cancel = function () {
      $state.go('blog');
    };
  });

starter.controller("SearchCtrl",function($scope, $ionicModal, $ionicLoading, $state, $stateParams) {
  var user = firebase.auth().currentUser;
      if (!user) {
          $ionicLoading.show({ template: 'Please login to Firebase first!', noBackdrop: true, duration: 2000 });
          $state.go('login');
      }

      //debugger

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
     console.log($scope.selectUsers)
  };

  $scope.showPets=function(){
    console.log($scope.selectPets)
  };

  $scope.Search=function () {
    // pass to search result page
    console.log('in search button')
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


starter.controller('SearchResultCtrl', function($scope, $stateParams, $state, $ionicLoading) {
  var user = firebase.auth().currentUser;
    if(!user) {
        $ionicLoading.show( {template: 'Please Login First! ', noBackdrop: true, duration:2000 });
        $state.go('login');
      }

  loadFoundPosts();




   function loadFoundPosts() {
      var selectedPosts = [];
      var post = {};
      var numPosts = 0;

      var ref = firebase.database().ref("posts");

      ref.orderByChild("startDate").on("value", function(snapshot) {
         // iterate through all posts
        if(!snapshot.val()) {
            return
        }
        snapshot.forEach(function (data) {
          // city and state cannot be empty
          if (data.val().active == true && lowercaseEqual($stateParams.city, data.val().city)
            || lowercaseEqual($stateParams.state, data.val().state)) {
            var post = {};
            post.uid = data.val().uid;
            post.city = data.val().city;
            post.state = data.val().state;
            post.startDate = data.val().startDate;
            post.endDate = data.val().endDate;
            post.message = data.val().message;
            post.userIdentity = data.val().purpose;
            post.pet = data.val().pets;

            post.userInfo = getUserInfo(post.uid);
            console.log(getUserInfo(post.uid))
            // TODO: here, put user info init post{}
            console.log("upper data"+post.startDate)
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
                   // console.log($stateParams.pet);
                //console.log(currPost.pet);
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
                console.log("all selected posts"+ selectedPosts);
                for (post in selectedPosts) {
                    var currPost = selectedPosts[post];

                    // if found pet info mismatch, remove

                    if (!samePet($stateParams.pet, currPost.pet)) {
                        selectedPosts.splice(post);
                        numPosts--;
                    }
                }
            } else {
                console.log("enter 4");
            }
        if (selectedPosts.length < 1) {
           $scope.foundNothing = true;
           } else {
           $scope.foundNothing = false;
           }
         // assign to frontend
         $scope.posts = selectedPosts;

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
      //console.log('first selected: ' + selectedPosts[0]);

  }

  function getUserInfo(uid) {
    var ref =  firebase.database().ref('/guests');
    ref.orderByKey().equalTo(uid).on("value", function(snapshot){
        if(!snapshot.val()){
            return
        }
        var user = snapshot.val();
        console.log(user)
        $scope.user = user[uid];
        // TODO: retrieve user info and put init post{}
    });
  }


  function lowercaseEqual(a, b) {
    if(a==null || b==null) return false;
    if(a.toLowerCase() == b.toLowerCase()) return true;
    else return false;
  }

 function samePet(user, database){

    if (user.Dogs == database.Dogs|| user.Cats == database.Cats|| user.Fish == database.Fish) return true;
    return false;
 }

 function sameIdentity(user, database) {
    if (user.Sitter == database.Sitter || user.Owner == database.Owner) return true;
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

});



starter.controller('AccountCtrl', function($scope, $ionicModal, $ionicLoading, $state, $stateParams) {
    var user = firebase.auth().currentUser;
      if (!user) {
          $ionicLoading.show({ template: 'Please login to Firebase first!', noBackdrop: true, duration: 2000 });
          $state.go('login');
      }
      init();

  $scope.photo = "";    //
  $scope.newPhoto = "";

  $scope.listOfPeople = {};

//Constructing the database
  $scope.addGuestToFirebase = function(completion) {
    //var user = firebase.auth().currentUser;

    var updateInfo = function() {
        var id = firebase.auth().currentUser.uid
        // id = id.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');

        var params = {
          id: id,
          firstName: $scope.firstName,
          lastName: $scope.lastName,
          email: $scope.email,
          phone : $scope.phone,
          photo: $scope.photo,

          // new added
          gender: $scope.gender,
          city: $scope.city,
          state:$scope.state,
          pets:$scope.pets,
          aboutUser:$scope.aboutUser

        }
        firebase.database().ref('/guests').child(id).set(params);
    }

    // if user wants to upload photo
    if ($scope.newPhoto) {
        var photoRef = firebase.storage().ref().child($scope.newPhoto.name)
        photoRef.put($scope.newPhoto).then(function(snapshot) {
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
          if (user){
              var firstName, lastName, email, phone, city, state, pets, photoUrl, aboutUser;
              var ref = firebase.database().ref("guests");
                 ref.orderByChild('id').equalTo(user.uid).on("value", function(snapshot){
                      if (!snapshot.val()){
                        console.log('no user info')
                        return
                      }
                      var userDB = Object.values(snapshot.val())[0]; // obtain user infor from firebase
                      // console.log(userDB.email)
                      // $scope.user = userDB;
                      $scope.firstName = userDB.firstName;
                      $scope.lastName = userDB.lastName;
                      $scope.email = userDB.email;
                      $scope.phone = userDB.phone;
                      $scope.city = userDB.city;
                      $scope.state = userDB.state;
                      $scope.pets = userDB.pets;
                      $scope.photo = userDB.photo;
                      $scope.aboutUser = userDB.aboutUser;

                 });
          } else {
              $ionicLoading.show({ template: 'Please login to Firebase first!', noBackdrop: true, duration: 2000 });
              $state.go('login');
          }
    };

  $scope.photoSelected = function(files) {
    $scope.newPhoto = files[0]
    console.log($scope.newPhoto)
  }

  $scope.editUserProfile = function () {
    console.log($scope.photo)


    // var button = FindViewById<ImageButton> (Resource.Id.myButton);
    //$scope.listOfPeople[user.id] = user;
    $scope.addGuestToFirebase(function() {
        $ionicLoading.show({ template: 'Person has been added to firebase!', noBackdrop: true, duration: 1000 });
        $state.go("dash"); // go back to home page
    });
  };

  $scope.cancel = function() {
    $state.go('dash', {}, {reload:true});
  };


});
