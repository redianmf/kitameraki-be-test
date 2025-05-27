import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { dbClient } from "../database";

export async function InsertTask(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const body = await request.json();

  const createdTask = await dbClient
    .database("TaskApp")
    .container("Tasks")
    .items.create(body);

  return { jsonBody: createdTask.resource, status: 200 };
}

app.http("InsertTask", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: InsertTask,
});
