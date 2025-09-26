import express from "express";
import cookieParser from "cookie-parser";
import coursesRoutes from "./routes/route";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const app = express();
const baseSpec = YAML.load(path.join(__dirname, "../swagger.yaml"));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
}); */
app.use("/api-courses", swaggerUi.serve, swaggerUi.setup(baseSpec));
app.use("/api/courses", coursesRoutes);

export default app;
