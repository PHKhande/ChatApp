const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./util/database');

//Models
const ChatAppUser = require('./models/userInfo');
const Message = require('./models/message');
const ChatGroup = require('./models/chatgroup');
const UserGroupTable = require('./models/usergrouptable');

const app = express();

app.use(cors());

//Routes
const userRoutes = require('./routes/userInfo');
const messageRoutes = require('./routes/message');
const groupRoutes = require('./routes/group');

//Middlewares
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Routed Middlewares
app.use('/chat', userRoutes);
app.use('/chat', messageRoutes);
app.use('/chat', groupRoutes);

// app.use(errorController.get404);

Message.belongsTo(ChatAppUser, { constraints: true, onDelete: 'CASCADE' } );
ChatAppUser.hasMany(Message);

Message.belongsTo(ChatGroup, { constraints: true, onDelete: 'CASCADE' } );
ChatGroup.hasMany(Message);

ChatAppUser.belongsToMany(ChatGroup, { through: UserGroupTable });
ChatGroup.belongsToMany(ChatAppUser, { through: UserGroupTable });


sequelize
  .sync()
  // .sync({force: true})
  .then( result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });