import express, { json } from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

config();

const app = express();
app.use(json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    components: {
      schemas: {}, // This is required, and should be an object
    },
  },
  apis: ["./routes/*.js"], // The paths to your API files
};

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 5000;

connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/users", userRoutes);
app.use("/books", bookRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
