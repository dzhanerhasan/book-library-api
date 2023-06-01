import express, { json } from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

config();

const app = express();
app.use(json());

const PORT = process.env.PORT || 5000;

connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define routes
app.use("/users", userRoutes);
app.use("/books", bookRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
