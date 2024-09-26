import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { createServer } from "http";
import express from "express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";
import cors from "cors";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./schema/resolvers";
import database from "./database";
import user from "./routes/user";

import { origin, port } from "./secrets";

export const pubsub = new PubSub();

// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
  server: httpServer,
  // path: "/api/subscription",
  path: "/api/graphql",
});
// Save the returned server's info so we can shutdown this server later
const serverCleanup = useServer({ schema }, wsServer);
const hiddenGraphqlUI =
  process.env.NODE_ENV === "production"
    ? ApolloServerPluginLandingPageDisabled()
    : {};
// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  plugins: [
    hiddenGraphqlUI,
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

(async () => {
  await database();
  await server.start();

  app.use(express.json({ limit: "20mb" }));

  app.use("/api/user", user);
  //   app.use("/api/fix", fix);

  app.use(
    "/api/graphql",
    cors<cors.CorsRequest>({
      credentials: true,
      origin: origin,
    }),
    expressMiddleware(server)
  );

  app.use("/api/health", (req, res) => {
    res.sendStatus(200);
  });

  // console.log("origin", origin);
  // Now that our HTTP server is fully set up, we can listen to it.

  httpServer.listen(port, () => {
    console.log(
      `🚀 GraphQL Server is now running on ${port} and accept request from ${origin}`
    );
  });
})();
