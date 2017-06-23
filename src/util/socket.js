import * as io from 'socket.io-client';

const socket = io.connect('ws://localhost:3030');

export default socket;
