import express from "express";
import Book from "../models/Book.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminAction:
 *       type: object
 *       required:
 *         - userId
 *         - book
 *       properties:
 *         userId:
 *           type: string
 *         book:
 *           $ref: '#/components/schemas/Book'
 *       example:
 *         userId: "6479cd9ccea758621a9ec93a"
 *         book:
 *           title: "Harry Potter"
 *           author: "JK Rowling"
 *           genre: "Fiction"
 *           publicationDate: "2023-05-31"
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - genre
 *         - publicationDate
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the book
 *         author:
 *           type: string
 *           description: The author of the book
 *         genre:
 *           type: string
 *           description: The genre of the book
 *         publicationDate:
 *           type: string
 *           format: date
 *           description: The publication date of the book
 *         isAvailable:
 *           type: boolean
 *           description: Is the book available for borrowing
 *         borrowedBy:
 *           type: string
 *           description: The user who borrowed the book
 *         reviews:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               reviewer:
 *                 type: string
 *               review:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *       example:
 *         title: "Harry Potter"
 *         author: "JK Rowling"
 *         genre: "Fiction"
 *         publicationDate: "2023-05-31"
 *     Review:
 *       type: object
 *       required:
 *         - userId
 *         - rating
 *         - text
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user adding the review
 *         rating:
 *           type: number
 *           description: The rating for the book
 *         text:
 *           type: string
 *           description: The review text
 *       example:
 *         userId: "6479cd9ccea758621a9ec93a"
 *         rating: 4
 *         text: "Great book!"
 */

/**
 * @swagger
 * /books/admin/add:
 *   post:
 *     summary: Creates a new book (admin only)
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminAction'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */
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
    console.log(err);
  }
});

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Returns a list of all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().populate("reviews.reviewer", "name");
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Gets the book with the specified ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     responses:
 *       200:
 *         description: The book data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 *       500:
 *         description: Some server error
 */
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "reviews.reviewer",
      "name"
    );
    if (!book) return res.status(404).json({ message: "Not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

/**
 * @swagger
 * /books/admin/update/{id}:
 *   put:
 *     summary: Update a book (admin only)
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminAction'
 *     responses:
 *       200:
 *         description: The book was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: The book was not found
 *       500:
 *         description: Some server error
 */
router.put("/admin/update/:id", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body.book,
      { new: true }
    );
    if (!updatedBook) return res.status(404).json({ message: "Not found" });
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

/**
 * @swagger
 * /books/admin/delete/{id}:
 *   delete:
 *     summary: Deletes a book (admin only)
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The user ID
 *             example:
 *               userId: "6479cd9ccea758621a9ec93a"
 *     responses:
 *       200:
 *         description: The book was successfully deleted
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: The book was not found
 *       500:
 *         description: Some server error
 */
router.delete("/admin/delete/:id", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

/**
 * @swagger
 * /books/review/{id}:
 *   post:
 *     summary: Add a review to a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: The review was successfully added
 *       404:
 *         description: The book was not found
 *       500:
 *         description: Some server error
 */
router.post("/review/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Not found" });
    const review = {
      reviewer: req.body.userId,
      rating: req.body.rating,
      text: req.body.text,
    };
    book.reviews.push(review);
    await book.save();
    res.json({ message: "Review added" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

export default router;
