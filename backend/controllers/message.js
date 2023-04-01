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


const AWS = require('aws-sdk');

updloadToS3 = (file, filename) => {
    const BUCKET_NAME = 'expensetrackerfiles';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET_KEY;

    let s3Bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })
    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: file,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
        s3Bucket.upload(params, (err, s3responce) => {
            if (err) {
                console.log(`Something went wrong`, err);
                reject(err);
            } else {
                console.log(`work has done ===>`, s3responce);
                resolve(s3responce.Location);
            }
        })
    })
}


exports.sendFile = async (req, res, next) => {
    try{
        
        const { groupId } = req.params;

        if(!req.file){
           return res.status(400).json({ success: false, message: `Please choose file !` });
        }
    
        let type = (req.file.mimetype.split('/'))[1];
        const file = req.file.buffer;
        const filename = `GroupChat/${new Date()}.${type}`;

        const fileUrl = await updloadToS3(file, filename);
    
        let result = await req.user.createMessage({
            message: fileUrl,
            groupId: groupId,
            userId: req.user.id
        })
        const data = { message: result.message, createdAt: result.createdAt };
    
        res.status(200).json({ success: true, data });
    }catch(err){
        console.log(err);
        res.status(400).json({ success: false, message: `Something went wrong !` });
    }
}