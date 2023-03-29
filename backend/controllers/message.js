const Message = require('../models/message');

exports.postSendMessage = async (req, res) => {

    try {

        const { userMessage } = req.body;
        if(!userMessage){
            return res.status(500).json({message: 'Enter something before sending'});
        }
        const idUser = req.user.id;

        const data = await Message.create({
            message: userMessage,
            userId: idUser
        });

        res.status(201).json({message: data});


    } catch(err) {

        console.log(err);
        res.status(500).json({message: "Couldn't send this message"});

    }

}

exports.getAllMessages = async (req, res) => {

    try{

        const allMessages = await Message.findAll();
        res.status(200).json({allMessages: allMessages})

    } catch(err) {

        console.log(err);
        res.status(500).json({message: "Cannot find messages"});

    }
}