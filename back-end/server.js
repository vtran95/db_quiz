const express = require("express");
const mysql = require('mysql');
const app = express();

app.set('view options', {layout: false});
app.use(express.static('front-end'));
app.use(express.json());

const con = mysql.createPool( {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

app.get("/", (req, res) => {
    res.render("index.html");
})

app.get("/questions", (req, res) => {
    // Create table
    const createTableQuery = "CREATE TABLE IF NOT EXISTS Questions (id INT AUTO_INCREMENT, body VARCHAR(255), answer VARCHAR(255), optiona VARCHAR(255), optionb VARCHAR(255), optionc VARCHAR(255), optiond VARCHAR(255), PRIMARY KEY (id))";
    con.query(createTableQuery, (err, result) => {
        if (err) throw err;
        con.query("SELECT * FROM Questions", (err, result) => {
            res.send(result);
        })
    })
})

app.post("/questions", (req, res) => {
    con.query("INSERT INTO Questions (body,answer,optiona,optionb,optionc,optiond) VALUES ('" + req.body.body + "','" + req.body.answer + "','" + req.body.optiona + "','" +  req.body.optionb + "','" + req.body.optionc + "','" + req.body.optiond +"')", (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

app.put("/questions/:id", (req, res) => {
    con.query("UPDATE Questions SET body = '" + req.body.body + "', answer = '" + req.body.answer + "', optiona = '" + req.body.optiona + "', optionb = '" +  req.body.optionb + "', optionc = '" + req.body.optionc + "', optiond = '" + req.body.optiond +"' WHERE id = " + req.params.id, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

app.listen(process.env.PORT || 5000, (err) => {
    if (err) throw err;
    console.log("Listening on port 5000");
} );