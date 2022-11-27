const io = require('socket.io')();



function init (server) {

    io.attach(server);

    io.on('connection', function (socket) {
            

            console.log('✅ Client connected with id: ' + socket.id); 
            socket.on('message', function (data) {
    
                console.log(data);
    
            });

            socket.on('disconnect', function () {
                console.log('⛔ Client disconnected with id: ' + socket.id);
            });



            


    
        });
}



module.exports.init = init;