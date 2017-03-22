petApp.controller('LoginCtrl',function($scope,$ionicLoading){
    $scope.username="john.doe@gmail.com";
    $scope.password="abc123";
    $scope.logoutButton={};
    $scope.logoutButton.visibility='hidden';

    $scope.createFirebaseUser=function(email,password){
        returnfirebase.auth().createUserWithEmailAndPassword(email,password).then(function(){
        $ionicLoading.show({template:'CreatedFirebaseUser!',noBackdrop:true,duration:1000});
    }).catch(function(error){
        var errorCode=error.code;
        var errorMessage=error.message;
    $ionicLoading.show({template:'Creationofuserunsuccessful!Tryagain!',noBackdrop:true,duration:1000});
    });
    };

    $scope.loginFirebaseUser=function(email,password){
        return firebase.auth().signInWithEmailAndPassword(email,password).catch(function(error){
            var errorCode=error.code;
            var errorMessage=error.message;
        });
    };

    $scope.logoutFirebaseUser=function(){
        firebase.auth().signOut().then(function(){
        console.log('SignedOutFirebaseuser');
        $ionicLoading.show({template:'Logoutsuccessful!',noBackdrop:true,duration:1000});
        $scope.logoutButton.visibility='hidden';
    },function(error){
        console.error('SignOutError',error);
        $ionicLoading.show({template:'LogoutUnsuccessful!',noBackdrop:true,duration:1000});
    });
    }

    $scope.init=function(){
        if(!firebase.auth().currentUser){
        //Showmodalwithdescriptionofevents
        $ionicLoading.show({template:'Pleaselogin',noBackdrop:true,duration:1000});
        }else{
        //Ifsuccessfullogin,thencurrentUserissetanddisplayeventmodal
        //Showmodalwithdescriptionofevents
            $scope.logoutButton.username=firebase.auth().currentUser.email;
            $scope.logoutButton.visibility='visible';
        }
    }

    $scope.init();

    $scope.attemptFirebaseLogin=function(){
        console.log("Attemptingfirebaseloginwithusername:"+$scope.username+"|password:"+$scope.password);
        $scope.loginFirebaseUser($scope.username,$scope.password).then(function(){
        //CheckifcurrentUserisset(weweresuccesfullyabletologin)
        if(!firebase.auth().currentUser){
        //Showmodalwithdescriptionofevents
            $ionicLoading.show({template:'LoginUnsuccessful!Checkcredentials,checkconnectionorcreateuser',noBackdrop:true,duration:1000});
        }else{
            //Ifsuccessfullogin,thencurrentUserissetanddisplayeventmodal
            //Showmodalwithdescriptionofevents
            $ionicLoading.show({template:'Sucessfulloginwithexistinguser',noBackdrop:true,duration:1000});
            $scope.logoutButton.username=firebase.auth().currentUser.email;
            $scope.logoutButton.visibility='visible';
        }
    });
};

    $scope.attemptCreateFirebaseUser=function(){
    $scope.createFirebaseUser($scope.username,$scope.password);
    }
});

petApp.run(function($ionicPlatform,$rootScope,$ionicHistory){
    $rootScope.$on('$stateChangeStart',function(event,toState,toParams,fromState,fromParams){
    $ionicHistory.clearCache();
    });
});



petApp.controller('DashCtrl', function($scope, $state)
{
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
})

petApp.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

petApp.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

petApp.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

petApp.controller('SearchCtrl', function($scope) {
    $scope.settings = {
      enableFriends: true
    };
})


petApp.controller('BlogCtrl', function($scope) {
    $scope.settings = {
      enableFriends: true
    };
})


// The start of the single controller that we will be using for this lab
// It is called "mainCtrl" and is connected to the Angular module "starter"
petApp.controller('SignupCtrl', function($scope, $ionicModal, $ionicLoading,$window) {
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
  };

});




