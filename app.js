// app.js  (step 1)

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: false }));

app.get('/post', (req, res) => {
  res.send(`
    <form action="/post" method="POST">
      <input type="text" name="testo" />
      <button type="submit">Invia</button>
    </form>
  `);
});

app.post('/post', (req, res) => {
  const filePath = path.join(__dirname, 'post.json');
  let dati = [];

  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf8');
    if (raw.trim() !== '') dati = JSON.parse(raw);
  }

  dati.push({ testo: req.body.testo || '' });

  fs.writeFileSync(filePath, JSON.stringify(dati, null, 2));
  res.redirect('/post');
});

app.listen(3000, () => {
  console.log('Server attivo su http://localhost:3000/post');
});
