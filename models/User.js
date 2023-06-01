// User.js
import { Schema, model } from "mongoose";

const UserSchema = Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ["Admin", "User"], default: "User" },
  borrowedBooks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

export default model("User", UserSchema);
