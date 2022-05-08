const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const headerAuth = req.headers.authorization;
    if (!headerAuth) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = headerAuth.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}

// Use middleware
app.use(cors());
app.use(express.json());

// perfumeUser
// wnAba9hdFFDzKYKc

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5yyjm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const perfumeCollection = client.db("perfumeCenter").collection("perfume");

         // Authenticatin with JWT
         app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: '1800'
            });
            res.send({ accessToken });
        })

        // Perfume Collection API
        // POST API for perfumeCollection
        app.post('/perfume', async (req, res) => {
            const newPerfume = req.body;
            const result = await perfumeCollection.insertOne(newPerfume);
            res.send(result);
        });

        // GET API for perfumeCollection
        app.get('/perfume', async (req, res) => {
            const query = {};
            const cursor = perfumeCollection.find(query);
            const perfumes = await cursor.toArray();
            res.send(perfumes);
        });

        app.get('/perfume/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const perfume = await perfumeCollection.findOne(query);
            res.send(perfume);
        });

        app.get('/myItem', async (req, res) => {
            const email = req.query.email;
                const query = { email: email };
                const cursor = perfumeCollection.find(query);
                const perfumes = await cursor.toArray();
                res.send(perfumes);
        });

         // DELETE api 
         app.delete('/perfume/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await perfumeCollection.deleteOne(query);
            res.send(result);
        });    

        // PUT api 
        app.put('/perfume/:id', async(req, res) => {
            const id = req.params.id;
            const perfume = req.body;            
            const filter = { _id: ObjectId(id) };
            const options = {upsert : true};
            const updateDoc = {
                $set : { newPerfume: perfume },
            };
            const result = await perfumeCollection.updateOne(filter, options, updateDoc);
            res.send(result);
        });   
                

    }
    finally{

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('NS Perfume Server Started!');
});


app.listen(port, ()=>{
    console.log('Listening to port', port);
});