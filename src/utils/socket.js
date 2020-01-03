import socket from 'socket.io';
import socketioJwt from 'socketio-jwt';
import env from '../config/env';

const { JWT_SECRET } = env;

export default (server) => {
    const io = socket(server);

    io.users = {};

    io.use(socketioJwt.authorize({
        secret: JWT_SECRET,
        handshake: true,
        callback: false
    }));

    io.on('connection', socket => {
        const { decoded_token: auth } = socket;

        io.users[auth.id] = socket;

        console.log(`Socket (userId: ${auth.id}): Connection Succeeded.`);

        socket.on('disconnect', () => {
            delete io.users[auth.id];
            console.log(`Socket (userId: ${auth.id}): Disconnected.`);

        });
    });

    return io;
}