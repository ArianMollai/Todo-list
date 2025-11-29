import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import userRoutes from './routes/users/user_route';
import courseRoutes from './routes/courses/courses_router';
import registerRoutes from './routes/registers/registers_router';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { errorHandller } from './middlewares/errorhandller';

const app = express();
//const baseSpec = YAML.load(path.join(__dirname, "../swagger.yaml"));
const swaggerDir = path.resolve(process.cwd(), 'swagger');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, try again later',
});

const baseUser = YAML.load(path.join(swaggerDir, 'users/users.yaml'));
const baseCourse = YAML.load(path.join(swaggerDir, 'courses/courses.yaml'));
const baseRegister = YAML.load(
  path.join(swaggerDir, 'registers/register.yaml'),
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
app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(limiter);

if (process.env.NODE_ENV !== 'test') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(mergedSpec));
}
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/registers', registerRoutes);

app.use(errorHandller);

export default app;
