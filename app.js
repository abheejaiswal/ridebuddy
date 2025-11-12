const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser')
const app = express();
const PORT = 5176;
const api = require("./routes/api");
const admin = require("./routes/admin");
const cors = require('cors');
const crypto= require('crypto');
// app.use(express.json());
 
// const AdminController = require("./controllers/AdminController");
// const LoginController = require("./controllers/LoginController");
// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", __dirname + "/view");
app.use(express.static(__dirname + "/public"));

// app.get("/", (req, res) => {
   
//     res.send("hello abhi test g");
// });

app.use(cors({
  origin: '*',
  credentials: true, // if you use cookies
}));
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1000mb' }));

const secret = crypto.randomBytes(64).toString('hex');
console.log("Session secret:", secret);

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,            // set to true only if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // ✅ 1 day in milliseconds
  }
}));
app.use((req, res, next) => {
  res.locals.BASE_URL = process.env.BASE_URL;
  next();
});

app.use('/userapi', api);
app.use('/', admin);
// app.get("/dashboard", AdminController.dashboard);

// app.get("/users", AdminController.users);
// app.get("/agenttree", AdminController.agenttree);
// app.get("/country_agent", AdminController.country_agent);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = app;