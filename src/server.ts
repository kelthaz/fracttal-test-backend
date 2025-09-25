import { AppDataSource } from "./infrastructure/config/data-source";
import app from "./app";

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Conectado a PostgreSQL");
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Error al conectar BD", err);
    process.exit(1);
  });