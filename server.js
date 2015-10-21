var exp = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

var rooms = [];

app.use('/', exp.static(__dirname + '/ui'));

io.on('connection', function(socket){

  socket.on('get_rooms', function(msg){
    io.to(socket.id).emit("rooms",rooms.slice(rooms.length-50, rooms.length))
  });

  socket.on('join_room', function(msg){
    socket.join(msg);
    socket.room = msg;
    if (rooms.indexOf(msg) == -1 ){
      rooms.push(msg);
    }
    io.to(socket.id).emit("joined",msg)
  });

  socket.on('letter', function(msg,room){
    socket.broadcast.to(room).emit("letter",socket.id,msg)
  });

});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening');
});
