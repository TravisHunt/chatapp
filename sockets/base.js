module.exports = function(io) {

    io.on('connection', function(socket) {

        socket.on('join', function(data) {
            socket.join(data.username);
            io.in(data.username).emit('server message', {message: "Welcome to global chat!"});
        });

        socket.on('chat message', function(user, msg) {
            io.emit('chat message', user, msg);
        });
        
        socket.on('user typing', function(username) {
            io.emit('user typing', username);
        });
        
        socket.on('done typing', function(username) {
            io.emit('done typing', username);
        });

    });
    
}