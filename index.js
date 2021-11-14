const express = require('express');
const ObjectId = require('mongodb').ObjectId;

const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j0bnd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect()
      
        const database =client.db('carHouse')
        const productCollections=database.collection('products')
        const purchaseCollection=database.collection('purchase-item')
        
        // post api 
        app.post('/product',async(req,res)=>{
          const service=req.body
          
            
            const result = await productCollections.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // purchase post
        app.post('/purchase',async(req,res)=>{
          const product=req.body;
          const results=await purchaseCollection.insertOne(product)
          
          res.json(results)
        })
     
        // get api 
        app.get('/products',async(req,res)=>{
          const cursor =productCollections.find({})
          const products=await cursor.toArray()
          
          res.send(products)
        })


         //get with email
         app.get('/order', async (req, res) => {
          const email = req.query.email;
          // const date = new Date(req.query.date).toLocaleDateString();

          const query = { email: email }
          console.log(query)

          const cursor = purchaseCollection.find(query);
          const manageOrder = await cursor.toArray();
          res.json(manageOrder);
      })

        // get all order collection 
        app.get('/allOrders',async(req,res)=>{
          const cursors=purchaseCollection.find({})
          const purchase=await cursors .toArray()
          res.send(purchase)

        })
         // delete api 
         app.get('/allOrders/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const user = await purchaseCollection.findOne(query);
          // console.log('load user with id: ', id);
          res.send(user);
      })
      app.delete('/allOrders/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await purchaseCollection.deleteOne(query);

        console.log('deleting user with id ', result);

        res.json(result);
    })

         


           // get single api 
           app.get('/products/:id',async(req,res)=>{
            const id=req.params.id;
            console.log('geting id',id)
            const query = { _id: ObjectId(id) };
            const product = await productCollections.findOne(query);
            res.json(product);
          })

         

    }
    finally{

    }

}
run().catch(console.dir);








app.get('/', (req, res) => {
  res.send('Hello how are you brother!')
})

app.listen(port, () => {
  console.log(`Example app listening ${port}`)
})