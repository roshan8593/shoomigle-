import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'
import user from './models/userModel.js';
import cors from "cors";
import jwt from 'jsonwebtoken';


dotenv.config();


const app = express();
const Port = process.env.PORT || 3000;
app.listen(Port,()=>{
    console.log("server is listening")
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

async function main() {
    try{
        await mongoose.connect(process.env.MONGO_URl)
        console.log("connection succesfull with db")
    }
    catch{
        console.log("some error occur")
    }
    
  }

main();


// authentication
app.post('/signup', async (req, res) => {
    try {
      const { username, password } = req.body;

      // check if user already exists
      const existingUser = await user.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists"
        });
      }
  
      // hash password
      let hashedPassword = await bcrypt.hash(password, 10);
      // create user
      const newUser = new user({
        username: username,
        Password: hashedPassword
      });
  
      await newUser.save();
  
      // create token (auto login part)
      const token = jwt.sign(
        {
          userId: newUser._id,
          username: newUser.username
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      // send response
      res.json({
        message: "Signup successful",
        token: token,
        username
      });
  
    } catch (err) {
        console.log("FULL ERROR:", err);
        res.status(500).json({
          message: err.message
        });
      }
  });

app.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body;
    
    const currUser = await user.findOne({ username });

    if (!currUser) {
      return res.status(401).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, currUser.Password);

    if (match) {
      const token = jwt.sign(
        { userId: currUser._id, username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ 
        message: "login successfully", 
        token, 
        username    // ✅ comes from req.body directly
      });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ message: err.message });
  }
});
app.post('/logout',async(req,res)=>{
    res.json({
        message:"logout succesfully"
    })
})
