import express from "express";
import User from "../models/User.js";
import Book from "../models/Book.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *         role:
 *           type: string
 *           description: The role of the user (Admin or User)
 *         borrowedBooks:
 *           type: array
 *           items:
 *             type: string
 *           description: The books borrowed by the user
 *       example:
 *         name: John Doe
 *         role: User
 *         borrowedBooks: []
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Creates a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns a list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Returns a specific user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Updates a user by the id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Removes the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user was deleted
 *       500:
 *         description: Some server error
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.deleteOne({ _id: req.params.id });
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

/**
 * @swagger
 * /users/borrow/{userId}/{bookId}:
 *   patch:
 *     summary: User borrows a book by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book was borrowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: The book is not available
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /users/return/{userId}/{bookId}:
 *   patch:
 *     summary: User returns a book by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book was returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
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
