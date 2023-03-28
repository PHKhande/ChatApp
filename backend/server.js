const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./util/database');

//Models
// const ChatAppUser = require('./models/userInfo');

const app = express();

app.use(cors());


//Routes
const userRoutes = require('./routes/userInfo');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/chat', userRoutes);

// app.use(errorController.get404);


sequelize
  .sync()
  // .sync({force: true})
  .then( result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });