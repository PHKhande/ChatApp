// import { create, findOne } from '../models/userInfo';
// import { hash, compare } from 'bcrypt';
// import { sign } from 'jsonwebtoken';

const ChatAppUser = require('../models/userInfo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
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

exports.login = async (req, res) => {

  try{

    const { loginEmail, loginPassword } = req.body;
    if (!loginEmail || !loginPassword) {
      return res.status(500).json({ message: 'Enter all fields to login' });
    }

    const user = await ChatAppUser.findOne( {where: {email: loginEmail } } );
    if (!user) {
      return res.status(404).json({ message: 'User not found'});
    }

    const correctPassword = await bcrypt.compare(loginPassword, user.password);
    if (!correctPassword) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    res.status(200).json({ message: 'User logged in successfully', token: generateAccesstoken(user.id) });

  } catch (err) {

    console.log(err);
    res.status(500).json({ error: err });

  }
  
}

generateAccesstoken = (id) => {
  return jwt.sign(id, 'chatapp');
}