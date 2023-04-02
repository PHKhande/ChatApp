const ChatGroup = require('../models/chatgroup');
const UserGroup = require('../models/usergrouptable');
const ChatAppUser = require('../models/userInfo');
const {Sequelize, Op} = require('sequelize');
 

exports.createGroup = async (req, res) => {

  const {groupName} = req.body;

  if(!groupName){
    return res.status(500).json({message: 'All fields are mandatory'});
  }

  try{
    
    const group = await ChatGroup.create({
        GroupName: groupName,
        CreatedBy: req.user.name
    });

    await group.addUser(req.user.id, { through: { isAdmin : true } });

    res.status(201).json({message: 'Successfully created group', myGroupsDB: group});   

  } catch(err){

    console.log(err);
    res.status(500).json({message: "Cannot create"});
    
  }

}


exports.getMyGroups = async (req, res) => {

  try{
    idUser = req.user.id;
    const myGroups = await ChatGroup.findAll({
      include: {
        model: ChatAppUser,
        where: { id: idUser}
      }
    });
    res.status(201).json({myGroupsDB: myGroups});

  } catch(err){

    console.log(err);
    res.status(500).json({message: "Cannot fetch my group information"});

  }

}

exports.getOtherGroups = async (req, res) => {

  try{

    const idUser = req.user.id;

    const userGroupIds = await UserGroup.findAll({
        where: { userId: idUser },
        attributes: ['groupId'],
    });

    const groupIds = userGroupIds.map( (userGroup) => userGroup.groupId );

    const otherGroups = await ChatGroup.findAll({
        where: { id: { [Sequelize.Op.notIn]: groupIds } },
    });
    
    res.status(201).json({otherGroupsDB: otherGroups});

  } catch(err){

    console.log(err);
    res.status(500).json({message: "Cannot fetch other group information"});

  }

} 

exports.deleteGroup = async (req, res) => {

  try{

    const idGroup = req.params.delId;
    const idUser = req.user.id;

    const adminCheck = await UserGroup.findOne( {where: {groupId: idGroup, userId: idUser, isAdmin: true } } );
    
    if(adminCheck){

      await ChatGroup.destroy( {where : {id : idGroup } } );
      res.status(200).json({success: 'true', message : `Group has deleted sucessfully`});

    } else {

      res.status(400).json( {success: 'false', message : `Only Admin can delete group !` });

    }

  } catch(err) {

    console.log(err);
    res.status(500).json( {success: 'false', message : `Something went wrong !`} );

  }
}

exports.joinGroup = async (req, res) => {

  try{

    const idGroup = req.params.joinId;
    const idUser = req.user.id;

    const updateGroup = ChatGroup.findOne({where: {id: idGroup } } );

    // await updateGroup.addUser(req.user.id, {through: {isAdmin : false}});

    await UserGroup.create({
      groupId : idGroup,
      userId : idUser,
      isAdmin : false
    });


    res.status(200).json({updatedGroupFromDB: updateGroup , message : `Congratulations ! Now you are in the group`});
        

  } catch(err) {

    console.log(err);
    res.status(500).json({message : `Something went wrong !`} );

  }
}

exports.getAllUsersofGroup = async (req, res) => {

  try{

    const idGroup = req.query.groupid;    

    const users = await ChatAppUser.findAll({
      include: [{
        model: ChatGroup,
        where: { id: idGroup },
        through: {
          attributes: ['isAdmin'],
          where: { isAdmin: { [Op.not]: true } }
        }
      }]
    });

    res.status(200).json({allUsers: users});

  } catch(err) {

    console.log(err);
    res.status(500).json({message : `Something went wrong !`} );

  }
}


exports.getAdminsofGroup = async (req, res) => {

  try{

    const idGroup = req.query.groupid;

    const users = await ChatAppUser.findAll({
      include: [{
        model: ChatGroup,
        where: { id: idGroup },
        through: {
          attributes: ['isAdmin'],
          where: { isAdmin: { [Op.not]: false } }
        }
      }]
    });

    res.status(200).json({allAdmins: users});

  } catch(err) {

    console.log(err);
    res.status(500).json({message : `Something went wrong !`} );

  }
}


exports.makeUserAdminofGroup = async (req, res) => {

  try{

    const idGroup = req.query.groupid;
    const idUser = req.query.userid;

    const userGroup = await UserGroup.findOne({ where: {groupId: idGroup, userId: idUser}});
    userGroup.isAdmin = true;
    await userGroup.save();
    
    res.status(200).json({message: 'Made Admin'});

  } catch(err) {

    console.log(err);
    res.status(500).json({message : `Something went wrong !`} );

  }

}


exports.makeAdminUserofGroup = async (req, res) => {

  try{

    const idGroup = req.query.groupid;
    const idUser = req.query.userid;

    const userGroup = await UserGroup.findOne({ where: {groupId: idGroup, userId: idUser}});
    userGroup.isAdmin = false;
    await userGroup.save();

    res.status(200).json({message: 'Made Admin'});

  } catch(err) {

    console.log(err);
    res.status(500).json({message : `Something went wrong !`} );

  }

}

exports.addUsertoGroup = async (req, res) => {

  try{

    const { email, grpId } = req.body;

    const user = await ChatAppUser.findOne( { where: {email: email}});

    await UserGroup.create({
      userId: user.id,
      groupId: grpId,
      isAdmin: false
    });

    res.status(200).json({addedUser: user})


  } catch(err) {

    console.log(err);
    res.status(500).json({message : `Something went wrong !`} );

  }

}