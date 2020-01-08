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

            console.log(`Socket (userId: ${ id }): Connection Succeeded.`);

            client.on('disconnect', () => {
                delete this._users[id];
                console.log(`Socket (userId: ${ id }): Disconnected.`)
            });

            client.on('action', (action) => {
                if (action.type === 'SERVER/MESSAGE') {
                    this._io.emit('action', { type: 'NEW_MESSAGE', data: action.data });
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