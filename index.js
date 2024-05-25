const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ak5lvkp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const EventCollection = client.db('eventDB').collection('EventCollection');
        const BookedEventCollection = client.db('eventDB').collection('BookedEventCollection');



        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection

        app.post('/events', async (req, res) => {
            const newEvent = req.body;
            const result = await EventCollection.insertOne(newEvent);
            res.send(result);
        })

        app.post('/bookedEvents', async (req, res) => {
            const newEvent = req.body;
            const result = await BookedEventCollection.insertOne(newEvent);
            res.send(result);
        })

        app.get('/bookedEvents/byId/:id', async (req, res) => {
            const id = req.params.id;
            const cursor = await BookedEventCollection.find({ id: id });
            const events = await cursor.toArray();
            res.send(events);
        })

        app.get('/bookedEvents/byEmail/:email', async (req, res) => {
            const email = req.params.email;
            const cursor = await BookedEventCollection.find({ currentUserEmail: email });
            const events = await cursor.toArray();
            res.send(events);
        })


        app.get('/bookedEvents', async (req, res) => {
            const cursor = await BookedEventCollection.find();
            const events = await cursor.toArray();
            res.send(events);
        })

        app.get('/events', async (req, res) => {
            const cursor = await EventCollection.find();
            const events = await cursor.toArray();
            res.send(events);
        })

        app.get('/events/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await EventCollection.findOne(query);
            res.send(result)
        })

        app.get('/events/byEmail/:email', async (req, res) => {
            const email = req.params.email;
            const cursor = await EventCollection.find({ email: email });
            const events = await cursor.toArray();
            res.send(events);
        })


        app.get('/events/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await EventCollection.findOne(query);
            res.send(result);
        })

        app.put('/events/update/:id', async (req, res) => {
            const id = req.params.id;
            const newEvent = req.body;
            const query = { _id: new ObjectId(id) }
            const event = {
                $set: {
                    name: newEvent.name,
                    area: newEvent.area,
                    Description: newEvent.Description,
                    image: newEvent.image,
                    price: newEvent.price,
                }
            }
            const result = await EventCollection.updateOne(query, event);
            res.send(result);
        })

        app.delete('/events/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await EventCollection.deleteOne(query);
            res.send(result);
        })








        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('This is skillX-server')
})

app.listen(port, () => {
    console.log(`SkillX-server running on port ${port}`)
})