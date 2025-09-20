import express from "express";
import cookieParser from "cookie-parser";
import coursesRoutes from "./routes/route";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
}); */
app.use("/api/courses", coursesRoutes);

export default app;
