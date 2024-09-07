
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { User } from "../models/user.model.js";

 export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // validation
        if (!name || !email || !password) {
            throw new Error("All input is required")
        }

        const userAlreadyExists = await User.findOne({ email })
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        //create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpires: Date.now() + 3600000
        })

        //JWT 
        generateToken(res, user._id);

        //send response
        res.status(201).json({ 
            success: true, 
            message: "User created successfully",
        user:{
            ...user._doc,
            password: undefined,
           
        } })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
 }