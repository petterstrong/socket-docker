import express from 'express'
import bodyParser from 'body-parser'
const app = express().use(bodyParser.json())
import ejs from 'ejs'
import route from './route'
const server = require('http').Server(app)
const port = Number(process.env.port) || 3019
export const io = require('socket.io')(server)

server.listen(port)
app.set('views', './views')
app.set('view engine', 'ejs')
route(app)

io.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' })
  socket.on('my other event', function (data) {
    console.log(data)
  })
})