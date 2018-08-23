import {
  GraphQLObjectType
} from 'graphql'

const schema = new GraphQLObjectType({
  query: new GraphQLObjectType({
    name: 'Query'
  })
})

export default schema