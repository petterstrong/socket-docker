import {Model, Schema} from 'mongoose'

const schema = new Schema({
  attachments: {
    type: Array
  },
  content: {
    type: String,
    required: true
  },
  from: {
    type: Schema.Types.ObjectId,
    required: true
  },
  to: {
    type: Schema.Types.ObjectId,
    required: true
  },
  post_date: {
    type: Number
  }
})

export default messageModel  = Model('message', schema)