import express from 'express'
const router = express.Router()
import {io} from '../server' 

router.post('/', (req, res) => {
  // io.of().broadcast.emit()
  io.emit('add', req.body)
  res.send({code: 1})
})

export default router