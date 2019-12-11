
const fs = require("fs");
const path = require("path");
const express = require("express");
const db = require("./db/db.json");


const dbRead = JSON.parse(fs.readFileSync(path.join(__dirname, "/db/db.json"),(err, data)=>{
   if (err) throw err;
}));

const dbWrite = dbRead => {
   let filtered = dbRead.filter(function(el) {
      return el != null;
   });
   fs.writeFileSync(path.join(__dirname, "/db/db.json"),
   JSON.stringify(filtered),
   err => {
      if (err) throw err;
   })
   }


const app = express();
const PORT = process.env.PORT || 3000


// express data
app.use(express.urlencoded({extended: true}));
app.use(express.json());



//html get requests 
app.get("/assets/css/styles.css", function(req,res) {
   res.sendFile(path.join(__dirname, "/public/assets/css/styles.css"))
});

app.get("/assets/js/index.js", function(req,res){
   res.sendFile(path.join(__dirname, "/public/assets/js/index.js"));
});

app.get("/", function(req,res){
   res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req,res){
   res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req,res){
   return res.json(dbRead);
});

// api post and delete
let x = 1;
app.post("/api/notes", function(req,res){
   var newNote = req.body;
   newNote.id = x;
   x++;
   dbRead.push(newNote);
   dbWrite(dbRead);
   
   return res.json(dbRead);
});

app.delete("/api/notes/:id", (req,res)=> {
   let id = req.params.id;
   delete dbRead[id - 1];
   dbWrite(dbRead);
   res.send(dbRead);
})


// server
app.listen(PORT, function() {
   console.log("App listening on PORT: " + PORT)
})