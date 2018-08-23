import cert from '../cert.json'
import qiniu from 'qiniu'
import path from 'path'
import yaml from 'yamljs'
const bucketList = path.resolve(__dirname, 'bucket.yml')
const buckets = yaml.load(bucketList)
const ak = cert.accessKey
const sk = cert.secretKey
const mac = new qiniu.auth.digest.Mac(ak, sk)

export const upload = function(key, file, bucket, withInfo) {
  const options = {
    scope: bucket,
    fileType: 1
  }
  if (withInfo) {
    options.returnBody = '{"key":"$(key)","hash":"$(etag)","bucket":"$(bucket)","name":"$(x:name)","height":"$(imageInfo.height)", "width": "$(imageInfo.width)"}'
  }

  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  const config = new qiniu.conf.Config()
  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()
  return new Promise((resolve, reject) => {
    formUploader.put(uploadToken, key, file, putExtra, function(err, body, info) {
      if (err) {
        throw err
        reject(err)
      }

      if (info.statusCode == 200) {
        body.url = `${buckets[bucket][0]}${body.key}`
        body.createdAt = Date.now()
        resolve(body)
      } else {
        resolve({errors: true, code: info.statusCode, body: body})
      }
    });
  })
}

export const getToken = (bucket, withInfo) => {
  let options = {
    scope: bucket
  }
  if (withInfo) {
    options.returnBody = '{"key":"$(key)","hash":"$(etag)","bucket":"$(bucket)","name":"$(x:name)","height":"$(imageInfo.height)", "width": "$(imageInfo.width)"}' 
  }

  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  return uploadToken
}
