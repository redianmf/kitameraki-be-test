import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { v4 as UUIDv4 } from "uuid";
import { dbClient } from "../database";

export async function InsertTask(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const body = await request.json();

  if (!body) return { status: 400 };
  const payload = { ...(body as object), id: UUIDv4() };

  console.log(payload);

  const createdTask = await dbClient
    .database("TaskApp")
    .container("Tasks")
    .items.create(payload);

  return { jsonBody: createdTask.resource, status: 200 };
}

app.http("InsertTask", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: InsertTask,
});
