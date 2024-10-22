// FRAMEWORK CONFIGURATION
const express = require( "express");
const connectb = require(" •/config/dbConnection");
const errorhandler = require(" /middleware/errorHandler");
const cors = require ("cors")

connectDb();
const app = express();
const port = process.env. PORT || 5000;

app.use (express.json());
app.use(cors());
//Error handling middleware
app .use(errorhandler);


//ROUTES BELOW
app.get('/', (req, res)=>{
    res.send("working");
});


//APP CONFIG START
app.listen(port, () => {
    console.log('Server running on port http://localhost:${port}');
});