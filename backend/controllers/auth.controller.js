
import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateToken } from "../utils/generateToken.js";
import { User } from "../models/user.model.js";
import { sendVerificationEmail, sendWelcomeEmail,sendPasswordResetEmail, sendResetSuccessEmail } from "../mail/emails.js";

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
            verificationExpires: Date.now() + 3600000
        })

        //JWT 
        generateToken(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        //send response
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,

            }
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}



export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationExpires: { $gt: Date.now() }
        })
        console.log(code);
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;

        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "invalid credentials" });
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "invalid credentials" });
        }
        generateToken(res, user._id);

        user.lastLogin = Date.now();
        await user.save();


        //send response
        res.status(200).json({ success: true, message: "Logged in successfully" });
    } catch (error) {
        console.log("Error in login", error);
        res.status(400).json({ success: false, message: error.message })
    }
};

export const forgotPassword = async (req, res) => { 
    const { email } = req.body;

    try {
        const user = await User.findOne({ email});

        if(!user) {
            return res.status(404).json({ success: false, message: "invalid credentials" });
        }

//Generate reset token
const resetToken = crypto.randomBytes(20).toString("hex");
const resetTokenExpiresAt = Date.now() + 3600000;

user.resetPasswordToken= resetToken;
user.resetPasswordExpires = resetTokenExpiresAt;

await user.save();

//Send email
await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`)

res.status(200).json({success:true, message:"Password reset link sent to your email"})

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
};

export const resetPassword = async (req, res) => { 
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if(!user){
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        //update password
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }


};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};


