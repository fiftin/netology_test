const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()


app.use(jsonParser);

app.get('/books', async (req, res) => {
  db.all("SELECT id, title, author from books", (err, rows) => {
    if (err) {
      res.status(500).send();
      return;
    }
    res.json(rows);
  });
});

app.get('/books/:id', (req, res) => {
  db.get("SELECT id, title, author from books WHERE id = ?", req.params.id, (err, row) => {
    if (err) {
      res.status(404).send();
      return;
    }
    res.json(row);
  });
});

app.post('/books', function (req, res) {
  console.log(req.body);
  
  db.run('INSERT INTO books (title, author) VALUES (?, ?)', req.body.title, req.body.author, (err) => {
    if (err) {
      res.status(400).send();
      return;
    }
    res.status(204).send();
  });
});

app.put('/books/:id', function (req, res) {
  db.run('UPDATE books SET title = ?, author = ? WHERE id = ?', req.body.title, req.body.author, req.params.id, (err) => {
    if (err) {
      res.status(404).send();
      return;
    }
    res.status(204).send();
  });
});


app.listen(8000, () => {
  console.log(`Example app listening at http://localhost:8000`);
  db.run('CREATE TABLE books(id integer primary key autoincrement, title varchar(100), author varchar(100))', () => {
    db.run('INSERT INTO books (title, author) VALUES ("Captain\'s daughter", "A. S. Pushkin")');
  });
});
