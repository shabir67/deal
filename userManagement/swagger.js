const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./app/routes/userManagementRoutes"];

swaggerAutogen(outputFile, endpointsFiles);
