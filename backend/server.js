const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./util/database');

//Models
const ChatAppUser = require('./models/userInfo');
const Message = require('./models/message');

const app = express();

app.use(cors());


//Routes
const userRoutes = require('./routes/userInfo');
const messageRoutes = require('./routes/message');

//Middlewares
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Routed Middlewares
app.use('/chat', userRoutes);
app.use('/chat', messageRoutes);

// app.use(errorController.get404);

Message.belongsTo(ChatAppUser, { constraints: true, onDelete: 'CASCADE' } );
ChatAppUser.hasMany(Message);

sequelize
  .sync()
  // .sync({force: true})
  .then( result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });