import swaggerJSDoc from "swagger-jsdoc";
import { version } from "../../package.json";
// Import scalars to make sure they are processed
import "./scalars";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sayenly API Documentation",
      version,
      description: "Documentation for Sayenly Backend API",
      contact: {
        name: "Sayenly Support",
        email: "support@sayenly.com",
      },
    },
    servers: [
      {
        url: "/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "Authentication and user management endpoints",
      },
      {
        name: "User",
        description: "User management endpoints",
      },
      {
        name: "Project",
        description: "Project management endpoints",
      },
      {
        name: "Service",
        description: "Service management endpoints",
      },
      {
        name: "Area",
        description: "Area management endpoints",
      },
      {
        name: "FAQ",
        description: "FAQ management endpoints",
      },
      {
        name: "Company",
        description: "Company management endpoints",
      },
      {
        name: "Booking",
        description: "Booking management endpoints",
      },
      {
        name: "Order",
        description: "Order management endpoints",
      },
      {
        name: "Notification",
        description: "Notification management endpoints",
      },
      {
        name: "Review",
        description: "Review management endpoints",
      },
    ],
  },
  apis: [
    "./src/utils/scalars.ts",
    "./src/routes/*.ts",
    "./src/controllers/*.ts",
    "./src/services/**/*.ts",
    "./src/prisma/schema.prisma",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
