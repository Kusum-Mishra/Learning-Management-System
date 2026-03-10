import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

//for signup
export const register = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success:false,
                message:"User already exists with this email."
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            success:true,
            message:"Profile created successfully."
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error occured. Failed to register."
        })
    }
}

//for login
export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User does not exist. Incorrect email or password."
            })
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password."
            });
        }
        generateToken(res, user, `Welcome back ${user.name}`);

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error occured. Failed to login."
        })
    }
}

export const logout = async(_, res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message:"Logged out successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error occured. Failed to logout."
        })
    }
}


export const getUserProfile = async (req,res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({
                message:"Profile not found",
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error occured. Failed to load user profile."
        })
    }
}

export const updateProfile = async (req, res) => { // Fixed 'Req' to 'req' here too!
    try {
        const userId = req.id;
        const { name } = req.body;
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        
        let photoUrl = user.photoUrl; // Default to the current photo in DB

        if (profilePhoto) {
            // 1. If user already has a photo, delete the old one from Cloudinary
            if (user.photoUrl) {
                const publicId = user.photoUrl.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId); 
            }
            // 2. Upload the new photo
            const cloudResponse = await uploadMedia(profilePhoto.path);
            photoUrl = cloudResponse.secure_url;
        }

        const updatedData = { name, photoUrl };
       

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");
        
        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
}

/*export const updateProfile = async(req,res) => {
    try {
        const userId = req.id;
        const {name} = req.body;
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        //extract the public id of the existing image from url if it exists
        if(user.photoUrl){
            const publicId = user.photoUrl.split("/").pop().split(".")[0];          //extracting public id of image
            deleteMediaFromCloudinary(publicId);
        }

        //uploading new photo
        const cloudResponse = await uploadMedia(profilePhoto.path);
        const photoUrl = cloudResponse.secure_url;


        const updatedData = {name, photoUrl};
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new:true}).select("-password");
        return res.status(200).json({
            success:true,
            user:updatedUser,
            message:"Profile updated successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to update profile"
        })
    }
}*/