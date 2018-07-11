import express from 'express'
import bodyParser from 'body-parser'
const app = express().use(bodyParser.json())
const port = process.env.port || 3019

app.use('/', (req, res) => {
  res.send('hello world')
})
app.listen(port, () => {
  console.log(`server start port: ${port}`)
})