const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;


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