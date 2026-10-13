import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { notFound } from "./middlewares/notFound";
import { sendResponse } from "./utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import cookieParser from "cookie-parser";
import { httpMessages } from "./constants/httpMessages";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { v1router } from "./routes";

const app: Application = express();
const allowedOrigins = ["http://localhost:5173"];

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: allowedOrigins }));

app.use("/api/v1", v1router);
// entry point
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: httpMessages.WELCOME_MESSAGE,
    });
  } catch (error) {
    next(error);
  }
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
