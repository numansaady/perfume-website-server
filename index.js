const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;


// Use middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('NS Perfume Server Started!');
});


app.listen(port, ()=>{
    console.log('Listening to port', port);
});