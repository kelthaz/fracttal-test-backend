import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import swaggerSpec from "./config/swagger";
import swaggerUi from "swagger-ui-express";

import { AppDataSource } from "./config/data-source"; // lo harás en el paso 3
import routes from "./interfaces/routes"; // aquí importarás el router

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
}));

// Servir la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use("/", routes);

export default app;
