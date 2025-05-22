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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    return res.json(books[isbn]);
  }
  return res.status(404).json({message: "Book not found"});
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.entries(books)
    .filter(([_, book]) => book.author.toLowerCase() === author.toLowerCase())
    .reduce((acc, [isbn, book]) => {
      acc[isbn] = book;
      return acc;
    }, {});

  if (Object.keys(booksByAuthor).length > 0) {
    return res.json(booksByAuthor);
  }
  return res.status(404).json({message: "No books found for this author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.entries(books)
    .filter(([_, book]) => book.title.toLowerCase().includes(title.toLowerCase()))
    .reduce((acc, [isbn, book]) => {
      acc[isbn] = book;
      return acc;
    }, {});

  if (Object.keys(booksByTitle).length > 0) {
    return res.json(booksByTitle);
  }
  return res.status(404).json({message: "No books found with this title"});
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    return res.json(books[isbn].reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
