const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const ObjectId = require("mongodb").ObjectID;
require('dotenv').config()
const port = process.env.PORT || 5000

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m8cui.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const blogCollection = client.db(`${process.env.DB_USER}`).collection("blogs");



  // perform actions on the collection object

  app.post('/addBlog', (req, res)=>{
    const file = req.files.file;
    const title = req.body.title;
    const content= req.body.content;
    const newImg = file.data;
    const encImg = newImg.toString('base64');
    console.log(title);

    var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };

    blogCollection.insertOne({ title, content, image })
    .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
  })


  app.get('/blogs', (req, res) => {
    blogCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  });


  
  app.delete("/deleteBlog/:id", (req, res) => {
    blogCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        // console.log(result.deletedCount)
        res.send(result.deletedCount > 0);

      })
  })

// ***
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})