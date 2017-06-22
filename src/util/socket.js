import * as io from 'socket.io-client';

const socket = io.connect('ws://localhost:3030');

socket.on('init', data => {
    sessionStorage.setItem('relations', JSON.stringify(data));
})

export default socket;
