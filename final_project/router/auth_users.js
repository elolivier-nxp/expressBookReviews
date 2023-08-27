const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  return validusers.length > 0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 });

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbnToFind = req.params.isbn
  const review = req.query.review
  for (const book in books) {
    if (books[book]['isbn'] === isbnToFind) {
      const reviews = books[book]['reviews']
      reviews[req.session.authorization.username] = review
      return res.status(200).json(`Review saved`)  
    }
  }
  return res.status(404).json({message: `Book with ISBN ${isbnToFind} not found`});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbnToFind = req.params.isbn
  for (const book in books) {
    if (books[book]['isbn'] === isbnToFind) {
      const reviews = books[book]['reviews']
      delete reviews[req.session.authorization.username]
      return res.status(200).json(`Review deleted`)  
    }
  }
  return res.status(404).json({message: `Book with ISBN ${isbnToFind} not found`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
