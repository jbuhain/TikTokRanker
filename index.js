'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');


/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}


/* start of code run on start-up */
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/compare.html");
});

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());

// picks two distict random videos (that is, not the same), and send an array containing their VideoTable data in the HTTP response.
app.get("/getTwoVideos", async function(req, res) {
  console.log("Picking Two Random Videos.");
  try {
    let pair = await db.all("SELECT * FROM VideoTable ORDER BY RANDOM() LIMIT 2");
    // For Debugging 
    // console.log(pair);
    // console.log(pair[0].rowIdNum);
    res.send(pair)
  } catch(err) {
    res.status(500).send(err);
  }
  // next(); is this necessary? 
});

app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
    // change parameter to "true" to get it to computer real winner based on PrefTable 
    // with parameter="false", it uses fake preferences data and gets a random result.
    // winner should contain the rowId of the winning video.
    let winner = await win.computeWinner(8,true);
    let cmd = "SELECT * from VideoTable where rowIdNum = ? "
    let winData = await db.get(cmd, winner);
    console.log(winData);
    res.send(winData); // send back winner data
  } catch(err) {
    res.status(500).send(err);
  }
});

// Step 5 code
// This is where the server receives and responds to POST requests
app.post('/insertPref', async function(req, res, next) {
  let text = req.body;
  // console.log([text.better, text.worse]);
  
  const cmd = "INSERT INTO PrefTable (better,worse) values (?, ?)";
  
  try {
    await db.run(cmd, text.better,text.worse);
    let tbl = await db.all("SELECT * from PrefTable");
    // For Debugging 
    console.log(tbl);
    if(tbl.length < 15) {
      res.send("continue");
    }
    else {
      res.send("pick winner");
    }
  } catch(error) {
    console.log("pref insert error", error);
  }
  
});

// Page not found
app.use(function(req, res){
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

// end of pipeline specification




// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

