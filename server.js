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


// UPDATE - Handle update form
app.post('/update/:id', (req, res) => {
  const item = items.find(i => i.id == req.params.id);
  if (item) item.name = req.body.name;
  res.redirect('/');
});
// DELETE - Handle delete request
app.post('/delete/:id', (req, res) => {
  items = items.filter(i => i.id != req.params.id);
  res.redirect('/');
});
// CREATE - Handle new item form  
app.use('/items', itemsController); 
app.use(express.json());      
app.use(morgan('dev'));
app.set('view engine', 'ejs'); 

//DELETE - Handle delete request
app.post('/delete/:id', (req, res) => {
  items = items.filter(i => i.id != req.params.id);
  res.redirect('/');
});
app.post('/items', async (req, res) => {
  try {
    const newItem = new items(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get('/items', async (req, res) => {
  try {
    const allItems = await items.find();
    res.json(allItems);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
