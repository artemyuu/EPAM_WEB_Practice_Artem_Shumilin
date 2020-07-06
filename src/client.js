const io = require('socket.io-client')
const https = require('https')
const events = require('events')

const socket = io.connect('https://voicy-speaker.herokuapp.com/',{reconnection: true})

socket.on('connect', socket =>{
    console.log('Connected')
   
})

socket.on('user', data =>{
    console.log(data);
})
