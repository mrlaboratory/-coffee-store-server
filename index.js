const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000


// middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1oul49i.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const coffeCollection = client.db("coffesDB");
        const collection = coffeCollection.collection("coffe");

        app.get('/coffe', async (req, res) => {
            const  cursor  = await collection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const  query  = {_id : new ObjectId(id)}
            const result = await collection.findOne(query)
            res.send(result)
        })

        app.post('/coffes', async (req, res) => {
            const newcoffe = req.body
            console.log(newcoffe)
            const result = await collection.insertOne(newcoffe)
            res.send(result)
        })

        app.put('/coffee/:id',async (req,res)=> {
            const id = req.params.id 
            const query = {_id : new ObjectId(id)}
            const options = {upsert:true}
            const coffee = req.body 
            const updateCoffee = {
                $set: {
                    name:coffee.name, 
                    quantity:coffee.quantity, 
                    supplier:coffee.supplier, 
                    taste:coffee.taste, 
                    category:coffee.category,
                    details:coffee.details, 
                    photo:coffee.photo
                }
            }
            const result = await collection.updateOne(query,updateCoffee,options)
            res.send(result)
        })

        app.delete('/coffe/:id',async(req,res)=> {
            const id = req.params.id
            const query = {_id : new ObjectId(id)}
            // const options = {}
            const result = await collection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('coffe server is running')
})

app.listen(port, () => {
    console.log('coffe server is runnning on ' + port)
})