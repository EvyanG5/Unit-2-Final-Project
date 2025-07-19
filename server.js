const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const authController = require('./controllers/auth.js');
const itemsController = require('./controllers/items.js');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const Item = require('./models/item.js');
const port = process.env.PORT ? process.env.PORT : '3000';
const path = require('path');
app.set('view engine', 'ejs'); // ✅ Sets EJS as the rendering engine
app.set('views', path.join(__dirname, 'views')); // ✅ Tells Express where the views are




mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));

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
app.get('/login/:userId', (req, res) => {
  req.session.userId = req.params.userId;
  res.send(`Logged in as user ${req.session.userId}`);
});
function checkAuth(req, res, next) {
  if (!req.session.userId) return res.redirect('/login/guest');
  next();
}

app.use(passUserToView);
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/items', itemsController);
app.use((req, res, next) => {
  console.log('Session userId:', req.session.userId);
  next();
});

// READ: list all user's items
app.get('/items', checkAuth, async (req, res) => {
  const items = await Item.find({ userId: req.session.userId });
  res.render('items', { items });
});

// CREATE: show form
app.get('/items/new', checkAuth, (req, res) => {
  res.render('new');
});

// CREATE: handle form submit
app.post('/items', checkAuth, async (req, res) => {
  await Item.create({
    userId: req.session.userId,
    name: req.body.name,
    price: req.body.price,
    description: req.body.description
  });
  res.redirect('/items');
});

// UPDATE: show edit form
app.get('/items/:id/edit', checkAuth, async (req, res) => {
  const item = await Item.findOne({ _id: req.params.id, userId: req.session.userId });
  if (!item) return res.status(404).send('Item not found');
  res.render('edit', { item });
});

// UPDATE: handle edit form submit
app.post('/items/:id/edit', checkAuth, async (req, res) => {
  await Item.findOneAndUpdate(
    { _id: req.params.id, userId: req.session.userId },
    {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description
    }
  );
  res.redirect('/items');
});

// DELETE: delete item
app.delete('/items/:id', async (req, res) => {
  try {
    const result = await Item.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId
    });

    if (!result) {
      return res.status(403).json({ message: 'Item not found or unauthorized' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
app.post('/items/:id/delete', checkAuth, async (req, res) => {
  await Item.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
  res.redirect('/items');
});

module.exports = app;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});