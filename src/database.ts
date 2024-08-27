import { connect } from "mongoose";

import { mongodbUri } from "./secrets";

export = async () => {
  const connectionString = mongodbUri;

  try {
    await connect(connectionString);
    return console.log(
      "Database connected to : ",
      connectionString.includes("localhost")
        ? connectionString.includes("replicaSet")
          ? "[ MongoDB Replica Set ]"
          : "[ MongoDB Local ]"
        : "[ MongoDB Cloud ☁️  ]"
    );
  } catch (error) {
    return console.log("Connection Error", error);
  }
};
