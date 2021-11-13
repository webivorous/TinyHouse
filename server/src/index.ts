import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql/index';
import { connectDatabase } from './database';

const app = express();

const mount = async (app: Application) => {
  const db = await connectDatabase();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ db })
  });

  await server.start().then(async () => {
    server.applyMiddleware({
      app,
      path: '/api'
    });
    app.listen(process.env.PORT);
    console.log(`[app]: http://localhost:${process.env.PORT}`);

    // Database Connection Test
    const listings = await db.listings.find({}).toArray();
    console.log(listings);
  });

}

mount(app);