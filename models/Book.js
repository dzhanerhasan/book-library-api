import { Schema, model } from "mongoose";

const reviewSchema = Schema({
  reviewer: { type: Schema.Types.ObjectId, ref: "User" },
  review: { type: String },
  rating: { type: Number, min: 1, max: 5 },
});

const BookSchema = Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  publicationDate: { type: Date, required: true },
  isAvailable: { type: Boolean, default: true },
  borrowedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [reviewSchema],
});

export default model("Book", BookSchema);
