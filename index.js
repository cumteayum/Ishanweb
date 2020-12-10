const express = require("express");
const hbs = require("hbs");
//const mongoose = require("mongoose");
const path = require("path");
const app = express();
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const fs = require('fs');
const port = process.env.port || 8000
//const packageFile = fs.createReadStream(__dirname+'/templates/assets/img', 'utf-8');

// Connect to our mongoDB Database
/*mongoose
  .connect("mongodb://localhost:27017/myNewDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection to database successful"))
  .catch((err) => console.log(err));
  */
// Create Mongoose Schema
/*const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  date: {
    type: Date,
    default: Date.now,
  },
});*/

// Create A Mongoose Model
//const User = new mongoose.model("ishanuser", userSchema);

// Set the template engine and Set the static directory
const partialsPath = path.join(__dirname, "templates/partials");
const templatePath = path.join(__dirname, "templates");

// Express specifications
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("templates"));
hbs.registerPartials(partialsPath); //registerPartials for regisering the partials path

// Routing
app.get("/", (req, res) => {
  res.render("index.hbs", {
    name: "Ishan Nagar",
  });
});

app.post("/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ishannagar84@gmail.com",
      pass: "ishanpy112",
    },
  });

  const mailOptions = {
    from: email,
    to: "ishannagar84@gmail.com",
    subject: subject,
    text: message,
  };
  transporter.sendMail(mailOptions, (err, success) => {
    if (err) throw err;
    console.log(`Email sent: ${success.response}`);
  });

  /*Put the user into the database(Non-async way)
  const myUser = new User({
    name:name,
    email:email,
    date:Date.now()
  });
  Save the user into database
  myUser.save();
  */

  // Method two Async way
  /*const createUser = async () => {
    try {
      const myUser = new User({
        name: name,
        email: email,
        date: Date.now(),
      });
      const result = await myUser.save();
    } catch (err) {
      console.log(err);
    }
  };

*///createUser();
});

app.get("/users", (req, res) => {
  res.render("signin.hbs");
});

app.post("/handleLogin", (req, res) => {
  const {name, password} = req.body;
  if(name == "ishan" && password == "ishan"){
    // Get documents
    const getDocument = async () => {
      const result = await User.find({}, {_id:0, date:0});
      const data = await result;
      return data;
    }

    res.render("users.hbs",{
      name:"Building...",
      info:"Building..."
    });

  }else{
    res.render("lost.hbs");
  }
});

app.get('/port', (req, res) => {
    res.render("certs.hbs");
});

app.get("*", (req, res) => {
  res.render("lost.hbs");

});
app.listen(port, () => console.log(`http://localhost:${port}`));
