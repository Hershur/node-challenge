import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { buildSchema } from 'type-graphql';
import config from 'config';
import context from './middleware/context';
import cors from 'cors';
import { ExpenseResolver } from './graphql/resolvers/ExpenseResolver';
import { router as expenseRoutes } from '@nc/domain-expense';
import express from 'express';
import gracefulShutdown from '@nc/utils/graceful-shutdown';
import { HelloWordResolver } from './graphql/resolvers/HelloWordResolver';
import helmet from 'helmet';
import Logger from '@nc/utils/logging';
import security from './middleware/security';
import { router as userRoutes } from '@nc/domain-user';
import { createServer as createHTTPServer, Server } from 'http';
import { createServer as createHTTPSServer, Server as SecureServer } from 'https';

const logger = Logger('server');
const app = express();
const productionEnv = config.environment === 'production';
const server: Server | SecureServer = (config.https.enabled === true) ? createHTTPSServer(config.https, app as any) : createHTTPServer(app as any);
server.ready = false;

gracefulShutdown(server);

app.use(cors());

app.use(
  helmet({
    crossOriginEmbedderPolicy: productionEnv,
    contentSecurityPolicy: productionEnv,
  })
);

app.get('/readycheck', function readinessEndpoint(req, res) {
  const status = (server.ready) ? 200 : 503;
  res.status(status).send(status === 200 ? 'OK' : 'NOT OK');
});

app.get('/healthcheck', function healthcheckEndpoint(req, res) {
  res.status(200).send('OK');
});

app.use(context);
app.use(security);

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);

// graphql support
(async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloWordResolver, ExpenseResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer: server })],

  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });
})();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function(err, req, res, next) {
  res.status(500).json(err);
});

server.listen(config.port, () => {
  server.ready = true;
  logger.log(`Server started on port ${config.port}`);
});

export default server;
