const Message = require('../models/message');
const { Op } = require('sequelize');

exports.postSendMessage = async (req, res) => {

    try {

        const { userMessage, grpId } = req.body;
        if(!userMessage){
            return res.status(500).json({message: 'Enter something before sending'});
        }
        const idUser = req.user.id;

        const data = await Message.create({
            message: userMessage,
            userId: idUser,
            groupId: grpId
        });
        console.log(data)

        res.status(201).json({message: data});


    } catch(err) {

        console.log(err);
        res.status(500).json({message: "Couldn't send this message"});

    }

}

exports.getAllMessages = async (req, res) => {
    
    try{
        
        const lastMsgId = +req.query.lastid;
        const grpId = +req.query.groupid;

        const newMessages = await Message.findAll({
            where: {
                groupId: grpId,
                id: { [Op.gt]: lastMsgId }
              }
        });
        
        const arrayOfMessages = newMessages.map(ele => {
            if(ele.userId == req.user.id){
                return { id : ele.id , message : ele.message , createdAt : ele.createdAt, groupId: grpId, currentUser: 'same user'};
            }
            return { id : ele.id , message : ele.message , groupId: grpId, createdAt : ele.createdAt};
        })

        res.status(200).json({allMessages: arrayOfMessages})

    } catch(err) {

        console.log(err);
        res.status(500).json({message: "Cannot find messages"});

    }
}