import home from './home'
import graphql from './graphql'
import admin from './admin'
import upload from './upload'
import statics from './static'

export default (app) => {
  app.use('/', home)
  app.use('/graphql', graphql)
  app.use('/admin', admin)
  app.use('/upload', upload)
  app.use('/static', statics)
}