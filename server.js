const http = require('http')
const io = require('socket.io')
const fs = require('fs')

let count = 0;

const battery = {
  id: 0,
  name: "Title",
  desc: "...",
  pos: {
    top: 100,
    left: 100
  },
  input: [],
  output: [],
  relations: [],
  err: "",
  belong: "",
  isAdd: false
}


const server = http.createServer()

const client = io.listen(server)

client.on('connection', socket => {
  //初始化数据
  socket.on('init', () => {
    fs.readFile('./data.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err)
      }
      socket.emit('init', data)
    })
  })
  //新建battery
  
})

server.listen(3030, () => {
  console.log('http server running on 3030')
}) 
