const express = require("express");
const router = express.Router();

const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const JWT_SECRET = 'Abinashisagoodb$oy';

// ROUTE 1 : Creating a new user with name, email and password
router.post('/createuser', [
    //Validation of the new user signin
    body('name','Enter a valid name').isLength({min: 3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({min: 5}),
], async (req,res) => {
    let success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({success, error: errors.array()});
    }
    try {
        let user = await User.findOne({email: req.body.email});
        //check wheather the user with the same email exits already
        if(user) {
            return res.status(400).json({success, error: 'Sorry a user with this email is already exists'});
        }
        // create a new user using the model
        let salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email:req.body.email,
        });

        const data = {
            user: {
                id:user.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success, message:"New User is Successfully created", authToken});
    } catch(error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured");
    }
    
})

// ROUTE 2 : Authenticate a user email and password
router.post('/login', [
    
    //Validation of the new user signin
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
    
], async (req,res) => {
    let success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    }
    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user) {
            success = false;
            return res.status(400).json({success: success, error: "Please try to login with correct credentials"});
        }
        const comparePassword = await bcrypt.compare(password,user.password);
        if(!comparePassword) {
            success = false;
            return res.status(400).json({success: success, error: "Please try to login with correct credentials"});
        }
        const data = {
            user: {
                id:user.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success:true, authToken});
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal Server Error");
    }
});

// ROUTE 3 : Get loggedin user details
router.post('/getuser', fetchuser, async (req,res) => {
    let userId = req.user.id;
    try {
        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal Server Error");
    }  
})

module.exports = router;