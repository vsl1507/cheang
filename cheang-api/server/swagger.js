import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cheang API Documentation",
      version: "1.0.0",
      description: "API documentation for the Cheang Handyman Platform",
      contact: {
        name: "Support Desk",
        email: "support@cheang.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
          description: "Access token stored in cookies",
        },
      },
    },
  },
  // Scan routes files for doc annotations
  apis: [
    "./server/routes/*.js",
    "./server/routes/v1/**/*.js"
  ],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
