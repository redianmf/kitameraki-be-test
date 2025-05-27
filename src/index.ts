import { app } from "@azure/functions";
import { initDB } from "./database";

initDB().catch((e) => {
  console.error(e);
  process.exit(1);
});

app.setup({
  enableHttpStream: true,
});
