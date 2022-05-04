const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        console.log('decoded', decoded);
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
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1800'
            });
            res.send({ accessToken });
        })

        // Perfume Collection API

        // POST API for perfumeCollection
        // POST
        app.post('/perfume', async (req, res) => {
            const newPerfume = req.body;
            const result = await perfumeCollection.insertOne(newPerfume);
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