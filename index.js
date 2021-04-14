const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k1ugo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const ObjectId = require('mongodb').ObjectId;

app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db(`${process.env.DB_NAME}`).collection("products");
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection("orders");

    app.post('/addProduct', (req, res)=>{
        const products = req.body
        productsCollection.insertOne(products, (err,result) => {
            res.send({count: result.insertedCount});
        })
    })

    app.post('/addOrder', (req, res)=>{
        const order = req.body
        ordersCollection.insertOne( order, (err,result) => {
            res.send({count: result.insertedCount})
        })
    });
    app.get('/orders', (req,res)=>{
        ordersCollection.find({email: req.query.email})
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })

    app.get('/product/:id', (req, res)=>{
        const id = req.params.id;
        productsCollection.find({_id: ObjectId(id)})
        .toArray((err, documents)=>
        {
            res.send(documents[0])
        })
    })

    app.get('/products', (req, res) =>{
        productsCollection.find({})
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })

    app.delete('/deleteProduct/:id', (req, res)=>{
        const id = req.params.id;
        productsCollection.deleteOne({_id: ObjectId(id)}, (err, result)=>{
            if(!err){
                res.send({count: 1})
            }
        })
    })

  app.get('/', (req, res) => {
    res.send('Welcome')
})
});


app.listen(process.env.PORT || 5000)