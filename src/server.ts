// src/server.ts
import { AppDataSource } from "./config/data-source";
import app from "./app";

const PORT = process.env.PORT || 4000;

// Paso 1: Conectar a la base de datos
AppDataSource.initialize()
  .then(() => {
    console.log("📦 Conectado a PostgreSQL");
    
    // Paso 2: Iniciar el servidor solo si la conexión es exitosa
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Error al conectar BD", err);
    // Puedes manejar la salida del error aquí
    process.exit(1);
  });