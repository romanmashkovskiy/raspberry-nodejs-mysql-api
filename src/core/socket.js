import socket from 'socket.io';
import socketioJwt from 'socketio-jwt';
import env from '../config/env';

const { JWT_SECRET } = env;

export default {
    _io: null,
    _users: {},

    initialize(server) {
        this._io = socket(server);
        this._users = {};

        this._io.use(socketioJwt.authorize({
            secret: JWT_SECRET,
            handshake: true
        }));

        this._io.on('connection', client => {
            const { decoded_token: { id } } = client;

            this._users[id] = client;

            client.broadcast.emit('action', {
                type: 'USER_CONNECTED',
                data: id
            });

            console.log(`Socket (userId: ${ id }): Connection Succeeded.`);

            client.on('disconnect', () => {
                client.broadcast.emit('action', {
                    type: 'USER_DISCONNECTED',
                    data: id
                });

                delete this._users[id];
                console.log(`Socket (userId: ${ id }): Disconnected.`);
            });

            client.on('action', (action) => {
                if (action.type === 'SERVER_OUTGOING_MESSAGE') {
                    client.broadcast.emit('action', {
                        type: 'INCOMING_MESSAGE',
                        data: action.data
                    });
                }
                if (action.type === 'SERVER_USER_IS_TYPING') {
                    client.broadcast.emit('action', {
                        type: 'USER_IS_TYPING',
                        data: action.data
                    });
                }
                if (action.type === 'SERVER_USER_STOP_TYPING') {
                    client.broadcast.emit('action', {
                        type: 'USER_STOP_TYPING',
                        data: action.data
                    });
                }
            });
        });
    },

    send(userIds, type, payload, meta={}) {
        userIds
            .filter(id => this._users[id])
            .map(id => this._users[id].emit('action', { type, payload, meta }))
    }
}