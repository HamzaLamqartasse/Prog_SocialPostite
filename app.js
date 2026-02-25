const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();

// 1. SETTINGS BASE
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads')); // Serve per vedere le foto

// 2. CONFIGURAZIONE UPLOAD (Semplice)
const upload = multer({ dest: 'uploads/' }); 

// Creiamo la cartella uploads se non esiste (così non dà errore)
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// 3. ROTTA PRINCIPALE (Form + Gallery)
app.get('/post', (req, res) => {
    let posts = [];
    if (fs.existsSync('post.json')) {
        const datiRaw = fs.readFileSync('post.json', 'utf8');
        if (datiRaw) posts = JSON.parse(datiRaw);
    }
    res.render('index', { posts: posts });
});

// 4. SALVATAGGIO DATI
app.post('/post', upload.single('immagine'), (req, res) => {
    let posts = [];
    
    // Leggi file
    if (fs.existsSync('post.json')) {
        const datiRaw = fs.readFileSync('post.json', 'utf8');
        if (datiRaw) posts = JSON.parse(datiRaw);
    }

    // Crea oggetto post
    const nuovoPost = {
        id: Date.now(),
        titolo: req.body.testo,
        descrizione: req.body.descrizione,
        info: req.body.info,
        immagine: req.file ? '/uploads/' + req.file.filename : null
    };

    // Aggiungi e salva
    posts.push(nuovoPost);
    fs.writeFileSync('post.json', JSON.stringify(posts, null, 2));
    
    res.redirect('/post');
});

// 5. DETTAGLIO
app.get('/post/:id', (req, res) => {
    const datiRaw = fs.readFileSync('post.json', 'utf8');
    const posts = JSON.parse(datiRaw);
    const post = posts.find(p => p.id == req.params.id);
    res.render('detail', { post: post });
});

app.listen(3000, () => console.log('Vai su http://localhost:3000/post'));