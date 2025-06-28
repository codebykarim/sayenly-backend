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
      description: `
# Sayenly API Documentation

Welcome to the Sayenly API! Sayenly is a comprehensive home services platform that connects customers with trusted service providers across the UAE.

## Features
- **User Management**: Registration, authentication, and profile management
- **Service Discovery**: Browse and search for various home services
- **Project Showcase**: View completed projects and service portfolios  
- **Booking System**: Schedule and manage service appointments
- **Order Management**: Request quotes and manage service orders
- **Review System**: Rate and review service providers
- **Company Profiles**: Manage service provider company information
- **FAQ System**: Access frequently asked questions
- **Notifications**: Real-time updates and communication

## Authentication
Most endpoints require authentication via Bearer tokens. Include your JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your-token>
\`\`\`

## Rate Limiting
API requests are rate-limited to ensure fair usage. Please respect the limits to maintain service quality.

## Support
For API support, documentation issues, or technical assistance, please contact our development team.
      `,
      contact: {
        name: "Sayenly Development Team",
        email: "dev@sayenly.com",
        url: "https://sayenly.com",
      },
      license: {
        name: "Proprietary",
        url: "https://sayenly.com/terms",
      },
      termsOfService: "https://sayenly.com/terms",
    },
    servers: [
      {
        url: "/api",
        description: "Development server (relative paths)",
      },
      {
        url: "https://api.sayenly.com/api",
        description: "Production server",
      },
      {
        url: "https://staging-api.sayenly.com/api",
        description: "Staging server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
      },
      schemas: {
        // Common reusable schemas
        UUID: {
          type: "string",
          format: "uuid",
          description: "A Universally Unique Identifier (UUID) v4",
          example: "123e4567-e89b-12d3-a456-426614174000",
        },
        Email: {
          type: "string",
          format: "email",
          description: "A valid email address",
          example: "user@example.com",
        },
        PhoneNumber: {
          type: "string",
          pattern: "^\\+[1-9]\\d{1,14}$",
          description: "Phone number in E.164 format (country code + number)",
          example: "+971501234567",
        },
        DateTime: {
          type: "string",
          format: "date-time",
          description: "A date-time string in ISO 8601 format",
          example: "2024-01-15T10:30:00.000Z",
        },
        URL: {
          type: "string",
          format: "uri",
          description: "A valid URL",
          example: "https://sayenly.com/image.jpg",
        },
        JSON: {
          type: "object",
          description: "A JSON object with dynamic properties",
          additionalProperties: true,
        },
      },
      responses: {
        BadRequest: {
          description: "Bad Request - Invalid request parameters or body",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  error: {
                    type: "string",
                    example: "Invalid request parameters",
                  },
                  details: {
                    type: "object",
                    description: "Additional error details when available",
                  },
                },
              },
            },
          },
        },
        Unauthorized: {
          description:
            "Unauthorized - Authentication required or invalid token",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  error: {
                    type: "string",
                    example:
                      "Unauthorized access - please provide valid authentication",
                  },
                },
              },
            },
          },
        },
        Forbidden: {
          description: "Forbidden - Insufficient permissions",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  error: {
                    type: "string",
                    example: "Access forbidden - insufficient permissions",
                  },
                },
              },
            },
          },
        },
        NotFound: {
          description: "Not Found - Requested resource does not exist",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  error: {
                    type: "string",
                    example: "Resource not found",
                  },
                },
              },
            },
          },
        },
        ServerError: {
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  error: {
                    type: "string",
                    example: "Internal server error occurred",
                  },
                },
              },
            },
          },
        },
        TooManyRequests: {
          description: "Too Many Requests - Rate limit exceeded",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  error: {
                    type: "string",
                    example: "Rate limit exceeded. Please try again later.",
                  },
                  retryAfter: {
                    type: "integer",
                    description: "Seconds to wait before retrying",
                    example: 60,
                  },
                },
              },
            },
          },
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
        description:
          "User authentication, registration, and account management endpoints. Handle user login, phone verification, and profile updates.",
      },
      {
        name: "User",
        description:
          "User profile management endpoints. Create, read, update, and manage user accounts and preferences.",
      },
      {
        name: "Project",
        description:
          "Project showcase and portfolio management. Browse completed projects, view before/after photos, and project details.",
      },
      {
        name: "Service",
        description:
          "Service catalog and management. Browse available home services, view service details, and manage service offerings.",
      },
      {
        name: "Area",
        description:
          "Geographic area and room management. Define service areas, room types, and location-based categorization.",
      },
      {
        name: "FAQ",
        description:
          "Frequently Asked Questions management. Access help documentation and common queries about Sayenly services.",
      },
      {
        name: "Company",
        description:
          "Service provider company profiles. Manage company information, contact details, and service provider credentials.",
      },
      {
        name: "Booking",
        description:
          "Appointment booking and scheduling system. Create, manage, and track service appointments with confirmed pricing.",
      },
      {
        name: "Order",
        description:
          "Service request and quote management. Submit service requests, receive quotes, and manage order lifecycle.",
      },
      {
        name: "Review",
        description:
          "Customer review and rating system. Submit and manage reviews for completed services and service providers.",
      },
      {
        name: "Notification",
        description:
          "Push notification and alert management. Handle real-time updates, reminders, and system notifications.",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);
export default specs;
