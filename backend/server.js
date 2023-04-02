const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('cron');
const sequelize = require('./util/database');

//Models
const ChatAppUser = require('./models/userInfo');
const Message = require('./models/message');
const ChatGroup = require('./models/chatgroup');
const UserGroupTable = require('./models/usergrouptable');
const ArchivedMessage = require('./models/archivemessage');

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

app.use( (req, res, next) => {
  res.sendFile( path.join( __dirname, `public/${req.url}` ) );
});

// app.use(errorController.get404);

Message.belongsTo(ChatAppUser, { constraints: true, onDelete: 'CASCADE' } );
ChatAppUser.hasMany(Message);

Message.belongsTo(ChatGroup, { constraints: true, onDelete: 'CASCADE' } );
ChatGroup.hasMany(Message);

ChatAppUser.belongsToMany(ChatGroup, { through: UserGroupTable });
ChatGroup.belongsToMany(ChatAppUser, { through: UserGroupTable });

//cron function
async function moveMessagesToArchive() {
  try {
    const messages = await Message.findAll();
    await ArchivedMessage.bulkCreate(messages);
    await Message.destroy({ truncate: true });
  } catch (error) {
    console.error(error);
  }
}

cron.schedule('0 0 * * *', moveMessagesToArchive);

sequelize
  .sync()
  // .sync({force: true})
  .then( result => {
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });