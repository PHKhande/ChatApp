const ChatAppUser = require('../models/userInfo');

const bcrypt = require('bcrypt');

exports.signUp = async (req, res, next) => {
  try{
    
    const {name, email, phn, password} = req.body;

    if(!name | !email | !phn | !password){
      return res.status(500).json({message: 'All fields are mandatory'});
    }
    
    const encryptPass = await bcrypt.hash(password, 10); 
    
    await ChatAppUser.create({
      name: name,
      email: email,
      phone: phn,
      password: encryptPass,
      isPremium: false,
      totalExpense: 0
    });

    res.status(201).json({message: 'Successfully created new user'});   
  }

  catch(err){
    console.log(err);
    res.status(500).json({message: "User Already Present"});
  }

}