import {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime,
  GraphQLEmailAddress,
  GraphQLJSON,
  GraphQLUUID,
  GraphQLURL,
  GraphQLPhoneNumber,
} from "graphql-scalars";

/**
 * Export GraphQL scalar definitions as reusable types for OpenAPI documentation
 *
 * This allows us to have more precise type definitions in the API documentation
 * rather than just using basic types like string.
 */

// Export scalar types that can be referenced in JSDocs
export const scalarTypes = {
  /**
   * @swagger
   * components:
   *   schemas:
   *     UUID:
   *       type: string
   *       format: uuid
   *       description: A Universally Unique Identifier (UUID) v4
   *       example: "123e4567-e89b-12d3-a456-426614174000"
   */
  UUID: GraphQLUUID,

  /**
   * @swagger
   * components:
   *   schemas:
   *     Email:
   *       type: string
   *       format: email
   *       description: A valid email address
   *       example: "user@example.com"
   */
  Email: GraphQLEmailAddress,

  /**
   * @swagger
   * components:
   *   schemas:
   *     Date:
   *       type: string
   *       format: date
   *       description: A date string in ISO 8601 format (YYYY-MM-DD)
   *       example: "2023-01-23"
   */
  Date: GraphQLDate,

  /**
   * @swagger
   * components:
   *   schemas:
   *     Time:
   *       type: string
   *       format: time
   *       description: A time string in ISO 8601 format (HH:MM:SS)
   *       example: "14:30:00"
   */
  Time: GraphQLTime,

  /**
   * @swagger
   * components:
   *   schemas:
   *     DateTime:
   *       type: string
   *       format: date-time
   *       description: A date-time string in ISO 8601 format
   *       example: "2023-01-23T14:30:00Z"
   */
  DateTime: GraphQLDateTime,

  /**
   * @swagger
   * components:
   *   schemas:
   *     URL:
   *       type: string
   *       format: uri
   *       description: A valid URL
   *       example: "https://example.com/resource"
   */
  URL: GraphQLURL,

  /**
   * @swagger
   * components:
   *   schemas:
   *     JSON:
   *       type: object
   *       description: A JSON object
   *       additionalProperties: true
   *       example: { "key": "value", "nested": { "data": 123 } }
   */
  JSON: GraphQLJSON,

  /**
   * @swagger
   * components:
   *   schemas:
   *     PhoneNumber:
   *       type: string
   *       description: A phone number that complies with E.164 format
   *       pattern: ^\+?[1-9]\d{1,14}$
   *       example: "+12125551212"
   */
  PhoneNumber: GraphQLPhoneNumber,
};
