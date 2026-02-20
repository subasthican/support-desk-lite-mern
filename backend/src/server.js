const app = require("./app");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const { errorHandler } = require("./middleware/errorMiddleware");

const PORT = process.env.PORT || 5001;

mongoose.set("strictQuery", true);

connectDB();

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
