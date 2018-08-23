import {Router} from 'express'
import path from 'path'
import multer from 'multer'
import fileType from 'file-type'
const router = Router()
const staticDir = path.resolve(__dirname, '../static') // 图片相对路径
import quload from '../utils/qupload'
import aws from '../modules/s3'
import {upload as load } from '../modules/qiniu'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, staticDir)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({storage}).single('avatar')

router.get('/', (req, res) => {
  res.send({
    name: 123
  })
})

router.use('/:type', (req, res, next) => {
  next()
})

router.post('/get-token', (req, res) => {
  res.send('get-token')
})

router.post('/loader', multer().single('avatar'), async (req, res) => {
  const filename = `upload/${req.file.originalname}`
  const filemime = req.file.mimetype || fileType(req.file.buffer).mime
  let bucket = 'gh-page'
  if (req.body.bucket) bucket = req.body.bucket
  // if (!/image/gi.test(filemime)) {
  //   res.send({
  //     errors: true,
  //     code: 400,
  //     message: '当前上传的文件非图片格式'
  //   })
  //   return
  // }
  try {
    const response = await load(filename, req.file.buffer, bucket, 1)
    res.send(response)
  } catch (err) {
    res.status(500).send(err.message || err)
  }
})

router.post('/aws', async (req, res) => {
  try {
    const message = await aws.createAndUpload()
    res.send(message)
  } catch (e) {
    res.status(500).send(e.message || JSON.stringify(e))
  }
})

router.post('/delete', async (req, res) => {
  try {
    const message = await aws.deleteBucket()
    res.send(message)
  } catch (e) {
    res.status(500).send(e.message || JSON.stringify(e))
  }
})

router.get('/list-bucket', async (req, res) => {
  try {
    const message = await aws.listBuckets()
    res.send(message)
  } catch (e) {
    res.status(500).send(e.message || JSON.stringify(e))
  }
})

router.post('/upload-s3', multer().single('avatar'), async (req, res) => {
  const filename = `upload/${req.file.originalname}`
  const filemime = req.file.mimetype || fileType(req.file.buffer).mime
  if (!/image/gi.test(filemime)) {
    res.send({
      errors: true,
      code: 400,
      message: '当前上传的文件非图片格式'
    })
    return
  }
  try {
    const response = await aws.upload(filename, req.file.buffer)
    res.send(response)
  } catch (err) {
    res.status(500).send(err.message || err)
  }
})

router.use('/images', (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err)
      res.status(400).send({
        error: '400',
        info: '上传失败'
      })
      return
    }
    const file = req.file
    console.log(file, req.file.buffer)
    next()
  })
})
router.post('/images', (req, res) => {
  console.log(req)
  res.send({
    info: 'hjahah'
  })
})

router.post('/qiniu', (req, res) => {
  try {
    res.send(quload('gh-page'))
  } catch (e) {
    res.status(500).send(e)
  }
})

export default router