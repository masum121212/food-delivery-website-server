const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jjyn9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run () {
    try{
        await client.connect();
        const database = client.db('online_Service');
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('orders')


        app.get('/services', async(req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            const count = await cursor.count();
            res.send({
                count,
                services
            });
        })

        app.post('/services/byKeys', async(req, res) =>{
            const keys =req.body;
            const query = {key: {$in: keys}}
            const services = await serviceCollection.find(query).toArray();
            res.json(services);
        })

        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        })

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('emajhon running');
});

app.listen(port, () => {
    console.log('server running')
})