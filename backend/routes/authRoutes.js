import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

const router = express.Router();

// ----------> Registration Process
router.post("/register", async (req,res) => {
    try{
        const {name, email, password} = req.body;

        // validation fileds
        if(!name || !email || !password) {
            return res.status(400).json({message: "All Fields Are Required."});
        }

        // exisitng User
        const exisitngUser = await User.findOne({email});
        if(exisitngUser) {
            return res.status(400).json({message: "Email Is Already Registered."});
        }

        // hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        // send response
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
        });
    }catch(error){
        console.error("Register Error", error);
        res.status(500).json({message: "Server Error.."});
    }
});

// ---------> Login Process
router.post("/login", async (req,res) => {
    try{
        const {email, password} = req.body;

        // validate details
        if(!email || !password) {
            return res.status(400).json({message: "Email And Password are Required."});
        }

        // Find User
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "Invalid Email or password."});
        }

        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: "Invalid email or Password"});
        }

        // generate Token
        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        // send response
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }catch(error) {
        console.error("Login Error", error);
        res.status(500).json({message: "Server Erorr...."});
    }
});

export default router;