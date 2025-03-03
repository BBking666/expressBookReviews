const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// public_users.post("/register", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });
public_users.post("/register", (req, res) => {
  const { username, password } = req.body; // 获取请求中的 username 和 password

  // 检查是否提供了用户名和密码
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  // 检查用户名是否已存在
  if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
  }

  // 添加新用户
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});



// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });
public_users.get('/', function (req, res) {
  return res.status(200).json({ books: books });
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
//  });
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // 获取 URL 里的 ISBN 参数

  if (books[isbn]) {
      return res.status(200).json(books[isbn]); // 返回该 ISBN 对应的书籍信息
  } else {
      return res.status(404).json({ message: "Book not found" }); // 如果 ISBN 不存在，返回 404
  }
});
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase(); // 获取 URL 里的作者参数并转换为小写
  let matchingBooks = [];

  // 遍历 books 对象，找出匹配的书籍
  Object.values(books).forEach(book => {
      if (book.author.toLowerCase() === author) {
          matchingBooks.push(book);
      }
  });

  // 如果找到书籍，则返回书籍列表，否则返回未找到的消息
  if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
  } else {
      return res.status(404).json({ message: "No books found for this author." });
  }
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });
// 通过书名查询书籍详情
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase(); // 获取 URL 里的书名参数并转换为小写
  let matchingBooks = [];

  // 遍历 books 对象，找到符合条件的书籍
  Object.values(books).forEach(book => {
      if (book.title.toLowerCase() === title) {
          matchingBooks.push(book);
      }
  });

  // 如果找到书籍，则返回书籍详情，否则返回未找到的消息
  if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
  } else {
      return res.status(404).json({ message: "No books found with this title." });
  }
});

//  Get book review
// public_users.get('/review/:isbn',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // 获取 URL 里的 ISBN 参数

  if (books[isbn]) {
      return res.status(200).json({ reviews: books[isbn].reviews }); // 返回书籍评论
  } else {
      return res.status(404).json({ message: "Book not found" }); // 如果 ISBN 不存在，返回 404
  }
});


module.exports.general = public_users;
