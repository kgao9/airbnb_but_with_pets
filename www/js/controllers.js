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
        // after creating account in auth, also create user in guests database
                  var user = firebase.auth().currentUser;
                  var userInfo = $stateParams.user;
                  var uid = user.uid;
                  userInfo.id = uid;    // update user id
                  userInfo.email = user.email;  //update email
                  console.log(userInfo)
        firebase.database().ref('/guests').child(uid).set(userInfo).then(function(){
        $ionicLoading.show({template:'Created New User!',noBackdrop:true,duration:1000});
      });
    }).catch(function(error){
              var errorCode=error.code;
              var errorMessage=error.message;
              console.log(errorMessage)
              $ionicLoading.show({template:'Fail to Create New User! Try again!',noBackdrop:true,duration:1000});
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
    $scope.login($scope.email,$scope.password).then(function(){
      //Check if current User is set(we were succesfully able to login)
      var current_user = firebase.auth().currentUser;
      if(!current_user){
        //Show modal with description of events
        $ionicLoading.show( {template:'Fail to Login! Check credentials,check connection or Create user',noBackdrop:true, duration:2000} );

      } else{
        //console.log(current_user.email)
        //If successful login,then current User is set and display event modal
        //Show modal with description of events
        $ionicLoading.show({template:'Successfully Login with Existing User!',noBackdrop:true,duration:2000});
        $state.go("dash");
      }
    });
  };

  $scope.createNewpassword= function(email){
    try{
    return firebase.auth().sendPasswordResetEmail($scope.email).then(function(){
        $ionicLoading.show({template:'Check your email to reset password',noBackdrop:true,duration:2000});
      })

     }catch(error){
            var errorCode=error.code;
            var errorMessage=error.message;
            $ionicLoading.show({template:'No user`s information has linked to this email',noBackdrop:true,duration:2000});
    };
 };


});

starter.controller('DashCtrl', function($scope, $state, $stateParams, $ionicLoading, $ionicHistory, $timeout) {
    // check user status
    //console.log("DashCtrl")
   var user = firebase.auth().currentUser;
   if(!user) {
    $ionicLoading.show( {template: 'Please Login First! ', noBackdrop: true, duration:2000 });
    $state.go('login');
   } else {

       var ref = firebase.database().ref("guests");
       ref.orderByChild('id').equalTo(user.uid).on("value", function(snapshot){

//       var printObj = function(obj, level) {
//        if (level == 3) {
//            return
//        }
//        if (typeof(obj) === 'object') {
//            for (key in obj) {
//                console.log('level'+ level +'key' + key)
//                printObj(obj[key], level+1)
//            }
//        } else {
//            console.log(obj)
//        }
//       }
            //console.log('here')
            //console.log("tried snapshot: " + snapshot)
//            console.log('uid: '+ user.uid)
//            console.log('.')
//            console.log(snapshot)
//            console.log('.')
//            console.log(snapshot.val)
//            console.log('.')
//            console.log(snapshot.val())
//            console.log('.')
//            console.log(snapshot.__proto__)
//            console.log('.')
//            console.log(snapshot.__proto__.val)
//            console.log('.')
            var val = snapshot.val()
            if (val){
                var firstKey = Object.keys(val)[0]
                var user = val[firstKey]
            } else {
                user = $stateParams.user;
            }

//            console.log(Object.keys)
//            console.log(Object.values)
            //console.log(val[firstKey])
//            printObj(snapshot.val(), 0)
//                console.log(snapshot[user.uid])
//                console.log(Object.keys(snapshot[user.uid]))

                var userDB = user//Object.values(snapshot.val())[0]; // obtain user infor from firebase

                $scope.user = userDB;
                if(!userDB.photo && !userDB.firstName) {
                    // console.log('def user')
                    $scope.defaultUser = true;
                } else {
                    $scope.defaultUser = false;
                }
                //console.log($scope.defaultUser)
                //console.log($scope.user)
       });

       //console.log("Dash")

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
          $state.go("login");
          $timeout(function () {
            $ionicHistory.clearCache();
          }, 200)
        },function(error){
          console.error('Sign out Error: ' + error);
          ionicLoading.show( {template: 'Logout Unsuccessful! ', noBackdrop: true, duration:2000 });
        });
      };

      $state.reload();
   }

});

starter.controller('BlogCtrl', function($scope, $state, $ionicLoading, $ionicPopup, $timeout) {
  console.log("in BlogCtrl")
  var user = firebase.auth().currentUser;
  if(!user) {
      $ionicLoading.show( {template: 'Please Login First! ', noBackdrop: true, duration:2000 });
      $state.go('login');
    } else {
    loadMyPosts(user.uid);


   $scope.user = function(myPostsDB) {
          var purpose = myPostsDB.purpose;
          var displayPurpose = "";
          if (purpose.Owner==true) {
            displayPurpose = "owner";
          } else if (purpose.Sitter==true) {
            displayPurpose = "sitter";
          } else {
            displayPurpose = "owner and sitter";
          }
          return displayPurpose;
      };

      $scope.pet = function(myPostsDB) {
          var pets = myPostsDB.pets;
          var displayPet = "";
          if(pets.Dogs==true) {
            displayPet = "dog";
          } else if(pets.Cats == true) {
            displayPet = "cat";
          } else if(pets.Fish == true) {
            displayPet = "cat";
          }
          // TODO: not the best way to display
          return displayPet;
      };

  function loadMyPosts(myid)  {
        // retrieve all posts w/ same id as curr user
        var ref = firebase.database().ref("posts");
        ref.orderByChild("uid").equalTo(myid).limitToLast(15).on("value", function(snapshot) {
            if(!snapshot.val()){
                //console.log('user no post!')
                return
            }
            var myPosts = [];
            var numPosts = 0;
            var post = {};

            snapshot.forEach(function(data){
                var key = data.key;
                //console.log(key)
                post = data.val();

                post.postKey = key;
                //console.log(post);
                myPosts[numPosts] = post;
                numPosts++;
            });
            //console.log(myPosts)
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
                     if (post.purpose[entry] == true) {
                       purpose.push(entry);
                     }
                   }
                   return purpose;
                 };

               function displayPet(post) {
                   var pets= [];
                   for (entry in post.pets) {
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
        //console.log(post.postKey)
        //console.log(post.active)
        var postKey = post.postKey;
        var ref = firebase.database().ref("posts");

        ref.orderByChild('postKey').equalTo(postKey).on("value", function(snapshot){
            //console.log('post in db w/ same key '+snapshot.val())
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
        var confirmPopup = $ionicPopup.confirm({
               title: 'Delete Post',
               template: 'Are you sure you want to delete this post?'
             });
        confirmPopup.then(function(res) {
               if(res) {
                 //console.log('yes, delete');
                 ref.remove().then(function(){
                    $ionicLoading.show({template: 'Successfully Remove the Post!', noBackdrop: true, duration: 2000});
                    $state.reload();
                 });
               } else {
                 //console.log('no, not delete');
               }
        });
     };

      $scope.newPost = function() {
        $state.go('newPost');
      };
      $scope.backHome = function() {
        $state.go('dash');
      };

      }
});

starter.controller('NewPostCtrl',function($scope, $ionicModal, $ionicLoading, $state, $stateParams, $window, $ionicPopup) {
  var user = firebase.auth().currentUser;
  if (!user) {
    $ionicLoading.show({template: 'Please login to Firebase first!', noBackdrop: true, duration: 2000});
    $state.go('login');
  } else {

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

//    post.uid = firebase.auth().currentUser.uid;
//    post.purpose = $scope.selectUsers;
//    post.startDate = $scope.startDate;
//    post.endDate = $scope.endDate;
//    post.pets = $scope.selectPets;
//    post.city = $scope.city;
//    post.state = $scope.state;
//    // var button = FindViewById<ImageButton> (Resource.Id.myButton);
//    post.startDate = $scope.startDate;
//    post.endDate = ""
//    post.message = "";
//    post.active = true;
    if ($scope.selectUsers==null||$scope.startDate==null||$scope.endDate==null|| $scope.selectPets==null|| $scope.city==null||$scope.state==null){
      $ionicLoading.show({template:'Please fill in all information ',noBackdrop:true, duration:2000});
    }else {
      post.uid = firebase.auth().currentUser.uid;
      post.purpose = $scope.selectUsers;
      post.startDate = $scope.startDate;
      post.endDate = $scope.endDate;
      post.pets = $scope.selectPets;
      post.city = $scope.city;
      post.state = $scope.state;
      // var button = FindViewById<ImageButton> (Resource.Id.myButton);
      if ($scope.message != null) {
        post.message = $scope.message;
      }
      post.active = true;
    }



      if ($scope.startDate && $scope.endDate) {
        post.startDate = $scope.startDate.toString().slice(0, 15);
        post.endDate = $scope.endDate.toString().slice(0, 15);
      }

      // check user enter
      var petSelected = post.pets.Dogs == true || post.pets.Cats == true || post.pets.Fish == true;
      var purposeSelected = post.purpose.Sitter == true || post.purpose.Owner == true;
      var validLocation = post.city != "" || post.state != "";
      var validTime = post.startDate && post.endDate;

      if (petSelected && purposeSelected && validLocation && validTime) {
        //console.log('valid post inputs')
        $scope.addPostToFirebase(post);

      } else if(!validLocation){
        // window.alert('Please Check your enter!');
        var alertPopup = $ionicPopup.alert({
                     title: 'Input Error',
                     template: 'Please Enter Valid Location!'
              });
              alertPopup
      } else if (!validTime) {
      var alertPopup = $ionicPopup.alert({
                           title: 'Input Error',
                           template: 'Please Enter Valid Time!'
                    });
      alertPopup

      } else if(!purposeSelected) {
      var alertPopup = $ionicPopup.alert({
                                 title: 'Input Error',
                                 template: 'Please Select User Identity!'
                          });
            alertPopup

      } else if(!petSelected) {
      var alertPopup = $ionicPopup.alert({
                                 title: 'Input Error',
                                 template: 'Please Select Pet!'
                          });
            alertPopup
      }
  }
        $scope.cancel = function () {
          $state.go('blog');
        };
    }
  });

starter.controller("SearchCtrl",function($scope, $ionicModal, $ionicLoading, $state, $stateParams) {
  var user = firebase.auth().currentUser;
      if (!user) {
          $ionicLoading.show({ template: 'Please login to Firebase first!', noBackdrop: true, duration: 2000 });
          $state.go('login');
      } else {

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

  //console.log($scope.selectUsers);
  $scope.showUsers=function(){
     //console.log($scope.selectUsers)
  };

  $scope.showPets=function(){
    //console.log($scope.selectPets)
  };

  $scope.Search=function () {
    // pass to search result page
    //console.log('in search button')
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

    $scope.backDash = function()  {
        $state.go('dash');
    };
}
});


starter.controller('SearchResultCtrl', function($scope, $stateParams, $state, $ionicLoading) {
  var user = firebase.auth().currentUser;
    if(!user) {
        $ionicLoading.show( {template: 'Please Login First! ', noBackdrop: true, duration:2000 });
        $state.go('login');
      } else {

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
            //console.log(getUserInfo(post.uid))
            // TODO: here, put user info init post{}
            //console.log("upper data"+post.startDate)
            selectedPosts[numPosts] = post;
            numPosts++;
          }
        });

            // user enter info about user identity and pet
            if (!emptyInputIdentity($stateParams.userIdentity) && !emptyInputPet($stateParams.pet)) {
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
                //console.log("enter 2");
                for (var i=selectedPosts.length-1; i>=0; i--) {
                    var currPost = selectedPosts[i];
                    if (!sameIdentity($stateParams.userIdentity, currPost.userIdentity)) {
                         //console.log('nothing pet, something user');
                         selectedPosts.splice(i, 1);
                         numPosts--;
                    }
                }
            }

            // user enter nothing about user identity but something about pet
            else if ( emptyInputIdentity($stateParams.userIdentity) && !emptyInputPet($stateParams.pet) ) {
                //console.log("enter 3");
                //console.log("all selected posts"+ selectedPosts);
                for (post in selectedPosts) {
                    var currPost = selectedPosts[post];

                    // if found pet info mismatch, remove

                    if (!samePet($stateParams.pet, currPost.pet)) {
                        selectedPosts.splice(post);
                        numPosts--;
                    }
                }
            } else {
                //console.log("enter 4");
            }
        if (selectedPosts.length < 1) {
           $scope.foundNothing = true;
           } else {
           $scope.foundNothing = false;
           }
         // assign to frontend
         $scope.posts = selectedPosts;

      }, function (errorObject) {
        //console.log("The read failed: " + errorObject.code);
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
        if(!user.photo){
            $scope.defaultUser = true;
        } else {
            $scope.defaultUser = false;
        }
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
 $state.reload();
 }


});



starter.controller('AccountCtrl', function($scope, $ionicModal, $ionicLoading, $state, $stateParams, $ionicPopup) {
    var user = firebase.auth().currentUser;
      if (!user) {
          $ionicLoading.show({ template: 'Please login to Firebase first!', noBackdrop: true, duration: 2000 });
          $state.go('login');
      } else  {
      init();
      console.log(user.email)

  $scope.photo = "";
  $scope.newPhoto = "";

  $scope.listOfPeople = {};

//Constructing the database
  $scope.addGuestToFirebase = function(completion) {
    //var user = firebase.auth().currentUser;

    var updateInfo = function() {
        var id = firebase.auth().currentUser.uid

        //console.log($scope.photo)
        if(!$scope.gender) {
            var alertPopup = $ionicPopup.alert({
                         title: 'Input Error',
                         template: 'Please Select Gender!'
            });
            alertPopup
            updateInfo()
        }

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
    //console.log("guest added to Firebase");
  };


  $scope.photoSelected = function(files) {
    $scope.newPhoto = files[0]
    //console.log($scope.newPhoto)
    //console.log($scope.newPhoto)
  }

  $scope.editUserProfile = function () {
    // console.log($scope.photo)


    // var button = FindViewById<ImageButton> (Resource.Id.myButton);
    //$scope.listOfPeople[user.id] = user;
    $scope.addGuestToFirebase(function() {
        $ionicLoading.show({ template: 'Person has been added to firebase!', noBackdrop: true, duration: 1000 });
        $state.go("dash"); // go back to home page
    });
  }

  $scope.cancel = function() {
    $state.go('dash', {}, {reload:true});
  };
}

function init() {
          if (user){
              // var firstName, lastName, email, phone, city, state, pets, photoUrl, aboutUser;
              var ref = firebase.database().ref("guests");
                 ref.orderByChild('id').equalTo(user.uid).on("value", function(snapshot){
                      if (!snapshot.val()){
                        //console.log('no user info')
                        return
                      }
                      // obtain user infor from firebase
                      // var userDB = Object.values(snapshot.val())[0];
                      var firstKey = Object.keys(snapshot.val())[0];
                      var userDB = snapshot.val()[firstKey];

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

});