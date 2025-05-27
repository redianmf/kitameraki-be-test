import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { dbClient } from "../database";

export async function GetTask(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const taskId = request.query.get("id");
  const organizationId = request.query.get("organizationId");

  const task = await dbClient
    .database("TaskApp")
    .container("Tasks")
    .item(taskId, organizationId)
    .read();

  return { jsonBody: task.resource, status: 200 };
}

app.http("GetTask", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: GetTask,
});
