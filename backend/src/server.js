const app = require("./app");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const helmet = require("helmet");

const rateLimit = require("express-rate-limit");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const { errorHandler } = require("./middleware/errorMiddleware");

const PORT = process.env.PORT || 5001;

mongoose.set("strictQuery", true);

app.use(helmet());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    data: null,
    error: "Too many requests, please try again later."
  }
});

app.use(limiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

connectDB();

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
