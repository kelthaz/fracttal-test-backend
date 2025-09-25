import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import swaggerSpec from "./infrastructure/config/swagger";
import swaggerUi from "swagger-ui-express";

import routes from "./presentation/routes"; 

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", routes);

export default app;
