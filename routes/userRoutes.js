import express from "express";
import User from "../models/User.js";
import Book from "../models/Book.js";

const router = express.Router();

// Create a new user
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Get a specific user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Update a user
router.patch("/:id", async (req, res) => {
  try {
    const updatedUser = await User.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.deleteOne({ _id: req.params.id });
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Borrow a book
router.patch("/borrow/:userId/:bookId", async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book.isAvailable) {
      return res
        .status(400)
        .json({ message: "Book is not available for borrowing." });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $push: { borrowedBooks: req.params.bookId } },
      { new: true }
    );

    book.isAvailable = false;
    await book.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Return a book
router.patch("/return/:userId/:bookId", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { borrowedBooks: req.params.bookId } },
      { new: true }
    );

    const book = await Book.findByIdAndUpdate(
      req.params.bookId,
      { isAvailable: true },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

export default router;
