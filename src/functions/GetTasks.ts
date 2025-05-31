import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { dbClient } from "../database";

export async function GetTasks(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    context.log(`Http function processed request for url "${request.url}"`);
    const organizationId = request.query.get("organizationId");
    const search = request.query.get("search");
    const status = request.query.get("status");

    let query = `
    SELECT DISTINCT c.id, c.organizationId, c.properties
    FROM c
    JOIN p1 IN c.properties
  `;

    const conditions = [`c.organizationId = @organizationId`];
    const queryParams: any[] = [
      { name: "@organizationId", value: organizationId },
    ];

    if (search) {
      query += `JOIN t IN c.properties `;
      conditions.push(
        `t.name = "title" AND CONTAINS(LOWER(t['value']), LOWER(@title))`
      );
      queryParams.push({ name: "@title", value: search });
    }

    if (status) {
      query += `JOIN s IN c.properties `;
      conditions.push(
        `s.name = "status" AND LOWER(s['value']) = LOWER(@status)`
      );
      queryParams.push({ name: "@status", value: status });
    }

    query += `WHERE ${conditions.join(" AND ")}`;

    const task = await dbClient
      .database("TaskApp")
      .container("Tasks")
      .items.query({ query, parameters: queryParams })
      .fetchNext();

    return { jsonBody: task.resources, status: 200 };
  } catch (error) {
    context.log(`Error GetTasks: ${error}`);
    return { jsonBody: "Internal Server Error", status: 500 };
  }
}

app.http("GetTasks", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: GetTasks,
});
