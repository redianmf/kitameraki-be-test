import { PatchOperation } from "@azure/cosmos";
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { dbClient } from "../database";

type UpdateTaskBody = {
  properties: Array<{
    name: string;
    label: string;
    fieldType: string;
    value: any;
  }>;
};

export async function UpdateTask(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const body = (await request.json()) as UpdateTaskBody;
  const taskId = request.query.get("id");
  const organizationId = request.query.get("organizationId");

  const patchRequest: PatchOperation[] = [
    {
      op: "replace",
      path: "/properties",
      value: body.properties,
    },
  ];

  const createdTask = await dbClient
    .database("TaskApp")
    .container("Tasks")
    .item(taskId, organizationId)
    .patch(patchRequest);

  return { jsonBody: createdTask.resource, status: 200 };
}

app.http("UpdateTask", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: UpdateTask,
});
