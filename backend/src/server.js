const app = require("./app");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const { errorHandler } = require("./middleware/errorMiddleware");

const PORT = process.env.PORT || 5001;

mongoose.set("strictQuery", true);

app.use(helmet());
app.use(mongoSanitize());

connectDB();

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
