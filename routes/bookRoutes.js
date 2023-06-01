import express from "express";
import Book from "../models/Book.js";
import User from "../models/User.js";

const router = express.Router();

// Create a new book (admin only)
router.post("/admin/add", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const newBook = new Book(req.body.book);
    const savedBook = await newBook.save();
    res.json(savedBook);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().populate("reviews.reviewer", "name");
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Get a specific book
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "reviews.reviewer",
      "name"
    );
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Update a book (admin only)
router.patch("/admin/update/:userId/:bookId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updatedBook = await Book.updateOne(
      { _id: req.params.bookId },
      { $set: req.body }
    );
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Delete a book (admin only)
router.delete("/admin/delete/:userId/:bookId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const deletedBook = await Book.deleteOne({ _id: req.params.bookId });
    res.json(deletedBook);
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
});

// Add a review to a book
router.patch("/review/:bookId/:userId", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.bookId,
      { $push: { reviews: { reviewer: req.params.userId, ...req.body } } },
      { new: true }
    );
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

export default router;
