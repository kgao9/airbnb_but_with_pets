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