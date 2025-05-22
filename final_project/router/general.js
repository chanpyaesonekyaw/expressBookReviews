const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }

  users.push({ username, password });
  return res.status(201).json({message: "User successfully registered"});
});

// Task 10: Get the book list using async/await
public_users.get('/', async function (req, res) {
  try {
    // Simulating an async operation with Promise
    const bookList = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    });
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11: Get book details by ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    // Simulating an async operation with Promise
    const book = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject(new Error("Book not found"));
        }
      }, 1000);
    });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 12: Get book details by author using async/await
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    // Simulating an async operation with Promise
    const booksByAuthor = await new Promise((resolve) => {
      setTimeout(() => {
        const filtered = Object.entries(books)
          .filter(([_, book]) => book.author.toLowerCase() === author.toLowerCase())
          .reduce((acc, [isbn, book]) => {
            acc[isbn] = book;
            return acc;
          }, {});
        resolve(filtered);
      }, 1000);
    });

    if (Object.keys(booksByAuthor).length === 0) {
      throw new Error("No books found for this author");
    }

    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 13: Get book details by title using async/await
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    // Simulating an async operation with Promise
    const booksByTitle = await new Promise((resolve) => {
      setTimeout(() => {
        const filtered = Object.entries(books)
          .filter(([_, book]) => book.title.toLowerCase().includes(title.toLowerCase()))
          .reduce((acc, [isbn, book]) => {
            acc[isbn] = book;
            return acc;
          }, {});
        resolve(filtered);
      }, 1000);
    });

    if (Object.keys(booksByTitle).length === 0) {
      throw new Error("No books found with this title");
    }

    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    return res.json(books[isbn].reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
