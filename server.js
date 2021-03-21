const express = require("express");
const mysql = require('mysql');
let url = require('url');
const http = require('http');
const app = express();

const con = mysql.createPool( {
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'bbf35e71cb4bbe',
    password: '1104f7eb',
    database: 'heroku_f63bd1f2c0630dc'
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

app.get("/questions", (req, res) => {
    con.query("SELECT * FROM Question", (err, result) => {
        res.send(result);
    })
})

let server = http.createServer(function(req, res) {
    console.log("server start");
    // res.writeHead(200, {
    //     "Content-Type": "text/html",
    //     "Access-Control-Allow-Origin": "*"
    // });
    con.getConnection(err => {
            if (err) handleDisconnect();
            console.log("connected");
            //Create table
        //     const createTableQuery = "CREATE TABLE IF NOT EXISTS score (id INT AUTO_INCREMENT, name VARCHAR(255), score INT, PRIMARY KEY (id))";
        //     con.query(createTableQuery, (err, result) => {
        //         if (err) handleDisconnect();
        //         console.log('Table created');
        //     })

        // const selectQuery = "SELECT * FROM score";
        //     con.query(selectQuery, (err, result) => {
        //         if (err) handleDisconnect();
        //         console.log('Select query');
        //         console.log(result);
        //     })

        const q = url.parse(req.url, true);
        const pathname = q.pathname;
        const isRead = pathname.includes("/readDB");
        const isWrite = pathname.includes("/writeDB");
        console.log("q: ");
        console.log(q);
        console.log("pathname: " + pathname);
        
        if (isWrite) {
            console.log("is write");
            res.writeHead(200, {
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*"
            });
            const name = q.query.name;
            const score = q.query.score;
            const writeQuery = "INSERT INTO score (name, score) VALUES('" + name + "','" + score + "')";
            con.query(writeQuery, (err, result) => {
                if (err) handleDisconnect();
                console.log('Data inserted');
                console.log(result);
                res.end(name + ": " + score + "has been inserted into the database.");
                // con.end();
            });
        } else if (isRead) {
            console.log("is read");
            res.writeHead(200, {
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*"
            });
            const readQuery = "SELECT * FROM score";
            con.query(readQuery, (err, result) => {
                if (err) handleDisconnect();
                console.log('Data retrieved');
                // console.log(result);
                console.log(JSON.stringify(result));
                res.end(JSON.stringify(result));
                // con.end();
            });
        } else {
            res.writeHead(200, {
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*"
            });
            res.end();
            // con.end();
        }
    });   
})

server.listen(process.env.PORT || 5000);