// show dbs // show all Database
// use db_name // use data base

//  CRUD Operation
//  C- Creation
//  R- Read 
//  U- Update 
//  D- Delete

const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const { connectToDb, getDb} = require('./db');


const app = express();
const port = 4000;

app.use(express.json());

// Replace the uri string with your connection string.
const uri = "mongodb+srv://rahul:PAVANk651@cluster0.rsqjuur.mongodb.net/";

const client = new MongoClient(uri);

async function run(res, items) {
  try {
    const menu = db.collection('menu');
    const order = [];

    let finddata = await menu.find().skip(items);
    for await(const data of finddata) {
      console.log(data);
      order.push(data);
    }
    res.send(order);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

let db;

connectToDb( (err) => {
  if(!err) {
      app.listen(port, ()=> {console.log("connect to db");
    })
  db=getDb();
  } else {
    console.log("is not working:",err);
  }
})

app.get('/',(req, res)=> {
    console.log("hello bro");
    menu_page = req.query.p || 0;
    const itemPerPage = 2
    run(res, menu_page * itemPerPage);
  
})

app.post("/add", (req, res) => {
  console.log(req.body);
  let item = req.body;
  const menu = db.collection('menu');
  menu.insertOne(item)
      .then(result => {
        res.status(201).json(result);
      })
      .catch( err => {
        res.status(500).json( {err: "Could not create new document"})
      });
    // res.send("Got post request!");
    
})

app.delete("/menu/:id", (req, res)=> {

    let item = req.body;
    const menu = db.collection('menu');
    if(ObjectId.isValid(req.params.id)) {
    menu.deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
          console.log(result);
          res.status(200).send("Got delete request from Menu!");
        })
        .catch( err => {
          console.log("not find ", err);
          res.status(500).json({err: "not find id"})
        })
    }
    else {
      console.log("id is not valid");
      res.status(500).json({err: "id is not valid"})
    }
})

app.put("/user", (req, res)=>{
    res.send("Got Put request from /user");
})

app.patch('/menu/:id', (req, res) => {
  const updates = req.body;
  const menu = db.collection('menu');
  if(ObjectId.isValid(req.params.id)) {
  menu.updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
      .then(result => {
        console.log(result);
        res.status(200).send("Got update request from Menu!");
      })
      .catch( err => {
        console.log("not find ", err);
        res.status(500).json({err: "not find id"})
      })
  }
  else {
    console.log("id is not valid");
    res.status(500).json({err: "id is not valid"})
  }
})