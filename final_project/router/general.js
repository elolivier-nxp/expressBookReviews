const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbnToFind = req.params.isbn
  for (const book in books) {
    if (books[book]['isbn'] === isbnToFind) {
      return res.status(200).json(books[book])  
    }
  }
  return res.status(404).json({message: `Book with ISBN ${isbnToFind} not found`});
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorToFilter = req.params.author
  let booksOfAuthor = []
  for (const book in books) {
    if (books[book]['author'] === authorToFilter) {
      booksOfAuthor.push(books[book])
    }
  }
  return res.status(200).json(booksOfAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleToFind = req.params.title
  for (const book in books) {
    if (books[book]['title'] === titleToFind) {
      return res.status(200).json(books[book])  
    }
  }
  return res.status(404).json({message: `Book with title ${titleToFind} not found`});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbnToFind = req.params.isbn
    for (const book in books) {
      if (books[book]['isbn'] === isbnToFind) {
        return res.status(200).json({"reviews": books[book]['reviews']})  
      }
    }
    return res.status(404).json({message: `Book with ISBN ${isbnToFind} not found`});
});

module.exports.general = public_users;
