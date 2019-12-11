const fs = require("fs");
const path = require("path");
const db = require("./db/db.json");
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

const dbData = JSON.parse(fs.readFileSync(path.join(__dirname, "/db/db.json"),(err, data)=>{
    if (err) throw err;
 }));

const dbWrite = dbData => {
        fs.writeFileSync(path.join(__dirname, "/db/db.json"),
        JSON.stringify(dbData),
        err => {
           if (err) throw err;
        })}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/assets/css/styles.css", function(req,res) {
    res.sendFile(path.join(__dirname, "/public/assets/css/styles.css"))
 });

app.get("/assets/js/index.js", function(req,res){
    res.sendFile(path.join(__dirname, "/public/assets/js/index.js"));
 });


app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "public/index.html"))
});

app.get("/notes", function(req,res){
    res.sendFile(path.join(__dirname, "/public/notes.html"));
 });

 app.get("/api/notes", function(req,res){
    return res.json(dbData);
 })

app.post("/api/notes", function(req, res){
    let note = req.body;
    let id = dbData.length;
    note.id = id + 1;
    dbData.push(note);
    dbWrite(dbData);
    return res.json(dbData);
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    var int = 1;
    dbData.splice(`${id - 1}`, 1);
    for(var i = 0; i < dbData.length; i++){
        dbData[i].id = int;
        int = int + 1;
    }
    dbWrite(dbData);
    res.send(dbData);
});


app.listen(port, function(){
    console.log("http://localhost:"+port);
});