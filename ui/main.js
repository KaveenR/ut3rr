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
    $scope.$apply();
  });

  $(function() {
     $(window).keypress(function(e) {
         if($scope.in){
           var k = new String(String.fromCharCode(e.which));
           k.ucolor="black";
           //if (k.toUpperCase() == $scope.letters[$scope.letters.length - 1].toUpperCase()){
             $scope.letters.push(k);
             socket.emit("letter",k,$scope.room.rname)
             $scope.$apply();
           //}
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
    $scope.$apply();
  });

  socket.on('rooms', function(msg){
    $scope.rooms = msg;

    $scope.$apply();
  })

  $scope.join = function(){
    socket.emit('join_room', $scope.room.rname);
    $scope.in = true;
    $scope.greet();
    $scope.$apply();
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
