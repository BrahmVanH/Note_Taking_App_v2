const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const dbFilePath = path.join(__dirname, '/db/db.json');

const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/notesPage', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});


app.get('/api/notes', function(req, res) {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        
        if (err) {
            return err;
        }
        console.log("You've got data", data)
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', function(req, res) {
    
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if(err) {
            return console.log(err);
        } 
        const randomId = uuidv4();
        noteDb = JSON.parse(data);
        var id = randomId.slice(9, 18);
        var newNote = { title: req.body.title, text: req.body.text, id: id };
        noteDb.push(newNote);
        fs.writeFile(dbFilePath, JSON.stringify(noteDb), function (err, data) {
            if (err) {
                return err;
            }
            console.log(noteDb);
            res.json(noteDb);
        });
    });
});


app.delete('api/notes/:id', function(req, res) {
   
    var id = req.body
    
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if(err) {
            return console.log(err);
        }
        
        noteDb = JSON.parse(data);
        
        const filteredNotes = noteDb.filter((element) => element.id !== id);
        
        fs.writeFileSync(dbFilePath, JSON.stringify(filteredNotes));
    });
})
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})


app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT} 🚀`)
);


