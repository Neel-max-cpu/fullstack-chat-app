import { generateToken } from "../lib/utils.js";
import User from "./../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters long!" });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User with this Email already exists!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            // fullName: fullName, ---- since same so we can shorten it
            fullName,
            // email: email,
            email,
            password: hashedPassword,
        })

        if (newUser) {
            // generate jwt token here -- and save the cookie in the response
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else {
            res.status(400).json({ message: "Invalid User Data!" });
        }
    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invaild credentials" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invaild credentials" });

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error in login controller:", error.message);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}

export const forget = async (req, res)=>{
    const {email, newPassword, confirmPassword } = req.body;
    try {
        if(!email || !newPassword || !confirmPassword ){
            return res.status(400).json({message:"Please fill all the fields!"});
        }

        const user = await User.findOne({email});
        // if email not found
        if(!user) {
            return res.status(400).json({message:"Invalid credentials"});
        }
        
        // if newpass != confirmpass
        if(newPassword !== confirmPassword){
            return res.status(400).json({message:"Passwords do not match!"});
        }
        
        // check if password is same as old password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if(isSamePassword){
            return res.status(400).json({message:"New password must be different from the old password!"});
        }

        // hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({message:"Password reset successfully!"});

    } catch (error) {
        console.log("Error in forget password controller:", error.message);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}


export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully!" });
    } catch (error) {
        console.log("Error in logout controller:", error.message);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}


export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller:", error.message);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}


// do forget password too