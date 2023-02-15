const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/note', function(req, res) {
    fs.readFile(__dirname, '/db/db.json', (err, data) => {
        return res.json((JSON.parse(data)));
    });
});

app.post('/api/note', function(req, res) {
    var newNote = req.body;

    fs.readFile(__dirname, '/db/db.json', (err, data) => {
        var noteDb = JSON.parse(data);
        noteDb.push(newNote);
        fs.writeFile(__dirname, '/db/db.json', JSON.stringify(noteDb));
    });
});


app.delete('api/note/:id', function(req, res) {
    let delReq = req.params;
    let id = delReq.id;

    fs.readFile(__dirname, '/db/db.json', (err, data) => {
         let noteDb = JSON.parse(data);
        
         const filteredNotes = noteDb.filter((element) => element.id !== id);

         fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(filteredNotes));
    });
})


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);


