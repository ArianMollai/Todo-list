import express from "express";
import cookieParser from "cookie-parser";
//import coursesRoutes from "./routes/route";
import userRoutes from "./routes/users/user_route";
import courseRoutes from "./routes/courses/courses_router";
import registerRoutes from "./routes/registers/registers_router";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const app = express();
//const baseSpec = YAML.load(path.join(__dirname, "../swagger.yaml"));
const swaggerDir = path.resolve(process.cwd(), "swagger");

const baseUser = YAML.load(path.join(swaggerDir, "users/users.yaml"));
const baseCourse = YAML.load(path.join(swaggerDir, "courses/courses.yaml"));
const baseRegister = YAML.load(
  path.join(swaggerDir, "registers/register.yaml")
);

const mergedSpec = {
  ...baseUser,
  paths: {
    ...baseUser.paths,
    ...baseCourse.paths,
    ...baseRegister.paths,
  },
  components: {
    ...baseUser.components,
    ...baseCourse.components,
    ...baseRegister.components,
  },
};

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api-courses", swaggerUi.serve, swaggerUi.setup(mergedSpec));
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/registers", registerRoutes);

export default app;
