import cert from '../cert.json'
import path from 'path'
import qiniu from 'qiniu'
const ak = cert.accessKey
const sk = cert.secretKey
const mac = new qiniu.auth.digest.Mac(ak, sk)

export default function (bucket) {
  const options = {
    scope: bucket
  }

  var putPolicy = new qiniu.rs.PutPolicy(options);
  var uploadToken = putPolicy.uploadToken(mac);

  var config = new qiniu.conf.Config();

  var formUploader = new qiniu.form_up.FormUploader(config);
  var putExtra = new qiniu.form_up.PutExtra();
  var localFile = path.resolve(__dirname, '..', 'static/binding-3.jpg')
  const keyName = 'test.jpg'
  // 上传字节数组
  formUploader.put(uploadToken, null, "hello", null, function(err, body, info) {
    if (err) {
        throw err;
    }

    if (info.statusCode == 200) {
      console.log(body);
    } else {
      console.log(info.statusCode);
      console.log(body);
    }
  });
  // 上传本地文件
  formUploader.putFile(uploadToken, keyName, localFile, putExtra, function (err, body, info) {
    if (err) {
      throw err;
    }

    if (info.statusCode == 200) {
      console.log(body);
    } else {
      console.log(info.statusCode);
      console.log(body);
    }
  })
  //  上传表单文件
  formUploader.putFile(uploadToken)
}
