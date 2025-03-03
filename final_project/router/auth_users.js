const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
// regd_users.post("/login", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });
const session = require('express-session'); // 确保 express-session 可用

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body; // 获取 username 和 password
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // 在 users 数组中查找匹配的用户
    const user = users.find(user => user.username === username && user.password === password);
    
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // 生成 JWT Token
    let accessToken = jwt.sign({ username: username }, "secret_key", { expiresIn: "1h" });

    // 将 token 存入 session
    req.session.authorization = {
        accessToken
    };

    return res.status(200).json({ message: "Login successful", accessToken: accessToken });
});

// Add a book review
// regd_users.put("/auth/review/:isbn", (req, res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewText = req.body.review;
  const username = req.session.authorization?.username;

  if (!username) {
      return res.status(401).json({ message: "Unauthorized: Please login to post a review" });
  }

  if (!reviewText) {
      return res.status(400).json({ message: "Review content is required" });
  }

  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  // 确保 `res.json()` 被调用
  books[isbn].reviews[username] = reviewText;
  return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

//delete
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // 获取 URL 参数 ISBN
  const username = req.session.authorization?.username; // 获取会话中的用户名

  // 检查用户是否已登录
  if (!username) {
      return res.status(401).json({ message: "Unauthorized: Please login to delete a review" });
  }

  // 确保书籍存在
  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  // 获取书籍的所有评论
  let bookReviews = books[isbn].reviews;

  // 检查当前用户是否发表过评论
  if (!bookReviews[username]) {
      return res.status(404).json({ message: "No review found from this user" });
  }

  // 删除该用户的评论
  delete bookReviews[username];

  return res.status(200).json({ message: "Review deleted successfully", reviews: bookReviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
