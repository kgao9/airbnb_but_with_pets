

petApp.controller('lab1Ctrl',function($scope,$ionicModal,$ionicLoading){
    $scope.firstName="";
    $scope.lastName="";
    $scope.phoneNumber="";
    $scope.email="";
    $scope.listOfPeople={};

    $scope.addGuestToFirebase=function(person){
    firebase.database().ref('/guests/'+person.id).set({
        id:person.id,
        firstName:person.firstName,
        lastName:person.lastName,
        email:person.email,
        phoneNumber:person.phoneNumber
    });
    console.log("guestaddedtoFirebase");
    };

    $scope.retrieveGuestsFromFirebase=function(){
    if(!firebase.auth().currentUser)
    {
    $ionicLoading.show({template:'PleaselogintoFirebasefirst!',noBackdrop:true,duration:1000});
    return;
    }
    firebase.database().ref('/guests/').once('value').then(function(snapshot){
    //varusername=snapshot.val().username;
    if(snapshot.val()!=null)$scope.listOfPeople=snapshot.val();
        $ionicLoading.show({template:'GuestsretrievedfromFirebase',noBackdrop:true,duration:1000});
        $scope.apply();
    });
    };

    $scope.init=function(){
    $scope.retrieveGuestsFromFirebase();
};

    $scope.init();

    $scope.onSubmit=function(){
        varperson={};
        person.id=$scope.firstName+$scope.lastName+$scope.phoneNumber+$scope.email;
        person.id=person.id.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g,'');
        person.firstName=$scope.firstName;
        person.lastName=$scope.lastName;
        person.phoneNumber=$scope.phoneNumber;
        person.email=$scope.email;
        $scope.listOfPeople[$scope.firstName+$scope.lastName+$scope.phoneNumber+$scope.email]=person;
        $scope.addGuestToFirebase(person);
        $ionicLoading.show({template:'PersonAdded!',noBackdrop:true,duration:1000});
    };

    $scope.deletePerson=function(person){
        delete$scope.listOfPeople[person.id];
        //Firebasedatabaseremovalcode
        firebase.database().ref('guests/').child(person.id).remove().then(function(){
        console.log("guestremovedfromFirebase");
    });
    $ionicLoading.show({template:'PersonDeleted!',noBackdrop:true,duration:1000});
};

});

    ionicApp.controller('promisesCtrl',function($scope,$ionicModal,$ionicLoading,$q,$timeout){
    /*Asynchronousfunctionswithpromises(examples)*/
    $scope.promiseReturnValue="Unknown";

    $scope.thisIsAFunctionThatReturnsAPromise=function(parameter){

    vardeferred=$q.defer();
    //SayAPIcallwasmadewithvariable"parameter"andwassuccessful
    //Thenpromisewouldbe"resolved"
    if(parameter=="goodParameter")
    {
    //Whenpromiseisresolveditcanreturnbackresults(s)
    //Inthiscasepromiseisresolvedandstringispassedback

    //wait2secondsbeforeresolvingpromisetosimulateAPIcallsthatreturnsafter2seconds
    $timeout(function(){deferred.resolve("Thispromisewasresolved");},2000);
    }
    //SayAPIcallwasmadewithvariable"parameter"andthenerroroccured
    //Thenpromisewouldbe"rejected"
    elseif(parameter=="badParameter")
    {
    //Whenpromiseisrejecteditcanreturnbackresults(s)
    //Inthiscasepromiseisrejectedandstringispassedback

    //wait2secondsbeforerejectingpromisetosimulateAPIcallsthatreturnsafter2seconds
    $timeout(function(){deferred.reject("Thispromisewasrejected");},2000);
    }
    //Functionreturnsapromise
    returndeferred.promise;
    };

    $scope.testResolvedPromise=function(){

    //thefunctionthatisavariable"aSyncFunc"isanasynchronousoperationthatreturnsapromise
    $scope.thisIsAFunctionThatReturnsAPromise("badParameter").then(
    function(successful_aSync_Operation_Result){
    //Successfulasynchronousoperation
    //executecodeinthisblockifasynchronousoperationwassuccessful/promisewas"resolved"
    console.log("result="+successful_aSync_Operation_Result);
    $scope.promiseReturnValue="Resolved";
    },function(NOT_successful_aSync_Operation_Result){
    //Unsuccessfulasynchronousoperation
    //executecodeinthisblockifasynchronousoperationwasunsuccessful/promisewas"rejected"
    console.log("result="+NOT_successful_aSync_Operation_Result);
    $scope.promiseReturnValue="Rejected";
    });

    };

    $scope.testRejectPromise=function(){
    //thefunctionthatisavariable"aSyncFunc"isanasynchronousoperationthatreturnsapromise
    //(using".catch"forerror)
    $scope.thisIsAFunctionThatReturnsAPromise("badParameter").then(
    function(successful_aSync_Operation_Result){
    //Successfulasynchronousoperation
    //executecodeinthisblockifasynchronousoperationwassuccessful/promisewas"resolved"
    console.log("result="+successful_aSync_Operation_Result);
    $scope.promiseReturnValue="Resolved";
    }).catch(function(NOT_successful_aSync_Operation_Result){
    //Unsuccessfulasynchronousoperation
    //executecodeinthisblockifasynchronousoperationwasunsuccessful/promisewas"rejected"
    console.log("result="+NOT_successful_aSync_Operation_Result);
    $scope.promiseReturnValue="Rejected";
    });

    };

    });


