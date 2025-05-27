import { CosmosClient } from "@azure/cosmos";
import { config } from "dotenv";

config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const dbClient = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
});

export const initDB = async (): Promise<void> => {
  await dbClient.databases.createIfNotExists({ id: "TaskApp" });

  const db = dbClient.database("TaskApp");
  const taskContainer = await db.containers.createIfNotExists({
    id: "Tasks",
    partitionKey: "/organizationId",
  });
  console.log(`Tasks container: ${taskContainer.container.id}`);

  const configContainer = await db.containers.createIfNotExists({
    id: "Configs",
    partitionKey: "/organizationId",
  });
  console.log(`Configs container: ${configContainer.container.id}`);
};
