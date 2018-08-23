import AWS from 'aws-sdk'
import uuid from 'uuid'

const s3 = new AWS.S3()

const bucket = 'node.buckets'
const keyName = 'hello_world.txt'

export const createAndUpload = () => {
  const bucketPromise = s3.createBucket({
    Bucket: bucket,
    ACL: 'public-read',
    CreateBucketConfiguration: {
      LocationConstraint: 'sa-east-1'
    }
  }).promise();
  return bucketPromise.then(data => {
    const params = {Bucket: bucket, Key: keyName, Body: 'Hello World'}
    const uploadPromise = s3.putObject(params).promise()
    return uploadPromise.then(item => {
      console.log(`upload dat to ${bucket} / ${keyName}`)
      return item
    })
  }).catch(e => {
    console.log(e, e.stack)
  }) 
}

export const deleteBucket = () => {
  const bucketPromise = s3.deleteBucket({Bucket: bucket}).promise()
  return bucketPromise.then(data => {
    console.log(data)
    return data
  })
}

export const listBuckets = () => {
  const buckPromise = s3.listBuckets({}).promise()
  return buckPromise.then(data => {
    console.log(data)
    return data
  })
}

export const upload = (key, file) => {
  const uploadPromise = s3.putObject({Bucket: bucket, Body: file, Key: key}).promise()
  uploadPromise.then(data => {
    console.log(data)
    return data
  })
}

export default {
  createAndUpload, deleteBucket, listBuckets, upload
}