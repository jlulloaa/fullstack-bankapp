const express = require('express')
const app = express()
const port = 3000

const graphqlHTTP = require('express-graphql')
const graphql = require('graphql');


// The following sectin should go in a separate file in this same folder
let schema = graphql.buildSchema(`
  type Query {
    hello: String
  }
`);

let root = {
  hello: () => {
    return 'Hello world!';
  },
};
// 

app.get('/', (req, res) => res.send('Hello Word!'))
// app.listen(port, () => console.log(`App de ejemplo escuchando el puerto ${port}!`))

app.use('/graphql', graphqlHTTP({
	schema: schema,
	rootValue: root,
	graphiql: true
}))