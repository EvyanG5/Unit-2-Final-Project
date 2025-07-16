const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const authController = require('./controllers/auth.js');
const itemsController = require('./controllers/items.js');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');



const port = process.env.PORT ? process.env.PORT : '3000';
const path = require('path');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView);

 app.get('/', (req, res) => {
  const user = req.session.user; 
  res.render('home.ejs', { user }); 
});
  

app.get('/home', (req, res) => {
  res.render('home.ejs')
});

app.get('/edit', (req, res) => {
  res.render('edit.ejs')
});

app.use(passUserToView);
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/items', itemsController);



app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
