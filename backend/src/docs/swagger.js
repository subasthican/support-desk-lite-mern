const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Support Desk Lite API",
      version: "1.0.0",
      description: "Role-based Ticket Management System API"
    },
    servers: [
      {
        url: "http://localhost:5001"
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;