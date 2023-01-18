const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
const saltCount = 9

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post('/register', async (req, res, next) => {
  try{
    const username = req.body.username;
    const password = req.body.password;
    const hash     = await bcrypt.hash(password, saltCount);
    const user = await User.create({username, password: hash});
    const message = `successfully created user ${username}`;
    res.send(message);
  }
  catch(error){
    console.error(error);
    next(error);
  }
})

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post('/login', async (req, res, next)=>{
  try{
    const { username, password } = req.body;
    const user = await User.findOne({ where: {username} });
    if(!user){
      res.status(401).send('user not found');
      return;
    }
    verified = await bcrypt.compare(password, user.password);
    if(!verified){
      res.send('incorrect username or password');
      return;
    }
    res.status(200).send(`successfully logged in user ${username}`);

  }catch(error){
    console.error(error);
    next(error);
  }
})

// we export the app, not listening in here, so that we can run tests
module.exports = app;
