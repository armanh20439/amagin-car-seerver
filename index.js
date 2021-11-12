const express = require('express');

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
        
        // post api 
        app.post('/product',async(req,res)=>{
          const service=req.body
            console.log('hit the post api',service)
            
            const result = await productCollections.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // get api 
        app.get('/products',async(req,res)=>{
          const cursor =productCollections.find({})
          const products=await cursor.toArray()
          console.log(products)
          res.send(products)
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