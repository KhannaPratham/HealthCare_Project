const express = require("express");
const connectDb = require("./config/dbConnection.js");
const errorHandler = require("./middleware/errorhandler");
const cors = require("cors");
const dotenv = require("dotenv").config();
const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const multer = require("multer");
// const upload = multer({dest:'./uploads' });


connectDb();
const app = express();
const port = process.env.PORT || 5000;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

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
// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/home', (req, res) => {
    res.render("home", {
        title: "Dynamic Home Page",
        message: "Welcome to the dynamic home page!",
        user: {
            name: "Pratham khanna",
            age: 21
        }});
})

app.get('/allusers', (req, res) => {
    // Mock array of user objects (replace with real data from a database)
    const users = [
        { name: "Pratham khanna", age: 21, email: "Prathamkhanna@example.com", role: "Admin" },
        { name: "Jane Smith", age: 25, email: "janesmith@example.com", role: "User" },
        { name: "Alice Johnson", age: 28, email: "alicejohnson@example.com", role: "Moderator" }
    ];

    // Pass the users array to the view
    res.render('users', { users });
});


app.post("/profile", upload.single("avatar"), function(req, res, next) {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    console.log(req.body);
    console.log(req.file);

    const fileName = req.file.filename;
    const imageUrl = `/uploads/${fileName}`;
    return res.render("home", {
        imageUrl: imageUrl 
    });
});

app.post('/profile/upload', upload.array('photos', 12), function (req, res, next) {
    if (!req.files) {
        return res.status(400).send("No files uploaded.");
    }
    console.log(req.body);
    console.log(req.files);  // This will be an array of file objects.

    // After uploading, you might want to handle the uploaded files.
    // For example, you can store their paths in the database or process them.

    return res.redirect("/home");
});



app.get('/', (req, res) => {
    res.send("Working");
})

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
    
});