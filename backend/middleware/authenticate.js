const jwt = require('jsonwebtoken');
const ChatAppUser = require('../models/userInfo');

exports.authentication = async(req, res,next) => {

    try{

        const { token } = req.body;
        const userId = jwt.verify(token, 'chatapp');

        const user = await ChatAppUser.findOne( {where: {id: userId } } );
        req.user = user;
        
        next();

    } catch(err) {

        console.log(err);
        return res.status(401).json( {message: 'Not Authorized'} )

    }

}

