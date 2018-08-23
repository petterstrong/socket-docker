import   express from 'express'
import bodyParser from 'body-parser'
import ejs from 'ejs'
import route from './route'
import mongoose from 'mongoose'
import morgan from 'morgan'
const app = express().use(bodyParser.json())
const server = require('http').Server(app)
const port = Number(process.env.port) || 3019
export const io = require('socket.io')(server)
import log4js from 'log4js'

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: { type: 'file', filename: 'logs/log4jsconnect.log' }
  },
  categories: {
    default: { appenders: ['console'], level: 'debug' },
    log4jslog: { appenders: ['file'], level: 'debug' }
  }
})

const logger = log4js.getLogger('log4jslog');

// logging

// connect mongodb
const db = mongoose.connection

mongoose.connect('mongodb://localhost/test')

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('connected')
})

server.listen(port)
app.use(express.static('/public'))
app.set('views', './views')
app.set('view engine', 'ejs')


app.use(log4js.connectLogger(logger, { level: 'auto' }));
route(app)

io.of('react').on('connection', (socket) => {
  socket.on('send', function (data) {
    socket.broadcast.emit('receive', data)
  })
  socket.on('typing', function() {
    socket.broadcast.emit('typing')
  })
})
io.of('vue').on('connection', (socket) => {
  socket.on('send', function (data) {
    socket.broadcast.emit('receive', data)
  })
  socket.on('typing', function() {
    socket.broadcast.emit('typing')
  })
})