import home from './home'
import graphql from './graphql'
import admin from './admin'

export default (app) => {
  app.use('/', home)
  app.use('/graphql', graphql)
  app.use('/admin', admin)
}