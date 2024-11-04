const express = require("express");
const connectDb = require("./config/dbConnection.js");
const errorHandler = require("./middleware/errorhandler");
const cors = require("cors");
const dotenv = require("dotenv").config();
const path = require('path');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

connectDb();
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use(errorHandler);

app.use('/api/register', require("./routes/userRoutes"));


// ERROR handling middleware

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
const hbs = require('hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'));
// app.set('view engine','hbs');

// app.get("/home",(req,res)=>{
//     res.sender("home",{})
// })
app.get('/home', (req, res) => {
    res.render("home", {
        title: "Dynamic Home Page",
        message: "Welcome to the dynamic home page!",
        user: {
            name: "John Doe",
            age: 30
        }});
})

app.get('/allusers', (req, res) => {
    // Mock array of user objects (replace with real data from a database)
    const users = [
        { name: "John Doe", age: 30, email: "johndoe@example.com", role: "Admin" },
        { name: "Jane Smith", age: 25, email: "janesmith@example.com", role: "User" },
        { name: "Alice Johnson", age: 28, email: "alicejohnson@example.com", role: "Moderator" }
    ];

    // Pass the users array to the view
    res.render('users', { users });
});


app.get('/', (req, res) => {
    res.send("Working");
})

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
    
});