import { connectDB } from "./config/db";
import { Server } from "http";
import { envVars } from "./config/env";
import app from "./app";
import { seedAdmin } from "./utils/seedAdmin";

let server: Server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(envVars.PORT, () => {
      console.log(`App listening at port http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
  await seedAdmin();
})();

process.on("unhandledRejection", (err) => {
  console.log(`Unhandled rejection detected... server shutting down...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log(`Uncaught exception detected... server shutting down...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", (err) => {
  console.log(`SIGTERM signal received... server shutting down...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGINT", (err) => {
  console.log(`SIGINT signal received... server shutting down...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
