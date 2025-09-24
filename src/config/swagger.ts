import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Lista de Tareas',
      version: '1.0.0',
      description: 'Documentación de la API para el reto técnico de lista de tareas.',
    },
    servers: [
      {
        url: 'http://localhost:4000/api',
      },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        }
    },
    security: [{
        bearerAuth: []
    }]
  },
  apis: ['./src/interfaces/routes/**/*.ts'],// Asegúrate de que esta ruta sea correcta
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;