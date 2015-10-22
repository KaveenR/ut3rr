var app = angular.module('StringGame', []);
app.controller('mnCtrl', function($scope) {
  $scope.in = false;
  var socket = io();
  $scope.room = {};
  $scope.rooms = [];
  $scope.room.rname = "";
  $scope.room.users={};
  $scope.letters = [];

  socket.on('joined', function(msg){
    $scope.room.rname = msg;
    if(!$scope.$$phase) {
         $scope.$apply();
    }
  });
  $(function() {
     $(window).keypress(function(e) {
         if($scope.in){
           var k;
           if (e.keyCode == 32){
             k = new String("");
             k.ucolor="red";
           }else if (e.keyCode == 13){
             k = new String("");
             k.ucolor="red";
           }else{
             k = new String(String.fromCharCode(e.which));
             k.ucolor="black";
           }
             $scope.letters.push(k);
             socket.emit("letter",k,$scope.room.rname)
             if(!$scope.$$phase) {
                  $scope.$apply();
             }
         }
     });
  });

  socket.on('letter', function(sid,msg){
    var t = new String(msg);
    t.sid = sid;
    if ($scope.room.users[sid] == undefined){
      $scope.room.users[sid] = '#'+Math.random().toString(16).substr(-6);
    }
    t.ucolor = $scope.room.users[sid];
    $scope.letters.push(t)
    if(!$scope.$$phase) {
         $scope.$apply();
    }
  });

  socket.on('rooms', function(msg){
    $scope.rooms = msg;
    if(!$scope.$$phase) {
         $scope.$apply();
    }
  })

  $scope.join = function(){
    socket.emit('join_room', $scope.room.rname);
    $scope.in = true;
    $scope.greet();
    if(!$scope.$$phase) {
         $scope.$apply();
    }
    $("#tbox").focus();
  }
  $scope.greet = function(){
    var message = "Welcome To Utt3rr, Nothing Fancy, Just Use Your keyboard";
    for(i in message){
      var l = new String(message[i]);
      l.ucolor = '#'+Math.random().toString(16).substr(-6);
      $scope.letters.push(l)
    }
  }
  $scope.quickjoin = function(room){
    $scope.room.rname = room;
    $scope.join();
  }

  $scope.init = function(){
    socket.emit('get_rooms', "");
  }

});
